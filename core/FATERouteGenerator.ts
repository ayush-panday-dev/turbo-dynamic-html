import fs, { Dirent } from "fs";
import path from "path";
import RootConfig from "../config/root.config";
import { FATEPages } from "./FATEPages";
import { FATELayout } from "./FATELayout";

function listRecursiveSync(base: string): string[] {
  const scan = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e: Dirent) => {
      const full = path.join(dir, e.name);
      return e.isDirectory() ? scan(full) : full;
    });
  return scan(base).map((p) => path.relative(base, p).replace(/\\/g, "/"));
}

function toPathname(rel: string): string {
  return rel
    .replace("index.ts", "")
    .replace(/\([^/]+\)\//g, "")
    .replace(".ts", "")
    .replace(".", "")
    .replace(/\[([^\]]+)\]/g, ":$1");
}

export async function FATERouteGenerator() {
  const outDir = path.join(process.cwd(), ".FATE");
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir);

  const base = RootConfig.FATE_RENDER_PATH;
  const files = listRecursiveSync(base);

  const dirLayout: Record<string, string> = {};
  await Promise.all(
    files.map(async (rel) => {
      if (!rel.endsWith("_layout.ts")) return;
      const abs = path.join(base, rel);
      const mod = await import(abs);
      if (mod.default instanceof FATELayout) {
        dirLayout[path.dirname(rel) === "." ? "" : path.dirname(rel)] = abs;
      }
    })
  );

  await files
    .reduce<Promise<Record<string, FATERouteConfig>>>(async (accP, rel) => {
      const acc = await accP;

      if (!rel.endsWith(".ts") || rel.endsWith("_layout.ts")) return acc;

      const abs = path.join(base, rel);
      const page = (await import(abs)).default;
      if (!(page instanceof FATEPages)) return acc;

      const segments = path.dirname(rel).split(path.sep);
      const layouts: string[] = [];
      for (let i = 0; i <= segments.length; i++) {
        const dir = segments.slice(0, i).join("/") || "";
        if (dir in dirLayout) layouts.push(dirLayout[dir] as string);
      }

      acc[`/${toPathname(rel)}`] = { filepath: abs, layout: layouts.reverse() };
      return acc;
    }, Promise.resolve({}))
    .then((config) => {
      fs.writeFileSync(
        path.join(outDir, "config.json"),
        JSON.stringify(config, null, 2)
      );
    });
}

export interface FATERouteConfig {
  layout: string[];
  filepath: string;
}
