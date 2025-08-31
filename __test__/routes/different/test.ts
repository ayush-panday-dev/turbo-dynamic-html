import { generateTDHPages } from "../../../core";

const page = generateTDHPages({
  render(data: any) {
    return `<div>${JSON.stringify(data)}</div>`;
  },
});

export default page;
