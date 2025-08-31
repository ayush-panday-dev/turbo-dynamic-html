import { generateFATELayout } from "../../../core/FATELayout";

const layout = generateFATELayout({
  render: (data: any, children) => {
    return `<text>{${children}}</text>`;
  },
});

export default layout;
