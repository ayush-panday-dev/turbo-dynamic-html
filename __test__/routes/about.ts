import { generateTDHPage } from "../../core";

const page = generateTDHPage({
  render(data: any) {
    return `<div>This is Working</div>`;
  },
});

export default page;
