// Applies the 14-target hold/dependency omission batch (canon-disposition-5bfde31.md) with exact preconditions.
// Usage: node hold-omit-apply.cjs <repo-root>
const fs = require("fs"), path = require("path");
const root = process.argv[2];
const plan = {
  "public/atlas/packs/expanse.js": [
    [627, /^\s*\{id: "drumring", name: "The habitat drum"/, "SP09 landmark medina/drum/drumring"],
    [628, /^\s*\{id: "engineering", name: "Engineering"/, "SP10 landmark medina/drum/engineering"],
    [927, /^\s*\{id: "b3f", book: 3, world: "medina", site: "drum", lm: "drumring"/, "SP11 event b3f"],
    [929, /^\s*\{id: "b3o", book: 3, world: "medina", site: "drum", lm: "engineering", fx: "battle"/, "SP12 event b3o (+fx battle)"],
    [932, /^\s*\{id: "b3i", book: 3, world: "medina", site: "drum", lm: "drumring"/, "dep event b3i (lm drumring)"],
    [978, /^\s*\{id: "b7d", book: 7, world: "medina", site: "drum", lm: "engineering"/, "dep event b7d (lm engineering)"],
  ],
  "public/atlas/packs/hyperion.js": [
    [75, /^\s*\{id:"sphinx",name:"The Sphinx",kind:"statue"/, "SP13 landmark tombs/sphinx"],
    [76, /^\s*\{id:"jade",name:"Jade Tomb"/, "SP14 landmark tombs/jade"],
    [81, /^\s*\{id:"sphinx",name:"The Sphinx",lat:37\.9/, "SP13 dep site hyperion/sphinx (line 1/5)"],
    [82, /^\s*scene:\{kind:"tombs",arch:"alien",size:"small",tod:"night"/, "site sphinx scene (nested)"],
    [83, /^\s*\{id:"door",/, "site sphinx nested landmark door"],
    [84, /^\s*\{id:"inner",/, "site sphinx nested landmark inner"],
    [85, /^\s*\{id:"watch",.*\}\]\}\},\s*$/, "site sphinx nested landmark watch (closes site)"],
    [553, /^\s*\{id:"b1i2",book:1,world:"hyperion",site:"sphinx"/, "dep event b1i2"],
    [562, /^\s*\{id:"b1n",book:1,world:"hyperion",site:"tombs"/, "SP15 event b1n"],
    [564, /^\s*\{id:"b2b",book:2,world:"hyperion",site:"tombs"/, "SP16 event b2b"],
    [574, /^\s*\{id:"b2k",book:2,world:"hyperion",site:"sphinx"/, "dep event b2k"],
    [582, /^\s*\{id:"b3b",book:3,world:"hyperion",site:"sphinx"/, "dep event b3b"],
  ],
};
let removed = [];
for (const [rel, items] of Object.entries(plan)) {
  const f = path.join(root, rel);
  const lines = fs.readFileSync(f, "utf8").split("\n");
  for (const [n, re, label] of items) {
    if (!re.test(lines[n - 1])) { console.error(`PRECONDITION FAIL ${rel}:${n} ${label}\n${lines[n - 1].slice(0, 160)}`); process.exit(1); }
  }
  const drop = new Set(items.map((i) => i[0]));
  for (const [n, , label] of items) removed.push({ file: rel, line: n, label, text: lines[n - 1].trim() });
  fs.writeFileSync(f, lines.filter((_, i) => !drop.has(i + 1)).join("\n"));
}
console.log(JSON.stringify(removed.map((r) => `${r.file}:${r.line} ${r.label}`), null, 1));
console.log(`removed lines: ${removed.length}`);
