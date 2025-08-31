import path from "path";
import RootConfig, { type iRootConfig } from "./config/root.config";
import {
  FATERouteGenerator,
  type FATERouteConfig,
} from "./core/FATERouteGenerator";
import fs from "fs/promises";
import type { FATEPages } from "./core";
import type { FATELayout } from "./core/FATELayout";

export default class FATE {
  static __init__(config?: iRootConfig) {
    RootConfig.FATE_EXICUTION_MODE =
      config?.FATE_EXICUTION_MODE || "development";
    RootConfig.FATE_REDIS_CONNECTION_URL = config?.FATE_REDIS_CONNECTION_URL;
    RootConfig.FATE_TTL = config?.FATE_TTL;
    RootConfig.FATE_RENDER_PATH =
      config?.FATE_RENDER_PATH || path.join(process.cwd(), "views");

    FATERouteGenerator();
  }

  static async render(pathname: string, data: unknown) {
    const configDir = path.join(process.cwd(), ".FATE", "config.json");

    const pageConfig = JSON.parse(
      await fs.readFile(configDir, {
        encoding: "utf-8",
      })
    );
    const config = pageConfig[pathname] as FATERouteConfig;
    const pageRender = (await import(config.filepath)).default as FATEPages;
    let htmlString = pageRender.render(data);

    for (const layout of config.layout) {
      const layoutInstanse = (await import(layout)).default as FATELayout;
      htmlString = layoutInstanse.render(data, htmlString);
    }
    return htmlString;
  }
}

export * from "./core";
