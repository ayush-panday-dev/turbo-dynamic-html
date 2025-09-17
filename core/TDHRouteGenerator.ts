import fs, { Dirent } from "fs";
import path from "path";
import { build, type BuildResult } from "esbuild";
import RootConfig from "../config/root.config";
import { Logger } from "../utils/logger";
import { fileURLToPath } from "url";

function listRecursiveSync(base: string): string[] {
  const scan = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e: Dirent) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        return scan(full);
      } else {
        return /\.(jsx|tsx|ts|js)$/.test(e.name) ? full : [];
      }
    });
  return scan(base).map((p) => path.relative(base, p).replace(/\\/g, "/"));
}

function toPathname(rel: string): string {
  return rel
    .replace(/index\.(jsx|tsx|ts|js)$/, "")
    .replace(/\([^\/]+\)\//g, "")
    .replace(/\.(jsx|tsx|ts|js)$/, "")
    .replace(/\.$/, "")
    .replace(/\[([^\]]+)\]/g, ":$1");
}

export async function TDHRouteGenerator() {
  const outDir = path.join(process.cwd(), ".TDH");
  const buildDir = path.join(outDir, "build");

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir);
  fs.mkdirSync(buildDir);

  const base = RootConfig.TDH_RENDER_PATH;

  const files = listRecursiveSync(base);

  const dirLayout: Record<string, string> = {};
  const pageEntryPoints: Record<string, string> = {};
  let notFound = "";
  let internalServerError = "";
  const finalConfig: Record<string, TDHRouteConfig> = {};

  for (const rel of files) {
    const abs = path.join(base, rel);
    const isLayout = /_layout\.(tsx|jsx|ts|js)$/.test(rel);
    const is404 = /^404\.(tsx|jsx|ts|js)$/.test(rel);
    const is500 = /^500\.(tsx|jsx|ts|js)$/.test(rel);

    if (isLayout) {
      dirLayout[path.dirname(rel) === "." ? "" : path.dirname(rel)] = abs;
    } else if (is404) {
      notFound = abs;
    } else if (is500) {
      internalServerError = abs;
    } else {
      pageEntryPoints[rel] = abs;
    }
  }

  if (Object.keys(pageEntryPoints).length === 0) {
    fs.writeFileSync(
      path.join(outDir, "config.json"),
      JSON.stringify({}, null, 2)
    );
    return;
  }

  if (!notFound) {
    throw new Error(
      "404.ts/js is required on your configured route directory."
    );
  }

  if (!internalServerError) {
    internalServerError =
      "500.ts/js is required on your configured route directory.";
  }

  try {
    const allEntryPoints: string[] = [
      ...Object.values(pageEntryPoints),
      ...Object.values(dirLayout),
    ];

    const result = await build({
      entryPoints: allEntryPoints,
      bundle: true,
      outdir: buildDir,
      format: "esm",
      platform: "node",
      minify: true,
      sourcemap: true,
      splitting: true,
      treeShaking: true,
      metafile: true,
      absWorkingDir: process.cwd(),
    });

    const specialPages = [
      { name: "404", path: notFound },
      { name: "500", path: internalServerError },
    ];

    for (const { name, path: specialPath } of specialPages) {
      const specialResult = await build({
        entryPoints: [specialPath],
        bundle: true,
        outdir: buildDir,
        format: "esm",
        platform: "node",
        minify: true,
        sourcemap: true,
        splitting: false,
        treeShaking: true,
        metafile: true,
        absWorkingDir: process.cwd(),
        entryNames: name,
      });

      const outputFile = findOutputFile(specialPath, specialResult);
      if (!outputFile) {
        Logger.error(
          `Could not find output file for ${name} page: ${specialPath}`
        );
        continue;
      }

      const module = (await import(outputFile)).default;
      if (!module) {
        Logger.warn(`Not a route: ${outputFile}`);
        continue;
      }
    }

    const builtLayouts: Record<string, string> = {};
    for (const [dir, layoutPath] of Object.entries(dirLayout)) {
      const outputFile = findOutputFile(layoutPath, result);
      if (outputFile) {
        builtLayouts[dir] = outputFile;
      }
    }

    for (const [rel, abs] of Object.entries(pageEntryPoints)) {
      const routePath = `/${toPathname(rel)}`;
      const segments = path.dirname(rel).split(path.sep);
      const layouts: string[] = [];

      for (let i = 0; i <= segments.length; i++) {
        const dir = segments.slice(0, i).join("/") || "";
        if (dir in builtLayouts) {
          layouts.push(builtLayouts[dir] as string);
        }
      }

      const outputFile = findOutputFile(abs, result);
      if (!outputFile) {
        Logger.error(`Could not find output file for ${abs}`);
        continue;
      }

      console.log(outputFile);
      const module = (await import(outputFile)).default;
      if (!module) {
        Logger.warn(`Not a route: ${outputFile}`);
        continue;
      }

      finalConfig[routePath] = {
        filepath: outputFile,
        layout: layouts.reverse(),
      };
    }
  } catch (error) {
    Logger.error("Build failed:", error);
    process.exit(1);
  }

  fs.writeFileSync(
    path.join(outDir, "config.json"),
    JSON.stringify(finalConfig, null, 2)
  );
}

function findOutputFile(
  absInputPath: string,
  result: BuildResult<{ metafile: true }>
): string | null {
  const relativeInput = path
    .relative(process.cwd(), absInputPath)
    .replace(/\\/g, "/");

  for (const [outPath, meta] of Object.entries(result.metafile.outputs)) {
    if (meta.entryPoint && meta.entryPoint === relativeInput) {
      return path.resolve(process.cwd(), outPath);
    }
  }
  return null;
}
