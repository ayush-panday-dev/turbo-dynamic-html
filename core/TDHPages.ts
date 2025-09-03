export class TDHPages {
  constructor(
    public render: GenerateTDHPagesOptions["render"],
    private type: GenerateTDHPagesOptions["type"],
    private preventCatcheContent?: boolean
  ) {}
}

export interface GenerateTDHPagesOptions {
  render: (data: any) => Promise<string> | string;
  type?: "static" | "dynamic";
  preventCatcheContent?: boolean;
}
export function generateTDHPages(options: GenerateTDHPagesOptions) {
  return new TDHPages(
    options.render,
    options.type || "dynamic",
    options.preventCatcheContent
  );
}
