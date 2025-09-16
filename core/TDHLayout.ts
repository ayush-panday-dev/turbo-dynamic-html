export class TDHLayout {
  constructor(
    public render: GenerateTDHLayoutOptions["render"],
    private type: GenerateTDHLayoutOptions["type"],
    private preventCatcheContent?: boolean
  ) {}
}

export function generateTDHLayout(options: GenerateTDHLayoutOptions) {
  return new TDHLayout(
    options.render,
    options.type || "dynamic",
    options.preventCatcheContent
  );
}
