// Static check of the built site (run after `pnpm build`): `node tests/check-dist.mjs [distDir]`.
//  1. Every same-origin file referenced from HTML (src/href), CSS (url()), the web manifest (icons) and JS string
//     literals that name a file (…/name.ext) exists in dist. This is how a missing folder (atlas/tex/ once) is caught
//     before deploy.
//  2. No page loads a script, stylesheet, font or image from another host (no CDNs, no Google Fonts): the site must
//     work offline and must not send visitors' addresses to third parties. Plain <a href="https://…"> links are fine.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const dist = resolve(process.argv[2] || new URL('../dist/', import.meta.url).pathname);
if (!existsSync(join(dist, 'index.html'))) {
  console.error(`check-dist: ${dist}/index.html not found. Run \`pnpm build\` first.`);
  process.exit(2);
}

function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(dist);
const problems = [];
const rel = path => relative(dist, path).split(sep).join('/');
const isRemote = url => /^(https?:)?\/\//i.test(url);
const skip = url =>
  !url || /^(data:|blob:|mailto:|tel:|javascript:|#|about:)/i.test(url) || url.includes('${') || url.includes('{{');

function checkLocal(from, url, baseDirs, what) {
  if (skip(url) || isRemote(url)) return;
  if (url.startsWith('/')) {
    problems.push(`${rel(from)}: absolute path "${url}" (${what}) breaks under the GitHub Pages subpath`);
    return;
  }
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  if (!clean) return; // "?pack=x" or "#hash": same page
  const ok = baseDirs.some(base => {
    const target = resolve(base, clean);
    if (!target.startsWith(dist)) return false;
    if (existsSync(target) && statSync(target).isFile()) return true;
    return existsSync(join(target, 'index.html'));
  });
  if (!ok) problems.push(`${rel(from)}: ${what} "${url}" does not exist in dist`);
}

// directories a JS file's relative literals may resolve against: the script's own folder (ENGINE_BASE-style) and
// the folders of the pages that can load it (any ancestor up to dist)
function jsBases(file) {
  const out = [];
  for (let d = dirname(file); d.startsWith(dist); d = dirname(d)) {
    out.push(d);
    if (d === dist) break;
  }
  return out;
}

const ASSET_EXT =
  'js|mjs|css|png|jpe?g|webp|gif|svg|json|woff2?|ttf|otf|webmanifest|ktx2|glb|gltf|mp3|ogg|wav|mp4|webm';
const literalRe = new RegExp(
  `["'\`]((?:\\.{1,2}/)?(?:[\\w@.-]+/)*[\\w@.-]+\\.(?:${ASSET_EXT}))(?:[?#][^"'\`]*)?["'\`]`,
  'g',
);
// any string literal or concatenation that requests a remote script or stylesheet
const remoteLoadRe =
  /(?:src|href)\s*=\s*["'](https?:)?\/\/[^"']+["']|load\(\s*["'](?:https?:)?\/\/|importScripts\(\s*["'](?:https?:)?\/\/|@import\s+(?:url\()?["']?(?:https?:)?\/\//gi;

for (const file of files) {
  const name = rel(file);
  if (/\.(html?)$/i.test(file)) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/<(script|link|img|source|video|audio|iframe|use)\b[^>]*>/gi)) {
      const tag = m[0];
      const kind = m[1].toLowerCase();
      for (const a of tag.matchAll(/\s(src|href|srcset|poster)\s*=\s*["']([^"']*)["']/gi)) {
        const url = a[2].trim();
        if (isRemote(url)) {
          problems.push(`${name}: <${kind}> loads ${url} from another host`);
          continue;
        }
        if (kind === 'use' && url.startsWith('#')) continue;
        checkLocal(file, url, [dirname(file)], `<${kind} ${a[1]}>`);
      }
    }
    // inline <style> url()s
    for (const m of html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
      if (isRemote(m[1])) problems.push(`${name}: CSS url() loads ${m[1]} from another host`);
      else checkLocal(file, m[1], [dirname(file)], 'url()');
    }
    // inline scripts: remote loads and file literals
    for (const s of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
      for (const m of s[1].matchAll(remoteLoadRe))
        problems.push(`${name}: inline script loads from another host: ${m[0]}`);
      for (const m of s[1].matchAll(literalRe)) checkLocal(file, m[1], [dirname(file)], 'inline-script path');
    }
  } else if (/\.css$/i.test(file)) {
    const css = readFileSync(file, 'utf8');
    for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
      if (isRemote(m[1])) problems.push(`${name}: url() loads ${m[1]} from another host`);
      else checkLocal(file, m[1], [dirname(file)], 'url()');
    }
    for (const m of css.matchAll(/@import\s+(?:url\()?["']?([^"')\s;]+)/gi)) {
      if (isRemote(m[1])) problems.push(`${name}: @import from another host: ${m[1]}`);
      else checkLocal(file, m[1], [dirname(file)], '@import');
    }
  } else if (/\.webmanifest$/i.test(file)) {
    const man = JSON.parse(readFileSync(file, 'utf8'));
    for (const icon of man.icons || []) checkLocal(file, icon.src, [dirname(file)], 'manifest icon');
  } else if (/\.m?js$/i.test(file) && !/(^|\/)vendor\/three-r128\//.test(name)) {
    const js = readFileSync(file, 'utf8');
    for (const m of js.matchAll(remoteLoadRe)) problems.push(`${name}: loads from another host: ${m[0]}`);
    if (/fonts\.(googleapis|gstatic)\.com/.test(js)) problems.push(`${name}: references Google Fonts`);
    // bundled Vite chunks contain many library strings; only check our own hand-written files
    if (name.startsWith('assets/')) continue;
    // block comments may name build tools (e.g. a generated-file header); only code can request files
    const code = js.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of code.matchAll(literalRe)) {
      // provenance strings naming repo-only folders (never shipped to visitors) are not requests
      if (/^(tools|docs|scripts)\//.test(m[1])) continue;
      checkLocal(file, m[1], jsBases(file), 'path literal');
    }
    // atlas/tex/ now ships (the Society Atlas maps): its fixed paths are checked above like any other literal, and every
    // map named in Society's TEXSET/ERA_TEX tables (built at run time as "tex/" + name) must exist too
    if (name === 'atlas/society.js') {
      const names = new Set();
      for (const start of ['const TEXSET=', 'const ERA_TEX=']) {
        const at = js.indexOf(start);
        if (at < 0) {
          problems.push(`${name}: no ${start} table found`);
          continue;
        }
        const end = js.indexOf('\nconst ', at + start.length);
        for (const m of js.slice(at, end < 0 ? undefined : end).matchAll(/:"([a-z0-9_]+)"/g)) names.add(m[1]);
      }
      for (const n of names)
        checkLocal(file, `tex/${n}${n.endsWith('ring') ? '.png' : '.jpg'}`, [dirname(file)], 'map name');
    }
  }
}

if (problems.length) {
  console.error(`check-dist: ${problems.length} problem(s) in ${dist}`);
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log(`check-dist: ${files.length} files OK (all same-origin references resolve; no third-party loads).`);
