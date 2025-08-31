import { generateTDHLayout } from "../../../core/TDHLayout";

const layout = generateTDHLayout({
  render: (data: any, children) => {
    return `<text>{${children}}</text>`;
  },
});

export default layout;
