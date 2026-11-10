// Selected-object reference block for black holes: real nonspinning-model sizes for the five UI presets (item 7a).
import { presetRows, SCALE_NOTE } from '../black-hole-catalog.ts';

/** Static markup for the collapsible "Real black-hole sizes" block, shown only for a selected black hole. */
export function blackHoleScalesHtml() {
  const items = presetRows()
    .map(
      row =>
        `<li><b>${row.label} · ${row.mass}</b><span>${row.cls} · horizon ${row.horizon} · shadow ${row.shadow}</span>` +
        `<small>e.g. ${row.example}</small></li>`,
    )
    .join('');
  return (
    `<details class="bh-scales" id="bh-scales" hidden><summary>Real black-hole sizes</summary>` +
    `<ul>${items}</ul><p>${SCALE_NOTE}</p></details>`
  );
}
