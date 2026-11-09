#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const filename = process.argv[2];
if (!filename) throw new Error('Usage: node mapping-inventory-probe.cjs path/to/cosmere.js');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { timeout: 5000 });
const pack = context.window.ATLAS_PACKS.cosmere;
const expected2 = ['e6','e68','e69','e8','e9','e70','e71','e10','e72','e73','e11','e74','e75','e12'];
const expected12 = ['e55','e118','e56','e119','e122','e123','e57','e124','e120','e121','e125','e58','e59','e60','e61','e62','e126','e63','e127','e128'];
const tests = [
  ['work registry absent at source snapshot', () => assert.equal(pack.works, undefined)],
  ['preset registry absent at source snapshot', () => assert.equal(pack.presets, undefined)],
  ['cumulative legacy mode at source snapshot', () => assert.equal(pack.spoilers.mode, 'cumulative')],
  ['key 2 exact 14-event inventory', () => assert.deepEqual(Array.from(pack.events.filter(e => e.book === 2), e => e.id), expected2)],
  ['key 12 exact 20-event inventory', () => assert.deepEqual(Array.from(pack.events.filter(e => e.book === 12), e => e.id), expected12)],
];
let count=0;
for(const [name,test] of tests){test();count++;console.log('PASS '+name);}
console.log(count+'/'+tests.length+' source-inventory assertions; no implementation or browser acceptance.');
