import { writeFile } from "fs/promises";
import TDH from "..";
import path from "path";
TDH.__init__({
  TDH_RENDER_PATH: path.join(process.cwd(),"__test__", "routes"),
});

setTimeout(async () => {
  const html = await TDH.render("/", { test: "asdf" });
  await writeFile(path.join(process.cwd(), "index.html"), html);
}, 500);
