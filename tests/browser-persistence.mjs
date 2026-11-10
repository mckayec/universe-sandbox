import assert from 'node:assert/strict';

const STORAGE_KEY = 'gravity-lab-universe-v1';

// Compare scientific state, not camera damping, transient effects or unordered object lists.
export function persistenceFingerprint(snapshot) {
  assert.equal(snapshot?.version, 1, 'Save must contain a version-1 snapshot');
  assert.ok(Array.isArray(snapshot.bodies), 'Save must contain a bodies array');
  const presentIds = new Set(snapshot.bodies.map(body => body.id));
  return {
    elapsed: snapshot.elapsed,
    gravity: snapshot.gravity,
    bodies: snapshot.bodies
      .map(body => ({
        id: body.id,
        kind: body.kind,
        name: body.name,
        mass: body.mass,
        birthMass: body.birthMass,
        position: body.position,
        velocity: body.velocity,
        locked: body.locked,
        buildLocked: body.buildLocked,
        groupId: body.groupId,
      }))
      .sort((a, b) => a.id - b.id),
    groups: (snapshot.groups ?? [])
      .map(group => ({
        id: group.id,
        name: group.name,
        // restoreUniverse intentionally removes group links to bodies already absent from the save.
        bodyIds: group.bodyIds.filter(id => presentIds.has(id)).sort((a, b) => a - b),
      }))
      .sort((a, b) => a.id - b.id),
  };
}

async function readSavedSnapshot(page) {
  return page.evaluate(key => {
    const raw = localStorage.getItem(key);
    if (!raw) throw new Error('Save did not write a snapshot to local storage');
    return JSON.parse(raw);
  }, STORAGE_KEY);
}

async function waitForPauseLabel(page, label) {
  await page.waitForFunction(expected => document.querySelector('#pause')?.textContent === expected, label);
}

/**
 * Isolated-browser test helper. Verify the exact persisted scene while physics is paused,
 * rather than chasing a live body count in an exhibit that deliberately destroys objects.
 * Failure still fails the test. No larger timeout or accepted mismatch is introduced.
 */
export async function assertSaveLoadRoundTrip(page) {
  const pause = page.locator('#pause');
  const originalPauseLabel = await pause.textContent();
  assert.ok(['Pause', 'Resume'].includes(originalPauseLabel), 'Pause control must have a known state');
  const wasRunning = originalPauseLabel === 'Pause';
  if (wasRunning) await pause.click();
  await waitForPauseLabel(page, 'Resume');

  let saved;
  try {
    // This is a fresh smoke-test browser context. Clearing this one slot ensures a failed
    // Save cannot be hidden by a previous successful snapshot. Recovery storage is untouched.
    await page.evaluate(key => localStorage.removeItem(key), STORAGE_KEY);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    saved = await readSavedSnapshot(page);
    const expected = persistenceFingerprint(saved);
    assert.ok(saved.bodies.length > 0, 'The smoke-test exhibit must not save an empty scene');
    assert.equal(await page.locator('#count').textContent(), String(saved.bodies.length));

    await page.getByRole('button', { name: 'Clear all', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#count')?.textContent === '0');
    assert.equal(await page.locator('#info-panel').evaluate(element => element.classList.contains('empty')), true);
    assert.deepEqual(persistenceFingerprint(await readSavedSnapshot(page)), expected, 'Clear must preserve the save');

    await page.getByRole('button', { name: 'Load', exact: true }).click();
    await page.waitForFunction(
      count => document.querySelector('#count')?.textContent === String(count),
      saved.bodies.length,
    );
    await waitForPauseLabel(page, 'Resume');

    // Re-save the restored scene so matching counts cannot hide substituted objects or
    // lost masses/positions/velocities/locks/groups. Keep the original expected snapshot in memory.
    await page.evaluate(key => localStorage.removeItem(key), STORAGE_KEY);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    const restored = await readSavedSnapshot(page);
    assert.deepEqual(persistenceFingerprint(restored), expected, 'Load must restore the saved scientific state');
    return { savedCount: saved.bodies.length, restoredCount: restored.bodies.length, wasRunning };
  } catch (error) {
    const diagnostics = await page.evaluate(() => ({
      count: document.querySelector('#count')?.textContent,
      pause: document.querySelector('#pause')?.textContent,
      toast: document.querySelector('#toast')?.textContent,
    }));
    throw new Error(
      `Save/Clear/Load failed: ${error.message}; ${JSON.stringify({ savedCount: saved?.bodies?.length, ...diagnostics })}`,
      { cause: error },
    );
  } finally {
    if (wasRunning && (await pause.textContent()) === 'Resume') {
      await pause.click();
      await waitForPauseLabel(page, 'Pause');
    }
  }
}
