import { generateFATEPages } from "../../../core";

const page = generateFATEPages({
  render(data: any) {
    return `<div>${JSON.stringify(data)}</div>`;
  },
});

export default page;
