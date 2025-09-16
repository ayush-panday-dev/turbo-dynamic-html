export class TDHPages {
  constructor(
    public render: generateTDHPageOptions["render"],
    private type: generateTDHPageOptions["type"],
    private preventCatcheContent?: boolean
  ) {}
}

export function generateTDHPage(options: generateTDHPageOptions) {
  return new TDHPages(
    options.render,
    options.type || "dynamic",
    options.preventCatcheContent
  );
}
