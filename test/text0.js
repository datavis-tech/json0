/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Tests for the embedded non-composable text type text0.

const assert = require('assert');
const fuzzer = require('ot-fuzzer');
const text0 = require('../lib/text0');

describe('text0', function() {
  describe('compose', () =>
    // Compose is actually pretty easy
    it('is sane', function() {
      assert.deepEqual(
        text0.compose(
          [],
          []
        ),
        []
      );
      assert.deepEqual(
        text0.compose(
          [{ i: 'x', p: 0 }],
          []
        ),
        [{ i: 'x', p: 0 }]
      );
      assert.deepEqual(
        text0.compose(
          [],
          [{ i: 'x', p: 0 }]
        ),
        [{ i: 'x', p: 0 }]
      );
      return assert.deepEqual(
        text0.compose(
          [{ i: 'y', p: 100 }],
          [{ i: 'x', p: 0 }]
        ),
        [{ i: 'y', p: 100 }, { i: 'x', p: 0 }]
      );
    }));

  describe('transform', function() {
    it('is sane', function() {
      assert.deepEqual([], text0.transform([], [], 'left'));
      assert.deepEqual([], text0.transform([], [], 'right'));

      assert.deepEqual(
        [{ i: 'y', p: 100 }, { i: 'x', p: 0 }],
        text0.transform([{ i: 'y', p: 100 }, { i: 'x', p: 0 }], [], 'left')
      );
      return assert.deepEqual(
        [],
        text0.transform([], [{ i: 'y', p: 100 }, { i: 'x', p: 0 }], 'right')
      );
    });

    it('inserts', function() {
      assert.deepEqual(
        [[{ i: 'x', p: 10 }], [{ i: 'a', p: 1 }]],
        text0.transformX([{ i: 'x', p: 9 }], [{ i: 'a', p: 1 }])
      );
      assert.deepEqual(
        [[{ i: 'x', p: 10 }], [{ i: 'a', p: 11 }]],
        text0.transformX([{ i: 'x', p: 10 }], [{ i: 'a', p: 10 }])
      );

      assert.deepEqual(
        [[{ i: 'x', p: 10 }], [{ d: 'a', p: 9 }]],
        text0.transformX([{ i: 'x', p: 11 }], [{ d: 'a', p: 9 }])
      );
      assert.deepEqual(
        [[{ i: 'x', p: 10 }], [{ d: 'a', p: 10 }]],
        text0.transformX([{ i: 'x', p: 11 }], [{ d: 'a', p: 10 }])
      );
      assert.deepEqual(
        [[{ i: 'x', p: 11 }], [{ d: 'a', p: 12 }]],
        text0.transformX([{ i: 'x', p: 11 }], [{ d: 'a', p: 11 }])
      );

      assert.deepEqual(
        [{ i: 'x', p: 10 }],
        text0.transform([{ i: 'x', p: 10 }], [{ d: 'a', p: 11 }], 'left')
      );
      assert.deepEqual(
        [{ i: 'x', p: 10 }],
        text0.transform([{ i: 'x', p: 10 }], [{ d: 'a', p: 10 }], 'left')
      );
      return assert.deepEqual(
        [{ i: 'x', p: 10 }],
        text0.transform([{ i: 'x', p: 10 }], [{ d: 'a', p: 10 }], 'right')
      );
    });

    return it('deletes', function() {
      assert.deepEqual(
        [[{ d: 'abc', p: 8 }], [{ d: 'xy', p: 4 }]],
        text0.transformX([{ d: 'abc', p: 10 }], [{ d: 'xy', p: 4 }])
      );
      assert.deepEqual(
        [[{ d: 'ac', p: 10 }], []],
        text0.transformX([{ d: 'abc', p: 10 }], [{ d: 'b', p: 11 }])
      );
      assert.deepEqual(
        [[], [{ d: 'ac', p: 10 }]],
        text0.transformX([{ d: 'b', p: 11 }], [{ d: 'abc', p: 10 }])
      );
      assert.deepEqual(
        [[{ d: 'a', p: 10 }], []],
        text0.transformX([{ d: 'abc', p: 10 }], [{ d: 'bc', p: 11 }])
      );
      assert.deepEqual(
        [[{ d: 'c', p: 10 }], []],
        text0.transformX([{ d: 'abc', p: 10 }], [{ d: 'ab', p: 10 }])
      );
      assert.deepEqual(
        [[{ d: 'a', p: 10 }], [{ d: 'd', p: 10 }]],
        text0.transformX([{ d: 'abc', p: 10 }], [{ d: 'bcd', p: 11 }])
      );
      assert.deepEqual(
        [[{ d: 'd', p: 10 }], [{ d: 'a', p: 10 }]],
        text0.transformX([{ d: 'bcd', p: 11 }], [{ d: 'abc', p: 10 }])
      );
      return assert.deepEqual(
        [[{ d: 'abc', p: 10 }], [{ d: 'xy', p: 10 }]],
        text0.transformX([{ d: 'abc', p: 10 }], [{ d: 'xy', p: 13 }])
      );
    });
  });

  describe('transformCursor', function() {
    it('is sane', function() {
      assert.strictEqual(0, text0.transformCursor(0, [], 'right'));
      assert.strictEqual(0, text0.transformCursor(0, [], 'left'));
      return assert.strictEqual(100, text0.transformCursor(100, []));
    });

    it('works vs insert', function() {
      assert.strictEqual(
        0,
        text0.transformCursor(0, [{ i: 'asdf', p: 100 }], 'right')
      );
      assert.strictEqual(
        0,
        text0.transformCursor(0, [{ i: 'asdf', p: 100 }], 'left')
      );

      assert.strictEqual(
        204,
        text0.transformCursor(200, [{ i: 'asdf', p: 100 }], 'right')
      );
      assert.strictEqual(
        204,
        text0.transformCursor(200, [{ i: 'asdf', p: 100 }], 'left')
      );

      assert.strictEqual(
        104,
        text0.transformCursor(100, [{ i: 'asdf', p: 100 }], 'right')
      );
      return assert.strictEqual(
        100,
        text0.transformCursor(100, [{ i: 'asdf', p: 100 }], 'left')
      );
    });

    return it('works vs delete', function() {
      assert.strictEqual(
        0,
        text0.transformCursor(0, [{ d: 'asdf', p: 100 }], 'right')
      );
      assert.strictEqual(
        0,
        text0.transformCursor(0, [{ d: 'asdf', p: 100 }], 'left')
      );
      assert.strictEqual(0, text0.transformCursor(0, [{ d: 'asdf', p: 100 }]));

      assert.strictEqual(
        196,
        text0.transformCursor(200, [{ d: 'asdf', p: 100 }])
      );

      assert.strictEqual(
        100,
        text0.transformCursor(100, [{ d: 'asdf', p: 100 }])
      );
      assert.strictEqual(
        100,
        text0.transformCursor(102, [{ d: 'asdf', p: 100 }])
      );
      assert.strictEqual(
        100,
        text0.transformCursor(104, [{ d: 'asdf', p: 100 }])
      );
      return assert.strictEqual(
        101,
        text0.transformCursor(105, [{ d: 'asdf', p: 100 }])
      );
    });
  });

  describe('normalize', function() {
    it('is sane', function() {
      const testUnchanged = op => assert.deepEqual(op, text0.normalize(op));
      testUnchanged([]);
      testUnchanged([{ i: 'asdf', p: 100 }]);
      return testUnchanged([{ i: 'asdf', p: 100 }, { d: 'fdsa', p: 123 }]);
    });

    it('adds missing p:0', function() {
      assert.deepEqual([{ i: 'abc', p: 0 }], text0.normalize([{ i: 'abc' }]));
      assert.deepEqual([{ d: 'abc', p: 0 }], text0.normalize([{ d: 'abc' }]));
      return assert.deepEqual(
        [{ i: 'abc', p: 0 }, { d: 'abc', p: 0 }],
        text0.normalize([{ i: 'abc' }, { d: 'abc' }])
      );
    });

    it('converts op to an array', function() {
      assert.deepEqual(
        [{ i: 'abc', p: 0 }],
        text0.normalize({ i: 'abc', p: 0 })
      );
      return assert.deepEqual(
        [{ d: 'abc', p: 0 }],
        text0.normalize({ d: 'abc', p: 0 })
      );
    });

    it('works with a really simple op', () =>
      assert.deepEqual([{ i: 'abc', p: 0 }], text0.normalize({ i: 'abc' })));

    it('compress inserts', function() {
      assert.deepEqual(
        [{ i: 'xyzabc', p: 10 }],
        text0.normalize([{ i: 'abc', p: 10 }, { i: 'xyz', p: 10 }])
      );
      assert.deepEqual(
        [{ i: 'axyzbc', p: 10 }],
        text0.normalize([{ i: 'abc', p: 10 }, { i: 'xyz', p: 11 }])
      );
      return assert.deepEqual(
        [{ i: 'abcxyz', p: 10 }],
        text0.normalize([{ i: 'abc', p: 10 }, { i: 'xyz', p: 13 }])
      );
    });

    it('doesnt compress separate inserts', function() {
      const t = op => assert.deepEqual(op, text0.normalize(op));

      t([{ i: 'abc', p: 10 }, { i: 'xyz', p: 9 }]);
      return t([{ i: 'abc', p: 10 }, { i: 'xyz', p: 14 }]);
    });

    it('compress deletes', function() {
      assert.deepEqual(
        [{ d: 'xyabc', p: 8 }],
        text0.normalize([{ d: 'abc', p: 10 }, { d: 'xy', p: 8 }])
      );
      assert.deepEqual(
        [{ d: 'xabcy', p: 9 }],
        text0.normalize([{ d: 'abc', p: 10 }, { d: 'xy', p: 9 }])
      );
      return assert.deepEqual(
        [{ d: 'abcxy', p: 10 }],
        text0.normalize([{ d: 'abc', p: 10 }, { d: 'xy', p: 10 }])
      );
    });

    return it('doesnt compress separate deletes', function() {
      const t = op => assert.deepEqual(op, text0.normalize(op));

      t([{ d: 'abc', p: 10 }, { d: 'xyz', p: 6 }]);
      return t([{ d: 'abc', p: 10 }, { d: 'xyz', p: 11 }]);
    });
  });

  // Skip this as it takes a long time.
  describe.skip('randomizer', () =>
    it('passes', function() {
      this.timeout(4000);
      this.slow(4000);
      return fuzzer(text0, require('./text0-generator'));
    }));

  describe('createPresence', function() {
    it('basic tests', function() {
      const defaultPresence = { u: '', c: 0, s: [] };
      const presence = { u: '5', c: 8, s: [[1, 2], [9, 5]] };

      assert.deepEqual(createPresence(), defaultPresence);
      assert.deepEqual(createPresence(null), defaultPresence);
      assert.deepEqual(createPresence(true), defaultPresence);
      assert.deepEqual(
        createPresence({ u: 5, c: 8, s: [1, 2] }),
        defaultPresence
      );
      assert.deepEqual(
        createPresence({ u: '5', c: '8', s: [1, 2] }),
        defaultPresence
      );
      assert.deepEqual(
        createPresence({ u: '5', c: 8, s: [1.5, 2] }),
        defaultPresence
      );
      assert.strictEqual(createPresence(presence), presence);
    });
  });

  describe('transformPresence', function() {
    it('basic tests', function() {
      assert.deepEqual(
        transformPresence(
          {
            u: 'user',
            c: 8,
            s: [[5, 7]]
          },
          [],
          true
        ),
        {
          u: 'user',
          c: 8,
          s: [[5, 7]]
        }
      );
      assert.deepEqual(
        transformPresence(
          {
            u: 'user',
            c: 8,
            s: [[5, 7]]
          },
          [],
          false
        ),
        {
          u: 'user',
          c: 8,
          s: [[5, 7]]
        }
      );

      assert.deepEqual(
        transformPresence(
          {
            u: 'user',
            c: 8,
            s: [[5, 7]]
          },
          [createRetain(3), createDelete(2), createInsertText('a')],
          true
        ),
        {
          u: 'user',
          c: 8,
          s: [[4, 6]]
        }
      );
      assert.deepEqual(
        transformPresence(
          {
            u: 'user',
            c: 8,
            s: [[5, 7]]
          },
          [createRetain(3), createDelete(2), createInsertText('a')],
          false
        ),
        {
          u: 'user',
          c: 8,
          s: [[3, 6]]
        }
      );

      assert.deepEqual(
        transformPresence(
          {
            u: 'user',
            c: 8,
            s: [[5, 7]]
          },
          [createRetain(5), createDelete(2), createInsertText('a')],
          true
        ),
        {
          u: 'user',
          c: 8,
          s: [[6, 6]]
        }
      );
      assert.deepEqual(
        transformPresence(
          {
            u: 'user',
            c: 8,
            s: [[5, 7]]
          },
          [createRetain(5), createDelete(2), createInsertText('a')],
          false
        ),
        {
          u: 'user',
          c: 8,
          s: [[5, 5]]
        }
      );

      assert.deepEqual(
        transformPresence(
          {
            u: 'user',
            c: 8,
            s: [[5, 7], [8, 2]]
          },
          [createInsertText('a')],
          false
        ),
        {
          u: 'user',
          c: 8,
          s: [[6, 8], [9, 3]]
        }
      );

      assert.deepEqual(
        transformPresence(
          {
            u: 'user',
            c: 8,
            s: [[1, 1], [2, 2]]
          },
          [createInsertText('a')],
          false
        ),
        {
          u: 'user',
          c: 8,
          s: [[2, 2], [3, 3]]
        }
      );
    });
  });

  describe('comparePresence', function() {
    it('basic tests', function() {
      assert.strictEqual(comparePresence(), true);
      assert.strictEqual(comparePresence(undefined, undefined), true);
      assert.strictEqual(comparePresence(null, null), true);
      assert.strictEqual(comparePresence(null, undefined), false);
      assert.strictEqual(comparePresence(undefined, null), false);
      assert.strictEqual(
        comparePresence(undefined, { u: '', c: 0, s: [] }),
        false
      );
      assert.strictEqual(comparePresence(null, { u: '', c: 0, s: [] }), false);
      assert.strictEqual(
        comparePresence({ u: '', c: 0, s: [] }, undefined),
        false
      );
      assert.strictEqual(comparePresence({ u: '', c: 0, s: [] }, null), false);

      assert.strictEqual(
        comparePresence(
          { u: 'user', c: 8, s: [[1, 2]] },
          { u: 'user', c: 8, s: [[1, 2]] }
        ),
        true
      );
      assert.strictEqual(
        comparePresence(
          { u: 'user', c: 8, s: [[1, 2], [4, 6]] },
          { u: 'user', c: 8, s: [[1, 2], [4, 6]] }
        ),
        true
      );
      assert.strictEqual(
        comparePresence(
          { u: 'user', c: 8, s: [[1, 2]], unknownProperty: 5 },
          { u: 'user', c: 8, s: [[1, 2]] }
        ),
        true
      );
      assert.strictEqual(
        comparePresence(
          { u: 'user', c: 8, s: [[1, 2]] },
          { u: 'user', c: 8, s: [[1, 2]], unknownProperty: 5 }
        ),
        true
      );
      assert.strictEqual(
        comparePresence(
          { u: 'user', c: 8, s: [[1, 2]] },
          { u: 'userX', c: 8, s: [[1, 2]] }
        ),
        false
      );
      assert.strictEqual(
        comparePresence(
          { u: 'user', c: 8, s: [[1, 2]] },
          { u: 'user', c: 9, s: [[1, 2]] }
        ),
        false
      );
      assert.strictEqual(
        comparePresence(
          { u: 'user', c: 8, s: [[1, 2]] },
          { u: 'user', c: 8, s: [[3, 2]] }
        ),
        false
      );
      assert.strictEqual(
        comparePresence(
          { u: 'user', c: 8, s: [[1, 2]] },
          { u: 'user', c: 8, s: [[1, 3]] }
        ),
        false
      );
      assert.strictEqual(
        comparePresence(
          { u: 'user', c: 8, s: [[9, 8], [1, 2]] },
          { u: 'user', c: 8, s: [[9, 8], [3, 2]] }
        ),
        false
      );
      assert.strictEqual(
        comparePresence(
          { u: 'user', c: 8, s: [[9, 8], [1, 2]] },
          { u: 'user', c: 8, s: [[9, 8], [1, 3]] }
        ),
        false
      );
      assert.strictEqual(
        comparePresence(
          { u: 'user', c: 8, s: [[9, 8], [1, 2]] },
          { u: 'user', c: 8, s: [[9, 8]] }
        ),
        false
      );
    });
  });

  describe('isValidPresence', function() {
    it('basic tests', function() {
      assert.strictEqual(isValidPresence(), false);
      assert.strictEqual(isValidPresence(null), false);
      assert.strictEqual(isValidPresence([]), false);
      assert.strictEqual(isValidPresence({}), false);
      assert.strictEqual(isValidPresence({ u: 5, c: 8, s: [] }), false);
      assert.strictEqual(isValidPresence({ u: '5', c: '8', s: [] }), false);
      assert.strictEqual(isValidPresence({ u: '5', c: 8.5, s: [] }), false);
      assert.strictEqual(
        isValidPresence({ u: '5', c: Infinity, s: [] }),
        false
      );
      assert.strictEqual(isValidPresence({ u: '5', c: NaN, s: [] }), false);
      assert.strictEqual(isValidPresence({ u: '5', c: 8, s: {} }), false);
      assert.strictEqual(isValidPresence({ u: '5', c: 8, s: [] }), true);
      assert.strictEqual(isValidPresence({ u: '5', c: 8, s: [[]] }), false);
      assert.strictEqual(isValidPresence({ u: '5', c: 8, s: [[1]] }), false);
      assert.strictEqual(isValidPresence({ u: '5', c: 8, s: [[1, 2]] }), true);
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [[1, 2, 3]] }),
        false
      );
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [[1, 2], []] }),
        false
      );
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [[1, 2], [3, 6]] }),
        true
      );
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [[1, 2], [3, '6']] }),
        false
      );
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [[1, 2], [3, 6.1]] }),
        false
      );
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [[1, 2], [3, Infinity]] }),
        false
      );
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [[1, 2], [3, NaN]] }),
        false
      );
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [[1, 2], [3, -0]] }),
        true
      );
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [[1, 2], [3, -1]] }),
        true
      );
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [[1, 2], ['3', 0]] }),
        false
      );
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [[1, '2'], [4, 0]] }),
        false
      );
      assert.strictEqual(
        isValidPresence({ u: '5', c: 8, s: [['1', 2], [4, 0]] }),
        false
      );
    });
  });
});
