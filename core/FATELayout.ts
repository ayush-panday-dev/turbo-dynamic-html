export class FATELayout {
  constructor(
    public render: GenerateFATELayoutOptions["render"],
    private type: GenerateFATELayoutOptions["type"],
    private preventCatcheContent?: boolean
  ) {}
}

export interface GenerateFATELayoutOptions {
  render: (data: unknown, children: string) => string;
  type?: "static" | "dynamic";
  preventCatcheContent?: boolean;
}
export function generateFATELayout(options: GenerateFATELayoutOptions) {
  return new FATELayout(
    options.render,
    options.type || "dynamic",
    options.preventCatcheContent
  );
}
