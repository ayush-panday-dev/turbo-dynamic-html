import path from "path";
import RootConfig from "./config/root.config";
import { TDHRouteGenerator } from "./core/TDHRouteGenerator";
import { Logger } from "./utils/logger";
import render from "./core/render";

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
  static render = render;
}

export * from "./core";
