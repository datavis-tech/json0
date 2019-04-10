// Draws from https://github.com/Teamwork/ot-rich-text/blob/master/src/Operation.js
function isValidPresence(presence) {
  if (
    presence == null ||
    typeof presence.u !== 'string' ||
    typeof presence.c !== 'number' ||
    !isFinite(presence.c) ||
    Math.floor(presence.c) !== presence.c ||
    !Array.isArray(presence.s)
  ) {
    return false;
  }

  const selections = presence.s;

  for (let i = 0, l = selections.length; i < l; ++i) {
    const selection = selections[i];

    if (
      !Array.isArray(selection) ||
      selection.length !== 2 ||
      selection[0] !== (selection[0] | 0) ||
      selection[1] !== (selection[1] | 0)
    ) {
      return false;
    }
  }

  return true;
}

const defaultPresence = {u: '', c: 0, s: []};

const createPresence = presence =>
  isValidPresence(presence) ? presence : defaultPresence;

// This needs more thinking/testing, looking a bit more carefully at
// how this is implemented in ot-rich-text, etc.
const comparePresence = function(pres1, pres2) {
  if (!pres1 || !pres2) {
    return false;
  }
  if (!pres1.p || !pres2.p) {
    return false;
  }
  if (pres1.t !== pres2.t) {
    return false;
  }
  if (pres1.t && subtypes[pres1.t]) {
    if (pres1.p[0] === pres2.p[0]) {
      return subtypes[pres1.t].comparePresence(pres1, pres2);
    }
  } else return pres1 === pres2;
};

// this is the key function, always run client-side, both on
// the client that creates a text-change, and on the clients
// that receive text-changes (ops). if there are no ops, just
// return presence, if there are ops, delegate to the subtype
// responsible for those ops (currently only ot-rich-text).
// I am making assumptions many places that all ops will be
// of the same subtype, not sure if this is a given.
// We're only concerned about the first level of object/array,
// not sure if the spec allows nesting of subtypes.
const transformPresence = function(presence, op, isOwn) {
  if (op.length < 1) {
    return presence;
  }
  const representativeOp = op[0];
  const opType = op[0].t;
  const path = representativeOp.p && representativeOp.p[0];
  if (opType && subtypes[opType] && path) {
    if (!presence.p || !presence.p[0] || presence.p[0] !== path) {
      return presence;
    }
    // return result of running the subtype's transformPresence,
    // but add path and type, which the subtype will not include
    presence = {
      ...subtypes[opType].transformPresence(presence, op, isOwn),
      p: op[0].p,
      t: op[0].t,
    };
  }
  return presence;
};

module.exports = {
  isValidPresence,
  createPresence,
  comparePresence,
  transformPresence,
};
