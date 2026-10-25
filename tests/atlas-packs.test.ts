import assert from 'node:assert/strict';
import test from 'node:test';
// @ts-expect-error plain JS helper without type declarations
import { validatePacks } from './atlas-pack-validator.mjs';

type Report = Record<string, { error?: string; issues?: string[]; warn?: string[] }>;
const report: Report = validatePacks();

// Warnings that are real bugs for readers (spoilers, dead clicks) are promoted to failures.
const FATAL_WARNINGS = [/first book \d+ > event book/, /\(spoiler line\)/];

test('every atlas pack loads and registers under its own file name', () => {
  for (const [file, r] of Object.entries(report)) assert.equal(r.error, undefined, `${file}: ${r.error}`);
});

for (const [file, r] of Object.entries(report)) {
  if (file.startsWith('_')) continue;
  test(`atlas pack ${file} has no broken references or spoiler leaks`, () => {
    const fatal = (r.warn || []).filter(w => FATAL_WARNINGS.some(re => re.test(w)));
    assert.deepEqual([...(r.issues || []), ...fatal], []);
  });
}

test('the pack template is internally consistent', () => {
  const r = report['_template.js'];
  assert.ok(r && !r.error);
  // the template registers "template", which is fine because templates are never loaded; everything else must hold
  const issues = (r.issues || []).filter(i => !/registers|not in registry/.test(i));
  const fatal = (r.warn || []).filter(w => FATAL_WARNINGS.some(re => re.test(w)));
  assert.deepEqual([...issues, ...fatal], []);
});
