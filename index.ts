import path from "path";
import RootConfig, { type iRootConfig } from "./config/root.config";
import {
  TDHRouteGenerator,
  type TDHRouteConfig,
} from "./core/TDHRouteGenerator";
import fs from "fs/promises";
import type { TDHPages } from "./core";
import type { TDHLayout } from "./core/TDHLayout";
import { Logger } from "./utils/logger";

export default class TDH {
  static __init__(config?: iRootConfig) {
    RootConfig.TDH_EXICUTION_MODE = config?.TDH_EXICUTION_MODE || "development";
    RootConfig.TDH_REDIS_CONNECTION_URL = config?.TDH_REDIS_CONNECTION_URL;
    RootConfig.TDH_TTL = config?.TDH_TTL;
    RootConfig.TDH_RENDER_PATH =
      config?.TDH_RENDER_PATH || path.join(process.cwd(), "views");

    Logger.info("Preparing for configuring");
    TDHRouteGenerator()
      .then(() => {
        Logger.info("Configuration complete, all pages will be now available");
      })
      .catch((error) => {
        Logger.error(
          error,
          "\nApplication still running but might now be able to serve pages"
        );
      });
  }
  static async render(pathname: string, data: any = {}) {
    try {
      const configDir = path.join(process.cwd(), ".TDH", "config.json");

      const pageConfig = JSON.parse(
        await fs.readFile(configDir, {
          encoding: "utf-8",
        })
      );

      console.log(pathname, pageConfig); // Your existing log

      // First try exact match (fastest path)
      let config = pageConfig[pathname] as TDHRouteConfig;
      let params: Record<string, string> = {};

      if (!config) {
        const matchResult = this.matchRoute(pathname, pageConfig);
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

  private static matchRoute(
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

        console.log(`  🔗 Comparing: "${pathSegment}" vs "${routeSegment}"`);

        if (routeSegment.startsWith(":")) {
          const paramName = routeSegment.slice(1);
          params[paramName] = pathSegment;
          console.log(`    ✅ Dynamic match: ${paramName} = "${pathSegment}"`);
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
}

export * from "./core";
