// Run: node test/status.test.js
const assert = require('assert');
const { shopStatus } = require('../js/status.js');

const at = (day, h, m) => shopStatus(day, h * 60 + m);

assert.deepStrictEqual(at(2, 9, 0), { open: true, text: 'Aperto ora, fino alle 20:00' });      // Tue morning
assert.strictEqual(at(2, 7, 59).text, 'Chiuso ora, apre alle 08:00');                          // Tue, just before opening
assert.strictEqual(at(2, 20, 0).text, 'Chiuso ora, riapre domani alle 08:00');                // Tue, closing minute
assert.strictEqual(at(6, 19, 59).open, true);                                                  // Sat, last open minute
assert.strictEqual(at(6, 20, 0).text, 'Chiuso ora, riapre martedì alle 08:00');                // Sat evening -> skips Sun/Mon
assert.strictEqual(at(1, 10, 0).text, 'Chiuso ora, riapre domani alle 08:00');                 // Mon -> Tue
assert.strictEqual(at(0, 12, 0).text, 'Chiuso ora, riapre martedì alle 08:00');                // Sun -> skips Mon

console.log('status: all checks passed');
