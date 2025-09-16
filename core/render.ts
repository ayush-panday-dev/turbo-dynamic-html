import path from "path";
import fs from "fs/promises";

import { Logger } from "../utils/logger";
import type { TDHPages } from "./TDHPages";
import type { TDHLayout } from "./TDHLayout";
import { MemoryCatching } from "../utils/catching";
import RootConfig from "../config/root.config";

async function getConfig(): Promise<Record<string, TDHRouteConfig>> {
  const catchedConfig = MemoryCatching.getFromCatch("tdh-config");
  if (catchedConfig) {
    return catchedConfig.value;
  }
  const configDir = path.join(process.cwd(), ".TDH", "config.json");
  const config = JSON.parse(
    await fs.readFile(configDir, {
      encoding: "utf-8",
    })
  );
  MemoryCatching.insertCatche("tdh-config", config, {
    expiry: new Date(new Date().setDate(new Date().getDate() + 3)),
  });
  return config;
}
export default async function render(pathname: string, data: any = {}) {
  try {
    const catche = MemoryCatching.getFromCatch(pathname);
    if (catche) {
      return catche.value;
    }
    const pageConfig = await getConfig();
    let config = pageConfig[pathname] as TDHRouteConfig;
    let params: Record<string, string> = {};

    if (!config) {
      const matchResult = matchRoute(pathname, pageConfig);
      if (matchResult) {
        config = matchResult.config;
        params = matchResult.params;
      }
    }

    if (!config) {
      const notFountDir = path.join(process.cwd(), ".TDH", "build");
      const page = (await import(path.join(notFountDir, "404.js")))
        .default as TDHPages;
      const layoutInstance = (
        await import(path.join(notFountDir, "_layout.js"))
      ).default as TDHLayout;
      const pagedata = await page.render(null);
      const layout = await layoutInstance.render(null, pagedata);

      return layout;
    }
    const pageRender = (await import(config.filepath)).default as TDHPages;

    let htmlString = await pageRender.render({ ...data, params });
    for (const layout of config.layout) {
      const layoutInstance = (await import(layout)).default as TDHLayout;
      htmlString = layoutInstance.render({ ...data, params }, htmlString);
    }

    MemoryCatching.insertCatche(pathname, htmlString, {
      expiry: new Date(Date.now() + (RootConfig.TDH_TTL || 120) * 1000),
    });
    return htmlString;
  } catch (error) {
    Logger.error(error);
    const notFountDir = path.join(process.cwd(), ".TDH", "build");
    const page = (await import(path.join(notFountDir, "500.js")))
      .default as TDHPages;
    const layoutInstance = (await import(path.join(notFountDir, "_layout.js")))
      .default as TDHLayout;
    const pagedata = await page.render(error);
    const layout = await layoutInstance.render(null, pagedata);

    return layout;
  }
}

function matchRoute(
  pathname: string,
  pageConfig: any
): { config: TDHRouteConfig; params: Record<string, string> } | null {
  const pathSegments = pathname.split("/").filter(Boolean);

  for (const [route, config] of Object.entries(pageConfig)) {
    const routeSegments = route.split("/").filter(Boolean);

    if (pathSegments.length !== routeSegments.length) {
      continue;
    }

    const params: Record<string, string> = {};
    let isMatch = true;

    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i] as string;
      const pathSegment = pathSegments[i] as string;

      if (routeSegment.startsWith(":")) {
        const paramName = routeSegment.slice(1);
        params[paramName] = pathSegment;
      } else if (routeSegment !== pathSegment) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return { config: config as TDHRouteConfig, params };
    }
  }
  return null;
}
