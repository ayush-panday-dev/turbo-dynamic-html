export interface iRootConfig {
  FATE_TTL?: number;
  FATE_REDIS_CONNECTION_URL?: string;
  FATE_EXICUTION_MODE?: "development" | "production";
  FATE_RENDER_PATH?: string;
}
export default class RootConfig {
  static FATE_TTL?: number;
  static FATE_REDIS_CONNECTION_URL?: string;
  static FATE_EXICUTION_MODE: "development" | "production";
  static FATE_RENDER_PATH: string;
}
