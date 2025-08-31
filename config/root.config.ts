export interface iRootConfig {
  TDH_TTL?: number;
  TDH_REDIS_CONNECTION_URL?: string;
  TDH_EXICUTION_MODE?: "development" | "production";
  TDH_RENDER_PATH?: string;
}
export default class RootConfig {
  static TDH_TTL?: number;
  static TDH_REDIS_CONNECTION_URL?: string;
  static TDH_EXICUTION_MODE: "development" | "production";
  static TDH_RENDER_PATH: string;
}
