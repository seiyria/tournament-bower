(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tournament = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var slice = Array.prototype.slice;

// ---------------------------------------------
// Functional Sequencing is default function
// ---------------------------------------------
var seq = function () {
  var fns = arguments;
  return function () {
    var res = fns[0].apply(this, arguments);
    for (var i = 1, len = fns.length; i < len; i += 1) {
      res = fns[i](res);
    }
    return res;
  };
};

var $ = seq;
$.seq = seq; // backwards compat

// ---------------------------------------------
// Functional Helpers
// ---------------------------------------------
$.id = function (x) {
  return x;
};

$.noop = function () {
};

$.copy = function (val) {
  if (Array.isArray(val)) {
    return val.slice();
  }
  if (val === Object(val)) {
    return $.extend({}, val);
  }
  return val;
};

$.constant = function (val) {
  return function () {
    return $.copy(val);
  };
};

$.not = function (fn) {
  return function (x) {
    return !fn(x);
  };
};

$.all = function (fn) {
  return function (xs) {
    return xs.every(fn);
  };
};

$.any = function (fn) {
  return function (xs) {
    return xs.some(fn);
  };
};

$.none = function (fn) {
  return function (xs) {
    return !xs.some(fn);
  };
};

$.elem = function (xs) {
  return function (x) {
    return xs.indexOf(x) >= 0;
  };
};

$.notElem = function (xs) {
  return function (x) {
    return xs.indexOf(x) < 0;
  };
};

$.extend = function (target, source) {
  var keys = Object.keys(source);
  for (var j = 0; j < keys.length; j += 1) {
    var name = keys[j];
    target[name] = source[name];
  }
  return target;
};

// ---------------------------------------------
// Math
// ---------------------------------------------
$.gcd = function (a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    var temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

$.lcm = function (a, b) {
  return (!a || !b) ? 0 : Math.abs((a * b) / $.gcd(a, b));
};

$.even = function (n) {
  return n % 2 === 0;
};

$.odd = function (n) {
  return n % 2 === 1;
};

// ---------------------------------------------
// Property accessors
// ---------------------------------------------
$.get = function () {
  var args = arguments;
  return function (el) {
    var res = el;
    for (var i = 0; i < args.length && res !== undefined; i += 1) {
      res = res[args[i]];
    }
    return res;
  };
};

$.pluck = function (prop, xs) {
  var result = [];
  for (var i = 0, len = xs.length; i < len; i += 1) {
    result[i] = xs[i][prop];
  }
  return result;
};

$.first = function (xs) {
  return xs[0];
};

$.last = function (xs) {
  return xs[xs.length - 1];
};

$.firstBy = function (fn, xs) {
  for (var i = 0, len = xs.length; i < len; i += 1) {
    if (fn(xs[i])) {
      return xs[i];
    }
  }
};

$.lastBy = function (fn, xs) {
  for (var i = xs.length - 1; i >= 0; i -= 1) {
    if (fn(xs[i])) {
      return xs[i];
    }
  }
};

// ---------------------------------------------
// Higher order looping
// ---------------------------------------------
$.range = function (start, stop, step) {
  if (arguments.length <= 1) {
    stop = start;
    start = 1;
  }
  step = arguments[2] || 1;
  var len = Math.max(Math.ceil((stop - start + 1) / step), 0)
    , range = new Array(len);

  for (var i = 0; i < len; i += 1, start += step) {
    range[i] = start;
  }
  return range;
};

$.replicate = function (times, el) {
  var res = [];
  for (var i = 0; i < times; i += 1) {
    res.push($.copy(el));
  }
  return res;
};

$.zipWith = function () {
  var fn = arguments[0]
    , args = slice.call(arguments, 1)
    , numLists = args.length
    , results = []
    , len = Math.min.apply(Math, $.pluck('length', args));

  for (var i = 0; i < len; i += 1) {
    var els = [];
    for (var j = 0; j < numLists; j += 1) {
      els.push(args[j][i]);
    }
    results.push(fn.apply(this, els));
  }
  return results;
};

$.zip = function () {
  var numLists = arguments.length
    , results = []
    , len = Math.min.apply(Math, $.pluck('length', arguments));

  for (var i = 0; i < len; i += 1) {
    var els = [];
    for (var j = 0; j < numLists; j += 1) {
      els.push(arguments[j][i]);
    }
    results.push(els);
  }
  return results;
};

$.iterate = function (times, init, fn) {
  var result = [init];
  for (var i = 1; i < times; i += 1) {
    result.push(fn(result[i - 1]));
  }
  return result;
};

$.scan = function (xs, init, fn) {
  var result = [init];
  for (var i = 0, len = xs.length ; i < len; i += 1) {
    result.push(fn(result[i], xs[i]));
  }
  return result;
};

// ---------------------------------------------
// Curried Prototype Accessors
// ---------------------------------------------
$.reduce = function (fn, init) {
  return function (xs) {
    return xs.reduce(fn, init);
  };
};

$.map = function (fn) {
  return function (xs) {
    return xs.map(fn);
  };
};

$.filter = function (fn) {
  return function (xs) {
    return xs.filter(fn);
  };
};

$.invoke = function (method) {
  var args = slice.call(arguments, 1);
  return function (xs) {
    var fn = xs[method];
    return fn.apply(xs, args);
  };
};

// end - export
module.exports = $;

},{}],2:[function(require,module,exports){
var group = function (numPlayers, groupSize) {
  var numGroups = Math.ceil(numPlayers / groupSize);
  groupSize = group.minimalGroupSize(numPlayers, groupSize, numGroups);
  var model = numGroups * groupSize;

  var groupList = [];
  for (var k = 0; k < numGroups; k += 1) {
    groupList[k] = [];
  }

  // iterations required to fill groups
  for (var j = 0; j < Math.ceil(groupSize / 2); j += 1) {
    // fill each group with pairs that sum to model + 1
    // until you are in the last iteration (in which may only want one of them)
    for (var g = 0; g < numGroups; g += 1) {
      var a = j*numGroups + g + 1;

      groupList[g].push(a);
      if (groupList[g].length < groupSize) {
        groupList[g].push(model + 1 - a);
      }
    }
  }

  // remove non-present players and sort by seeding number
  return groupList.map(function (g) {
    return g.sort(function (x, y) {
      return x - y;
    }).filter(function (p) {
      return p <= numPlayers;
    });
  });
};

group.fromArray = function (ary, groupSize) {
  return group(ary.length, groupSize).map(function (group) {
    return group.map(function (seed) {
      return ary[seed-1];
    });
  });
};


group.minimalGroupSize = function (numPlayers, groupSize) {
  var numGroups = arguments[2] || Math.ceil(numPlayers / groupSize);
  while (numGroups * groupSize - numPlayers >= numGroups) {
    groupSize -= 1; // while all groups have 1 free slot
  }
  return groupSize;
};

module.exports = group;

},{}],3:[function(require,module,exports){
var $ = require('autonomy');

module.exports = function () {
  var fns = arguments;
  return function () {
    var res = fns[0].apply(this, arguments);
    for (var i = 1, len = fns.length; i < len; i += 1) {
      res = fns[i](res);
    }
    return res;
  };
};

$.extend(module.exports, $);
$.extend(module.exports, require('operators'));
$.extend(module.exports, require('subset'));

},{"autonomy":1,"operators":4,"subset":6}],4:[function(require,module,exports){
var $ = {}
  , concat = Array.prototype.concat;

// multi-parameter versions for the associative operators:
$.plus2 = function (x, y) {
  return x + y;
};
$.plus3 = function (x, y, z) {
  return x + y + z;
};
$.plus4 = function (x, y, z, w) {
  return x + y + z + w;
};

$.times2 = function (x, y) {
  return x * y;
};
$.times3 = function (x, y, z) {
  return x * y * z;
};
$.times4 = function (x, y, z, w) {
  return x * y * z * w;
};

$.and2 = function (x, y) {
  return x && y;
};
$.and3 = function (x, y, z) {
  return x && y && z;
};
$.and4 = function (x, y, z, w) {
  return x && y && z && w;
};

$.or2 = function (x, y) {
  return x || y;
};
$.or3 = function (x, y, z) {
  return x || y || z;
};
$.or4 = function (x, y, z, w) {
  return x || y || z || w;
};

$.append2 = function (xs, ys) {
  return xs.concat(ys);
};
$.append3 = function (xs, ys, zs) {
  return xs.concat(ys, zs);
};
$.append4 = function (xs, ys, zs, ws) {
  return xs.concat(ys, zs, ws);
};
$.prepend2 = function (xs, ys) {
  return ys.concat(xs);
};

// Array versions of 5/6 associative operators by looping rather than reducing ops
// Associative reductions would make these functions one-liners..
// I.e. $.product = (xs) -> xs.reduce($.times2, 1)
// These abstractions are very much not free however, and are thus avoided for now:
// http://jsperf.com/reduce-vs-slicereduce3
$.sum = function (xs) {
  var sum = 0;
  for (var i = 0; i < xs.length; i += 1) {
    sum += xs[i];
  }
  return sum;
};

$.product = function (xs) {
  var product = 1;
  for (var i = 0, len = xs.length; i < len; i += 1) {
    product *= xs[i];
  }
  return product;
};

$.and = function (xs) {
  var and = true;
  for (var i = 0, len = xs.length; i < len; i += 1) {
    and = and && xs[i];
  }
  return and;
};

$.or = function (xs) {
  var or = false;
  for (var i = 0, len = xs.length; i < len; i += 1) {
    or = or || xs[i];
  }
  return or;
};

$.flatten = function (xs) {
  return concat.apply([], xs);
};

// variadic versions
$.add = function () {
  var sum = 0;
  for (var i = 0, len = arguments.length; i < len; i += 1) {
    sum += arguments[i];
  }
  return sum;
};

$.multiply = function () {
  var product = 1;
  for (var i = 0, len = arguments.length; i < len; i += 1) {
    product *= arguments[i];
  }
  return product;
};

$.concat = function () {
  return concat.apply([], arguments);
};

// non-associative operators only get the 2 argument version
$.minus2 = function (x, y) {
  return x - y;
};

$.divide2 = function (x, y) {
  return x / y;
};

$.div2 = function (x, y) {
  return Math.floor(x / y);
};

$.mod2 = function (x, y) {
  return x % y;
};

$.pow2 = Math.pow;

$.log2 = function (x, y) {
  return Math.log(x) / Math.log(y);
};

$.eq2 = function (x, y) {
  return x === y;
};

$.neq2 = function (x, y) {
  return x !== y;
};

$.gt2 = function (x, y) {
  return x > y;
};

$.lt2 = function (x, y) {
  return x < y;
};

$.gte2 = function (x, y) {
  return x >= y;
};

$.lte2 = function (x, y) {
  return x <= y;
};

// curried versions
$.plus = function (y) {
  return function (x) {
    return x + y;
  };
};

$.minus = function (y) {
  return function (x) {
    return x - y;
  };
};

$.times = function (y) {
  return function (x) {
    return x * y;
  };
};

$.divide = function (y) {
  return function (x) {
    return x / y;
  };
};

$.div = function (y) {
  return function (x) {
    return Math.floor(x / y);
  };
};

$.mod = function (y) {
  return function (x) {
    return x % y;
  };
};

$.pow = function (y) {
  return function (x) {
    return Math.pow(x, y);
  };
};

$.log = function (y) {
  return function (x) {
    return Math.log(x) / Math.log(y);
  };
};

$.append = function (ys) {
  return function (xs) {
    return xs.concat(ys);
  };
};

$.prepend = function (ys) {
  return function (xs) {
    return ys.concat(xs);
  };
};

$.gt = function (y) {
  return function (x) {
    return x > y;
  };
};

$.lt = function (y) {
  return function (x) {
    return x < y;
  };
};

$.eq = function (y) {
  return function (x) {
    return x === y;
  };
};

$.neq = function (y) {
  return function (x) {
    return x !== y;
  };
};

$.gte = function (y) {
  return function (x) {
    return x >= y;
  };
};

$.lte = function (y) {
  return function (x) {
    return x <= y;
  };
};

module.exports = $;

},{}],5:[function(require,module,exports){
const DUMMY = -1;
// returns an array of round representations (array of player pairs).
// http://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm
module.exports = function (n, ps) {  // n = num players
  var rs = [];                  // rs = round array
  if (!ps) {
    ps = [];
    for (var k = 1; k <= n; k += 1) {
      ps.push(k);
    }
  } else {
    ps = ps.slice();
  }

  if (n % 2 === 1) {
    ps.push(DUMMY); // so we can match algorithm for even numbers
    n += 1;
  }
  for (var j = 0; j < n - 1; j += 1) {
    rs[j] = []; // create inner match array for round j
    for (var i = 0; i < n / 2; i += 1) {
      if (ps[i] !== DUMMY && ps[n - 1 - i] !== DUMMY) {
        rs[j].push([ps[i], ps[n - 1 - i]]); // insert pair as a match
      }
    }
    ps.splice(1, 0, ps.pop()); // permutate for next round
  }
  return rs;
};

},{}],6:[function(require,module,exports){
var $ = {};

// ---------------------------------------------
// Comparison and Equality
// ---------------------------------------------

$.equality = function () {
  var pargs = arguments;
  return function (x, y) {
    for (var i = 0, len = pargs.length; i < len; i += 1) {
      if (x[pargs[i]] !== y[pargs[i]]) {
        return false;
      }
    }
    return true;
  };
};

$.compare = function (c, c2) {
  if (typeof c === 'function') {
    c2 = c2 || 1;
    return function (x, y) {
      return c2 * (c(x) - c(y));
    };
  }
  c = c || 1;
  return function (x, y) {
    return c * (x - y);
  };
};

// result of this can be passed directly to Array::sort
$.comparing = function () {
  var args = arguments;
  return function (x, y) {
    for (var i = 0, len = args.length; i < len; i += 2) {
      var factor = args[i + 1] || 1;
      if (x[args[i]] !== y[args[i]]) {
        return factor * (x[args[i]] - y[args[i]]);
      }
    }
    return 0;
  };
};

// default equality, like `operators` eq2
var eq2 = function (x, y) {
  return x === y;
};

// ---------------------------------------------
// Operations
// ---------------------------------------------

// max/min + generalized
$.maximum = function (xs) {
  return Math.max.apply(Math, xs);
};

$.minimum = function (xs) {
  return Math.min.apply(Math, xs);
};

$.maximumBy = function (cmp, xs) {
  for (var i = 1, max = xs[0], len = xs.length; i < len; i += 1) {
    if (cmp(xs[i], max) > 0) {
      max = xs[i];
    }
  }
  return max;
};

$.minimumBy = function (cmp, xs) {
  for (var i = 1, min = xs[0], len = xs.length; i < len; i += 1) {
    if (cmp(xs[i], min) < 0) {
      min = xs[i];
    }
  }
  return min;
};

// Modifying Array operations
$.insertBy = function (cmp, xs, x) {
  for (var i = 0, len = xs.length; i < len; i += 1) {
    if (cmp(xs[i], x) >= 0) {
      xs.splice(i, 0, x);
      return xs;
    }
  }
  xs.push(x);
  return xs;
};

$.insert = function (xs, x) {
  return $.insertBy($.compare(), xs, x);
};

$.deleteBy = function (eq, xs, x) {
  for (var i = 0, len = xs.length; i < len; i += 1) {
    if (eq(xs[i], x)) {
      xs.splice(i, 1);
      return xs;
    }
  }
  return xs;
};

$.delete = function (xs, x) {
  var idx = xs.indexOf(x);
  if (idx >= 0) {
    xs.splice(idx, 1);
  }
  return xs;
};

// "Set" operations
$.intersectBy = function (eq, xs, ys) {
  var result = []
    , xLen = xs.length
    , yLen = ys.length;

  if (xLen && yLen) {
    for (var i = 0; i < xLen; i += 1) {
      var x = xs[i];
      for (var j = 0; j < yLen; j += 1) {
        if (eq(x, ys[j])) {
          result.push(x);
          break;
        }
      }
    }
  }
  return result;
};

$.intersect = function (xs, ys) {
  return $.intersectBy(eq2, xs, ys);
};

$.nubBy = function (eq, xs) {
  var result = [];
  for (var i = 0, len = xs.length; i < len; i += 1) {
    var keep = true;
    for (var j = 0, resLen = result.length; j < resLen; j += 1) {
      if (eq(result[j], xs[i])) {
        keep = false;
        break;
      }
    }
    if (keep) {
      result.push(xs[i]);
    }
  }
  return result;
};

// nub, build up a list of unique (w.r.t. equality)
// elements by checking if current is not 'equal' to anything in the buildup
// http://jsperf.com/nubnubbytest1 => indexOf clearly beats calling $.nubBy(eq2)
$.nub = function (xs) {
  var result = [];
  for (var i = 0, len = xs.length; i < len; i += 1) {
    if (result.indexOf(xs[i]) < 0) {
      result.push(xs[i]);
    }
  }
  return result;
};

$.groupBy = function (eq, xs) {
  var result = []
    , j, sub;
  for (var i = 0, len = xs.length; i < len; i = j) {
    sub = [xs[i]];
    for (j = i + 1; j < len && eq(xs[i], xs[j]); j += 1) {
      sub.push(xs[j]);
    }
    result.push(sub);
  }
  return result;
};

$.group = function (xs) {
  return $.groupBy(eq2, xs);
};

$.unionBy = function (eq, xs, ys) {
  return xs.concat(xs.reduce($.deleteBy.bind(null, eq), $.nubBy(eq, ys)));
};

$.union = function (xs, ys) {
  return xs.concat(xs.reduce($.delete, $.nub(ys)));
};

$.differenceBy = function (eq, xs, ys) {
  return ys.reduce($.deleteBy.bind(null, eq), xs.slice()); // reduce a copy
};

$.difference = function (xs, ys) {
  return ys.reduce($.delete, xs.slice());
};

$.isSubsetOf = function (xs, ys, proper) {
  var parent = ys.slice();
  for (var i = 0; i < xs.length; i += 1) {
    var x = xs[i]
      , idx = parent.indexOf(x);
    if (idx < 0) {
      return false;
    }
    parent.splice(idx, 1);
  }
  return (proper) ? (parent.length > 0) : true;
};

// end - export
module.exports = $;

},{}],7:[function(require,module,exports){
var $ = require('interlude');

var o = { NONE: 0 }; // no player marker same for all tournaments

o.findMatch = function (ms, id) {
  return $.firstBy(function (m) {
    return (id.s === m.id.s) &&
           (id.r === m.id.r) &&
           (id.m === m.id.m);
  }, ms);
};

o.findMatches = function (ms, id) {
  return ms.filter(function (m) {
    return (id.s == null || m.id.s === id.s) &&
           (id.r == null || m.id.r === id.r) &&
           (id.m == null || m.id.m === id.m);
  });
};

o.findMatchesRanged = function (ms, lb, ub) {
  ub = ub || {};
  return ms.filter(function (m) {
    return (lb.s == null || m.id.s >= lb.s) &&
           (lb.r == null || m.id.r >= lb.r) &&
           (lb.m == null || m.id.m >= lb.m) &&
           (ub.s == null || m.id.s <= ub.s) &&
           (ub.r == null || m.id.r <= ub.r) &&
           (ub.m == null || m.id.m <= ub.m);
  });
};

o.partitionMatches = function (ms, splitKey, filterKey, filterVal) {
  var res = [];
  for (var i = 0; i < ms.length; i += 1) {
    var m = ms[i];
    if (filterVal == null || m.id[filterKey] === filterVal) {
      if (!Array.isArray(res[m.id[splitKey] - 1])) {
        res[m.id[splitKey] - 1] = [];
      }
      res[m.id[splitKey] - 1].push(m);
    }
  }
  return res;
};

o.matchesForPlayer = function (ms, playerId) {
  return ms.filter(function (m) {
    return m.p.indexOf(playerId) >= 0;
  });
};

o.players = function (ms) {
  var ps = ms.reduce(function (acc, m) {
    return acc.concat(m.p); // collect all players in given matches
  }, []);
  return $.nub(ps).filter($.gt(o.NONE)).sort($.compare());
};

// This may replace rounds in future versions
o.rounds = function (ms) {
  return $.nub(ms.map($.get('id', 'r'))).sort($.compare());
};

o.upcoming = function (ms, playerId) {
  return ms.filter(function (m) {
    return m.p.indexOf(playerId) >= 0 && !m.m
  });
};

o.started = function (ms) {
  return ms.some(function (m) {
    return m.p.every($.gt(o.NONE)) && m.m; // not an automatically scored match
  });
};

o.playable = function (m) {
  return !m.p.some($.eq(o.NONE));
};

module.exports = o;

},{"interlude":3}],8:[function(require,module,exports){
var $ = require('interlude');
var helper = require('./match');

function Tournament(np, ms) {
  this.matches = ms;
  this.state = [];
}

Object.defineProperty(Tournament, 'NONE', { enumerable: true, value: helper.NONE });
Object.defineProperty(Tournament, 'helpers', { value: helper });

// ------------------------------------------------------------------
// Multi stage helpers
// ------------------------------------------------------------------

var replaceMatches = function (inst, resAry) {
  if (helper.started(inst.matches)) {
    throw new Error('Cannot replace players for a tournament in progress');
  }
  // because resAry is always sorted by .pos, we simply use this to replace seeds
  inst.matches.forEach(function (m) {
    m.p = m.p.map(function (oldSeed) {
      // as long as they are actual players
      return (oldSeed > 0) ? resAry[oldSeed-1].seed : oldSeed;
    });
  });
};

Tournament.from = function (Klass, inst, numPlayers, opts) {
  var err = 'Cannot forward from ' + inst.name + ': ';
  if (!inst.isDone()) {
    throw new Error(err + 'tournament not done');
  }
  var res = inst.results();
  if (res.length < numPlayers) {
    throw new Error(err + 'not enough players');
  }
  var luckies = res.filter(function (r) {
    return r.pos <= numPlayers;
  });
  if (luckies.length > numPlayers) {
    throw new Error(err + 'too many players tied to pick out top ' + numPlayers);
  }
  var forwarded = new Klass(numPlayers, opts);
  replaceMatches(forwarded, res); // correct when class is of standard format
  return forwarded;
};

// TODO: eventually turn resAry into a ES6 Map
Tournament.resultEntry = function (resAry, seed) {
  for (var i = 0; i < resAry.length; i += 1) {
    if (resAry[i].seed === seed) {
      return resAry[i];
    }
  }
  throw new Error('No result found for seed ' + seed + ' in result array:' + resAry);
};

// ------------------------------------------------------------------
// Misc helpers
// ------------------------------------------------------------------

var idString = function (id) {
  return (id + '' === '[object Object]') ?
    'S' + id.s + ' R' + id.r + ' M' + id.m :
    id + '';
};

Tournament.isInteger = function (n) { // until this gets on Number in ES6
  return Math.ceil(n) === n;
};

// ------------------------------------------------------------------
// Inheritance helpers
// ------------------------------------------------------------------

Tournament.sub = function (name, init, Initial_) {
  var Initial = Initial_ || Tournament;

  var Klass = function (numPlayers, opts_) {
    if (!(this instanceof Klass)) {
      return new Klass(numPlayers, opts_);
    }

    if (!Klass.invalid) {
      throw new Error(name + ' must implement an Invalid function');
    }

    Object.defineProperty(this, '_opts', {
      configurable: true,
      value: (Klass.defaults ? Klass : Initial).defaults(numPlayers, opts_)
    });

    var invReason = Klass.invalid(numPlayers, this._opts);
    if (invReason !== null) {
      this._opts.log.error('Invalid %d player %s with opts=%j rejected',
        numPlayers, name, this._opts
      );
      throw new Error('Cannot construct ' + name + ': ' + invReason);
    }

    this.numPlayers = numPlayers;
    this.name = name;

    // call given init method, and pass in parent constructor as cb
    init.call(this, this._opts, Initial.bind(this, numPlayers));
  };
  Initial.inherit(Klass, Initial);
  return Klass;
};

// two statics that can be overridden with configure
Tournament.invalid = $.constant(null);
Tournament.defaults = function (np, opts) {
  var o = $.extend({}, opts || {});
  o.log = opts && opts.log ? opts.log : console;
  return o;
};

Tournament.configure = function (Klass, obj, Initial_) {
  var Initial = Initial_ || Tournament;
  if (obj.defaults) {
    Klass.defaults = function (np, opts) {
      return obj.defaults(np, Initial.defaults(np, opts));
    };
  }
  else {
    Klass.defaults = Initial.defaults;
  }
  if (obj.invalid) {
    Klass.invalid = function (np, opts) {
      if (!Tournament.isInteger(np)) {
        return 'numPlayers must be a finite integer';
      }
      var invReason = obj.invalid(np, Klass.defaults(np, opts));
      if (invReason !== null) {
        return invReason;
      }
      return null;
    };
  }
  else {
    Klass.invalid = Initial.invalid;
  }
};

Tournament.inherit = function (Klass, Initial_) {
  var Initial = Initial_ || Tournament;
  Klass.prototype = Object.create(Initial.prototype);

  // Ensure deeper sub classes preserve chains whenever they are set up
  // This way any deeper sub classes can always just call the previous method
  // NB: If users subclass these later on, they just replaces the default ones here
  var virtuals = {
    _verify: null,
    _progress: undefined,
    _early: false,
    _safe: false,
    _initResult: {}
  };
  Object.keys(virtuals).forEach(function (fn) {
    // Implement a default if not already implemented (when Initial is Tournament)
    Klass.prototype[fn] = Initial.prototype[fn] || $.constant(virtuals[fn]);
  });

  Klass.from = function (inst, numPlayers, opts) {
    return Tournament.from(Klass, inst, numPlayers, opts);
  };

  Klass.restore = function (numPlayers, opts, state) {
    var trn = new Klass(numPlayers, opts);
    state.forEach(function (o) {
      if (o.type === 'score') {
        trn.score(o.id, o.score);
      }
    });
    return trn;
  };

  Klass.configure = function (obj) {
    return Tournament.configure(Klass, obj, Initial);
  };

  // ways to inherit from a tournament subclass:
  Klass.sub = function (subName, init) {
    return Initial.sub(subName, init, Klass);
  };

  Klass.inherit = function (SubKlass) {
    return Initial.inherit(SubKlass, Klass);
  };
};

// ------------------------------------------------------------------
// Comparators and sorters
// ------------------------------------------------------------------

// ensures first matches first and (for most part) forEach scorability
// similarly how it's read in many cases: WB R2 G3, G1 R1 M1
Tournament.compareMatches = function (g1, g2) {
  return (g1.id.s - g2.id.s) || (g1.id.r - g2.id.r) || (g1.id.m - g2.id.m);
};

// how to sort results array (of objects) : by position desc (or seed asc for looks)
// only for sorting (more advanced `pos` algorithms may be used separately)
Tournament.compareRes = function (r1, r2) {
  return (r1.pos - r2.pos) || (r1.seed - r2.seed);
};

// internal sorting of zipped player array with map score array : zip(m.p, m.m)
// sorts by map score desc, then seed asc
Tournament.compareZip = function (z1, z2) {
  return (z2[1] - z1[1]) || (z1[0] - z2[0]);
};

// helper to get the player array in a match sorted by compareZip
Tournament.sorted = function (m) {
  return $.zip(m.p, m.m).sort(Tournament.compareZip).map($.get('0'));
};

// ------------------------------------------------------------------
// Tie computers
// ------------------------------------------------------------------

// tie position an assumed sorted resAry using a metric fn
// the metric fn must be sufficiently linked to the sorting fn used
Tournament.resTieCompute = function (resAry, startPos, cb, metric) {
  var pos = startPos
    , ties = 0
    , points = -Infinity;

  for (var i = 0; i < resAry.length; i += 1) {
    var r = resAry[i];
    var metr = metric(r);

    if (metr === points) {
      ties += 1;
    }
    else {
      pos += ties + 1;
      ties = 0;
    }
    points = metr;
    cb(r, pos);
  }
};

// tie position an individual match by passing in a slice of the
// zipped players and scores array, sorted by compareZip
Tournament.matchTieCompute = function (zipSlice, startIdx, cb) {
  var pos = startIdx
    , ties = 0
    , scr = -Infinity;

  // loop over players in order of their score
  for (var k = 0; k < zipSlice.length; k += 1) {
    var pair = zipSlice[k]
      , p = pair[0]
      , s = pair[1];

    // if this is a tie, pos is previous one, and next real pos must be incremented
    if (scr === s) {
      ties += 1;
    }
    else {
      pos += 1 + ties; // if we tied, must also + that
      ties = 0;
    }
    scr = s;
    cb(p, pos); // user have to find resultEntry himself from seed
  }
};

// ------------------------------------------------------------------
// Prototype interface that expects certain implementations
// ------------------------------------------------------------------

Tournament.prototype.isDone = function () {
  return this.matches.every($.get('m')) || this._early();
};

Tournament.prototype.unscorable = function (id, score, allowPast) {
  var m = this.findMatch(id);
  if (!m) {
    return idString(id) + ' not found in tournament';
  }
  if (!this.isPlayable(m)) {
    return idString(id) + ' not ready - missing players';
  }
  if (!Array.isArray(score) || !score.every(Number.isFinite)) {
    return idString(id) + ' scores must be a numeric array';
  }
  if (score.length !== m.p.length) {
    return idString(id) + ' scores must have length ' + m.p.length;
  }
  // if allowPast - you can do anything - but if not, it has to be safe
  if (!allowPast && Array.isArray(m.m) && !this._safe(m)) {
    return idString(id) + ' cannot be re-scored';
  }
  return this._verify(m, score);
};

Tournament.prototype.score = function (id, score) {
  var invReason = this.unscorable(id, score, true);
  if (invReason !== null) {
    this._opts.log.error('failed scoring match %s with %j', idString(id), score);
    this._opts.log.error('reason:', invReason);
    return false;
  }
  var m = this.findMatch(id);
  m.m = score;
  this.state.push({ type: 'score', id: id, score: score });
  this._progress(m);
  return true;
};

Tournament.prototype.results = function () {
  var players = this.players();
  if (this.numPlayers !== players.length) {
    var why = players.length + ' !== ' + this.numPlayers;
    throw new Error(this.name + ' initialized numPlayers incorrectly: ' + why);
  }

  var res = new Array(this.numPlayers);
  for (var s = 0; s < this.numPlayers; s += 1) {
    // res is no longer sorted by seed initially
    res[s] = {
      seed: players[s],
      wins: 0,
      for: 0,
      against: 0,
      pos: this.numPlayers
    };
    $.extend(res[s], this._initResult(players[s]));
  }
  if (this._stats instanceof Function) {
    this.matches.reduce(this._stats.bind(this), res);
  }
  return (this._sort instanceof Function) ?
    this._sort(res) :
    res.sort(Tournament.compareRes); // sensible default
};

// ------------------------------------------------------------------
// Prototype convenience methods
// ------------------------------------------------------------------

Tournament.prototype.resultsFor = function (seed) {
  return $.firstBy(function (r) {
    return r.seed === seed;
  }, this.results());
};

Tournament.prototype.upcoming = function (playerId) {
  return helper.upcoming(this.matches, playerId);
};

Tournament.prototype.isPlayable = helper.playable;

Tournament.prototype.findMatch = function (id) {
  return helper.findMatch(this.matches, id);
};

Tournament.prototype.findMatches = function (id) {
  return helper.findMatches(this.matches, id);
};

Tournament.prototype.findMatchesRanged = function (lb, ub) {
  return helper.findMatchesRanged(this.matches, lb, ub);
};


// partition matches into rounds (optionally fix section)
Tournament.prototype.rounds = function (section) {
  return helper.partitionMatches(this.matches, 'r', 's', section);
};
// partition matches into sections (optionally fix round)
Tournament.prototype.sections = function (round) {
  return helper.partitionMatches(this.matches, 's', 'r', round);
};

var roundNotDone = function (rnd) {
  return rnd.some(function (m) {
    return !m.m;
  });
};
Tournament.prototype.currentRound = function (section) {
  return $.firstBy(roundNotDone, this.rounds(section));
};
Tournament.prototype.nextRound = function (section) {
  var rounds = this.rounds(section);
  for (var i = 0; i < rounds.length; i += 1) {
    if (roundNotDone(rounds[i])) {
      return rounds[i+1];
    }
  }
};

Tournament.prototype.matchesFor = function (playerId) {
  return helper.matchesForPlayer(this.matches, playerId);
};

Tournament.prototype.players = function (id) {
  return helper.players(this.findMatches(id || {}));
};

module.exports = Tournament;

},{"./match":7,"interlude":3}],"duel":[function(require,module,exports){
var Base = require('tournament')
  , $ = require('interlude');

const WB = 1
    , LB = 2
    , WO = -1;

// Id class - so each Id has an automatic string representation
function Id(bracket, round, match) {
  if (!(this instanceof Id)) {
    return new Id(bracket, round, match);
  }
  this.s = bracket;
  this.r = round;
  this.m = match;
}
Id.prototype.toString = function () {
  return (this.s === WB ? 'WB' : 'LB') + ' R' + this.r + ' M' + this.m;
};

// ------------------------------------------------------------------
// Initialization helpers
// ------------------------------------------------------------------

var blank = function () {
  return [Base.NONE, Base.NONE];
};

// mark players that had to be added to fit model as WO's
var woMark = function (ps, size) {
  return ps.map(function (p) {
    return (p > size) ? WO : p;
  });
};

// shortcut to create a match id as duel tourneys are very specific about locations
var gId = function (b, r, m) {
  return new Id(b, r, m);
};

// helpers to initialize duel tournaments
// http://clux.org/entries/view/2407
var evenSeed = function (i, p) {
  var k = Math.floor(Math.log(i) / Math.log(2))
    , r = i - Math.pow(2, k);
  if (r === 0) {
    return Math.pow(2, p - k);
  }
  var nr = (i - 2*r).toString(2).split('').reverse().join('');
  return (parseInt(nr, 2) << p - nr.length) + Math.pow(2, p - k - 1);
};

// get initial players for match i in a power p duel tournament
// NB: match number i is 1-indexed - VERY UNDEFINED for i<=0
var seeds = function (i, p) {
  var even = evenSeed(i, p);
  return [Math.pow(2, p) + 1 - even, even];
};

// make ALL matches for a Duel elimination tournament
var elimination = function (size, p, last, isLong) {
  var matches = [];
  // first WB round to initialize players
  for (var i = 1; i <= Math.pow(2, p - 1); i += 1) {
    matches.push({ id: gId(WB, 1, i), p: woMark(seeds(i, p), size) });
  }

 // blank WB rounds
  var r, g;
  for (r = 2; r <= p; r += 1) {
    for (g = 1; g <= Math.pow(2, p - r); g += 1) {
      matches.push({id: gId(WB, r, g), p: blank() });
    }
  }

  // blank LB rounds
  if (last >= LB) {
    for (r = 1; r <= 2*p - 2; r += 1) {
      // number of matches halves every odd round in losers bracket
      for (g = 1; g <= Math.pow(2, p - 1 - Math.floor((r + 1) / 2)); g += 1) {
        matches.push({ id: gId(LB, r, g), p: blank() });
      }
    }
    matches.push({ id: gId(LB, 2*p - 1, 1), p: blank() }); // grand final match 1
  }
  if (isLong) {
    // bronze final if last === WB, else grand final match 2
    matches.push({ id: gId(LB, last === LB ? 2*p : 1, 1), p: blank() });
  }
  return matches.sort(Base.compareMatches); // sort so they can be scored in order
};

// ------------------------------------------------------------------
// progression helpers - assume instance context
// ------------------------------------------------------------------

// find the match and position a winner should move "right" to in the current bracket
var right = function (id) {
  var b = id.s
    , r = id.r
    , g = id.m
    , p = this.p;

  // cases where progression stops for winners
  var isFinalSe = (this.last === WB && r === p)
    , isFinalDe = (this.last === LB && b === LB && r === 2*p)
    , isBronze = (this.last === WB && b === LB)
    , isShortLbGf = (b === LB && r === 2*p - 1 && !this.isLong);

  if (isFinalSe || isFinalDe || isBronze || isShortLbGf) {
    return null;
  }

  // special case of WB winner moving to LB GF G1
  if (this.last >= LB && b === WB && r === p) {
    return [gId(LB, 2*p - 1, 1), 0];
  }

  // for LB positioning
  var ghalf = (b === LB && $.odd(r)) ? g : Math.floor((g + 1) / 2);

  var pos;
  if (b === WB) {
    pos = (g + 1) % 2; // normal WB progression
  }
  // LB progression
  else if (r >= 2*p - 2) {
    pos = (r + 1) % 2; // LB final winner -> bottom & GF(1) underdog winner -> top
  }
  else if (r === 1) {
    // unless downMix, LBR1 winners move inversely to normal progression
    pos = this.downMix ? 1 : g % 2;
  }
  else {
    // winner from LB always bottom in odd rounds, otherwise normal progression
    pos = $.odd(r) ? 1 : (g + 1) % 2;
  }

  // normal progression
  return [gId(b, r + 1, ghalf), pos];
};

// helper to mix down progression to reduce chances of replayed matches
var mixLbGames = function (p, round, game) {
  // we know round <= p
  var numGames = Math.pow(2, p - round);
  var midPoint = Math.floor(Math.pow(2, p - round - 1)); // midPoint 0 in finals

  // reverse the match list map
  var reversed = $.odd(Math.floor(round/2));
  // split the match list map in two change order and rejoin the lists
  var partitioned = $.even(Math.floor((round + 1)/2));

  if (partitioned) {
    if (reversed) {
      return (game > midPoint) ? numGames - game + midPoint + 1 : midPoint - game + 1;
    }
    return (game > midPoint) ?  game - midPoint : game + midPoint;
  }
  return reversed ? numGames - game + 1 : game;
};

// find the match and position a loser should move "down" to in the current bracket
var down = function (id) {
  var b = id.s
    , r = id.r
    , g = id.m
    , p = this.p;

  // knockouts / special finals
  if (b >= this.last) { // greater than case is for BF in long single elimination
    if (b === WB && this.isLong && r === p - 1) {
      // if bronze final, move loser to "LBR1" at mirror pos of WBGF
      return [gId(LB, 1, 1), (g + 1) % 2];
    }
    if (b === LB && r === 2*p - 1 && this.isLong) {
      // if double final, then loser moves to the bottom
      return [gId(LB, 2 * p, 1), 1];
    }
    // otherwise always KO'd if loosing in >= last bracket
    return null;
  }

  // WBR1 always feeds into LBR1 as if it were WBR2
  if (r === 1) {
    return [gId(LB, 1, Math.floor((g+1)/2)), g % 2];
  }

  if (this.downMix) {
    // always drop on top when downmixing
    return [gId(LB, (r-1)*2, mixLbGames(p, r, g)), 0];
  }

  // normal  LB drops: on top for (r>2) and (r<=2 if odd g) to match bracket movement
  var pos = (r > 2 || $.odd(g)) ? 0 : 1;
  return [gId(LB, (r-1)*2, g), pos];
};

// given a direction (one of the above two), move an 'advancer' to that location
var playerInsert = function (progress, adv) {
  if (progress) {
    var id = progress[0]
      , pos = progress[1]
      , insertM = this.findMatch(id);

    if (!insertM) {
      throw new Error('tournament corrupt: ' + id + ' not found!');
    }

    insertM.p[pos] = adv;
    if (insertM.p[(pos + 1) % 2] === WO) {
      insertM.m = (pos) ? [0, 1] : [1, 0]; // set WO map scores
      return insertM.id; // this id was won by adv on WO, inform
    }
  }
};

// helper to initially score matches with walkovers correctly
var woScore = function (progressFn, m) {
  var idx = m.p.indexOf(WO);
  if (idx >= 0) {
    // set scores manually to avoid the `_verify` walkover scoring restriction
    m.m = (idx === 0) ? [0, 1] : [1, 0];
    progressFn(m);
  }
};

// ------------------------------------------------------------------
// statistics helpers
// ------------------------------------------------------------------

var lbPos = function (p, maxr) {
  // model position as y = 2^(k+1) + c_k2^k + 1
  // where k(maxr) = floor(roundDiff/2)
  // works upto and including LB final (gf players must be positioned manually)
  var metric = 2*p - maxr;
  var k = Math.floor(metric/2) - 1; // every other doubles
  if (k < 0) {
    throw new Error('lbPos model works for k>=0 only');
  }
  var ck = Math.pow(2, k) * (metric % 2);
  return Math.pow(2, k + 1) + 1 + ck;
};

var wbPos = function (p, maxr) {
  // similar but simpler, double each round, and note that ties are + 1
  // works up to and including semis (WBF + BF must be positioned manually)
  return Math.pow(2, p - maxr) + 1;
};

var placement = function (last, p, maxr) {
  return (last === LB) ? lbPos(p, maxr) : wbPos(p, maxr);
};

// ------------------------------------------------------------------
// Interface
// ------------------------------------------------------------------

var Duel = Base.sub('Duel', function (opts, initParent) {
  this.isLong = opts.isLong; // isLong for WB => hasBF, isLong for LB => hasGf2
  this.last = opts.last;
  this.limit = opts.limit;
  this.downMix = opts.downMix;
  this.p = Math.ceil(Math.log(this.numPlayers) / Math.log(2));
  initParent(elimination(this.numPlayers, this.p, this.last, this.isLong));

  // manually progress WO markers
  var scorer = woScore.bind(null, this._progress.bind(this));
  this.findMatches({s: WB, r: 1}).forEach(scorer);
  if (this.last > WB) {
    this.findMatches({s: LB, r: 1}).forEach(scorer);
  }
});

// ------------------------------------------------------------------
// Static helpers and constants
// ------------------------------------------------------------------

Duel.configure({
  defaults: function (np, o) {
    o.isLong = !o.short;
    o.last = o.last || WB;
    o.limit = o.limit | 0;
    o.downMix = Boolean(o.downMix && o.last > WB);
    return o;
  },

  invalid: function (np, opts) {
    if (np < 4 || np > 1024) {
      return 'numPlayers must be >= 4 and <= 1024';
    }
    if ([WB, LB].indexOf(opts.last) < 0) {
      return 'last elimination bracket must be either WB or LB';
    }
    if (opts.limit) {
      return 'limits not yet supported';
    }
    return null;
  }
});

var consts = {WB: WB, LB: LB, WO: WO};
Object.keys(consts).forEach(function (key) {
  Object.defineProperty(Duel, key, {
    enumerable: true,
    value: consts[key]
  });
});

Duel.attachNames = function (fn) {
  Duel.prototype.roundName = function (partialId) {
    return fn(consts, this.last, this.p, partialId);
  };
};

// ------------------------------------------------------------------
// Expected methods
// ------------------------------------------------------------------

Duel.prototype._progress = function (m) {
  // helper to insert player adv into [id, pos] from progression fns
  var inserter = playerInsert.bind(this);

  // 1. calculate winner and loser for progression
  var w = (m.m[0] > m.m[1]) ? m.p[0] : m.p[1]
    , l = (m.m[0] > m.m[1]) ? m.p[1] : m.p[0];
  // in double elimination, the double final should be propagated to with zeroes
  // unless we actually need it (underdog won gfg1 forcing the gfg2 decider)
  var isShortLbGf = (m.id.s === LB && m.id.r === 2*this.p - 1 && this.isLong);
  if (isShortLbGf && w === m.p[0]) {
    w = l = 0;
  }

  // 2. move winner right
  // NB: non-WO match `id` cannot `right` into a WOd match => discard res
  inserter(this.right(m.id), w);

  // 3. move loser down if applicable
  var dres = inserter(this.down(m.id), l);

  // 4. check if loser must be forwarded from existing WO in LBR1/LBR2
  // NB: propagateZeroes is never relevant as LBR2 is always before GF1 when p >= 2
  if (dres) {
    inserter(this.right(dres), l);
  }
};

Duel.prototype._verify = function (m, score) {
  if (m.p[0] === WO || m.p[1] === WO) {
    return "cannot override score in walkover'd match";
  }
  if (score[0] === score[1]) {
    return 'cannot draw a duel';
  }
  return null;
};

Duel.prototype._safe = function (m) {
  // ensure matches [right, down, down ∘ right] are all unplayed (ignoring WO)
  var r = this.right(m.id)
    , d = this.down(m.id)
    , rm = r && this.findMatch(r[0])
    , dm = d && this.findMatch(d[0])
    , dr = dm && this.right(dm.id) // right from down
    , drm = dr && this.findMatch(dr[0]);

  return [rm, dm, drm].every(function (next) {
    // safe iff (match not there, or unplayed, or contains WO markers)
    return !next || !next.m || next.p[0] === WO || next.p[1] === WO;
  });
};

Duel.prototype._early = function () {
  var gf1 = this.matches[this.matches.length - 2];
  return this.isLong && this.last === LB && gf1.m && gf1.m[0] > gf1.m[1];
};

Duel.prototype._stats = function (res, g) {
  var isLong = this.isLong
    , last  = this.last
    , p = this.p
    , isBf = isLong && last === WB && g.id.s === LB
    , isWbGf = last === WB && g.id.s === WB && g.id.r === p
    , isLbGfs = last === LB && g.id.s === LB && g.id.r >= 2*p - 1
    , isLongSemi = isLong && last === WB && g.id.s === WB && g.id.r === p-1
    , canPosition = !isBf && !isWbGf && !isLbGfs && !isLongSemi
    , maxr = (g.id.s < last) ? this.down(g.id, false)[0].r : g.id.r;

  // position players based on reaching the match
  g.p.filter($.gt(0)).forEach(function (s) {
    Base.resultEntry(res, s).pos = canPosition ?
      placement(last, p, maxr): // estimate from minimally achieved last round
      2 + Number(isBf || isLongSemi)*2; // finals are 2 or 4 initially
  });

  // compute stats for played matches - ignore WOs (then p found in next)
  if (g.p.indexOf(WO) < 0 && g.m) {
    // when we have scores, we have a winner and a loser
    var p0 = Base.resultEntry(res, g.p[0])
      , p1 = Base.resultEntry(res, g.p[1])
      , w = (g.m[0] > g.m[1]) ? p0 : p1;

    // inc wins
    w.wins += 1;
    p0.for += g.m[0];
    p1.for += g.m[1];
    p0.against += g.m[1];
    p1.against += g.m[0];

    // bump winners of finals
    var wbWinnerWon = p0.seed === w.seed;
    var isConclusiveLbGf = isLbGfs && (g.id.r === 2*p || !isLong || wbWinnerWon);
    if (isBf || isWbGf || isConclusiveLbGf) {
      w.pos -= 1;
    }
  }
  return res;
};

// exposed helpers - extras
Duel.prototype.down = down;
Duel.prototype.right = right;

Duel.Id = Id;
module.exports = Duel;

},{"interlude":3,"tournament":8}],"ffa":[function(require,module,exports){
var $ = require('interlude')
  , group = require('group')
  , Tournament = require('tournament');

function Id(r, m) {
  this.s = 1;
  this.r = r;
  this.m = m;
}

Id.prototype.toString = function () {
  return 'R' + this.r + ' M' + this.m;
};

var mId = function (r, m) {
  return new Id(r, m);
};

//------------------------------------------------------------------
// Initialization helpers
//------------------------------------------------------------------

var unspecify = function (grps) {
  return grps.map(function (grp) {
    return $.replicate(grp.length, Tournament.NONE);
  });
};

var makeMatches = function (np, grs, adv) {
  var matches = []; // pushed in sort order
  // rounds created iteratively - know configuration valid at this point so just
  // repeat the calculation in the validation
  for (var i = 0; i < grs.length; i += 1) {
    var a = adv[i]
      , gs = grs[i]
      , numGroups = Math.ceil(np / gs)
      , grps = group(np, gs);

    if (numGroups !== grps.length) {
      throw new Error('internal FFA construction error');
    }
    if (i > 0) {
      // only fill in seeding numbers for round 1, otherwise placeholders
      grps = unspecify(grps);
    }

    // fill in matches
    for (var m = 0; m < grps.length; m += 1) {
      matches.push({id: mId(i+1, m+1), p: grps[m]}); // matches 1-indexed
    }
    // reduce players left (for next round - which will exist if a is defined)
    np = numGroups*a;
  }
  return matches;
};

var prepRound = function (currRnd, nxtRnd, adv) {
  var top = currRnd.map(function (m) {
    return $.zip(m.p, m.m).sort(Tournament.compareZip).slice(0, adv);
  });

  // now flatten and sort across matches
  // this essentially re-seeds players for the next round
  top = $.pluck(0, $.flatten(top).sort(Tournament.compareZip));

  // re-find group size from maximum length of zeroed player array in next round
  var grs = $.maximum($.pluck('length', $.pluck('p', nxtRnd)));

  // set all next round players with the fairly grouped set
  group(top.length, grs).forEach(function (group, k) {
    // replaced nulled out player array with seeds mapped to corr. top placers
    nxtRnd[k].p = group.map(function (seed) {
      return top[seed-1]; // NB: top is zero indexed
    });
  });
};

//------------------------------------------------------------------
// Invalid helpers
//------------------------------------------------------------------

var roundInvalid = function (np, grs, adv, numGroups) {
  // the group size in here refers to the maximal reduced group size
  if (np < 2) {
    return 'needs at least 2 players';
  }
  if (grs < 2) {
    return 'group size must be at least 2';
  }
  if (adv >= grs) {
    return 'must advance less than the group size';
  }
  var isUnfilled = (np % numGroups) > 0;
  if (isUnfilled && adv >= grs - 1) {
    return 'must advance less than the smallest match size';
  }
  if (adv <= 0) {
    return 'must eliminate players each match';
  }
  return null;
};

var finalInvalid = function (leftOver, limit, gLast) {
  if (leftOver < 2) {
    return 'must contain at least 2 players'; // force >4 when using limits
  }
  var lastNg = Math.ceil(leftOver / gLast);
  if (limit > 0) { // using limits
    if (limit >= leftOver) {
      return 'limit must be less than the remaining number of players';
    }
    // need limit to be a multiple of numGroups (otherwise tiebreaks necessary)
    if (limit % lastNg !== 0) {
      return 'number of matches must divide limit';
    }
  }
  return null;
};

var invalid = function (np, grs, adv, limit) {
  if (np < 2) {
    return 'number of players must be at least 2';
  }
  if (!grs.length || !grs.every(Tournament.isInteger)) {
    return 'sizes must be a non-empty array of integers';
  }
  if (!adv.every(Tournament.isInteger) || grs.length !== adv.length + 1) {
    return 'advancers must be a sizes.length-1 length array of integers';
  }

  var numGroups = 0;
  for (var i = 0; i < adv.length; i += 1) {
    // loop over adv as then both a and g exist
    var a = adv[i];
    var g = grs[i];
    // calculate how big the groups are
    numGroups = Math.ceil(np / g);
    var gActual = group.minimalGroupSize(np, g);

    // and ensure with group reduction that eliminationValid for reduced params
    var invReason = roundInvalid(np, gActual, a, numGroups);
    if (invReason !== null) {
      return 'round ' + (i+1) + ' ' + invReason;
    }
    // return how many players left so that np is updated for next itr
    np = numGroups*a;
  }
  // last round and limit checks
  var invFinReason = finalInvalid(np, limit, grs[grs.length-1]);
  if (invFinReason !== null) {
    return 'final round ' + invFinReason;
  }

  // nothing found - ok to create
  return null;
};

//------------------------------------------------------------------
// Interface
//------------------------------------------------------------------

var FFA = Tournament.sub('FFA', function (opts, initParent) {
  this.limit = opts.limit;
  this.advs = opts.advancers;
  this.sizes = opts.sizes;
  initParent(makeMatches(this.numPlayers, this.sizes, this.advs));
});

//------------------------------------------------------------------
// Helpers and constants
//------------------------------------------------------------------

FFA.configure({
  defaults: function (np, opts) {
    opts.limit = opts.limit | 0;
    opts.sizes = Array.isArray(opts.sizes) ? opts.sizes : [np];
    opts.advancers = Array.isArray(opts.advancers) ? opts.advancers : [];
    return opts;
  },
  invalid: function (np, opts) {
    return invalid(np, opts.sizes, opts.advancers, opts.limit);
  }
});

FFA.prototype.limbo = function (playerId) {
  // if player reached currentRound, he may be waiting for generation of nextRound
  var m = $.firstBy(function (g) {
    return g.p.indexOf(playerId) >= 0 && g.m;
  }, this.currentRound() || []);

  if (m) {
    // will he advance to nextRound ?
    var adv = this.advs[m.id.r - 1];
    if (Tournament.sorted(m).slice(0, adv).indexOf(playerId) >= 0) {
      return {s: 1, r: m.id.r + 1}; // TODO: no toString representation for this
    }
  }
};

// ------------------------------------------------------------------
// Expected methods
// ------------------------------------------------------------------

FFA.prototype._progress = function (match) {
  var adv = this.advs[match.id.r - 1] || 0;
  var currRnd = this.findMatches({r: match.id.r});
  if (currRnd.every($.get('m')) && adv > 0) {
    prepRound(currRnd, this.findMatches({r: match.id.r + 1}), adv);
  }
};

FFA.prototype._safe = function (match) {
  var nextRnd = this.findMatches({ r: match.id.r + 1 });
  // safe iff next round has not started
  return nextRnd.every(function (m) {
    return !Array.isArray(m.m);
  });
};

FFA.prototype._verify = function (match, score) {
  var adv = this.advs[match.id.r - 1] || 0;
  if (adv > 0 && score[adv] === score[adv - 1]) {
    return 'scores must unambiguous decide who advances';
  }
  if (!adv && this.limit > 0) {
    // number of groups in last round is the match number of the very last match
    // because of the ordering this always works!
    var lastNG = this.matches[this.matches.length-1].id.m;
    var cutoff = this.limit/lastNG; // NB: lastNG divides limit (from finalInvalid)
    if (score[cutoff] === score[cutoff - 1]) {
      return 'scores must decide who advances in final round with limits';
    }
  }
  return null;
};

FFA.prototype._stats = function (res, m) {
  if (m.m) {
    var adv = this.advs[m.id.r - 1] || 0;
    $.zip(m.p, m.m).sort(Tournament.compareZip).forEach(function (t, j, top) {
      var p = Tournament.resultEntry(res, t[0]);
      p.for += t[1];
      p.against += (top[0][1] - t[1]); // difference with winner
      if (j < adv) {
        p.wins += 1;
      }
    });
  }
  return res;
};

var compareMulti = function (x, y) {
  return (x.pos - y.pos) ||
         ((y.for - y.against) - (x.for - x.against)) ||
         (x.seed - y.seed);
};

FFA.prototype._sort = function (res) {
  var limit = this.limit;
  var advs = this.advs;
  var sizes = this.sizes;
  var maxround = this.sizes.length;

  // gradually improve scores for each player by looking at later and later rounds
  this.rounds().forEach(function (rnd, k) {
    var rndPs = $.flatten($.pluck('p', rnd)).filter($.gt(Tournament.NONE));
    rndPs.forEach(function (p) {
      Tournament.resultEntry(res, p).pos = rndPs.length; // tie players that got here
    });

    var isFinal = (k === maxround - 1);
    var adv = advs[k] || 0;
    var wlim = (limit > 0 && isFinal) ? limit / rnd.length : adv;
    var nonAdvancers = $.replicate(sizes[k] - adv, []); // all in final

    // collect non-advancers - and set wins
    rnd.filter($.get('m')).forEach(function (m) {
      var startIdx = isFinal ? 0 : adv;
      var top = $.zip(m.p, m.m).sort(Tournament.compareZip).slice(startIdx);
      Tournament.matchTieCompute(top, startIdx, function (p, pos) {
        var resEl = Tournament.resultEntry(res, p);
        if (pos <= wlim || (pos === 1 && !adv)) {
          resEl.wins += 1;
        }
        if (isFinal) {
          resEl.gpos = pos; // for rawPositions
        }
        nonAdvancers[pos-adv-1].push(resEl);
      });
    });

    // nonAdvancers will be tied between the round based on their mpos
    var posctr = adv*rnd.length + 1;
    nonAdvancers.forEach(function (xplacers) {
      xplacers.forEach(function (r) {
        r.pos = posctr;
      });
      posctr += xplacers.length;
    });
  });

  return res.sort(compareMulti);
};

// helper method to be compatible with TieBreaker
FFA.prototype.rawPositions = function (res) {
  if (!this.isDone()) {
    throw new Error('cannot tiebreak a FFA tournament until it is finished');
  }
  var maxround = this.sizes.length;
  var finalRound = this.findMatches({ r: maxround });
  var posAry = finalRound.map(function (m) {
    var seedAry = $.replicate(m.p.length, []);
    m.p.forEach(function (p) {
      var resEl = Tournament.resultEntry(res, p);
      $.insert(seedAry[(resEl.gpos || resEl.pos)-1], p);
    });
    return seedAry;
  });
  return posAry;
};

// ------------------------------------------------------------------

FFA.Id = Id;
module.exports = FFA;

},{"group":2,"interlude":3,"tournament":8}],"groupstage":[function(require,module,exports){
var $ = require('interlude')
  , Tournament = require('tournament')
  , robin = require('roundrobin')
  , grouper = require('group');

function Id(g, r, m) {
  if (!(this instanceof Id)) {
    return new Id(g, r, m);
  }
  this.s = g;
  this.r = r;
  this.m = m;
}

Id.prototype.toString = function () {
  return 'G' + this.s + ' R' + this.r + ' M' + this.m;
};

// ------------------------------------------------------------------

var mapOdd = function (n) {
  return n*2 - 1;
};
var mapEven = function (n) {
  return n*2;
};

var makeMatches = function (numPlayers, groupSize, hasAway) {
  var groups = grouper(numPlayers, groupSize);
  var matches = [];
  for (var g = 0; g < groups.length; g += 1) {
    var group = groups[g];
    // make robin rounds for the group
    var rnds = robin(group.length, group);
    for (var r = 0; r < rnds.length; r += 1) {
      var rnd = rnds[r];
      for (var m = 0; m < rnd.length; m += 1) {
        var plsH = rnd[m];
        if (!hasAway) { // players only meet once
          matches.push({ id: new Id(g+1, r+1, m+1), p : plsH });
        }
        else { // players meet twice
          var plsA = plsH.slice().reverse();
          matches.push({ id: new Id(g+1, mapOdd(r+1), m+1), p: plsH });
          matches.push({ id: new Id(g+1, mapEven(r+1), m+1), p: plsA });
        }
      }
    }
  }
  return matches.sort(Tournament.compareMatches);
};

// ------------------------------------------------------------------

var GroupStage = Tournament.sub('GroupStage', function (opts, initParent) {
  var ms = makeMatches(this.numPlayers, opts.groupSize, opts.meetTwice);
  this.numGroups = $.maximum(ms.map($.get('id', 's')));
  this.groupSize = Math.ceil(this.numPlayers / this.numGroups); // perhaps reduced
  this.winPoints = opts.winPoints;
  this.tiePoints = opts.tiePoints;
  this.scoresBreak = opts.scoresBreak;
  initParent(ms);
});

GroupStage.configure({
  defaults: function (np, o) {
    // no group size set => league
    o.groupSize = Number(o.groupSize) || np;
    o.meetTwice = Boolean(o.meetTwice);
    o.winPoints = Number.isFinite(o.winPoints) ? o.winPoints : 3;
    o.tiePoints = Number.isFinite(o.tiePoints) ? o.tiePoints : 1;
    o.scoresBreak = Boolean(o.scoresBreak);
    return o;
  },

  invalid: function (np, opts) {
    if (np < 2) {
      return 'numPlayers cannot be less than 2';
    }
    if (opts.groupSize < 2) {
      return 'groupSize cannot be less than 2';
    }
    if (opts.groupSize > np) {
      return 'groupSize cannot be greater than numPlayers';
    }
    return null;
  }
});

// helper
GroupStage.prototype.groupFor = function (playerId) {
  for (var i = 0; i < this.matches.length; i += 1) {
    var m = this.matches[i];
    if (m.p.indexOf(playerId) >= 0) {
      return m.id.s;
    }
  }
};

// no one-round-at-a-time restrictions so can always recore
GroupStage.prototype._safe = $.constant(true);

GroupStage.prototype._initResult = function (seed) {
  return {
    grp: this.groupFor(seed),
    gpos: this.groupSize,
    pts: 0,
    draws: 0,
    losses: 0
  };
};

GroupStage.prototype._stats = function (res, m) {
  if (!m.m) {
    return res;
  }
  var p0 = Tournament.resultEntry(res, m.p[0]);
  var p1 = Tournament.resultEntry(res, m.p[1]);

  if (m.m[0] === m.m[1]) {
    p0.pts += this.tiePoints;
    p1.pts += this.tiePoints;
    p0.draws += 1;
    p1.draws += 1;
  }
  else {
    var w = (m.m[0] > m.m[1]) ? p0 : p1;
    var l = (m.m[0] > m.m[1]) ? p1 : p0;
    w.wins += 1;
    w.pts += this.winPoints;
    l.losses += 1;
  }
  p0.for += m.m[0];
  p1.for += m.m[1];
  p0.against += m.m[1];
  p1.against += m.m[0];
  return res;
};

var resultsByGroup = function (results, numGroups) {
  var grps = $.replicate(numGroups, []);
  for (var k = 0; k < results.length; k += 1) {
    var p = results[k];
    grps[p.grp - 1].push(p);
  }
  return grps;
};

var tieCompute = function (resAry, startPos, scoresBreak, cb) {
  // provide the metric for resTieCompute which look factors: points and score diff
  Tournament.resTieCompute(resAry, startPos, cb, function metric(r) {
    var val = 'PTS' + r.pts;
    if (scoresBreak) {
      val += 'DIFF' + (r.for - r.against);
    }
    return val;
  });
};

var compareResults = function (x, y) {
  var xScore = x.for - x.against;
  var yScore = y.for - y.against;
  return (y.pts - x.pts) || (yScore - xScore) || (x.seed - y.seed);
};

var finalCompare = function (x, y) {
  return (x.pos - y.pos) ||  compareResults(x, y);
};

GroupStage.prototype._sort = function (res) {
  var scoresBreak = this.scoresBreak;
  res.sort(compareResults);

  // tieCompute within groups to get the `gpos` attribute
  // at the same time build up array of xplacers
  var xarys = $.replicate(this.groupSize, []);
  resultsByGroup(res, this.numGroups).forEach(function (g) { // g sorted as res is
    tieCompute(g, 0, scoresBreak, function (r, pos) {
      r.gpos = pos;
      xarys[pos-1].push(r);
    });
  });

  if (this.isDone()) {
    // position based entirely on x-placement (ignore pts/scorediff across grps)
    var posctr = 1;
    xarys.forEach(function (xplacers) {
      xplacers.forEach(function (r) {
        r.pos = posctr;
      });
      posctr += xplacers.length;
    });
  }
  return res.sort(finalCompare); // ensure sorted by pos primarily
};

// helper method to be compatible with TieBreaker
GroupStage.prototype.rawPositions = function (res) {
  return resultsByGroup(res, this.numGroups).map(function (grp) {
    // NB: need to create the empty arrays to let result function as a lookup
    var seedAry = $.replicate(grp.length, []);
    for (var k = 0; k < grp.length; k += 1) {
      var p = grp[k];
      $.insert(seedAry[p.gpos-1], p.seed); // insert ensures ascending order
    }
    return seedAry;
  });
};

// ------------------------------------------------------------------

GroupStage.id = Id; // deprecated - should be capitalized
GroupStage.Id = Id;
module.exports = GroupStage;

},{"group":2,"interlude":3,"roundrobin":5,"tournament":8}],"tiebreaker":[function(require,module,exports){
var $ = require('interlude')
  , GroupStage = require('groupstage')
  , Base = require('tournament');

// for grouped breakers
function Id(s, r, m, isSimple) {
  this.s = s;
  this.r = r;
  this.m = m;
  Object.defineProperty(this, '_simple', {
    value: isSimple
  });
}
Id.prototype.toString = function () {
  return this._simple ?
    'S' + this.s + ' TB' :
    'S' + this.s + ' TB R' + this.r + ' M' + this.m;
};

var simpleId = function (s) {
  return new Id(s, 1, 1, true);
};

// ------------------------------------------------------------------
// Init helpers
// ------------------------------------------------------------------

var createClusters = function (posAry, limit, breakOneUp) {
  var numSections = posAry.length;
  var position = Math.ceil(limit / numSections);

  return posAry.map(function (seedAry) {
    var unchosen = position;
    // need a match in this section if no clear position-placer
    for (var i = 0; unchosen > 0; i += 1) {
      var xps = seedAry[i];
      var needForBetween = xps.length >1 && xps.length === unchosen && breakOneUp;
      if (xps.length > unchosen || needForBetween) {
        return xps.slice();
      }
      unchosen -= xps.length; // next cluster must be smaller to fit
    }
    return []; // nothing to break this section
  });
};

var createGroupStageBreaker = function (cluster, section, gsOpts) {
  var gs = new GroupStage(cluster.length, gsOpts);
  gs.tbSection = section;
  gs.matches.forEach(function (m) {
    // NB: cannot modify section as GroupStage relies on it being < numGroups
    m.p.forEach(function (oldSeed, i) {
      // but can safely modify seeds in match - equivalent to using .from
      m.p[i] = cluster[oldSeed-1];
    });
  });
  return gs;
};

var createFfaBreaker = function (cluster, section) {
  return { id: simpleId(section), p: cluster };
};

var createMatches = function (posAry, limit, opts) {
  var xs = [];
  createClusters(posAry, limit, opts.breakForBetween).forEach(function (ps, i) {
    if (ps.length) {
      var matchMaker = opts.grouped ? createGroupStageBreaker : createFfaBreaker;
      xs.push(matchMaker(ps, i+1, opts.groupOpts));
    }
  });
  return xs;
};

// ------------------------------------------------------------------
// results / rawPositions helpers
// ------------------------------------------------------------------

// NB: expects instance context
var getWithinBreakerScore = function (section) {
  if (!this.grouped) {
    var ffaM = this.findMatch({ s: section, r: 1, m: 1 });
    return (ffaM && ffaM.m) ? ffaM : null;
  }

  var gs = $.firstBy(function (stage) {
    return stage.tbSection === section;
  }, this.groupStages);

  if (gs == null || !gs.isDone()) {
    return null;
  }
  var gsRes = gs.results();
  var positions = gs.rawPositions(gsRes);
  var match = { p: [], m: [] }; // match equivalent
  // convert from rawPosition - only used by matchTieCompute in updater
  positions[0].forEach(function (xps, x) {
    xps.forEach(function (p) {
      match.p.push(p);
      match.m.push(positions[0].length-x);
    });
  });
  return match;
};

// split up the posAry entried cluster found in corresponding within section breakers
var updateSeedAry = function (seedAry, match) {
  var res = $.replicate(seedAry.length, []);
  seedAry.forEach(function (xps, x) {
    // NB: while we are not writing 1-1 from seedAry to res, we are always
    // making sure not to overwrite what we had in previous iterations
    if (xps.indexOf(match.p[0]) < 0) {
      res[x] = res[x].concat(xps);
      return;
    }
    // always tieCompute match because only strict mode has guaranteed non-ties
    var sorted = $.zip(match.p, match.m).sort(Base.compareZip);
    Base.matchTieCompute(sorted, 0, function (p, pos) {
      res[x+pos-1].push(p);
    });
  });
  return res;
};

// ------------------------------------------------------------------
// Interface
// ------------------------------------------------------------------

function TieBreaker(oldRes, posAry, limit, opts) {
  if (!(this instanceof TieBreaker)) {
    return new TieBreaker(oldRes, posAry, limit, opts);
  }
  this._opts = TieBreaker.defaults(opts);
  var invReason = TieBreaker.invalid(oldRes, posAry, this._opts, limit);
  if (invReason !== null) {
    this._opts.log.error('Invalid %d player TieBreaker with oldRes=%j rejected, opts=%j',
      limit, oldRes, this._opts
    );
    throw new Error('Cannot construct TieBreaker: ' + invReason);
  }

  var xs = createMatches(posAry, limit, this._opts);
  var ms = [];
  if (this._opts.grouped) {
    for (var i = 0; i < xs.length; i += 1) {
      for (var j = 0; j < xs[i].matches.length; j += 1) {
        var m = xs[i].matches[j];
        // NB: modifying the matches here so that outside world sees the section
        // corr. to the section they came from - whereas gs inst needs s === 1
        ms.push({
          id: new Id(xs[i].tbSection, m.id.r, m.id.m),
          p: m.p.slice()
        });
      }
    }
    this.groupStages = xs;
  }
  else {
    ms = xs;
  }

  Base.call(this, oldRes.length, ms);
  this.name = 'TieBreaker';
  this.grouped = this._opts.grouped;
  this.strict = this._opts.strict;
  this.posAry = posAry;
  this.limit = limit;
  this.oldRes = oldRes;
  this.numSections = posAry.length;
  this.sectionSize = $.flatten(posAry[0]).length;
  this.betweenPosition = Math.ceil(this.limit / this.numSections);

  // Demote player positions until we are done

  // Demotion must unfortunately happen here, and not in previous tourneys results.
  // This is because demotion will change depending on what limits we choose.
  // While this means if we bypass TB we may end up forwarding unfairly (perhaps
  // more players from one group than another), TB is here to fix it, so use it.
  var pls = this.players(); // the players that are actually in matches here
  this.numPlayers = pls.length; // override this.numPlayers set via Base.call(this)
  var playersGuaranteed = oldRes.filter(function (r) {
    return pls.indexOf(r.seed) < 0 && r.pos <= limit;
  }).length;
  oldRes.forEach(function (r) {
    if (pls.indexOf(r.seed) >= 0) {
      r.pos = pls.length + playersGuaranteed;
    }
  });
}
Base.inherit(TieBreaker);

// ------------------------------------------------------------------
// Static helpers
// ------------------------------------------------------------------

// custom invalid that doesn't call inherited versions (because different ctor args)
TieBreaker.invalid = function (oldRes, posAry, opts, limit) {
  if (!Array.isArray(oldRes)) {
    return 'results must be implemented';
  }
  if (!Array.isArray(posAry) || !posAry.length) {
    return 'rawPositions must be implemented properly';
  }
  if (!Base.isInteger(limit) || limit < 1 || limit >= oldRes.length) {
    return 'limit must be an integer in {1, ..., previous.numPlayers}';
  }
  if (limit % posAry.length !== 0) {
    return 'number of sections must divide limit';
  }
  oldRes.forEach(function (r) {
    if (![r.seed, r.for, r.pos].every(Base.isInteger)) {
      return 'invalid results format - common properties missing';
    }
  });
  var len = posAry[0].length;
  var s0Len = $.flatten(posAry[0]).length;
  posAry.forEach(function (seedAry) {
    seedAry.forEach(function (p) {
      if (!Base.isInteger(p) || p <= Base.NONE) {
        return 'invalid rawPositions - all entries must be arrays of integers';
      }
    });
    if (Math.abs(seedAry.length - len) > 1) { // allow diff of 1
      return 'rawPositions must be ~equally long for every section';
    }
    if (Math.abs($.flatten(seedAry).length - s0Len) > 1) { // ditto
      return 'rawPositions must contain ~equally many players per section';
    }
  });
  return null;
};

TieBreaker.defaults = function (opts) {
   // Call defaults from other classes manually + dont modify input
  var o = Base.defaults(Math.Infinity, opts || {});
  o.breakForBetween = Boolean(o.breakForBetween);
  o.grouped = Boolean(o.grouped);
  o.groupOpts = o.grouped ? GroupStage.defaults(Math.Infinity, o.groupOpts) : {};
  delete o.groupOpts.groupSize; // all subgroups must be ONE group only
  delete o.groupOpts.log;
  // grouped tiebreakers cannot be strict
  o.strict = Boolean(o.strict) && !o.grouped;
  return o;
};

// custom from because TieBreaker has different constructor arguments
TieBreaker.from = function (inst, numPlayers, opts) {
  var err = 'Cannot forward from ' + inst.name + ': ';
  if (!inst.isDone()) {
    throw new Error(err + 'tournament not done');
  }
  var res = inst.results();
  if (res.length < numPlayers) {
    throw new Error(err + 'not enough players');
  }
  if (!inst.rawPositions) {
    throw new Error(inst.name + ' does not implement rawPositions');
  }
  var posAry = inst.rawPositions(res);

  // NB: no replacing for TieBreaker, everything read from results
  return new TieBreaker(res, posAry, numPlayers, opts);
};

TieBreaker.isNecessary = function (inst, numPlayers, opts) {
  var o = TieBreaker.defaults(opts);
  var posAry = inst.rawPositions(inst.results());
  var hasNonEmptyCluster = function (cluster) {
    return cluster.length > 0;
  };
  var clusters = createClusters(posAry, numPlayers, o.breakForBetween);
  return clusters.some(hasNonEmptyCluster);
};

// ------------------------------------------------------------------
// Expected methods
// ------------------------------------------------------------------

TieBreaker.prototype._verify =  function (match, score) {
  if (this.strict && $.nub(score).length !== score.length) {
    return 'scores must unambiguously decide every position in strict mode';
  }
  return null;
};

// can always rescore matches since we don't propagate to between group breakers
TieBreaker.prototype._safe = $.constant(true);

TieBreaker.prototype._progress = function (match) {
  if (this.grouped) {
    var gs = $.firstBy(function (stage) {
      return stage.tbSection === match.id.s;
    }, this.groupStages);
    var oldId = { s: 1, r: match.id.r, m: match.id.m };
    gs.score(oldId, match.m);
  }
};

var compareResults = function (x, y) {
  var xScore = x.for - (x.against || 0);
  var yScore = y.for - (y.against || 0);
  return (y.pts - x.pts) || (yScore - xScore) || (x.seed - y.seed);
};

var finalCompare = function (x, y) {
  if (x.pos !== y.pos) {
    return x.pos - y.pos;
  }
  return compareResults(x, y);
};

var positionAcross = function (xarys) {
  // always tie between groups like in groupstage - we dont make inferences
  var posctr = 1;
  xarys.forEach(function (xplacers) {
    xplacers.sort(compareResults);
    xplacers.forEach(function (r) {
      r.pos = posctr;
    });
    posctr += xplacers.length;
  });
};

// override results because we need to do it all from scratch
TieBreaker.prototype.results = function () {
  var res = this.oldRes.map(function (r) {
    return $.extend({}, r); // deep copy to avoid modifying oldRes
  });
  // NB: we do not care about stats from the matches apart from what it broke

  // gposition based on updated posAry from rawPositions - and create xarys
  var xarys = $.replicate(this.sectionSize, []);
  this.rawPositions().forEach(function (seedAry) {
    seedAry.forEach(function (gxp, x) {
      gxp.forEach(function (s) {
        var resEl = Base.resultEntry(res, s);
        resEl.gpos = x+1;
        xarys[x].push(resEl);
      });
    });
  });

  if (this.isDone()) {
    positionAcross(xarys);
  }

  return res.sort(finalCompare);
};

TieBreaker.prototype.rawPositions = function () {
  var findScores = getWithinBreakerScore.bind(this);
  return this.posAry.map(function (seedAry, i) {
    var match = findScores(i+1);
    return match == null ? seedAry : updateSeedAry(seedAry, match);
  });
};

TieBreaker.Id = Id;
module.exports = TieBreaker;

},{"groupstage":"groupstage","interlude":3,"tournament":8}]},{},[])("tiebreaker")
});