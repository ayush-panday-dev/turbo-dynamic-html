import path from "path";
import fs from "fs/promises";

import type { TDHRouteConfig } from "./TDHRouteGenerator";
import { Logger } from "../utils/logger";
import type { TDHPages } from "./TDHPages";
import type { TDHLayout } from "./TDHLayout";

export default async function render(pathname: string, data: any = {}) {
  try {
    const configDir = path.join(process.cwd(), ".TDH", "config.json");

    const pageConfig = JSON.parse(
      await fs.readFile(configDir, {
        encoding: "utf-8",
      })
    );

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
      Logger.todo(
        "When we do not found any pathname we will render Not found html on future release"
      );
      return `TODO: Here will be not found page later on future release.`;
    }
    const pageRender = (await import(config.filepath)).default as TDHPages;

    let htmlString = pageRender.render({ ...data, params });
    for (const layout of config.layout) {
      const layoutInstance = (await import(layout)).default as TDHLayout;
      htmlString = layoutInstance.render({ ...data, params }, htmlString);
    }
    return htmlString;
  } catch (error) {
    Logger.error(error);
    return `TODO: here will be 500 file`;
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
