import { writeFile } from "fs/promises";
import TDH from "..";
import path from "path";
TDH.__init__({
  TDH_RENDER_PATH: path.join(process.cwd(), "__test__", "routes"),
});

setInterval(async () => {
  const html = await TDH.render("/test/thisisslug", { test: "asdf" });
  await writeFile(path.join(process.cwd(), "__test__", "index.html"), html);
}, 10_000);
