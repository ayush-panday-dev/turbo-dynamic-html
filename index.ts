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

  static async render(pathname: string, data: unknown = {}) {
    try {
      const configDir = path.join(process.cwd(), ".TDH", "config.json");

      const pageConfig = JSON.parse(
        await fs.readFile(configDir, {
          encoding: "utf-8",
        })
      );
      const config = pageConfig[pathname] as TDHRouteConfig;
      if (!config) {
        Logger.todo(
          "When we do not found any pathname we will render Not found html on future release"
        );
        return `TODO: Here will be not found page later on future release.`;
      }
      const pageRender = (await import(config.filepath)).default as TDHPages;
      let htmlString = pageRender.render(data);

      for (const layout of config.layout) {
        const layoutInstanse = (await import(layout)).default as TDHLayout;
        htmlString = layoutInstanse.render(data, htmlString);
      }
      return htmlString;
    } catch (error) {
      Logger.error(error);
      return `TODO: here will be 500 file`;
    }
  }
}

export * from "./core";
