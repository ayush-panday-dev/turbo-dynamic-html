import fs, { Dirent } from "fs";
import path from "path";
import RootConfig from "../config/root.config";
import { TDHPages } from "./TDHPages";
import { TDHLayout } from "./TDHLayout";

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
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir);

  const base = RootConfig.TDH_RENDER_PATH;
  const files = listRecursiveSync(base);

  const dirLayout: Record<string, string> = {};
  await Promise.all(
    files.map(async (rel) => {
      if (!rel.endsWith("_layout.ts")) return;
      const abs = path.join(base, rel);
      const mod = await import(abs);
      if (mod.default instanceof TDHLayout) {
        dirLayout[path.dirname(rel) === "." ? "" : path.dirname(rel)] = abs;
      }
    })
  );

  await files
    .reduce<Promise<Record<string, TDHRouteConfig>>>(async (accP, rel) => {
      const acc = await accP;

      if (!rel.endsWith(".ts") || rel.endsWith("_layout.ts")) return acc;

      const abs = path.join(base, rel);
      const page = (await import(abs)).default;
      if (!(page instanceof TDHPages)) return acc;

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

export interface TDHRouteConfig {
  layout: string[];
  filepath: string;
}
