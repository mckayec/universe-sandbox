/* Relationship grounding for timeline edges (timeline checkpoint 15).

   A codex card's `src` cites the card, not each of its `see` links, so the Standard Works adapter leaves every
   link's `src` empty and keeps the card's citation as `cardSrc`. This module reviews each relationship on its own:

   * `parseLocator({t, u})` reads one citation into { book, chapters, verses } from the official URL (volume/book)
     and the label ("Mosiah 12:1–37", "Genesis 16–17", "D&C 52 heading"). Unparseable citations return null.
   * `groundLink(fromSrc, toSrc)` compares the two endpoint cards' citations and classes the relationship:
       shared-verse     both cards cite at least one identical verse (the overlap is returned as a candidate);
       shared-chapter   both cite the same chapter and one of them cites it whole (candidate, weaker);
       same-chapter     both cite the same chapter but different verses (no candidate);
       cross-text       both cite something, but no common chapter (no candidate: the link joins two texts);
       no-locator       one card or both have no citation.
     A class is evidence for a reviewer, never a source by itself.
   * `applyEdgeSources(model, reviewed)` promotes an edge only when a reviewed entry names it AND every locator in
     that entry lies inside the shared passage of both endpoints. Anything else is reported as rejected, so a
     card-only citation can never be promoted into a relationship source. Nothing is invented: the promoted `src`
     is the reviewed entry's own citation. */
(function (root) {
  'use strict';

  const arr = v => (Array.isArray(v) ? v : v == null ? [] : [v]);

  /* "1–3, 5" → [1,2,3,5]; returns null when the text holds no verse numbers */
  function verseList(s) {
    const out = [];
    String(s || '')
      .split(/[,;]/)
      .forEach(part => {
        const m = part.trim().match(/^(\d+)(?:\s*[–-]\s*(\d+))?/);
        if (!m) return;
        const a = +m[1];
        const b = m[2] ? +m[2] : a;
        for (let v = a; v <= b && v - a < 500; v++) out.push(v);
      });
    return out.length ? out : null;
  }

  function parseLocator(c) {
    if (!c) return null;
    const t = String(c.t || '').trim();
    const um = String(c.u || '').match(/\/study\/scriptures\/([^/]+)\/([^/?#]+)(?:\/(\d+))?/);
    if (!um) return null;
    const book = um[1] + '/' + um[2];
    const heading = /\bheading\b/i.test(t);
    const urlCh = um[3] ? +um[3] : 0;
    const colon = t.indexOf(':');
    let chapters = [urlCh];
    let verses = null;
    if (colon > 0) {
      const cm = t.slice(0, colon).match(/(\d+)\s*$/);
      if (!cm || +cm[1] !== urlCh) return { book, chapters, verses: null, heading, loose: true };
      verses = verseList(t.slice(colon + 1).replace(/heading/gi, ''));
    } else {
      const hv = heading && t.match(/heading\s*,\s*([\d,\s–-]+)$/i);
      if (hv) return { book, chapters, verses: verseList(hv[1]), heading, loose: false };
      const rm = t.replace(/\s*heading\s*$/i, '').match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*$/);
      if (rm && +rm[1] === urlCh && rm[2]) {
        chapters = [];
        for (let ch = +rm[1]; ch <= +rm[2]; ch++) chapters.push(ch);
      }
    }
    return { book, chapters, verses, heading, loose: false };
  }

  /* one citation's verses within one chapter; null = the whole chapter (or the heading only, see `heading`) */
  function spans(src) {
    const out = [];
    arr(src).forEach(c => {
      const p = parseLocator(c);
      if (!p) return;
      p.chapters.forEach(ch =>
        out.push({ key: p.book + '#' + ch, verses: p.chapters.length > 1 ? null : p.verses, heading: p.heading, c }),
      );
    });
    return out;
  }

  function groundLink(fromSrc, toSrc) {
    const a = spans(fromSrc);
    const b = spans(toSrc);
    if (!a.length || !b.length) return { cls: 'no-locator', shared: [] };
    const shared = [];
    let sameChapter = false;
    let wholeChapter = false;
    a.forEach(x =>
      b.forEach(y => {
        if (x.key !== y.key) return;
        sameChapter = true;
        const xh = x.heading && !x.verses;
        const yh = y.heading && !y.verses;
        if (xh || yh) {
          /* a chapter heading is its own passage: it grounds only against another citation of that heading */
          if (xh && yh) {
            wholeChapter = true;
            shared.push({ key: x.key, verses: null, heading: true, whole: true, from: x.c, to: y.c });
          }
        } else if (x.verses && y.verses) {
          const vs = x.verses.filter(v => y.verses.includes(v));
          if (vs.length) shared.push({ key: x.key, verses: vs, from: x.c, to: y.c });
        } else {
          wholeChapter = true;
          shared.push({ key: x.key, verses: x.verses || y.verses, whole: true, from: x.c, to: y.c });
        }
      }),
    );
    if (shared.some(s => !s.whole)) return { cls: 'shared-verse', shared: shared.filter(s => !s.whole) };
    if (wholeChapter) return { cls: 'shared-chapter', shared };
    if (sameChapter) return { cls: 'same-chapter', shared: [] };
    return { cls: 'cross-text', shared: [] };
  }

  /* true when every verse of `loc` is inside one of the endpoints' shared spans */
  function insideShared(loc, shared) {
    const p = parseLocator(loc);
    if (!p || p.chapters.length !== 1) return false;
    const key = p.book + '#' + p.chapters[0];
    return shared.some(s => {
      if (s.key !== key) return false;
      if (!p.verses) return !!s.whole && !s.verses && !!s.heading === !!p.heading;
      return p.verses.every(v => (s.verses ? s.verses.includes(v) : true));
    });
  }

  /* reviewed: { [edgeId]: { src: [{t, u}], basis: '…' } } — promotes only entries inside the shared passage */
  function applyEdgeSources(model, reviewed) {
    const recs = new Map(model.records.map(r => [r.id, r]));
    const promoted = [];
    const rejected = [];
    const byId = new Map(model.edges.map(e => [e.id, e]));
    Object.keys(reviewed || {}).forEach(id => {
      const entry = reviewed[id];
      const e = byId.get(id);
      if (!e) return rejected.push({ id, why: 'no such edge' });
      const from = recs.get(e.from);
      const to = recs.get(e.to);
      const g = groundLink(from && from.src, to && to.src);
      const src = arr(entry && entry.src);
      if (!src.length) return rejected.push({ id, why: 'no locator in the reviewed entry' });
      if (!src.every(c => insideShared(c, g.shared)))
        return rejected.push({ id, why: 'locator is not cited by both cards (' + g.cls + ')' });
      e.src = src.map(c => ({ t: c.t, u: c.u }));
      e.locator = src.map(c => c.t).join('; ');
      e.basis = (entry && entry.basis) || null;
      promoted.push(id);
    });
    return { promoted, rejected };
  }

  /* every relationship with its class, for the review ledger */
  function ledger(model) {
    const recs = new Map(model.records.map(r => [r.id, r]));
    return model.edges.map(e => {
      const from = recs.get(e.from);
      const to = recs.get(e.to);
      const g = e.type === 'travel' ? { cls: 'travel', shared: [] } : groundLink(from && from.src, to && to.src);
      return { edge: e, from, to, cls: g.cls, shared: g.shared };
    });
  }

  root.AtlasTimelineGrounding = { parseLocator, verseList, groundLink, insideShared, applyEdgeSources, ledger };
})(typeof window !== 'undefined' ? window : globalThis);
