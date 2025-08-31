import { writeFile } from "fs/promises";
import FATE from "..";
import path from "path";
FATE.__init__({
  FATE_RENDER_PATH: path.join(process.cwd(), "routes"),
});

setTimeout(async () => {
  const html = await FATE.render("/", { test: "asdf" });
  await writeFile(path.join(process.cwd(), "index.html"), html);
}, 500);
