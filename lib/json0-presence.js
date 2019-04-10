const { transformCursor } = require('./text0');
const { convertFromText } = require('./utils');

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
      selection.length < 2 ||
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

const transformPresence = (presence, op, isOwn) => {
  for (let c of op){
    if(c.si || c.sd){
      convertFromText(c)
    }
    if(c.t === 'text0') {
      presence = Object.assign({}, presence, {
        s: presence.s.map(([start, end]) => ([
          transformCursor(start, c.o),
          transformCursor(end, c.o),
        ]))
      });
    }
  }
  return presence;
};

module.exports = {
  isValidPresence,
  createPresence,
  comparePresence,
  transformPresence,
};