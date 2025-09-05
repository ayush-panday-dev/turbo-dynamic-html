import { generateTDHPage } from "../../../core";

const page = generateTDHPage({
  render(data: any) {
    return `<div>${JSON.stringify(data)}</div>`;
  },
});

export default page;
