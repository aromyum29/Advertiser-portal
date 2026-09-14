/**
 * Builds the standalone case study.
 *
 * Reads src/index.template.html, replaces every `{{shot:name}}` with the
 * matching screenshot from shots/ as a base64 data URI, and writes index.html.
 * One file, no external assets beyond web fonts, so it can be hosted anywhere
 * or attached to an application as-is.
 */
import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(here, "src/index.template.html"), "utf8");

let missing = 0;
const out = template.replace(/\{\{shot:([\w-]+)\}\}/g, (_, name) => {
  const file = join(here, "shots", `${name}.jpg`);
  if (!existsSync(file)) {
    missing += 1;
    console.error(`missing shot: ${name}`);
    return "";
  }
  return `data:image/jpeg;base64,${readFileSync(file).toString("base64")}`;
});

if (missing > 0) process.exit(1);
writeFileSync(join(here, "index.html"), out);
console.log(`case-study/index.html written (${(statSync(join(here, "index.html")).size / 1024 / 1024).toFixed(2)} MB)`);

// A body-only variant for hosts that wrap the page in their own document
// skeleton (claude.ai Artifacts): title, font links and styles first, then the
// page content, no doctype/html/head/body of its own.
const head = out.slice(out.indexOf("<title>"), out.indexOf("</head>"));
const body = out.slice(out.indexOf("<body>") + "<body>".length, out.lastIndexOf("</body>"));
writeFileSync(join(here, "artifact.html"), `${head}\n${body}`);
console.log("case-study/artifact.html written");
