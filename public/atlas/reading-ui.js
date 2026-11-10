/* Atlas per-work reading controls (COS-BB-001): a "Reading" button next to the book bar that opens a small
   panel with the pack's reading-order presets ("read through …") and an explicit per-work checklist.

   Only mounted when a cumulative pack declares a valid `spoilers.works` registry (see reading.js); every other
   pack is unchanged. The panel never decides visibility itself: every choice is turned into a reading state by
   AtlasReading (choosePreset / toggleWork) and handed to the engine through `onChoose`, which re-renders through
   the same path as every other state change.

   Rules from the accepted design (revision 3) and implementation-handoff-2026-11-09.md:
   - ticking a work never ticks any other work; starting from a preset, the checklist starts from that preset's
     read prefix and the result is labelled a custom selection, never a preset;
   - unticking the last work is the deliberate 'none' state (nothing read, persisted as #read=_none), not All and not
     the invalid-link safe state; All is its own deliberate button;
   - the safe state (rejected link or stored value) opens the panel by default so the reader can choose;
   - the status line always lists the works actually selected. */
(function (root) {
  'use strict';

  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );

  /* Pure view model (unit-tested): what the panel shows for a state. */
  function model(R, state, reg, opts) {
    const o = opts || {};
    const d = R.describe(state, reg, o.bookTitle || '');
    const rs = R.readSetOf(state, reg) || new Set();
    const perWork = state && (state.mode === 'preset' || state.mode === 'set' || state.mode === 'none');
    const groups = [];
    const byBucket = new Map();
    reg.order.forEach((id) => {
      const w = reg.works.get(id);
      const key = w.bucket == null ? 'none' : String(w.bucket);
      if (!byBucket.has(key)) {
        const g = { key: key, title: o.groupTitle ? o.groupTitle(w.bucket) : '', works: [] };
        byBucket.set(key, g);
        groups.push(g);
      }
      byBucket
        .get(key)
        .works.push({ id: id, title: w.title, year: R.yearLabel(w), checked: !!perWork && rs.has(id) });
    });
    const presets = Array.from(reg.presets.values()).map((p) => ({
      id: p.id,
      label: p.label,
      options: p.versions.get(p.latest).map((id) => ({ id: id, title: reg.works.get(id).title })),
      selected: state && state.mode === 'preset' && state.preset === p.id && state.v === p.latest ? state.work : '',
    }));
    return {
      kind: d.kind,
      label: d.label,
      works: d.works,
      groups: groups,
      presets: presets,
      allPressed: !state || state.mode === 'all',
      unreviewed: !!(perWork && o.unreviewed),
    };
  }

  /* DOM controller. opts: {R, reg, button (host element to insert after), getState(), onChoose(state),
     groupTitle(bucket), bookTitle(), unreviewed()}. Returns {update(), open(), close(), el}. */
  function mount(opts) {
    const R = opts.R;
    const reg = opts.reg;
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.id = 'rdBtn';
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'rdPanel');
    btn.textContent = 'Reading';
    opts.after.insertAdjacentElement('afterend', btn);

    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.id = 'rdPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'How far you’ve read');
    panel.hidden = true;
    document.body.appendChild(panel);

    let isOpen = false;
    let returnFocus = null;

    function choose(st) {
      if (!st) return;
      opts.onChoose(st);
      update();
    }

    function render() {
      const m = model(R, opts.getState(), reg, {
        groupTitle: opts.groupTitle,
        bookTitle: opts.bookTitle ? opts.bookTitle() : '',
        unreviewed: opts.unreviewed ? opts.unreviewed() : false,
      });
      const presetHtml = m.presets
        .map(
          (p) =>
            '<label class="rd-preset"><span>' +
            esc(p.label) +
            '</span><select data-preset="' +
            esc(p.id) +
            '"><option value=""' +
            (p.selected ? '' : ' selected') +
            '>Read through…</option>' +
            p.options
              .map(
                (w) =>
                  '<option value="' +
                  esc(w.id) +
                  '"' +
                  (w.id === p.selected ? ' selected' : '') +
                  '>' +
                  esc(w.title) +
                  '</option>',
              )
              .join('') +
            '</select></label>',
        )
        .join('');
      const listHtml = m.groups
        .map(
          (g) =>
            '<li class="rd-group">' +
            (g.title ? '<p class="rd-gt">' + esc(g.title) + '</p>' : '') +
            '<ul>' +
            g.works
              .map(
                (w) =>
                  '<li><label><input type="checkbox" data-work="' +
                  esc(w.id) +
                  '"' +
                  (w.checked ? ' checked' : '') +
                  '><span>' +
                  esc(w.title) +
                  ' <small class="rd-y">(' +
                  esc(w.year) +
                  ')</small></span></label></li>',
              )
              .join('') +
            '</ul></li>',
        )
        .join('');
      panel.innerHTML =
        '<div class="rd-head"><p class="k">How far you’ve read</p><button type="button" class="btn rd-x" data-close aria-label="Close">×</button></div>' +
        '<p class="rd-status rd-' +
        esc(m.kind) +
        '" aria-live="polite">' +
        esc(m.label) +
        '</p>' +
        (m.works.length ? '<p class="rd-sel">Selected: ' + esc(m.works.join(', ')) + '</p>' : '') +
        (m.unreviewed
          ? '<p class="rd-note">Some details in this series are only grouped, not yet sorted by book.</p>'
          : '') +
        (presetHtml ? '<div class="rd-presets">' + presetHtml + '</div>' : '') +
        '<fieldset class="rd-list"><legend>Books I’ve read</legend><ul>' +
        listHtml +
        '</ul></fieldset>' +
        '<div class="rd-acts"><button type="button" class="btn" data-all aria-pressed="' +
        String(m.allPressed) +
        '">Show all books</button></div>';
    }

    function update() {
      const d = R.describe(opts.getState(), reg, opts.bookTitle ? opts.bookTitle() : '');
      btn.classList.toggle('on', d.kind === 'preset' || d.kind === 'set' || d.kind === 'none');
      btn.classList.toggle('warn', d.kind === 'safe');
      btn.title = d.label;
      if (isOpen) {
        const f = document.activeElement;
        const key = f && panel.contains(f) ? focusKey(f) : null;
        render();
        if (key) restoreFocus(key);
      }
    }

    function focusKey(el) {
      if (el.dataset.work) return '[data-work="' + el.dataset.work + '"]';
      if (el.dataset.preset) return '[data-preset="' + el.dataset.preset + '"]';
      if (el.hasAttribute('data-all')) return '[data-all]';
      return null;
    }
    function restoreFocus(sel) {
      const el = panel.querySelector(sel);
      if (el) el.focus();
    }

    function open() {
      if (isOpen) return;
      isOpen = true;
      returnFocus = document.activeElement;
      render();
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      const first = panel.querySelector('select,input');
      if (first) first.focus();
    }
    function close() {
      if (!isOpen) return;
      isOpen = false;
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      if (returnFocus && returnFocus.focus && document.contains(returnFocus)) returnFocus.focus();
      else btn.focus();
    }

    btn.addEventListener('click', () => (isOpen ? close() : open()));
    panel.addEventListener('change', (e) => {
      const t = e.target;
      if (t.dataset.preset) {
        if (t.value) choose(R.choosePreset(reg, t.dataset.preset, t.value));
        return;
      }
      if (t.dataset.work) choose(R.toggleWork(opts.getState(), t.dataset.work, reg));
    });
    panel.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) close();
      else if (e.target.closest('[data-all]')) choose({ mode: 'all' });
    });
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    });
    document.addEventListener('pointerdown', (e) => {
      if (isOpen && !panel.contains(e.target) && !btn.contains(e.target)) close();
    });

    update();
    return {
      el: panel,
      button: btn,
      update: update,
      open: open,
      close: close,
      get isOpen() {
        return isOpen;
      },
    };
  }

  root.AtlasReadingUI = { model: model, mount: mount };
})(typeof window !== 'undefined' ? window : this);
