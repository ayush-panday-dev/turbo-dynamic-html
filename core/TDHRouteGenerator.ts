import fs, { Dirent } from "fs";
import path from "path";
import { build, type BuildResult } from "esbuild";
import RootConfig from "../config/root.config";
import { Logger } from "../utils/logger";

export interface TDHRouteConfig {
  layout: string[];
  filepath: string;
}

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
  const finalConfig: Record<string, TDHRouteConfig> = {};

  for (const rel of files) {
    const abs = path.join(base, rel);
    if (rel.endsWith("_layout.ts")) {
      dirLayout[path.dirname(rel) === "." ? "" : path.dirname(rel)] = abs;
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

  try {
    const result = await build({
      entryPoints: Object.values(pageEntryPoints),
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

    for (const [rel, abs] of Object.entries(pageEntryPoints)) {
      const routePath = `/${toPathname(rel)}`;
      const segments = path.dirname(rel).split(path.sep);
      const layouts: string[] = [];

      for (let i = 0; i <= segments.length; i++) {
        const dir = segments.slice(0, i).join("/") || "";
        if (dir in dirLayout) {
          layouts.push(dirLayout[dir] as string);
        }
      }

      const outputFile = findOutputFile(abs, result);
      if (!outputFile) {
        Logger.error(`Could not find output file for ${abs}`);
        continue;
      }

      const module = (await import(outputFile)).default;
      if (!module) {
        return Logger.warn(`Not a route: ${outputFile}`);
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
