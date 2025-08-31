import { generateTDHPages } from "../../../../core";

const page = generateTDHPages({
  render(data: any) {
    return `<div>This is Working</div>`;
  },
});

export default page;
