interface TDHRouteConfig {
  layout: string[];
  filepath: string;
}

interface iRootConfig {
  TDH_TTL?: number;
  TDH_REDIS_CONNECTION_URL?: string;
  TDH_EXICUTION_MODE?: "development" | "production";
  TDH_RENDER_PATH?: string;
}

interface GenerateTDHLayoutOptions {
  render: (data: any, children: string) => string;
  type?: "static" | "dynamic";
  preventCatcheContent?: boolean;
}
interface generateTDHPageOptions {
  render: (data: any) => Promise<string> | string;
  type?: "static" | "dynamic";
  preventCatcheContent?: boolean;
}
