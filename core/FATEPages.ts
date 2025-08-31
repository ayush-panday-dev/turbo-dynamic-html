export class FATEPages {
  constructor(
    public render: GenerateFATEPagesOptions["render"],
    private type: GenerateFATEPagesOptions["type"],
    private preventCatcheContent?: boolean
  ) {}
}

export interface GenerateFATEPagesOptions {
  render: (data: unknown) => string;
  type?: "static" | "dynamic";
  preventCatcheContent?: boolean;
}
export function generateFATEPages(options: GenerateFATEPagesOptions) {
  return new FATEPages(
    options.render,
    options.type || "dynamic",
    options.preventCatcheContent
  );
}
