import { generateFATEPages } from "../../core";

const page = generateFATEPages({
  render(data: any) {
    return `<div>This is Working</div>`;
  },
});

export default page;
