// Selected-object reference block for black holes: real nonspinning-model sizes for the five UI presets (item 7a).
import {
  BLACK_HOLE_PRESETS,
  formatSolarMasses,
  presetRows,
  SCALE_NOTE,
  type PresetRow,
} from '../black-hole-catalog.ts';

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

/**
 * Inspector row for a black hole's reference scale (item 7b): a picker that reads this body's model mass as one of
 * the five presets, plus the resulting reference mass and horizon radius. `merged` is shown, never offered.
 */
export function blackHoleReferenceRowHtml() {
  const options = BLACK_HOLE_PRESETS.map(
    preset => `<option value="${preset.id}">${preset.label} · ${formatSolarMasses(preset.solarMasses)}</option>`,
  ).join('');
  return (
    `<div id="reference-row" class="reference-row"><dt><label for="bh-reference">Read as</label></dt><dd>` +
    `<select id="bh-reference" aria-describedby="info-reference"><option value="none">Model units only</option>` +
    `${options}<option value="merged" disabled hidden>Merged remnant</option></select>` +
    `<small id="info-reference">None · model units only</small></dd></div>`
  );
}
