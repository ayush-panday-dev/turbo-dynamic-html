export interface TDHConfig {
  TDH_TTL?: number;
  TDH_REDIS_CONNECTION_URL?: string;
  TDH_EXICUTION_MODE?: "development" | "production";
  TDH_RENDER_PATH?: string;
}

export interface TDHPageOptions {
  render: (data: any) => Promise<string> | string;
  type?: "static" | "dynamic";
  preventCatcheContent?: boolean;
}

export interface TDHLayoutOptions {
  render: (data: any, children: string) => string;
  type?: "static" | "dynamic";
  preventCatcheContent?: boolean;
}

export interface TDHPage {
  render: (data: any) => Promise<string> | string;
  type: "static" | "dynamic";
  preventCatcheContent: boolean;
}

export interface TDHLayout {
  render: (data: any, children: string) => string;
  type: "static" | "dynamic";
  preventCatcheContent: boolean;
}

export declare function generateTDHPage(options: TDHPageOptions): TDHPage;
export declare function generateTDHLayout(options: TDHLayoutOptions): TDHLayout;

declare class TDH {
  static __init__(config: TDHConfig): void;
  static render(path: string, data?: any): Promise<string | null>;
}

export default TDH;
