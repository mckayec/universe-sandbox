// Selected-object reference block for black holes: real nonspinning-model sizes for the five UI presets (item 7a).
import { presetRows, SCALE_NOTE, type PresetRow } from '../black-hole-catalog.ts';

function escapeHtml(text: string) {
  return text.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
}

/** Example line: linked source name, rounded mass, and its qualification (rounding, model, dormant/active context). */
function exampleHtml(row: PresetRow) {
  if (!row.exampleName) return '<small>e.g. —</small>';
  const link =
    `<a href="${escapeHtml(row.exampleSource)}" target="_blank" rel="noopener noreferrer" ` +
    `aria-label="${escapeHtml(row.exampleName)} source (opens in a new tab)">${escapeHtml(row.exampleName)}</a>`;
  return `<small>e.g. ${link} ≈ ${escapeHtml(row.exampleMass)}<i>${escapeHtml(row.exampleNote)}</i></small>`;
}

/** Static markup for the collapsible "Real black-hole sizes" block, shown only for a selected black hole. */
export function blackHoleScalesHtml() {
  const items = presetRows()
    .map(
      row =>
        `<li><b>${row.label} · ${row.mass}</b>` +
        `<span>${row.cls} · horizon radius ${row.horizon} · shadow radius ${row.shadow}</span>` +
        `${exampleHtml(row)}</li>`,
    )
    .join('');
  return (
    `<details class="bh-scales" id="bh-scales" hidden><summary>Real black-hole sizes</summary>` +
    `<ul>${items}</ul><p>${SCALE_NOTE}</p></details>`
  );
}
