// Independent checkpoint-21 DOM integration probe. Synthetic data only.
// Run from repository root: node docs/reviews/synchronoptic-timelines/tl21/reviewer-view-probe.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  let passed = 0;
  for (const width of [1440, 390]) {
    for (const variant of ['accepted', 'proposed', 'absent', 'invalid', 'stale', 'changed', 'not-opted-in']) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.setContent('<div id="timeline" hidden></div>');
      for (const name of ['timeline.js', 'timeline-grounding.js', 'timeline-view.js'])
        await page.addScriptTag({ path: path.resolve('public/atlas', name) });
      const result = await page.evaluate(variant => {
        const G = window.AtlasTimelineGrounding;
        const src = [{ t: 'D&C 52:3', u: 'https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/52?lang=eng' }];
        const SV = 'synthetic-view@1';
        const m = { calendar: 'gregorian-ce', sourceVersion: SV, journeys: [], lanes: [{ id: 'l', title: 'Synthetic lane' }],
          records: ['a', 'b'].map((id, i) => ({ id, label: i ? 'Hidden sentinel B' : 'Visible A', lane: 'l', order: i,
            when: null, whenText: '', gate: { book: i + 1, layers: [] }, src, claim: [], notes: [], notSame: [] })),
          edges: [{ id: 'a>b', from: 'a', to: 'b', type: 'context', label: null, gate: {}, src: [], cardSrc: [] }] };
        const row = { v: 1, state: 'accepted', mode: 'shared', from: 'a', to: 'b', type: 'context', claim: 'synthetic claim',
          basis: 'synthetic rationale', sourceVersion: SV, supportRequired: false, src };
        row.binding = G.bindingFor(m, 'a>b', row);
        let sidecar = { kind: 'atlas-timeline-review-sidecar', reviewVersion: 1, pack: 'fixture', manifest: { sourceVersion: SV }, rows: { 'a>b': row } };
        // A previous promotion must be cleared by a rejected/absent replacement before rendering.
        G.loadSidecar(m, sidecar, { packId: 'fixture', sourceVersion: SV });
        if (variant === 'proposed') row.state = 'proposed';
        if (variant === 'absent') sidecar = null;
        if (variant === 'invalid') sidecar.kind = 'wrong';
        if (variant === 'stale') sidecar.manifest.sourceVersion = 'old';
        if (variant === 'changed') m.records[1].label += ' renamed';
        window.limit = 2;
        const env = { el: document.querySelector('#timeline'), model: m, pack: { id: 'fixture' }, sourceVersion: SV,
          ok: g => !g || g.book == null || g.book <= window.limit };
        if (variant !== 'not-opted-in') env.sidecar = sidecar;
        const view = window.AtlasTimelineView.createView(env);
        view.show();
        document.querySelector('[data-mode="list"]').click();
        const first = { status: view.grounding && view.grounding.status,
          sourced: m.edges[0].src.length, grounding: !!m.edges[0].grounding,
          citations: document.querySelectorAll('.tl-edges a').length, text: document.body.textContent };
        view.show('b');
        window.limit = 1;
        view.refresh();
        const narrow = { selected: view.sel, text: document.body.textContent, citations: document.querySelectorAll('.tl-edges a').length };
        return { first, narrow };
      }, variant);
      const expectSource = ['accepted', 'not-opted-in'].includes(variant);
      assert.equal(result.first.sourced, expectSource ? 1 : 0, `${width}/${variant} source`);
      assert.equal(result.first.citations, expectSource ? 1 : 0, `${width}/${variant} DOM source`);
      assert.equal(result.first.grounding, expectSource, `${width}/${variant} promotion`);
      assert.equal(result.first.status, ({ accepted: 'ok', proposed: 'ok', absent: 'absent', invalid: 'invalid', stale: 'stale', changed: 'ok', 'not-opted-in': null })[variant]);
      assert.equal(result.narrow.selected, null);
      assert.equal(result.narrow.citations, 0);
      assert.equal(result.narrow.text.includes('Hidden sentinel B'), false, `${width}/${variant} stale text`);
      assert.deepEqual(errors, []);
      passed++;
      console.log(`PASS ${width}/${variant}: first-render source state, downgrade selection/text/citation, no page errors`);
      await page.close();
    }
  }
  console.log(`${passed}/14 scenarios passed (8 assertions each; synthetic DOM integration, not full atlas host/device qualification)`);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
