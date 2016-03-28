(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Masters = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"autonomy":1,"operators":3,"subset":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"interlude":2}],6:[function(require,module,exports){
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

},{"./match":5,"interlude":2}],"masters":[function(require,module,exports){
var Base = require('tournament')
  , $ = require('interlude');

function Id(r) {
  this.s = 1;
  this.r = r;
  this.m = 1;
}

Id.prototype.toString = function () {
  return 'R' + this.r; // always only one match per round
};

var mId = function (r) {
  return new Id(r);
};

// ------------------------------------------------------------------
// init helpers
// ------------------------------------------------------------------

var makeMatches = function (np, kos) {
  var ms = [];
  ms.push({ id: mId(1), p: $.range(np) });
  var ps = np;
  for (var i = 0; i < kos.length; i += 1) {
    // create the next round from current ko parameter
    ps -= kos[i];
    ms.push({ id: mId(i+2), p: $.replicate(ps, Base.NONE) });
  }
  return ms;
};

// ------------------------------------------------------------------
// Interface
// ------------------------------------------------------------------

var Masters = Base.sub('Masters', function (opts, initParent) {
  this.knockouts = opts.knockouts;
  initParent(makeMatches(this.numPlayers, this.knockouts));
});

var makeDefaultKos = function (np) {
  var kos = [];
  for (var i = np; i > 2; i -= 1) {
    kos.push(1);
  }
  return kos;
};

Masters.configure({
  defaults: function (np, opts) {
    // no knockouts specified => musical chairs style (1 out per round)
    opts.knockouts = opts.knockouts || makeDefaultKos(np);
    return opts;
  },

  invalid: function (np, opts) {
    if (np < 3) {
      return 'need at least 3 players';
    }
    var kos = opts.knockouts;
    if (!Array.isArray(kos) || !kos.every(Base.isInteger)) {
      return 'knockouts must be an array of positive integers';
    }
    var ps = np;
    for (var i = 0; i < kos.length; i += 1) {
      var ko = kos[i];
      if (ko < 1) {
        return 'must knock out a positive number of players each round';
      }
      if (ps - ko <= 1) {
        return 'must leave at least two players in every match';
      }
      ps -= ko;
    }
    return null;
  }
});

Masters.prototype._progress = function (match) {
  var ko = this.knockouts[match.id.r - 1];
  if (ko) {
    // if more matches to play -> progress the top not knocked out
    var adv = match.p.length - ko;
    var top = Base.sorted(match).slice(0, adv);
    var next = this.findMatch(mId(match.id.r + 1));
    next.p = top;
  }
};

Masters.prototype._verify = function (match, score) {
  var ko = this.knockouts[match.id.r - 1] | 0;
  var adv = match.p.length - ko;
  if (ko > 0 && score[adv-1] === score[adv]) {
    return 'scores must unambiguous decide who is in the top ' + adv;
  }
  return null;
};

Masters.prototype._safe = function (match) {
  var next = this.findMatch({ s: 1, r: match.id.r + 1, m: 1 });
  return next && !Array.isArray(next.m);
};

Masters.prototype._stats = function (res, m) {
  // handle players that have reached the match
  m.p.filter($.gt(0)).forEach(function (s) {
    Base.resultEntry(res, s).pos = m.p.length; // tie them all
  });
  if (m.m) {
    var ko = this.knockouts[m.id.r-1] | 0;
    var adv = m.p.length - ko;
    var isFinal = (!ko);

    // update positions
    var top = $.zip(m.p, m.m).sort(Base.compareZip);
    var startIdx = isFinal ? 0 : adv;
    Base.matchTieCompute(top.slice(startIdx), startIdx, function (p, pos) {
      Base.resultEntry(res, p).pos = pos;
    });

    // update score sum and wins (won if proceeded)
    for (var k = 0; k < top.length; k += 1) {
      var p = top[k][0];
      var sc = top[k][1];
      var resEl = Base.resultEntry(res, p);
      resEl.for += sc;
      resEl.against += (top[0][1] - sc); // difference with winner
      if ((!isFinal && k < adv) || (isFinal && resEl.pos === 1)) {
        resEl.wins += 1;
      }
    }
  }
  return res;
};

Masters.Id = Id;
module.exports = Masters;

},{"interlude":2,"tournament":6}]},{},[])("masters")
});