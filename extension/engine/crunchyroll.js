(async()=>{const api=globalThis.browser||globalThis.chrome;const d=await api.storage.local.get('sceneEnabled');if(d.sceneEnabled===false)return;
/* FlowSkip · engine derived from Streaming enhanced 1.1.108 · GPL-3.0. See LICENSE and SOURCE.md. */
(() => {
  // ../Scene-Full/node_modules/@vue/shared/dist/shared.esm-bundler.js
  // @__NO_SIDE_EFFECTS__
  function makeMap(str) {
    const map = /* @__PURE__ */ Object.create(null);
    for (const key of str.split(",")) map[key] = 1;
    return (val) => val in map;
  }
  var EMPTY_OBJ = false ? Object.freeze({}) : {};
  var EMPTY_ARR = false ? Object.freeze([]) : [];
  var NOOP = () => {
  };
  var NO = () => false;
  var extend = Object.assign;
  var remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = (val, key) => hasOwnProperty.call(val, key);
  var isArray = Array.isArray;
  var isMap = (val) => toTypeString(val) === "[object Map]";
  var isSet = (val) => toTypeString(val) === "[object Set]";
  var isFunction = (val) => typeof val === "function";
  var isString = (val) => typeof val === "string";
  var isSymbol = (val) => typeof val === "symbol";
  var isObject = (val) => val !== null && typeof val === "object";
  var isPromise = (val) => {
    return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
  };
  var objectToString = Object.prototype.toString;
  var toTypeString = (value) => objectToString.call(value);
  var toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  var isPlainObject = (val) => toTypeString(val) === "[object Object]";
  var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  var cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return ((str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    });
  };
  var camelizeRE = /-\w/g;
  var camelize = cacheStringFunction(
    (str) => {
      return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
    }
  );
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  var capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  var toHandlerKey = cacheStringFunction(
    (str) => {
      const s = str ? `on${capitalize(str)}` : ``;
      return s;
    }
  );
  var hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  var _globalThis;
  var getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  var isBooleanAttr = /* @__PURE__ */ makeMap(
    specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`
  );

  // ../Scene-Full/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
  function warn(msg, ...args) {
    console.warn(`[Vue warn] ${msg}`, ...args);
  }
  var activeEffectScope;
  function getCurrentScope() {
    return activeEffectScope;
  }
  var activeSub;
  var pausedQueueEffects = /* @__PURE__ */ new WeakSet();
  var ReactiveEffect = class {
    constructor(fn) {
      this.fn = fn;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 1 | 4;
      this.next = void 0;
      this.cleanup = void 0;
      this.scheduler = void 0;
      if (activeEffectScope) {
        if (activeEffectScope.active) {
          activeEffectScope.effects.push(this);
        } else {
          this.flags &= -2;
        }
      }
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      if (this.flags & 64) {
        this.flags &= -65;
        if (pausedQueueEffects.has(this)) {
          pausedQueueEffects.delete(this);
          this.trigger();
        }
      }
    }
    /**
     * @internal
     */
    notify() {
      if (this.flags & 2 && !(this.flags & 32)) {
        return;
      }
      if (!(this.flags & 8)) {
        batch(this);
      }
    }
    run() {
      if (!(this.flags & 1)) {
        return this.fn();
      }
      this.flags |= 2;
      cleanupEffect(this);
      prepareDeps(this);
      const prevEffect = activeSub;
      const prevShouldTrack = shouldTrack;
      activeSub = this;
      shouldTrack = true;
      try {
        return this.fn();
      } finally {
        if (false) {
          warn(
            "Active effect was not restored correctly - this is likely a Vue internal bug."
          );
        }
        cleanupDeps(this);
        activeSub = prevEffect;
        shouldTrack = prevShouldTrack;
        this.flags &= -3;
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let link = this.deps; link; link = link.nextDep) {
          removeSub(link);
        }
        this.deps = this.depsTail = void 0;
        cleanupEffect(this);
        this.onStop && this.onStop();
        this.flags &= -2;
      }
    }
    trigger() {
      if (this.flags & 64) {
        pausedQueueEffects.add(this);
      } else if (this.scheduler) {
        this.scheduler();
      } else {
        this.runIfDirty();
      }
    }
    /**
     * @internal
     */
    runIfDirty() {
      if (isDirty(this)) {
        this.run();
      }
    }
    get dirty() {
      return isDirty(this);
    }
  };
  var batchDepth = 0;
  var batchedSub;
  var batchedComputed;
  function batch(sub, isComputed = false) {
    sub.flags |= 8;
    if (isComputed) {
      sub.next = batchedComputed;
      batchedComputed = sub;
      return;
    }
    sub.next = batchedSub;
    batchedSub = sub;
  }
  function startBatch() {
    batchDepth++;
  }
  function endBatch() {
    if (--batchDepth > 0) {
      return;
    }
    if (batchedComputed) {
      let e = batchedComputed;
      batchedComputed = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        e = next;
      }
    }
    let error;
    while (batchedSub) {
      let e = batchedSub;
      batchedSub = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        if (e.flags & 1) {
          try {
            ;
            e.trigger();
          } catch (err) {
            if (!error) error = err;
          }
        }
        e = next;
      }
    }
    if (error) throw error;
  }
  function prepareDeps(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      link.version = -1;
      link.prevActiveLink = link.dep.activeLink;
      link.dep.activeLink = link;
    }
  }
  function cleanupDeps(sub) {
    let head;
    let tail = sub.depsTail;
    let link = tail;
    while (link) {
      const prev = link.prevDep;
      if (link.version === -1) {
        if (link === tail) tail = prev;
        removeSub(link);
        removeDep(link);
      } else {
        head = link;
      }
      link.dep.activeLink = link.prevActiveLink;
      link.prevActiveLink = void 0;
      link = prev;
    }
    sub.deps = head;
    sub.depsTail = tail;
  }
  function isDirty(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
        return true;
      }
    }
    if (sub._dirty) {
      return true;
    }
    return false;
  }
  function refreshComputed(computed3) {
    if (computed3.flags & 4 && !(computed3.flags & 16)) {
      return;
    }
    computed3.flags &= -17;
    if (computed3.globalVersion === globalVersion) {
      return;
    }
    computed3.globalVersion = globalVersion;
    if (!computed3.isSSR && computed3.flags & 128 && (!computed3.deps && !computed3._dirty || !isDirty(computed3))) {
      return;
    }
    computed3.flags |= 2;
    const dep = computed3.dep;
    const prevSub = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = computed3;
    shouldTrack = true;
    try {
      prepareDeps(computed3);
      const value = computed3.fn(computed3._value);
      if (dep.version === 0 || hasChanged(value, computed3._value)) {
        computed3.flags |= 128;
        computed3._value = value;
        dep.version++;
      }
    } catch (err) {
      dep.version++;
      throw err;
    } finally {
      activeSub = prevSub;
      shouldTrack = prevShouldTrack;
      cleanupDeps(computed3);
      computed3.flags &= -3;
    }
  }
  function removeSub(link, soft = false) {
    const { dep, prevSub, nextSub } = link;
    if (prevSub) {
      prevSub.nextSub = nextSub;
      link.prevSub = void 0;
    }
    if (nextSub) {
      nextSub.prevSub = prevSub;
      link.nextSub = void 0;
    }
    if (false) {
      dep.subsHead = nextSub;
    }
    if (dep.subs === link) {
      dep.subs = prevSub;
      if (!prevSub && dep.computed) {
        dep.computed.flags &= -5;
        for (let l = dep.computed.deps; l; l = l.nextDep) {
          removeSub(l, true);
        }
      }
    }
    if (!soft && !--dep.sc && dep.map) {
      dep.map.delete(dep.key);
    }
  }
  function removeDep(link) {
    const { prevDep, nextDep } = link;
    if (prevDep) {
      prevDep.nextDep = nextDep;
      link.prevDep = void 0;
    }
    if (nextDep) {
      nextDep.prevDep = prevDep;
      link.nextDep = void 0;
    }
  }
  var shouldTrack = true;
  var trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function cleanupEffect(e) {
    const { cleanup } = e;
    e.cleanup = void 0;
    if (cleanup) {
      const prevSub = activeSub;
      activeSub = void 0;
      try {
        cleanup();
      } finally {
        activeSub = prevSub;
      }
    }
  }
  var globalVersion = 0;
  var Link = class {
    constructor(sub, dep) {
      this.sub = sub;
      this.dep = dep;
      this.version = dep.version;
      this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  };
  var Dep = class {
    // TODO isolatedDeclarations "__v_skip"
    constructor(computed3) {
      this.computed = computed3;
      this.version = 0;
      this.activeLink = void 0;
      this.subs = void 0;
      this.map = void 0;
      this.key = void 0;
      this.sc = 0;
      this.__v_skip = true;
      if (false) {
        this.subsHead = void 0;
      }
    }
    track(debugInfo) {
      if (!activeSub || !shouldTrack || activeSub === this.computed) {
        return;
      }
      let link = this.activeLink;
      if (link === void 0 || link.sub !== activeSub) {
        link = this.activeLink = new Link(activeSub, this);
        if (!activeSub.deps) {
          activeSub.deps = activeSub.depsTail = link;
        } else {
          link.prevDep = activeSub.depsTail;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
        }
        addSub(link);
      } else if (link.version === -1) {
        link.version = this.version;
        if (link.nextDep) {
          const next = link.nextDep;
          next.prevDep = link.prevDep;
          if (link.prevDep) {
            link.prevDep.nextDep = next;
          }
          link.prevDep = activeSub.depsTail;
          link.nextDep = void 0;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
          if (activeSub.deps === link) {
            activeSub.deps = next;
          }
        }
      }
      if (false) {
        activeSub.onTrack(
          extend(
            {
              effect: activeSub
            },
            debugInfo
          )
        );
      }
      return link;
    }
    trigger(debugInfo) {
      this.version++;
      globalVersion++;
      this.notify(debugInfo);
    }
    notify(debugInfo) {
      startBatch();
      try {
        if (false) {
          for (let head = this.subsHead; head; head = head.nextSub) {
            if (head.sub.onTrigger && !(head.sub.flags & 8)) {
              head.sub.onTrigger(
                extend(
                  {
                    effect: head.sub
                  },
                  debugInfo
                )
              );
            }
          }
        }
        for (let link = this.subs; link; link = link.prevSub) {
          if (link.sub.notify()) {
            ;
            link.sub.dep.notify();
          }
        }
      } finally {
        endBatch();
      }
    }
  };
  function addSub(link) {
    link.dep.sc++;
    if (link.sub.flags & 4) {
      const computed3 = link.dep.computed;
      if (computed3 && !link.dep.subs) {
        computed3.flags |= 4 | 16;
        for (let l = computed3.deps; l; l = l.nextDep) {
          addSub(l);
        }
      }
      const currentTail = link.dep.subs;
      if (currentTail !== link) {
        link.prevSub = currentTail;
        if (currentTail) currentTail.nextSub = link;
      }
      if (false) {
        link.dep.subsHead = link;
      }
      link.dep.subs = link;
    }
  }
  var targetMap = /* @__PURE__ */ new WeakMap();
  var ITERATE_KEY = /* @__PURE__ */ Symbol(
    false ? "Object iterate" : ""
  );
  var MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol(
    false ? "Map keys iterate" : ""
  );
  var ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol(
    false ? "Array iterate" : ""
  );
  function track(target, type, key) {
    if (shouldTrack && activeSub) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = new Dep());
        dep.map = depsMap;
        dep.key = key;
      }
      if (false) {
        dep.track({
          target,
          type,
          key
        });
      } else {
        dep.track();
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      globalVersion++;
      return;
    }
    const run = (dep) => {
      if (dep) {
        if (false) {
          dep.trigger({
            target,
            type,
            key,
            newValue,
            oldValue,
            oldTarget
          });
        } else {
          dep.trigger();
        }
      }
    };
    startBatch();
    if (type === "clear") {
      depsMap.forEach(run);
    } else {
      const targetIsArray = isArray(target);
      const isArrayIndex = targetIsArray && isIntegerKey(key);
      if (targetIsArray && key === "length") {
        const newLength = Number(newValue);
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
            run(dep);
          }
        });
      } else {
        if (key !== void 0 || depsMap.has(void 0)) {
          run(depsMap.get(key));
        }
        if (isArrayIndex) {
          run(depsMap.get(ARRAY_ITERATE_KEY));
        }
        switch (type) {
          case "add":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (isArrayIndex) {
              run(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (isMap(target)) {
              run(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
    }
    endBatch();
  }
  function reactiveReadArray(array) {
    const raw = /* @__PURE__ */ toRaw(array);
    if (raw === array) return raw;
    track(raw, "iterate", ARRAY_ITERATE_KEY);
    if (/* @__PURE__ */ isShallow(array)) return raw;
    if (!/* @__PURE__ */ isReadonly(array)) return raw.map(toReactive);
    return /* @__PURE__ */ isReactive(array) ? raw.map((item) => toReadonly(toReactive(item))) : raw.map(toReadonly);
  }
  function shallowReadArray(arr) {
    track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
    return arr;
  }
  function toWrapped(target, item) {
    if (/* @__PURE__ */ isReadonly(target)) {
      return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
    }
    return toReactive(item);
  }
  var arrayInstrumentations = {
    __proto__: null,
    [Symbol.iterator]() {
      return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
    },
    concat(...args) {
      return reactiveReadArray(this).concat(
        ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
      );
    },
    entries() {
      return iterator(this, "entries", (value) => {
        value[1] = toWrapped(this, value[1]);
        return value;
      });
    },
    every(fn, thisArg) {
      return apply(this, "every", fn, thisArg, void 0, arguments);
    },
    filter(fn, thisArg) {
      return apply(
        this,
        "filter",
        fn,
        thisArg,
        (v) => v.map((item) => toWrapped(this, item)),
        arguments
      );
    },
    find(fn, thisArg) {
      return apply(
        this,
        "find",
        fn,
        thisArg,
        (item) => toWrapped(this, item),
        arguments
      );
    },
    findIndex(fn, thisArg) {
      return apply(this, "findIndex", fn, thisArg, void 0, arguments);
    },
    findLast(fn, thisArg) {
      return apply(
        this,
        "findLast",
        fn,
        thisArg,
        (item) => toWrapped(this, item),
        arguments
      );
    },
    findLastIndex(fn, thisArg) {
      return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
    },
    // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
    forEach(fn, thisArg) {
      return apply(this, "forEach", fn, thisArg, void 0, arguments);
    },
    includes(...args) {
      return searchProxy(this, "includes", args);
    },
    indexOf(...args) {
      return searchProxy(this, "indexOf", args);
    },
    join(separator) {
      return reactiveReadArray(this).join(separator);
    },
    // keys() iterator only reads `length`, no optimization required
    lastIndexOf(...args) {
      return searchProxy(this, "lastIndexOf", args);
    },
    map(fn, thisArg) {
      return apply(this, "map", fn, thisArg, void 0, arguments);
    },
    pop() {
      return noTracking(this, "pop");
    },
    push(...args) {
      return noTracking(this, "push", args);
    },
    reduce(fn, ...args) {
      return reduce(this, "reduce", fn, args);
    },
    reduceRight(fn, ...args) {
      return reduce(this, "reduceRight", fn, args);
    },
    shift() {
      return noTracking(this, "shift");
    },
    // slice could use ARRAY_ITERATE but also seems to beg for range tracking
    some(fn, thisArg) {
      return apply(this, "some", fn, thisArg, void 0, arguments);
    },
    splice(...args) {
      return noTracking(this, "splice", args);
    },
    toReversed() {
      return reactiveReadArray(this).toReversed();
    },
    toSorted(comparer) {
      return reactiveReadArray(this).toSorted(comparer);
    },
    toSpliced(...args) {
      return reactiveReadArray(this).toSpliced(...args);
    },
    unshift(...args) {
      return noTracking(this, "unshift", args);
    },
    values() {
      return iterator(this, "values", (item) => toWrapped(this, item));
    }
  };
  function iterator(self2, method, wrapValue) {
    const arr = shallowReadArray(self2);
    const iter = arr[method]();
    if (arr !== self2 && !/* @__PURE__ */ isShallow(self2)) {
      iter._next = iter.next;
      iter.next = () => {
        const result = iter._next();
        if (!result.done) {
          result.value = wrapValue(result.value);
        }
        return result;
      };
    }
    return iter;
  }
  var arrayProto = Array.prototype;
  function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
    const arr = shallowReadArray(self2);
    const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
    const methodFn = arr[method];
    if (methodFn !== arrayProto[method]) {
      const result2 = methodFn.apply(self2, args);
      return needsWrap ? toReactive(result2) : result2;
    }
    let wrappedFn = fn;
    if (arr !== self2) {
      if (needsWrap) {
        wrappedFn = function(item, index) {
          return fn.call(this, toWrapped(self2, item), index, self2);
        };
      } else if (fn.length > 2) {
        wrappedFn = function(item, index) {
          return fn.call(this, item, index, self2);
        };
      }
    }
    const result = methodFn.call(arr, wrappedFn, thisArg);
    return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
  }
  function reduce(self2, method, fn, args) {
    const arr = shallowReadArray(self2);
    const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
    let wrappedFn = fn;
    let wrapInitialAccumulator = false;
    if (arr !== self2) {
      if (needsWrap) {
        wrapInitialAccumulator = args.length === 0;
        wrappedFn = function(acc, item, index) {
          if (wrapInitialAccumulator) {
            wrapInitialAccumulator = false;
            acc = toWrapped(self2, acc);
          }
          return fn.call(this, acc, toWrapped(self2, item), index, self2);
        };
      } else if (fn.length > 3) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, item, index, self2);
        };
      }
    }
    const result = arr[method](wrappedFn, ...args);
    return wrapInitialAccumulator ? toWrapped(self2, result) : result;
  }
  function searchProxy(self2, method, args) {
    const arr = /* @__PURE__ */ toRaw(self2);
    track(arr, "iterate", ARRAY_ITERATE_KEY);
    const res = arr[method](...args);
    if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
      args[0] = /* @__PURE__ */ toRaw(args[0]);
      return arr[method](...args);
    }
    return res;
  }
  function noTracking(self2, method, args = []) {
    pauseTracking();
    startBatch();
    const res = (/* @__PURE__ */ toRaw(self2))[method].apply(self2, args);
    endBatch();
    resetTracking();
    return res;
  }
  var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  var builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  function hasOwnProperty2(key) {
    if (!isSymbol(key)) key = String(key);
    const obj = /* @__PURE__ */ toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  var BaseReactiveHandler = class {
    constructor(_isReadonly = false, _isShallow = false) {
      this._isReadonly = _isReadonly;
      this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      if (key === "__v_skip") return target["__v_skip"];
      const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return isShallow2;
      } else if (key === "__v_raw") {
        if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
          return target;
        }
        return;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly2) {
        let fn;
        if (targetIsArray && (fn = arrayInstrumentations[key])) {
          return fn;
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty2;
        }
      }
      const res = Reflect.get(
        target,
        key,
        // if this is a proxy wrapping a ref, return methods using the raw ref
        // as receiver so that we don't have to call `toRaw` on the ref in all
        // its class methods
        /* @__PURE__ */ isRef(target) ? target : receiver
      );
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (isShallow2) {
        return res;
      }
      if (/* @__PURE__ */ isRef(res)) {
        const value = targetIsArray && isIntegerKey(key) ? res : res.value;
        return isReadonly2 && isObject(value) ? /* @__PURE__ */ readonly(value) : value;
      }
      if (isObject(res)) {
        return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
      }
      return res;
    }
  };
  var MutableReactiveHandler = class extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(false, isShallow2);
    }
    set(target, key, value, receiver) {
      let oldValue = target[key];
      const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
      if (!this._isShallow) {
        const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
        if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
          oldValue = /* @__PURE__ */ toRaw(oldValue);
          value = /* @__PURE__ */ toRaw(value);
        }
        if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
          if (isOldValueReadonly) {
            if (false) {
              warn(
                `Set operation on key "${String(key)}" failed: target is readonly.`,
                target[key]
              );
            }
            return true;
          } else {
            oldValue.value = value;
            return true;
          }
        }
      }
      const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(
        target,
        key,
        value,
        /* @__PURE__ */ isRef(target) ? target : receiver
      );
      if (target === /* @__PURE__ */ toRaw(receiver) && result) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
      }
      return result;
    }
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      const oldValue = target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0, oldValue);
      }
      return result;
    }
    has(target, key) {
      const result = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    ownKeys(target) {
      track(
        target,
        "iterate",
        isArray(target) ? "length" : ITERATE_KEY
      );
      return Reflect.ownKeys(target);
    }
  };
  var ReadonlyReactiveHandler = class extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(true, isShallow2);
    }
    set(target, key) {
      if (false) {
        warn(
          `Set operation on key "${String(key)}" failed: target is readonly.`,
          target
        );
      }
      return true;
    }
    deleteProperty(target, key) {
      if (false) {
        warn(
          `Delete operation on key "${String(key)}" failed: target is readonly.`,
          target
        );
      }
      return true;
    }
  };
  var mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
  var readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
  var toShallow = (value) => value;
  var getProto = (v) => Reflect.getPrototypeOf(v);
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
      return extend(
        // inheriting all iterator properties
        Object.create(innerIterator),
        {
          // iterator protocol
          next() {
            const { value, done } = innerIterator.next();
            return done ? { value, done } : {
              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
              done
            };
          }
        }
      );
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      if (false) {
        const key = args[0] ? `on key "${args[0]}" ` : ``;
        warn(
          `${capitalize(type)} operation ${key}failed: target is readonly.`,
          /* @__PURE__ */ toRaw(this)
        );
      }
      return type === "delete" ? false : type === "clear" ? void 0 : this;
    };
  }
  function createInstrumentations(readonly2, shallow) {
    const instrumentations = {
      get(key) {
        const target = this["__v_raw"];
        const rawTarget = /* @__PURE__ */ toRaw(target);
        const rawKey = /* @__PURE__ */ toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has } = getProto(rawTarget);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        if (has.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      },
      get size() {
        const target = this["__v_raw"];
        !readonly2 && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
        return target.size;
      },
      has(key) {
        const target = this["__v_raw"];
        const rawTarget = /* @__PURE__ */ toRaw(target);
        const rawKey = /* @__PURE__ */ toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      },
      forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = /* @__PURE__ */ toRaw(target);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      }
    };
    extend(
      instrumentations,
      readonly2 ? {
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear")
      } : {
        add(value) {
          const target = /* @__PURE__ */ toRaw(this);
          const proto = getProto(target);
          const rawValue = /* @__PURE__ */ toRaw(value);
          const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
          const hadKey = proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue);
          if (!hadKey) {
            target.add(valueToAdd);
            trigger(target, "add", valueToAdd, valueToAdd);
          }
          return this;
        },
        set(key, value) {
          if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
            value = /* @__PURE__ */ toRaw(value);
          }
          const target = /* @__PURE__ */ toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = /* @__PURE__ */ toRaw(key);
            hadKey = has.call(target, key);
          } else if (false) {
            checkIdentityKeys(target, has, key);
          }
          const oldValue = get.call(target, key);
          target.set(key, value);
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value, oldValue);
          }
          return this;
        },
        delete(key) {
          const target = /* @__PURE__ */ toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = /* @__PURE__ */ toRaw(key);
            hadKey = has.call(target, key);
          } else if (false) {
            checkIdentityKeys(target, has, key);
          }
          const oldValue = get ? get.call(target, key) : void 0;
          const result = target.delete(key);
          if (hadKey) {
            trigger(target, "delete", key, void 0, oldValue);
          }
          return result;
        },
        clear() {
          const target = /* @__PURE__ */ toRaw(this);
          const hadItems = target.size !== 0;
          const oldTarget = false ? isMap(target) ? new Map(target) : new Set(target) : void 0;
          const result = target.clear();
          if (hadItems) {
            trigger(
              target,
              "clear",
              void 0,
              void 0,
              oldTarget
            );
          }
          return result;
        }
      }
    );
    const iteratorMethods = [
      "keys",
      "values",
      "entries",
      Symbol.iterator
    ];
    iteratorMethods.forEach((method) => {
      instrumentations[method] = createIterableMethod(method, readonly2, shallow);
    });
    return instrumentations;
  }
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = createInstrumentations(isReadonly2, shallow);
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(
        hasOwn(instrumentations, key) && key in target ? instrumentations : target,
        key,
        receiver
      );
    };
  }
  var mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  var readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  var readonlyMap = /* @__PURE__ */ new WeakMap();
  var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  // @__NO_SIDE_EFFECTS__
  function reactive(target) {
    if (/* @__PURE__ */ isReadonly(target)) {
      return target;
    }
    return createReactiveObject(
      target,
      false,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  // @__NO_SIDE_EFFECTS__
  function readonly(target) {
    return createReactiveObject(
      target,
      true,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      if (false) {
        warn(
          `value cannot be made ${isReadonly2 ? "readonly" : "reactive"}: ${String(
            target
          )}`
        );
      }
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    if (target["__v_skip"] || !Object.isExtensible(target)) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const targetType = targetTypeMap(toRawType(target));
    if (targetType === 0) {
      return target;
    }
    const proxy = new Proxy(
      target,
      targetType === 2 ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy);
    return proxy;
  }
  // @__NO_SIDE_EFFECTS__
  function isReactive(value) {
    if (/* @__PURE__ */ isReadonly(value)) {
      return /* @__PURE__ */ isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  // @__NO_SIDE_EFFECTS__
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  // @__NO_SIDE_EFFECTS__
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  // @__NO_SIDE_EFFECTS__
  function isProxy(value) {
    return value ? !!value["__v_raw"] : false;
  }
  // @__NO_SIDE_EFFECTS__
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? /* @__PURE__ */ toRaw(raw) : observed;
  }
  var toReactive = (value) => isObject(value) ? /* @__PURE__ */ reactive(value) : value;
  var toReadonly = (value) => isObject(value) ? /* @__PURE__ */ readonly(value) : value;
  // @__NO_SIDE_EFFECTS__
  function isRef(r) {
    return r ? r["__v_isRef"] === true : false;
  }
  // @__NO_SIDE_EFFECTS__
  function ref(value) {
    return createRef(value, false);
  }
  function createRef(rawValue, shallow) {
    if (/* @__PURE__ */ isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  var RefImpl = class {
    constructor(value, isShallow2) {
      this.dep = new Dep();
      this["__v_isRef"] = true;
      this["__v_isShallow"] = false;
      this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
      this._value = isShallow2 ? value : toReactive(value);
      this["__v_isShallow"] = isShallow2;
    }
    get value() {
      if (false) {
        this.dep.track({
          target: this,
          type: "get",
          key: "value"
        });
      } else {
        this.dep.track();
      }
      return this._value;
    }
    set value(newValue) {
      const oldValue = this._rawValue;
      const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
      newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
      if (hasChanged(newValue, oldValue)) {
        this._rawValue = newValue;
        this._value = useDirectValue ? newValue : toReactive(newValue);
        if (false) {
          this.dep.trigger({
            target: this,
            type: "set",
            key: "value",
            newValue,
            oldValue
          });
        } else {
          this.dep.trigger();
        }
      }
    }
  };
  var INITIAL_WATCHER_VALUE = {};
  var cleanupMap = /* @__PURE__ */ new WeakMap();
  var activeWatcher = void 0;
  function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
    if (owner) {
      let cleanups = cleanupMap.get(owner);
      if (!cleanups) cleanupMap.set(owner, cleanups = []);
      cleanups.push(cleanupFn);
    } else if (false) {
      warn(
        `onWatcherCleanup() was called when there was no active watcher to associate with.`
      );
    }
  }
  function watch2(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, once, scheduler, augmentJob, call } = options;
    const warnInvalidSource = (s) => {
      (options.onWarn || warn)(
        `Invalid watch source: `,
        s,
        `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
      );
    };
    const reactiveGetter = (source2) => {
      if (deep) return source2;
      if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0)
        return traverse(source2, 1);
      return traverse(source2);
    };
    let effect2;
    let getter;
    let cleanup;
    let boundCleanup;
    let forceTrigger = false;
    let isMultiSource = false;
    if (/* @__PURE__ */ isRef(source)) {
      getter = () => source.value;
      forceTrigger = /* @__PURE__ */ isShallow(source);
    } else if (/* @__PURE__ */ isReactive(source)) {
      getter = () => reactiveGetter(source);
      forceTrigger = true;
    } else if (isArray(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
      getter = () => source.map((s) => {
        if (/* @__PURE__ */ isRef(s)) {
          return s.value;
        } else if (/* @__PURE__ */ isReactive(s)) {
          return reactiveGetter(s);
        } else if (isFunction(s)) {
          return call ? call(s, 2) : s();
        } else {
        }
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = call ? () => call(source, 2) : source;
      } else {
        getter = () => {
          if (cleanup) {
            pauseTracking();
            try {
              cleanup();
            } finally {
              resetTracking();
            }
          }
          const currentEffect = activeWatcher;
          activeWatcher = effect2;
          try {
            return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
          } finally {
            activeWatcher = currentEffect;
          }
        };
      }
    } else {
      getter = NOOP;
    }
    if (cb && deep) {
      const baseGetter = getter;
      const depth = deep === true ? Infinity : deep;
      getter = () => traverse(baseGetter(), depth);
    }
    const scope = getCurrentScope();
    const watchHandle = () => {
      effect2.stop();
      if (scope && scope.active) {
        remove(scope.effects, effect2);
      }
    };
    if (once && cb) {
      const _cb = cb;
      cb = (...args) => {
        const res = _cb(...args);
        watchHandle();
        return res;
      };
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = (immediateFirstRun) => {
      if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
        return;
      }
      if (cb) {
        const newValue = effect2.run();
        if (immediateFirstRun || deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
          if (cleanup) {
            cleanup();
          }
          const currentWatcher = activeWatcher;
          activeWatcher = effect2;
          try {
            const args = [
              newValue,
              // pass undefined as the old value when it's changed for the first time
              oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
              boundCleanup
            ];
            oldValue = newValue;
            call ? call(cb, 3, args) : (
              // @ts-expect-error
              cb(...args)
            );
          } finally {
            activeWatcher = currentWatcher;
          }
        }
      } else {
        effect2.run();
      }
    };
    if (augmentJob) {
      augmentJob(job);
    }
    effect2 = new ReactiveEffect(getter);
    effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
    boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
    cleanup = effect2.onStop = () => {
      const cleanups = cleanupMap.get(effect2);
      if (cleanups) {
        if (call) {
          call(cleanups, 4);
        } else {
          for (const cleanup2 of cleanups) cleanup2();
        }
        cleanupMap.delete(effect2);
      }
    };
    if (false) {
      effect2.onTrack = options.onTrack;
      effect2.onTrigger = options.onTrigger;
    }
    if (cb) {
      if (immediate) {
        job(true);
      } else {
        oldValue = effect2.run();
      }
    } else if (scheduler) {
      scheduler(job.bind(null, true), true);
    } else {
      effect2.run();
    }
    watchHandle.pause = effect2.pause.bind(effect2);
    watchHandle.resume = effect2.resume.bind(effect2);
    watchHandle.stop = watchHandle;
    return watchHandle;
  }
  function traverse(value, depth = Infinity, seen) {
    if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Map();
    if ((seen.get(value) || 0) >= depth) {
      return value;
    }
    seen.set(value, depth);
    depth--;
    if (/* @__PURE__ */ isRef(value)) {
      traverse(value.value, depth, seen);
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    } else if (isPlainObject(value)) {
      for (const key in value) {
        traverse(value[key], depth, seen);
      }
      for (const key of Object.getOwnPropertySymbols(value)) {
        if (Object.prototype.propertyIsEnumerable.call(value, key)) {
          traverse(value[key], depth, seen);
        }
      }
    }
    return value;
  }

  // ../Scene-Full/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
  function callWithErrorHandling(fn, instance, type, args) {
    try {
      return args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    if (isArray(fn)) {
      const values = [];
      for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
      return values;
    } else if (false) {
      warn$1(
        `Invalid value type passed to callWithAsyncErrorHandling(): ${typeof fn}`
      );
    }
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = false ? ErrorTypeStrings$1[type] : `https://vuejs.org/error-reference/#runtime-${type}`;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      if (errorHandler) {
        pauseTracking();
        callWithErrorHandling(errorHandler, null, 10, [
          err,
          exposedInstance,
          errorInfo
        ]);
        resetTracking();
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
  }
  function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
    if (false) {
      const info = ErrorTypeStrings$1[type];
      if (contextVNode) {
        pushWarningContext(contextVNode);
      }
      warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
      if (contextVNode) {
        popWarningContext();
      }
      if (throwInDev) {
        throw err;
      } else {
        console.error(err);
      }
    } else if (throwInProd) {
      throw err;
    } else {
      console.error(err);
    }
  }
  var queue = [];
  var flushIndex = -1;
  var pendingPostFlushCbs = [];
  var activePostFlushCbs = null;
  var postFlushIndex = 0;
  var resolvedPromise = /* @__PURE__ */ Promise.resolve();
  var currentFlushPromise = null;
  function nextTick(fn) {
    const p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(this ? fn.bind(this) : fn) : p;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJob = queue[middle];
      const middleJobId = getId(middleJob);
      if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    return start;
  }
  function queueJob(job) {
    if (!(job.flags & 1)) {
      const jobId = getId(job);
      const lastJob = queue[queue.length - 1];
      if (!lastJob || // fast path when the job id is larger than the tail
      !(job.flags & 2) && jobId >= getId(lastJob)) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(jobId), 0, job);
      }
      job.flags |= 1;
      queueFlush();
    }
  }
  function queueFlush() {
    if (!currentFlushPromise) {
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray(cb)) {
      if (activePostFlushCbs && cb.id === -1) {
        activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
      } else if (!(cb.flags & 1)) {
        pendingPostFlushCbs.push(cb);
        cb.flags |= 1;
      }
    } else {
      for (let i = 0; i < cb.length; i++) {
        pendingPostFlushCbs.push(cb[i]);
      }
    }
    queueFlush();
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)].sort(
        (a, b) => getId(a) - getId(b)
      );
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        for (let i = 0; i < deduped.length; i++) {
          activePostFlushCbs.push(deduped[i]);
        }
        return;
      }
      activePostFlushCbs = deduped;
      if (false) {
        seen = seen || /* @__PURE__ */ new Map();
      }
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        const cb = activePostFlushCbs[postFlushIndex];
        if (false) {
          continue;
        }
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        if (!(cb.flags & 8)) cb();
        cb.flags &= -2;
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  var getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
  function flushJobs(seen) {
    if (false) {
      seen = seen || /* @__PURE__ */ new Map();
    }
    const check = false ? (job) => checkRecursiveUpdates(seen, job) : NOOP;
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && !(job.flags & 8)) {
          if (false) {
            continue;
          }
          if (job.flags & 4) {
            job.flags &= ~1;
          }
          callWithErrorHandling(
            job,
            job.i,
            job.i ? 15 : 14
          );
          if (!(job.flags & 4)) {
            job.flags &= ~1;
          }
        }
      }
    } finally {
      for (; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job) {
          job.flags &= -2;
        }
      }
      flushIndex = -1;
      queue.length = 0;
      flushPostFlushCbs(seen);
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs(seen);
      }
    }
  }
  if (false) {
    getGlobalThis().__VUE_HMR_RUNTIME__ = {
      createRecord: tryWrap(createRecord),
      rerender: tryWrap(rerender),
      reload: tryWrap(reload)
    };
  }
  var currentRenderingInstance = null;
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = getCurrentInstance();
    if (instance || currentApp) {
      let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else if (false) {
        warn$1(`injection "${String(key)}" not found.`);
      }
    } else if (false) {
      warn$1(`inject() can only be used inside setup() or functional components.`);
    }
  }
  var ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
  var useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      if (!ctx) {
      }
      return ctx;
    }
  };
  function watch(source, cb, options) {
    if (false) {
      warn$1(
        `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
      );
    }
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, flush, once } = options;
    if (false) {
      if (immediate !== void 0) {
        warn$1(
          `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
      if (deep !== void 0) {
        warn$1(
          `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
      if (once !== void 0) {
        warn$1(
          `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
    }
    const baseWatchOptions = extend({}, options);
    if (false) baseWatchOptions.onWarn = warn$1;
    const runsImmediately = cb && immediate || !cb && flush !== "post";
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      if (flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else if (!runsImmediately) {
        const watchStopHandle = () => {
        };
        watchStopHandle.stop = NOOP;
        watchStopHandle.resume = NOOP;
        watchStopHandle.pause = NOOP;
        return watchStopHandle;
      }
    }
    const instance = currentInstance;
    baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
    let isPre = false;
    if (flush === "post") {
      baseWatchOptions.scheduler = (job) => {
        queuePostRenderEffect(job, instance && instance.suspense);
      };
    } else if (flush !== "sync") {
      isPre = true;
      baseWatchOptions.scheduler = (job, isFirstRun) => {
        if (isFirstRun) {
          job();
        } else {
          queueJob(job);
        }
      };
    }
    baseWatchOptions.augmentJob = (job) => {
      if (cb) {
        job.flags |= 4;
      }
      if (isPre) {
        job.flags |= 2;
        if (instance) {
          job.id = instance.uid;
          job.i = instance;
        }
      }
    };
    const watchHandle = watch2(source, cb, baseWatchOptions);
    if (isInSSRComponentSetup) {
      if (ssrCleanup) {
        ssrCleanup.push(watchHandle);
      } else if (runsImmediately) {
        watchHandle();
      }
    }
    return watchHandle;
  }
  var requestIdleCallback = getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
  var cancelIdleCallback = getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        pauseTracking();
        const reset = setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        reset();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    } else if (false) {
      const apiName = toHandlerKey(ErrorTypeStrings$1[type].replace(/ hook$/, ""));
      warn$1(
        `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
      );
    }
  }
  var createHook = (lifecycle) => (hook, target = currentInstance) => {
    if (!isInSSRComponentSetup || lifecycle === "sp") {
      injectHook(lifecycle, (...args) => hook(...args), target);
    }
  };
  var onBeforeMount = createHook("bm");
  var onMounted = createHook("m");
  var onBeforeUpdate = createHook(
    "bu"
  );
  var onUpdated = createHook("u");
  var onBeforeUnmount = createHook(
    "bum"
  );
  var onUnmounted = createHook("um");
  var onServerPrefetch = createHook(
    "sp"
  );
  var onRenderTriggered = createHook("rtg");
  var onRenderTracked = createHook("rtc");
  if (false) {
    PublicInstanceProxyHandlers.ownKeys = (target) => {
      warn$1(
        `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
      );
      return Reflect.ownKeys(target);
    };
  }
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  var currentApp = null;
  var queuePostRenderEffect = queueEffectWithSuspense;
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  var emptyAppContext = createAppContext();
  var currentInstance = null;
  var getCurrentInstance = () => currentInstance || currentRenderingInstance;
  var internalSetCurrentInstance;
  var setInSSRSetupState;
  {
    const g = getGlobalThis();
    const registerGlobalSetter = (key, setter) => {
      let setters;
      if (!(setters = g[key])) setters = g[key] = [];
      setters.push(setter);
      return (v) => {
        if (setters.length > 1) setters.forEach((set) => set(v));
        else setters[0](v);
      };
    };
    internalSetCurrentInstance = registerGlobalSetter(
      `__VUE_INSTANCE_SETTERS__`,
      (v) => currentInstance = v
    );
    setInSSRSetupState = registerGlobalSetter(
      `__VUE_SSR_SETTERS__`,
      (v) => isInSSRComponentSetup = v
    );
  }
  var setCurrentInstance = (instance) => {
    const prev = currentInstance;
    internalSetCurrentInstance(instance);
    instance.scope.on();
    return () => {
      instance.scope.off();
      internalSetCurrentInstance(prev);
    };
  };
  var isInSSRComponentSetup = false;

  // ../Scene-Full/node_modules/vue/dist/vue.runtime.esm-bundler.js
  if (false) {
    initDev();
  }

  // source/storage.ts
  var api = globalThis.browser || globalThis.chrome;
  var clone = (v) => JSON.parse(JSON.stringify(v));
  function merge(defaults, value) {
    if (Array.isArray(defaults)) return Array.isArray(value) ? clone(value) : clone(defaults);
    if (defaults && typeof defaults === "object") return Object.fromEntries(Object.entries(defaults).map(([k, v]) => [k, merge(v, value?.[k])]));
    return typeof value === typeof defaults && value !== null ? value : defaults;
  }
  function differences(a, b, path = [], out = []) {
    if (JSON.stringify(a) === JSON.stringify(b)) return out;
    if (b && typeof b === "object" && !Array.isArray(b)) {
      for (const key of Object.keys(b)) differences(a?.[key], b[key], [...path, key], out);
    } else out.push({ path, value: b, delta: path[0] === "Statistics" ? Number(b) - Number(a || 0) : void 0 });
    return out;
  }
  function useBrowserSyncStorage(key, defaults, mergeValue = true) {
    return useBrowserLocalStorage(key, defaults, mergeValue);
  }
  function useBrowserLocalStorage(key, defaults, mergeValue = true) {
    const data = ref(clone(defaults));
    let previous = clone(defaults), updating = true;
    const mask = (value, enabled) => {
      if (key !== "settings" || enabled) return value;
      const result = clone(value);
      for (const group of Object.values(result)) if (group && typeof group === "object") {
        for (const k of Object.keys(group)) if (typeof group[k] === "boolean") group[k] = false;
      }
      return result;
    };
    const promise3 = (async () => {
      const stored = await api.storage.local.get([key, "sceneEnabled"]);
      data.value = mask(mergeValue ? merge(defaults, stored[key]) : stored[key] ?? clone(defaults), stored.sceneEnabled !== false);
      previous = clone(data.value);
      await nextTick();
      updating = false;
    })();
    watch(data, async (value) => {
      if (updating) return;
      const next = clone(toRaw(value));
      const patches = differences(previous, next);
      previous = next;
      if (!patches.length) return;
      try {
        const r = await api.runtime.sendMessage({ type: "engineWrite", key, patches });
        if (!r?.ok) console.warn("Scene: could not save changes");
      } catch (e) {
        console.warn("Scene storage", e);
      }
    }, { deep: true, flush: "post" });
    api.storage.onChanged.addListener(async (changes, area) => {
      if (area !== "local" || !changes[key] && !changes.sceneEnabled) return;
      updating = true;
      const stored = await api.storage.local.get([key, "sceneEnabled"]);
      data.value = mask(mergeValue ? merge(defaults, stored[key]) : stored[key] ?? clone(defaults), stored.sceneEnabled !== false);
      previous = clone(data.value);
      await nextTick();
      updating = false;
    });
    return { data, promise: promise3 };
  }

  // source/defaults.ts
  var defaultSettings = {
    Amazon: {
      skipIntro: true,
      skipCredits: true,
      watchCredits: false,
      selfAd: true,
      skipAd: true,
      speedSlider: true,
      filterPaid: false,
      showRating: true,
      xray: true,
      improveUI: true,
      hideTitles: true
    },
    Netflix: {
      skipIntro: true,
      skipRecap: true,
      skipCredits: true,
      watchCredits: false,
      skipBlocked: true,
      skipAd: true,
      speedSlider: true,
      profile: true,
      showRating: true,
      removeGames: true,
      hideTitles: true
    },
    Disney: {
      skipIntro: true,
      skipCredits: true,
      watchCredits: false,
      skipAd: true,
      speedSlider: true,
      showRating: true,
      hideTitles: true
    },
    Crunchyroll: {
      skipIntro: true,
      skipCredits: true,
      skipAfterCredits: false,
      speedSlider: true,
      releaseCalendar: true,
      profile: true,
      bigPlayer: true,
      filterQueued: true,
      dubLanguage: "none",
      filterDuplicates: true,
      showRating: true
    },
    HBO: {
      skipIntro: true,
      skipCredits: true,
      watchCredits: false,
      speedSlider: true,
      showRating: true
    },
    Paramount: {
      skipIntro: true,
      skipCredits: true,
      watchCredits: false,
      speedSlider: true,
      showRating: true,
      skipAd: true
    },
    Video: {
      playOnFullScreen: true,
      epilepsy: false,
      userAgent: true,
      doubleClick: true,
      scrollVolume: true,
      showYear: false,
      dimLowRatings: false
    },
    Statistics: {
      AmazonAdTimeSkipped: 0,
      NetflixAdTimeSkipped: 0,
      DisneyAdTimeSkipped: 0,
      ParamountAdTimeSkipped: 0,
      IntroTimeSkipped: 0,
      RecapTimeSkipped: 0,
      SegmentsSkipped: 0
    },
    General: {
      Crunchyroll_profilePicture: "",
      profileName: "",
      profilePicture: "",
      sliderSteps: 1,
      sliderMin: 5,
      sliderMax: 20,
      GCdate: "2024-01-01",
      MALGCdate: "2024-01-01",
      Crunchyroll_skipTimeout: 0,
      RatingThresholds: [
        { color: "red" /* Red */, value: 5.5 },
        { color: "rgb(245, 197, 24)" /* Yellow */, value: 7 },
        { color: "rgb(0, 166, 0)" /* Green */, value: 10 }
      ]
    }
  };

  // source/inject.ts
  var browser = globalThis.browser || globalThis.chrome;

  // source/bridge.ts
  var api2 = globalThis.browser || globalThis.chrome;
  async function sendMessage(type, data, destination) {
    const result = await api2.runtime.sendMessage({ type: "engine", action: type, data });
    if (!result?.ok) return { error: result?.error || "Scene \uC5F0\uACB0 \uC2E4\uD328" };
    return result.value;
  }

  // source/engine/shared-functions.ts
  console.log("shared-functions loaded");
  var { data: settings, promise } = useBrowserSyncStorage("settings", defaultSettings);
  var { data: hiddenTitles, promise: hiddenTitlesPromise } = useBrowserLocalStorage(
    "hiddenTitles",
    {},
    false
  );
  var date = /* @__PURE__ */ new Date();
  var today = date.toISOString().split("T")[0];
  var ua = navigator.userAgent;
  var isMobile = /mobile|streamingEnhanced/i.test(ua);
  var url = globalThis.location.href;
  var hostname = globalThis.location.hostname;
  var title = document.title;
  var isPrimeVideo = /amazon|primevideo/i.test(hostname) && (/video/i.test(title) || /video/i.test(url));
  var isNetflix = /netflix/i.test(hostname);
  var isDisney = /disneyplus|starplus/i.test(hostname);
  var isHotstar = /hotstar|jiostar|jiocinema/i.test(hostname);
  var isHBO = /max.com/i.test(hostname);
  var isParamount = /paramount/i.test(hostname) || /paramountplus/i.test(hostname);
  var htmlLang = document.documentElement.lang;
  var AmazonVideoClass = ".dv-player-fullscreen video";
  var DBCache = {};
  async function startSharedFunctions(platform) {
    if (platform == "amazon" /* Amazon */) isPrimeVideo = true;
    if (platform == "netflix" /* Netflix */) isNetflix = true;
    if (platform == "disney" /* Disney */) isDisney = true;
    if (platform == "hotstar" /* Hotstar */) isHotstar = true;
    if (platform == "hbo" /* HBO */) isHBO = true;
    if (platform == "paramount" /* Paramount */) isParamount = true;
    await promise;
    if (isNetflix || isPrimeVideo) {
      await hiddenTitlesPromise;
      console.log("hiddenTitles", hiddenTitles.value);
    }
    if (settings.value.Video.playOnFullScreen) startPlayOnFullScreen();
    getDBCache();
  }
  async function getDBCache() {
    const result = await browser.storage.local.get("DBCache");
    DBCache = result?.DBCache;
    if (typeof DBCache !== "object") {
      console.log("DBCache not found, creating new one", DBCache);
      try {
        await browser.storage.local.set({ DBCache: {} });
      } catch (error) {
        console.log(error);
      }
      DBCache = {};
    }
    if (isNetflix) {
      if (settings.value.Netflix?.showRating || settings.value.Netflix?.hideTitles)
        startShowRatingInterval(settings.value.Netflix?.showRating, settings.value.Netflix?.hideTitles);
    } else if (isDisney || isHotstar) {
      if (settings.value.Disney?.showRating || settings.value.Disney?.hideTitles)
        startShowRatingInterval(settings.value.Disney?.showRating, settings.value.Disney?.hideTitles);
    } else if (isPrimeVideo) {
      if (settings.value.Amazon?.showRating || settings.value.Amazon?.hideTitles)
        startShowRatingInterval(settings.value.Amazon?.showRating, settings.value.Amazon?.hideTitles);
    } else if (isHBO && settings.value.HBO?.showRating) startShowRatingInterval();
    else if (isParamount && settings.value.Paramount?.showRating) startShowRatingInterval();
    if (getDiffInDays(settings.value.General.GCdate, date) >= GCdiff) garbageCollection();
    browser.storage.onChanged.addListener(function(changes, areaName) {
      if (areaName === "local" && changes?.DBCache) DBCache = changes.DBCache.newValue;
    });
  }
  async function setDBCache() {
    const size = new TextEncoder().encode(JSON.stringify(DBCache)).length;
    const kiloBytes = size / 1024;
    const megaBytes = kiloBytes / 1024;
    if (megaBytes < 5) {
      console.log("updateDBCache size:", megaBytes.toFixed(4) + " MB");
      await browser.storage.local.set({ DBCache });
    } else {
      console.log("DBCache cleared", megaBytes);
      DBCache = {};
      await browser.storage.local.set({ DBCache });
    }
  }
  var GCdiff = 30;
  async function garbageCollection() {
    console.log("garbageCollection started, deleting old ratings:");
    const keys = Object.keys(DBCache);
    for (const key of keys) {
      if (getDiffInDays(DBCache[key].date, date) >= GCdiff || DBCache[key].db != "tmdb") {
        console.log(DBCache[key].date, key);
        delete DBCache[key];
      }
    }
    settings.value.General.GCdate = today;
    setDBCache();
  }
  function createSlider(video, videoSpeed2, position, sliderStyle, speedStyle, divStyle = "", cleanupTarget = null) {
    videoSpeed2.value = videoSpeed2.value || video.playbackRate;
    const slider = document.createElement("input");
    slider.id = "videoSpeedSlider";
    slider.type = "range";
    slider.min = settings.value.General.sliderMin.toString();
    slider.max = settings.value.General.sliderMax.toString();
    slider.value = (videoSpeed2.value * 10).toString();
    slider.step = settings.value.General.sliderSteps.toString();
    slider.style.cssText = sliderStyle;
    const speed = document.createElement("p");
    speed.id = "videoSpeed";
    speed.textContent = videoSpeed2.value ? videoSpeed2.value.toFixed(1) + "x" : "1.0x";
    watch(videoSpeed2, (newValue) => {
      speed.textContent = newValue.toFixed(1) + "x";
      slider.value = (newValue * 10).toString();
    });
    speed.style.cssText = speedStyle;
    if (divStyle) {
      const div = document.createElement("div");
      div.style.cssText = divStyle;
      div.appendChild(slider);
      div.appendChild(speed);
      position.prepend(div);
    } else position.prepend(slider, speed);
    if (cleanupTarget) {
      const cleanup = () => {
        if (divStyle) {
          slider.parentElement?.remove();
        } else {
          slider.remove();
          speed.remove();
        }
      };
      const cleanupObserver = new MutationObserver(() => {
        if (!cleanupTarget.isConnected) {
          cleanup();
          cleanupObserver.disconnect();
        }
      });
      cleanupObserver.observe(document.body ?? document.documentElement, { childList: true, subtree: true });
      if (!cleanupTarget.isConnected) {
        cleanup();
        cleanupObserver.disconnect();
      }
    }
    if (videoSpeed2.value) video.playbackRate = videoSpeed2.value;
    speed.onclick = function(event) {
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
      slider.style.display = slider.style.display === "block" ? "none" : "block";
    };
    slider.onclick = function(event) {
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    slider.oninput = function(event) {
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
      const sliderValue = Number.parseFloat(slider.value);
      speed.textContent = (sliderValue / 10).toFixed(1) + "x";
      video.playbackRate = sliderValue / 10;
      videoSpeed2.value = sliderValue / 10;
    };
    return { slider, speed };
  }
  async function getMovieInfo(title2, card, media_type = null, year = null) {
    const locale = htmlLang || navigator?.language || "en-US";
    const queryType = media_type ?? "multi";
    let url3 = `https://api.themoviedb.org/3/search/${queryType}?query=${encodeURIComponent(title2)}&include_adult=false&language=${locale}&page=1`;
    if (year) url3 += `&year=${year}`;
    const data = await sendMessage("fetch", { url: url3, type: "tmdb" }, "background");
    if (data != void 0) {
      if (data?.results) data.results = data.results?.filter((item) => item.media_type?.toLowerCase() !== "person");
      const movie = data?.results?.[0];
      const compiledData = {
        id: movie?.id,
        media_type: queryType == "multi" ? movie?.media_type : queryType,
        score: movie?.vote_average,
        vote_count: movie?.vote_count,
        release_date: movie?.release_date || movie?.first_air_date,
        title: movie?.title || movie?.original_title || movie?.name || movie?.original_name,
        poster_path: movie?.poster_path ?? null,
        date: today,
        db: "tmdb"
      };
      DBCache[title2] = compiledData;
      setRatingOnCard(card, compiledData, title2);
    }
  }
  var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g;
  function showRating() {
    if (isDisney) {
      url = globalThis.location.href;
      if (url.includes("search")) return false;
      if (url.includes("entity")) {
        const SelectedTab = document.querySelector('[aria-selected="true"]');
        return uuidRegex.test(SelectedTab?.id?.split("_control")?.[0] ?? "") && SelectedTab?.getAttribute("aria-label") != "EXTRAS";
      }
      return true;
    } else if (isPrimeVideo) {
      if (globalThis.location.href.includes("detail")) {
        return document.querySelector('[data-testid="btf-related-tab"]')?.getAttribute("tabIndex") == "0";
      }
      return true;
    } else return true;
  }
  async function startShowRatingInterval(optionShowRating = true, optionHideTitles = false) {
    if (showRating()) addRating(optionShowRating, optionHideTitles);
    const RatingInterval = setInterval(function() {
      if (isNetflix) {
        optionShowRating = settings.value.Netflix?.showRating;
        optionHideTitles = settings.value.Netflix?.hideTitles;
      } else if (isDisney || isHotstar) {
        optionShowRating = settings.value.Disney?.showRating;
        optionHideTitles = settings.value.Disney?.hideTitles;
      } else if (isPrimeVideo) {
        optionShowRating = settings.value.Amazon?.showRating;
        optionHideTitles = settings.value.Amazon?.hideTitles;
      }
      if (isNetflix && !(settings.value.Netflix?.showRating || settings.value.Netflix?.hideTitles) || isPrimeVideo && !(settings.value.Amazon?.showRating || settings.value.Amazon?.hideTitles) || (isDisney || isHotstar) && !(settings.value.Disney?.showRating || settings.value.Disney?.hideTitles) || isHBO && !settings.value.HBO?.showRating || isParamount && !settings.value.Paramount?.showRating) {
        console.log("stopped adding Rating");
        clearInterval(RatingInterval);
        return;
      }
      if (showRating()) addRating(optionShowRating, optionHideTitles);
    }, 1e3);
  }
  function getDiffInDays(firstDate, secondDate) {
    if (!firstDate || !secondDate) return 31;
    return Math.round(Math.abs(new Date(secondDate).getTime() - new Date(firstDate).getTime()) / (1e3 * 60 * 60 * 24));
  }
  function useDBCache(title2, card, media_type) {
    if (!DBCache[title2]?.date) DBCache[title2].date = today;
    const vote_count = DBCache[title2]?.vote_count || 100;
    const diffInReleaseDate = (
      // vote count is under 80 inaccurate rating
      vote_count < 100 && // did not refresh rating in the last 0 days
      getDiffInDays(DBCache[title2].date, date) > 1 && // release date is in the last 50 days after not many people will
      getDiffInDays(DBCache[title2]?.release_date, date) <= 50
    );
    if (getDiffInDays(DBCache[title2].date, date) >= GCdiff || diffInReleaseDate) {
      if (diffInReleaseDate)
        console.log(
          "update recent movie:",
          title2,
          ",refresh:",
          getDiffInDays(DBCache[title2].date, date),
          ",Age:",
          getDiffInDays(DBCache[title2]?.release_date, date),
          "Vote count:",
          vote_count
        );
      else console.log("update old rating:", title2, ",Age:", getDiffInDays(DBCache[title2].date, date));
      getMovieInfo(title2, card, media_type);
    } else {
      setRatingOnCard(card, DBCache[title2], title2);
    }
  }
  function Amazon_getMediaType(type) {
    if (!type) return null;
    if (type.toLowerCase().includes("tv")) return "tv";
    if (type.toLowerCase().includes("movie")) return "movie";
    return null;
  }
  function getAllTitleCardsTypes() {
    let AllTitleCardsTypes = [];
    if (isNetflix)
      AllTitleCardsTypes = [
        document.querySelectorAll(
          'a[data-uia="standard-card"]:not(.imdb), a[data-uia="progress-card"]:not(.imdb), a[data-uia="ranked-card"]:not(.imdb)'
        )
      ];
    else if (isDisney)
      AllTitleCardsTypes = [document.querySelectorAll("a[data-testid='set-item']:not([href^='/browse/page']):not(.imdb)")];
    else if (isHotstar)
      AllTitleCardsTypes = [
        document.querySelectorAll(
          "[data-testid='tray-card-default']:not(.imdb), [data-testid='tray-horizontal-card-hover']:not(.imdb)"
        )
      ];
    else if (isHBO) AllTitleCardsTypes = [document.querySelectorAll("a[class*='StyledTileLinkNormal-']:not(.imdb)")];
    else if (isParamount)
      AllTitleCardsTypes = [document.querySelectorAll("a[href*='/shows']:not(.imdb), a[href*='/movies']:not(.imdb)")];
    else if (isPrimeVideo)
      AllTitleCardsTypes = [
        document.querySelectorAll(
          "li article[data-card-title]:not([data-card-entity-type='EVENT']):not([data-card-title='Live-TV']):not(:has(#rating))"
        ),
        document.querySelectorAll("article[data-testid*='-card']:not(:has(#rating))")
      ];
    return AllTitleCardsTypes;
  }
  function isElementVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const visible = (
      // el.checkVisibility({ checkOpacity: true, visibilityProperty: true, contentVisibilityAuto: true }) &&
      rect.bottom > 0 && rect.right > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.left < (window.innerWidth || document.documentElement.clientWidth)
    );
    return visible;
  }
  async function addRating(showRating2, optionHideTitles) {
    url = globalThis.location.href;
    const AllTitleCardsTypes = getAllTitleCardsTypes();
    let lastTitle = "";
    let updateDBCache = false;
    for (let type = 0; type < AllTitleCardsTypes.length; type++) {
      const titleCards = AllTitleCardsTypes[type];
      for (let i = 0; i < titleCards.length; i++) {
        const card = titleCards[i];
        if (isNetflix || isDisney || isHotstar || isHBO || isParamount) card.classList.add("imdb");
        else if (isPrimeVideo) {
          if (type == 0) card?.closest("li")?.classList.add("imdb");
          else if (type == 1) card?.classList.add("imdb");
        }
        const media_type = getMediaType(card);
        const title2 = getCleanTitle(card, type);
        if (!title2) continue;
        if (optionHideTitles) {
          if (hiddenTitles.value[title2]) {
            let item;
            if (isNetflix) item = card.closest("[data-virtual-slot]") || card.parentElement;
            else if (isDisney) item = card.parentElement;
            else if (isHotstar)
              item = card.closest("[data-testid='tray-card-default']") || card.closest("a") || card.parentElement;
            else if (isPrimeVideo) item = card.closest("li");
            if (item) {
              if (item.style.display === "none") continue;
              item.style.display = "none";
            }
            settings.value.Statistics.SegmentsSkipped++;
            sendMessage("increaseBadge", {}, "background");
            console.log("hidden Title", title2);
            continue;
          }
          if (isDisney || isHotstar || isPrimeVideo) addHideTitleButton(card, title2, media_type, type);
        }
        if (showRating2 && (!isDisney || !card?.classList.contains("_1p76x1y4"))) {
          if (lastTitle != title2 && !title2.includes("Netflix") && !title2.includes("Prime Video")) {
            lastTitle = title2;
            if ((DBCache[title2]?.score || getDiffInDays(DBCache[title2]?.date, date) <= 7) && (!media_type || DBCache[title2]?.media_type == media_type)) {
              useDBCache(title2, card, media_type);
            } else if (!isElementVisible(card)) {
              if (isNetflix || isDisney || isHotstar || isHBO || isParamount) card.classList.remove("imdb");
              else if (isPrimeVideo) {
                if (type == 0) card?.closest("li")?.classList.remove("imdb");
                else if (type == 1) card?.classList.remove("imdb");
              }
              continue;
            } else {
              getMovieInfo(title2, card, media_type);
              updateDBCache = true;
            }
          }
        }
      }
    }
    if (updateDBCache) {
      setTimeout(function() {
        setDBCache();
      }, 5e3);
    }
  }
  function addHideTitleButton(card, title2, mediaType, cardType = 0) {
    let target;
    if (isHotstar) {
      target = card.closest("[data-testid='tray-card-default']") || card.closest("[data-testid='tray-horizontal-card-hover']") || card;
    } else if (isPrimeVideo) {
      target = cardType == 0 ? card?.querySelector('[data-testid="packshot"]') : card;
    } else {
      target = card.parentElement;
    }
    if (!target || target.querySelector("#hideTitleButton")) return;
    if (isPrimeVideo && getComputedStyle(target).position === "static") target.style.position = "relative";
    const button = document.createElement("button");
    button.id = "hideTitleButton";
    button.textContent = "X";
    button.style.cssText = "position: absolute; top: 0; right: 0; background: transparent; color: white; border: none; font-size: 12px;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; z-index: 10;";
    button.onclick = function(event) {
      event.stopPropagation();
      event.preventDefault();
      const item = target;
      if (item) {
        if (isDisney || isHotstar) item.style.display = "none";
        else if (isPrimeVideo) {
          const li = card.closest("li");
          if (li) li.style.display = "none";
        }
      }
      hiddenTitles.value[title2] = {
        platform: isPrimeVideo ? "Amazon" : "Disney",
        mediaType,
        posterPath: DBCache[title2]?.poster_path ?? null,
        dateAdded: today
      };
    };
    target.appendChild(button);
  }
  function getMediaType(card) {
    let media_type = null;
    if (isNetflix) {
      if (url.includes("genre/83")) media_type = "tv";
      else if (url.includes("genre/34399")) media_type = "movie";
    } else if (isDisney) {
      if (url.includes("browse/series")) media_type = "tv";
      else if (url.includes("browse/movies")) media_type = "movie";
      else if (/(Staffel)|(Nummer)|(Season)|(Episod)|(Number)/g.test(title ?? "")) media_type = "tv";
    } else if (isParamount) {
      const href = card.getAttribute("href") || "";
      if (href.includes("/shows/")) media_type = "tv";
      else if (href.includes("/movies/")) media_type = "movie";
    } else if (isHBO) {
      const href = card.getAttribute("href") || "";
      if (href.includes("show") || href.includes("series")) media_type = "tv";
      else if (href.includes("movie")) media_type = "movie";
    } else if (isPrimeVideo) {
      if (url.includes("video/tv")) media_type = "tv";
      else if (url.includes("video/movie")) media_type = "movie";
      else media_type = Amazon_getMediaType(card.dataset.cardEntityType ?? "");
    } else if (isHotstar) {
      if (url.includes("/movies/")) media_type = "movie";
      else if (url.includes("/tv-shows/")) media_type = "tv";
    }
    return media_type;
  }
  function getCleanTitle(card, type) {
    let title2;
    if (isNetflix) {
      title2 = card?.getAttribute("aria-label")?.split(" (")[0];
    } else if (isDisney) {
      const prompt = card.querySelector('div[data-testid="hero-carousel-prompt"]');
      if (prompt?.textContent)
        title2 = Disney_fixTitle(card?.getAttribute("aria-label")?.replace(" " + prompt.textContent, ""));
      else title2 = Disney_fixTitle(card?.getAttribute("aria-label") ?? void 0);
      if (url.includes("entity")) {
        const SelectedTabId = document.querySelector('[aria-selected="true"]')?.id.split("_control")[0];
        if (SelectedTabId != card.closest('div[role="tabpanel"]')?.id) title2 = "";
      }
    } else if (isHotstar) {
      const rawTitle = card?.querySelector("[data-testid='action']")?.getAttribute("aria-label") || card?.querySelector("a")?.getAttribute("aria-label") || card?.getAttribute("aria-label") || card?.getAttribute("alt") || card.querySelector("img")?.getAttribute("alt") || card.querySelector("[data-testid='card-hover-title-cutout'] img")?.getAttribute("alt") || card.querySelector("span")?.textContent || "";
      title2 = rawTitle.replaceAll(/(S\d+\sE\d+)/g, "").split(",")[0].replace(/\s\d+$/, "").trim();
      if (!title2 || ["show", "movie", "live", "episode", "special", "free"].includes(title2.toLowerCase()))
        title2 = void 0;
    } else if (isPrimeVideo) {
      if (card.querySelector("a")?.href?.includes("detail")) {
        if (type == 0) title2 = Amazon_fixTitle(card.dataset.cardTitle ?? "");
        else if (type == 1) title2 = Amazon_fixTitle(card.querySelector("a")?.getAttribute("aria-label") ?? "");
      }
    } else if (isHBO) {
      const href = card.getAttribute("href") || "";
      if (href.includes("show") || href.includes("series") || href.includes("movie") || href.includes("topical") || href.includes("standalone")) {
        title2 = card.querySelector("p[class*='md_strong-']")?.textContent ?? "";
      }
    } else if (isParamount) title2 = card.getAttribute("title") ?? "";
    return title2;
  }
  var Brands = String.raw`Hulu Original Series|Disney\+ Original|STAR (?:Original|Generic)|ZDF Enterprises`;
  var Badge = String.raw`New(?: (?:Episode|Movie|Series))? Badge|`;
  var DISNEY_TITLE_RE_EN = new RegExp(
    [
      String.raw`^`,
      // sometimes there is a "Number 1 " or "Number 2 " badge in the title, but it is not consistent
      String.raw`(?:Number\s+\d+\s+)?`,
      // sometimes there is a "Disney+ Original" or "STAR Original" badge in the title, but it is not consistent
      // starting the non capturing group
      String.raw`(?:(?:`,
      String.raw`Catch Up on the Series|`,
      Badge,
      Brands,
      String.raw`)\s+)*`,
      // ending the non capturing group
      String.raw`\s*`,
      // The title is captured in a non-greedy way until we reach one of the following keywords that indicate additional info, or the end of the string
      String.raw`(?<title>[\s\S]+?)`,
      // lookahead for keywords that indicate end of title and start of additional info, e.g. Season
      String.raw`(?=`,
      // these keywords indicate that the title has ended and additional info has started, such as season number, release date, rating, etc.
      String.raw`\s+(?:`,
      String.raw`Season\b|New Episode\b|Rated\b|Released\b|Coming\b|Prepare\b|Catch Up on the Series|`,
      Badge,
      String.raw`Select for details on this title\.|`,
      String.raw`\d+\s+hour\b|\d+\s+minutes remaining\b|`,
      Brands,
      // or the end of the string
      String.raw`)`,
      String.raw`|$`,
      String.raw`)`
    ].join("")
  );
  var DISNEY_TITLE_RE_DE = new RegExp(
    [
      String.raw`^`,
      // ranking badge
      String.raw`(?:Nummer\s+\d+\s+)?`,
      // provider / brand badges (can appear multiple times, sometimes both before and after "Label: ...")
      String.raw`(?:(?:${Brands})\s+)*`,
      // label badge (can appear multiple times, and may appear before the actual title)
      String.raw`(?:Label:\s+(?:Neuer Film|Neue Serie|Neue Folge|Neu)\s+)*`,
      String.raw`\s*`,
      // Sometimes the UI contains countdown-only tiles like "Nur noch 60 Sekunden ...".
      String.raw`(?!Nur\s+noch\s+\d+\s+Sekunden\b)`,
      // capture the title until we reach one of the known metadata / CTA markers
      String.raw`(?<title>[\s\S]+?)`,
      String.raw`(?=`,
      String.raw`\s+(?:`,
      // typical UI strings
      String.raw`Jetzt\s+aufholen\b|Altersfreigabe:|Erscheinungsjahr:|Genre:|Label:|`,
      String.raw`Ab\b|ab\b|Neue Folge\b|Mach\s+dich\s+bereit\b|`,
      String.raw`Für\s+Details\s+zu\s+diesem\s+Titel\s+auswählen\.|`,
      String.raw`Staffel\b|Folge\b|Noch\b|\d+\s*Stunde\b|\d+\s*Stunden\b|\d+\s*Minuten\b|`,
      Brands,
      String.raw`)`,
      String.raw`|$`,
      String.raw`)`
    ].join(""),
    "u"
  );
  function Disney_fixTitle(title2) {
    const regex = htmlLang == "de" ? DISNEY_TITLE_RE_DE : DISNEY_TITLE_RE_EN;
    return title2?.match(regex)?.groups?.title?.trim();
  }
  function Amazon_fixTitle(title2) {
    return title2?.split(" - ")[0]?.split(" \u2013 ")[0]?.replaceAll(/(S\d+)/g, "")?.replaceAll(/ \[.*\]/g, "")?.replaceAll(/\s\(.*\)/g, "")?.replaceAll(/:?\sStaffel-?\s\d+/g, "")?.replaceAll(/:?\sSeason-?\s\d+/g, "")?.replaceAll(/ \/ \d/g, "")?.split(": Die komplette")[0]?.split(": The complete")[0];
  }
  function getColorForRating(rating, lowVoteCount) {
    if (!rating || lowVoteCount) return "grey";
    for (const threshold of settings.value.General.RatingThresholds) {
      if (rating <= threshold.value) {
        return threshold.color;
      }
    }
  }
  function getIsTransparent(rating, lowVoteCount) {
    if (!settings.value.Video?.dimLowRatings) return false;
    if ((!rating || rating <= settings.value.General.RatingThresholds[0].value) && !lowVoteCount) return true;
    return false;
  }
  function getTMDBUrl(id, media_type) {
    return `https://www.themoviedb.org/${media_type}/${id}`;
  }
  async function setRatingOnCard(card, data, title2) {
    let div;
    if (data?.id) {
      if (isHotstar) {
        div = document.createElement("div");
        div.style.cursor = "pointer";
        div.onclick = (event) => {
          event.stopPropagation();
          event.preventDefault();
          window.open(getTMDBUrl(data.id, data.media_type), "_blank");
        };
      } else {
        const a = document.createElement("a");
        a.href = getTMDBUrl(data.id, data.media_type);
        a.target = "_blank";
        div = a;
      }
    } else div = document.createElement("div");
    const vote_count = data?.vote_count || 0;
    div.id = "rating";
    let zIndexValue = "2";
    if (isDisney) zIndexValue = "";
    else if (isPrimeVideo) zIndexValue = "3";
    Object.assign(div.style, {
      position: "absolute",
      bottom: "0",
      color: "black",
      textDecoration: "none",
      background: getColorForRating(data?.score, vote_count < 50),
      borderRadius: "5px",
      padding: "0 2px 0 2px",
      right: isNetflix ? "0.2vw" : "0",
      zIndex: zIndexValue,
      fontSize: isMobile ? "4vw" : "1vw"
    });
    if (data?.score >= 0) {
      let releaseDate = "";
      if (settings.value.Video?.showYear && data?.release_date) {
        releaseDate = new Date(data?.release_date)?.getFullYear() + "-";
      }
      div.textContent = releaseDate + data.score?.toFixed(1);
      div.setAttribute(
        "alt",
        "Filtered title: " + title2 + ", Fetched title: " + data?.title + ", media_type: " + data?.media_type + ", Vote count: " + vote_count
      );
    } else {
      div.textContent = "?";
      div.setAttribute(
        "alt",
        "Filtered title: " + title2 + (data?.title ? ", Fetched title: " + data?.title : "") + (data?.media_type ? ", media_type: " + data?.media_type : "")
      );
      console.log("no score found:", title2, data, card);
    }
    const greyOverlay = document.createElement("div");
    Object.assign(greyOverlay.style, {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(40, 40, 40, 0.7)",
      pointerEvents: "none",
      zIndex: 2
    });
    if (isNetflix) {
      const titleCardContainer = card.closest("div[data-virtual-slot]");
      if (titleCardContainer) {
        titleCardContainer.appendChild(div);
        if (getIsTransparent(data?.score, vote_count < 50)) titleCardContainer.appendChild(greyOverlay);
      }
    } else if (isHBO) {
      card.appendChild(div);
      if (getIsTransparent(data?.score, vote_count < 50)) card.appendChild(greyOverlay);
    } else if (isParamount) {
      card.style.position = "unset";
      card.appendChild(div);
      if (getIsTransparent(data?.score, vote_count < 50)) card.appendChild(greyOverlay);
    } else if (isDisney) {
      const parentDiv = card?.closest("div");
      if (parentDiv) {
        if (card.nextElementSibling && card.nextElementSibling.id != "hideTitleButton") {
          div.style.top = card.offsetHeight + "px";
          div.style.bottom = "";
        }
        parentDiv.style.position = "relative";
        parentDiv.appendChild(div);
        if (getIsTransparent(data?.score, vote_count < 50)) parentDiv.appendChild(greyOverlay);
      }
    } else if (isHotstar) {
      const targetContainer = card;
      if (targetContainer && !targetContainer.querySelector("#rating")) {
        div.style.zIndex = "10";
        targetContainer.appendChild(div);
        if (getIsTransparent(data?.score, vote_count < 50)) targetContainer.appendChild(greyOverlay);
      }
    } else if (isPrimeVideo) {
      let position = card;
      if (card.dataset.cardTitle) position = card?.firstChild?.firstChild;
      else if (card.querySelector('div[data-testid="title-metadata-main"]'))
        position = card.querySelector('div[data-testid="title-metadata-main"]');
      position?.appendChild(div);
      if (getIsTransparent(data?.score, vote_count < 50)) position?.appendChild(greyOverlay);
    }
  }
  function OnFullScreenChange() {
    let video;
    if (isDisney)
      video = Array.from(document.querySelectorAll("video")).find((v) => v.checkVisibility());
    else if (isNetflix || isHotstar || isHBO || isParamount) video = document.querySelector("video");
    else video = document.querySelector(AmazonVideoClass);
    if (document.fullscreenElement && video) {
      video.play();
      console.log("auto-played on fullscreen");
      settings.value.Statistics.SegmentsSkipped++;
      sendMessage("increaseBadge", {}, "background");
    }
  }
  async function startPlayOnFullScreen() {
    if (settings.value.Video?.playOnFullScreen) {
      addEventListener("fullscreenchange", OnFullScreenChange);
    } else {
      removeEventListener("fullscreenchange", OnFullScreenChange);
    }
  }

  // source/engine/crunchyroll.ts
  startSharedFunctions("crunchyroll" /* Crunchyroll */);
  var { data: settings2, promise: promise2 } = useBrowserSyncStorage("settings", defaultSettings);
  var { data: crunchyList, promise: crunchyListPromise } = useBrowserSyncStorage("crunchyList", [], false);
  var url2 = globalThis.location.href;
  var date2 = /* @__PURE__ */ new Date();
  var today2 = date2.toISOString().split("T")[0];
  var config = { attributes: true, childList: true, subtree: true };
  async function logStartOfAddon() {
    console.log("%cStreaming enhanced", "color: #00aeef;font-size: 2em;");
    console.log("Settings", settings2.value);
  }
  async function addSkippedTime(startTime, endTime, key) {
    if (typeof startTime === "number" && typeof endTime === "number" && endTime > startTime) {
      console.log(key, endTime - startTime);
      settings2.value.Statistics[key] += endTime - startTime;
      sendMessage("increaseBadge", {}, "background");
    }
  }
  async function startCrunchyroll() {
    await promise2;
    await crunchyListPromise;
    logStartOfAddon();
    if (settings2.value.Crunchyroll.releaseCalendar) Crunchyroll_ReleaseCalendar();
    if (settings2.value.Crunchyroll.profile) {
      const pickInterval = setInterval(function() {
        Crunchyroll_AutoPickProfile();
      }, 100);
      setTimeout(function() {
        clearInterval(pickInterval);
      }, 2e3);
    }
    if (settings2.value.Video.playOnFullScreen) startPlayOnFullScreen2();
    if (settings2.value.Video.doubleClick) startdoubleClick();
    if (settings2.value.Crunchyroll.speedSlider) Crunchyroll_SpeedKeyboard();
    CrunchyrollObserver.observe(document, config);
    getMALCache();
  }
  var MALCache = {};
  var MALGCdiff = 30;
  function getMALUrl(id) {
    return `https://myanimelist.net/anime/${id}`;
  }
  async function getMALCache() {
    const result = await browser.storage.local.get("MALCache");
    MALCache = result?.MALCache;
    if (typeof MALCache !== "object") {
      console.log("MALCache not found, creating new one", MALCache);
      try {
        await browser.storage.local.set({ MALCache: {} });
      } catch (error) {
        console.log(error);
      }
      MALCache = {};
    }
    if (settings2.value.Crunchyroll?.showRating) startMALRatingInterval();
    if (getDiffInDays(settings2.value.General.MALGCdate, date2) >= MALGCdiff) malGarbageCollection();
    browser.storage.onChanged.addListener(function(changes, areaName) {
      if (areaName === "local" && changes?.MALCache) MALCache = changes.MALCache.newValue;
    });
  }
  async function setMALCache() {
    const size = new TextEncoder().encode(JSON.stringify(MALCache)).length;
    const megaBytes = size / 1024 / 1024;
    if (megaBytes < 5) {
      await browser.storage.local.set({ MALCache });
    } else {
      console.log("MALCache cleared", megaBytes);
      MALCache = {};
      await browser.storage.local.set({ MALCache });
    }
  }
  async function malGarbageCollection() {
    console.log("malGarbageCollection started, deleting old ratings:");
    const keys = Object.keys(MALCache);
    for (const key of keys) {
      if (getDiffInDays(MALCache[key].date, date2) >= MALGCdiff) {
        delete MALCache[key];
      }
    }
    settings2.value.General.MALGCdate = today2;
    setMALCache();
  }
  var MAL_MAX_QUERY_LENGTH = 64;
  function getMALSearchQuery(title2) {
    const beforeColon = title2.split(":")[0].trim();
    return beforeColon.slice(0, MAL_MAX_QUERY_LENGTH).trim();
  }
  async function getMALInfo(title2, card) {
    const searchUrl = `https://api.myanimelist.net/v2/anime?q=${encodeURIComponent(getMALSearchQuery(title2))}&limit=1&fields=mean,num_scoring_users,media_type,start_date,main_picture`;
    const data = await sendMessage("fetch", { url: searchUrl, type: "mal" }, "background");
    const node = data?.data?.[0]?.node;
    if (!node) console.log("MAL: no match or fetch error for", title2, data);
    const compiledData = {
      id: node?.id ?? 0,
      title: node?.title ?? title2,
      score: node?.mean ?? null,
      num_scoring_users: node?.num_scoring_users ?? 0,
      media_type: node?.media_type ?? "",
      start_date: node?.start_date ?? "",
      poster: node?.main_picture?.medium ?? null,
      date: today2
    };
    MALCache[title2] = compiledData;
    setMALRatingOnCard(card, compiledData);
    setMALCache();
  }
  function setMALRatingOnCard(card, data) {
    if (card.querySelector("#mal-rating")) return;
    const a = data?.id ? document.createElement("a") : document.createElement("div");
    a.id = "mal-rating";
    if (data?.id) {
      ;
      a.href = getMALUrl(data.id);
      a.target = "_blank";
    }
    const voteCount = data.num_scoring_users || 0;
    const score = data.score ?? 0;
    Object.assign(a.style, {
      position: "absolute",
      bottom: "0",
      right: "0.2vw",
      color: "black",
      textDecoration: "none",
      background: getColorForRating(score, voteCount < 50),
      borderRadius: "5px",
      padding: "0 2px 0 2px",
      zIndex: "2",
      fontSize: "1vw"
    });
    if (data.score) {
      let releaseText = "";
      if (settings2.value.Video?.showYear && data.start_date) {
        releaseText = new Date(data.start_date).getFullYear() + "-";
      }
      a.textContent = releaseText + data.score.toFixed(1);
    } else {
      a.textContent = "?";
    }
    card.style.position = "relative";
    card.appendChild(a);
    if (getIsTransparent(score, voteCount < 50)) {
      const greyOverlay = document.createElement("div");
      Object.assign(greyOverlay.style, {
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "rgba(40, 40, 40, 0.7)",
        pointerEvents: "none",
        zIndex: "1"
      });
      card.appendChild(greyOverlay);
    }
  }
  var MAL_NO_MATCH_RETRY_DAYS = 1;
  function addMALRating() {
    const cards = document.querySelectorAll('div[data-t~="series-card"]:not(.mal-rated)');
    cards.forEach((cardEl) => {
      const card = cardEl;
      card.classList.add("mal-rated");
      const title2 = card.querySelector('h3[data-t="title"] a')?.textContent?.trim();
      if (!title2) return;
      const cached = MALCache[title2];
      const cacheTtlDays = cached?.id ? MALGCdiff : MAL_NO_MATCH_RETRY_DAYS;
      if (cached && getDiffInDays(cached.date, date2) < cacheTtlDays) {
        setMALRatingOnCard(card, cached);
      } else {
        getMALInfo(title2, card);
      }
    });
  }
  async function startMALRatingInterval() {
    addMALRating();
    const MALRatingInterval = setInterval(function() {
      if (!settings2.value.Crunchyroll?.showRating) {
        console.log("stopped observing| MAL Rating");
        clearInterval(MALRatingInterval);
        return;
      }
      addMALRating();
    }, 1e3);
  }
  var CrunchyrollObserver = new MutationObserver(Crunchyroll);
  async function Crunchyroll() {
    if (settings2.value.Crunchyroll?.profile) Crunchyroll_profile();
    const video = document.querySelector("video");
    if (!video) return;
    if (settings2.value.Crunchyroll?.bigPlayer) Crunchyroll_bigPlayerStyle();
    const time = video?.currentTime;
    Crunchyroll_Intro_Outro(video, time);
    if (settings2.value.Crunchyroll?.speedSlider) Crunchyroll_SpeedSlider(video);
    if (settings2.value.Video?.scrollVolume) Crunchyroll_scrollVolume(video);
  }
  async function Crunchyroll_profile() {
    const img = document.querySelector(".avatar-wrapper img");
    if (img && img.src !== settings2.value.General.Crunchyroll_profilePicture) {
      settings2.value.General.Crunchyroll_profilePicture = img.src;
      console.log("Profile switched to", img.src);
    }
  }
  async function Crunchyroll_AutoPickProfile() {
    if (document.querySelector(".profile-item-name")) {
      document.querySelectorAll(".erc-profile-item img")?.forEach((element) => {
        const img = element;
        if (img.src === settings2.value.General.Crunchyroll_profilePicture) {
          img.click();
          console.log("Profile automatically chosen:", img.src);
          settings2.value.Statistics.SegmentsSkipped++;
          sendMessage("increaseBadge", {}, "background");
        }
      });
    }
  }
  var styleId = "enhanced-crunchyroll-big-player-style";
  async function Crunchyroll_bigPlayerStyle() {
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) return;
    const style = document.createElement("style");
    style.id = styleId;
    let styles = (
      /*css*/
      `
      .video-player-wrapper{
					max-height: calc(100vw / 1.7777);
          height: 100vh;
      }
			[class^="app-layout__header"] {
					position: absolute;
          top: 0;
          width: 100%;
          height: 3.75rem;
          z-index: 999;
			}
      .erc-large-header {
          position: absolute;
          top: 0;
          width: 100%;
          height: 3.75rem;
          z-index: 999;
      }
      .erc-large-header .header-content {
          position: absolute;
          top: -3.75rem;
          transition: top 0.4s, top 0.4s;
      }
      .erc-large-header:hover .header-content {
          top: 0;
      }
  `
    );
    style.textContent = styles;
    document.head.appendChild(style);
  }
  async function Crunchyroll_scrollVolume(video) {
    const volumeControl = document.querySelector(
      '[data-testid="bottom-left-controls-stack"]:not(.enhanced) [data-testid="volume-slider-container"]'
    );
    if (volumeControl) {
      volumeControl?.parentElement?.classList.add("enhanced");
      volumeControl.addEventListener("wheel", (event) => {
        event.preventDefault();
        let volume = video.volume;
        if (event.deltaY < 0) volume = Math.min(1, volume + 0.1);
        else volume = Math.max(0, volume - 0.1);
        video.volume = volume;
      });
    }
  }
  function OnFullScreenChange2() {
    const video = document.querySelector("video");
    if (document.fullscreenElement && video) {
      video.play();
      console.log("auto-played on fullscreen");
      settings2.value.Statistics.SegmentsSkipped++;
      sendMessage("increaseBadge", {}, "background");
    }
  }
  async function startPlayOnFullScreen2() {
    if (settings2.value.Video?.playOnFullScreen) {
      console.log("started observing| PlayOnFullScreen");
      addEventListener("fullscreenchange", OnFullScreenChange2);
    } else {
      console.log("stopped observing| PlayOnFullScreen");
      removeEventListener("fullscreenchange", OnFullScreenChange2);
    }
  }
  function shouldBlockPreviewSkip(ariaLabel, skipAfterCredits) {
    return !skipAfterCredits && (ariaLabel?.toLowerCase().includes("preview") ?? false);
  }
  var skipped = false;
  var reverseButtonClicked = false;
  var reverseButtonStartTime;
  var reverseButtonEndTime;
  async function Crunchyroll_Intro_Outro(video, time) {
    if (video.paused || video.currentTime <= 2) return;
    const isOutro = time > video.duration / 2;
    if (!settings2.value.Crunchyroll?.skipIntro && !isOutro) return;
    if (!settings2.value.Crunchyroll?.skipCredits && isOutro) return;
    if (!reverseButtonClicked) {
      const button = document.querySelector('button:has(svg[data-testid="skip-intro-icon"])');
      const ariaLabel = button?.getAttribute("aria-label");
      if (button && button.checkVisibility({ opacityProperty: true }) && !skipped && !ariaLabel?.toLowerCase()?.includes("recap")) {
        skipped = true;
        setTimeout(function() {
          if (isOutro && settings2.value.Crunchyroll?.skipAfterCredits) {
            const nextEpButton = document.querySelector('[data-testid="next-episode-button"]');
            if (nextEpButton) {
              nextEpButton.click();
              console.log("Outro skipped", nextEpButton);
            } else {
              button?.click();
              console.log("Outro skipped", button);
            }
          } else if (shouldBlockPreviewSkip(ariaLabel, !!settings2.value.Crunchyroll?.skipAfterCredits)) {
            console.log("After-credits preview left alone (skipAfterCredits disabled)", button);
          } else {
            button?.click();
            console.log("Intro skipped", button, settings2.value.General.Crunchyroll_skipTimeout);
            setTimeout(function() {
              CrunchyrollGobackbutton(time, video?.currentTime);
              addSkippedTime(time, video?.currentTime, "IntroTimeSkipped");
            }, 600);
          }
          setTimeout(function() {
            skipped = false;
          }, 2e3);
        }, settings2.value.General.Crunchyroll_skipTimeout);
      }
    } else if (!document.querySelector(".reverse-button")) {
      addButton(reverseButtonStartTime, reverseButtonEndTime);
    }
  }
  function addButton(startTime, endTime) {
    if (reverseButtonClicked) return;
    const button = document.createElement("div");
    button.setAttribute(
      "class",
      "reverse-button kat:inline-flex kat:items-center kat:justify-center kat:rounded-full kat:border kat:border-solid kat:ps-24 kat:pe-24 kat:pt-12 kat:pb-12 kat:text-sm kat:font-semibold kat:leading-none kat:transition-colors kat:duration-200 kat:outline-none kat:cursor-pointer kat:disabled:cursor-not-allowed kat:bg-neutral-50 kat:border-transparent kat:text-neutral-900 kat:hover:bg-neutral-200 kat:active:bg-neutral-300 kat:focus-visible:ring-4 kat:focus-visible:ring-taupe-600 kat:disabled:bg-neutral-600 kat:disabled:text-neutral-400 kat:z-1001 kat:gap-4 kat:min-w-161 kat:h-44 kat:shadow-lg kat:self-end kat:mr-40 kat:pointer-events-auto"
    );
    button.textContent = "Rewind?";
    const buttonTimeout = setTimeout(() => {
      button.remove();
    }, 5e3);
    button.onclick = function() {
      reverseButtonClicked = true;
      const reverseButton = document.querySelector('[data-testid="jump-backward-button"]');
      const clicksNeeded = Math.ceil((endTime - startTime) / 10);
      for (let i = 0; i < clicksNeeded; i++) {
        reverseButton?.click();
      }
      button.remove();
      clearTimeout(buttonTimeout);
      const waitTime = endTime - startTime + 2;
      setTimeout(function() {
        reverseButtonClicked = false;
      }, waitTime * 1e3);
    };
    const position = document.querySelector('[data-testid="player-controls-root"]')?.querySelector('[data-testid="bottom-controls-autohide"]');
    if (position) {
      position.before(button);
    }
  }
  async function CrunchyrollGobackbutton(startTime, endTime) {
    reverseButtonStartTime = startTime;
    reverseButtonEndTime = endTime;
    addButton(startTime, endTime);
  }
  var videoSpeed = ref(1);
  var CrunchyrollSliderStyle = "display: none;margin: auto;width:200px;";
  var CrunchyrollSpeedStyle = "color: white;margin: auto;padding: 0 5px;width: 40px;";
  async function Crunchyroll_SpeedSlider(video) {
    if (video) {
      const alreadySlider = document.querySelector("#videoSpeedSlider");
      if (!alreadySlider) {
        const position = document.querySelector('[data-testid="bottom-right-controls-stack"]');
        if (position) {
          createSlider(video, videoSpeed, position, CrunchyrollSliderStyle, CrunchyrollSpeedStyle);
          document.querySelector('button[data-testid="playback-speed-button"]')?.remove();
        }
      } else {
        video.playbackRate = videoSpeed.value;
      }
    }
  }
  async function Crunchyroll_SpeedKeyboard() {
    const steps = settings2.value.General.sliderSteps / 10;
    document.addEventListener("keydown", (event) => {
      if (!settings2.value.Crunchyroll?.speedSlider || event.ctrlKey || event.metaKey || event.altKey || event.target?.closest?.('input,textarea,select,[contenteditable="true"]')) return;
      const video = document.querySelector("video");
      if (!video) return;
      if (event.key === "d") {
        video.playbackRate = Math.min(video.playbackRate + steps * 2, settings2.value.General.sliderMax / 10);
        videoSpeed.value = video.playbackRate;
      } else if (event.key === "s") {
        video.playbackRate = Math.max(video.playbackRate - steps * 2, 0.6);
        videoSpeed.value = video.playbackRate;
      }
    });
  }
  async function startdoubleClick() {
    document.ondblclick = function() {
      if (!settings2.value.Video.doubleClick) return;
      const fullScreenButton = document.querySelector('button[data-testid="fullscreen-button"]');
      fullScreenButton?.click();
    };
  }
  function setReleaseRemoved(element) {
    element.classList.add("removed");
    element.style.display = "none";
  }
  function showAllElements() {
    const list = document.querySelectorAll("li article.release.js-release");
    list.forEach((element) => {
      if (!element.parentElement) return;
      element.parentElement.classList.remove("removed");
      element.parentElement.style.display = "block";
    });
  }
  var langs = [
    "English",
    "Deutsch",
    "Fran\xE7ais",
    "Japanese",
    "French",
    "German",
    "Am\xE9rica Latina",
    "Portuguese",
    "Portugu\xEAs",
    "Spanish",
    "Indonesian",
    "Italian",
    "Castilian",
    "Russian",
    "Espa\xF1a",
    "Italiano",
    "Brasil",
    "\u666E\u901A\u8BDD",
    "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
  ];
  var filterNoDubs = "all";
  var filterAllDubs = "none";
  var dubLanguageRegex = /\(([^()\d]+?)(?:\s+Dub)?\)(?!.*\([^()]*\))/;
  function titleContainsDub(title2) {
    const isDub = title2?.includes("Dub") || /[^(]*\(\D*\)[^(]*/g.test(title2) || // Array.from(langs).some((lang) => element?.textContent?.includes(lang)) ||
    title2?.includes("Audio");
    if (isDub) {
      const dubLanguage = dubLanguageRegex.exec(title2)?.[1]?.trim();
      if (dubLanguage && !langs.includes(dubLanguage)) {
        langs.push(dubLanguage);
      }
    }
    return isDub;
  }
  function titleContainsAllowedDub(title2) {
    const selectedDubLanguage = settings2.value.Crunchyroll.dubLanguage;
    if (selectedDubLanguage === filterNoDubs) return true;
    else if (selectedDubLanguage === filterAllDubs) return false;
    return title2?.includes(selectedDubLanguage);
  }
  var getTitle = (el) => el?.textContent?.trim() ?? "";
  var getEpisodeRegex = /(\d+)(?!.*\d)/;
  function filterFunctions() {
    const showsByTitle = /* @__PURE__ */ new Map();
    const list = document.querySelectorAll("li article.release.js-release");
    list.forEach((element, index) => {
      if (!element.parentElement) return;
      if (!element?.checkVisibility()) {
        element.parentElement.classList.add("removed");
        return;
      }
      const titleElement = element?.querySelector("cite[itemprop='name']");
      const title2 = getTitle(titleElement);
      if (titleElement?.textContent) titleElement.textContent = title2.replace(/Season \d*/, "");
      const queuedFlag = element.querySelector("div.queue-flag:not(.queued)");
      const premiereFlag = element.querySelector("div.premiere-flag");
      const episodeNumber = Number.parseInt(
        element.querySelector("a.available-episode-link")?.textContent?.match(getEpisodeRegex)?.[1] ?? "-1"
      );
      if (titleContainsDub(title2) && !titleContainsAllowedDub(title2)) {
        setReleaseRemoved(element.parentElement);
      } else if (settings2.value.Crunchyroll.filterQueued && queuedFlag && !premiereFlag) {
        setReleaseRemoved(element.parentElement);
      } else if (settings2.value.Crunchyroll.filterDuplicates) {
        if (showsByTitle.has(title2)) {
          showsByTitle.get(title2)?.push({ index, episode: episodeNumber });
        } else {
          showsByTitle.set(title2, [{ index, episode: episodeNumber }]);
        }
      }
    });
    showsByTitle.forEach((shows) => {
      if (shows.length > 1) {
        shows.sort((a, b) => {
          const episodeDiff = b.episode - a.episode;
          if (episodeDiff !== 0) return episodeDiff;
          return a.index - b.index;
        });
        shows.slice(1).forEach((show) => {
          const element = list[show.index];
          if (element.parentElement) setReleaseRemoved(element.parentElement);
        });
      }
    });
  }
  function createFilterElement(filterType, filterText, settingsValue) {
    const label = document.createElement("label");
    const span = document.createElement("span");
    span.style.display = "flex";
    span.style.alignItems = "center";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = settingsValue;
    input.id = filterType;
    input.onclick = function() {
      settings2.value.Crunchyroll[filterType] = input.checked;
      showAllElements();
      filterFunctions();
    };
    const p = document.createElement("p");
    p.style.width = "100px";
    p.textContent = filterText;
    label.appendChild(span);
    span.appendChild(input);
    span.appendChild(p);
    return label;
  }
  function createDubLanguageSelectElement() {
    const label = document.createElement("label");
    const span = document.createElement("span");
    span.style.display = "flex";
    span.style.alignItems = "start";
    span.style.flexDirection = "column";
    const select = document.createElement("select");
    select.id = "filterDubLanguage";
    const selectedDubLanguage = settings2.value.Crunchyroll.dubLanguage || filterAllDubs;
    const options = [filterAllDubs, filterNoDubs, ...langs];
    options.forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang;
      option.textContent = lang;
      select.appendChild(option);
    });
    select.value = selectedDubLanguage;
    if (!options.includes(selectedDubLanguage)) {
      select.value = filterAllDubs;
      settings2.value.Crunchyroll.dubLanguage = filterAllDubs;
    }
    select.onchange = function() {
      settings2.value.Crunchyroll.dubLanguage = select.value;
      showAllElements();
      filterFunctions();
    };
    const p = document.createElement("p");
    p.textContent = "Show these dubs:";
    label.appendChild(span);
    span.appendChild(p);
    span.appendChild(select);
    return label;
  }
  function addButtons() {
    const toggleForm = document.querySelector("#filter_toggle_form");
    if (!toggleForm?.firstElementChild) return;
    toggleForm.style.display = "flex";
    toggleForm.firstElementChild.appendChild(createDubLanguageSelectElement());
    toggleForm.firstElementChild.appendChild(
      createFilterElement("filterQueued", "Show Playlist only", settings2.value.Crunchyroll.filterQueued)
    );
    toggleForm.firstElementChild.appendChild(
      createFilterElement("filterDuplicates", "Filter Duplicates", settings2.value.Crunchyroll.filterDuplicates)
    );
  }
  function addShowsToList(position, list) {
    list.forEach((element) => {
      const article = document.createElement("article");
      article.className = "release js-release";
      const time = document.createElement("time");
      time.className = "available-time";
      time.textContent = new Date(element.time).toLocaleString([], { hour: "2-digit", minute: "2-digit" });
      const div1 = document.createElement("div");
      const div2 = document.createElement("div");
      div2.className = "queue-flag queued";
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 48 48");
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        "/i/svg/simulcastcalendar/calendar_icons.svg#cr_bookmark"
      );
      svg.appendChild(use);
      div2.appendChild(svg);
      const h1 = document.createElement("h1");
      h1.className = "season-name";
      const a = document.createElement("a");
      a.className = "js-season-name-link";
      a.href = element?.href || "";
      a.setAttribute("itemprop", "url");
      const cite = document.createElement("cite");
      cite.setAttribute("itemprop", "name");
      cite.textContent = element?.name || "";
      a.appendChild(cite);
      h1.appendChild(a);
      div1.appendChild(div2);
      div1.appendChild(h1);
      article.appendChild(time);
      article.appendChild(div1);
      position.appendChild(article);
    });
  }
  function clickOnCurrentDay() {
    const days = document.querySelectorAll(".specific-date [datetime]");
    for (const day of days) {
      const dateOnPage = new Date(day?.getAttribute("datetime") ?? "");
      if (date2.getDay() == dateOnPage.getDay()) {
        day.closest("li.day")?.classList.add("active");
        return date2.toLocaleDateString() == dateOnPage.toLocaleDateString();
      }
    }
    return false;
  }
  function createLocalList() {
    const localList = [];
    document.querySelectorAll("ol.releases li:not(.removed) article.release.js-release").forEach((element) => {
      const queuedFlag = element.querySelector("div.queue-flag:not(.queued)");
      const premiereFlag = element.querySelector("div.premiere-flag");
      if (premiereFlag && !queuedFlag) return;
      const h1 = element.querySelector("h1.season-name a");
      const name = h1?.firstChild?.nextSibling?.textContent;
      const href = h1?.href;
      const time = element.firstElementChild?.getAttribute("datetime") ?? "";
      localList.push({ href, name, time });
    });
    return localList;
  }
  function filterOldList(isCurrentWeek, localList) {
    let oldList = toRaw(crunchyList.value);
    const lastElement = localList.at(-1);
    if (!lastElement?.time) return oldList;
    const lastTime = new Date(lastElement.time);
    const [lastDay, lastHr, lastMin] = [lastTime.getDay(), lastTime.getHours(), lastTime.getMinutes()];
    if (!isCurrentWeek) {
      oldList = [];
    } else {
      oldList = oldList.filter((item) => {
        return item && shiftSunday(date2.getDay()) - shiftSunday(new Date(item.time).getDay()) <= 0;
      }).filter((item) => {
        const itemTime = new Date(item.time);
        const itemHr = itemTime.getHours();
        const itemDay = itemTime.getDay();
        return lastDay != itemDay || itemDay != date2.getDay() || itemHr > lastHr || itemHr == lastHr && itemTime.getMinutes() > lastMin;
      });
    }
    return oldList;
  }
  var shiftSunday = (a) => (a + 6) % 7;
  function addSavedCrunchyList() {
    const localList = createLocalList();
    const isCurrentWeek = clickOnCurrentDay();
    const oldList = localList.length > 0 ? filterOldList(isCurrentWeek, localList) : toRaw(crunchyList.value);
    crunchyList.value = localList.concat(oldList);
    if (isCurrentWeek) {
      document.querySelectorAll("section.calendar-day").forEach((element) => {
        const datetime = element.querySelector("time")?.getAttribute("datetime") ?? "";
        const weekday = new Date(datetime).getDay();
        if (shiftSunday(date2.getDay()) - shiftSunday(weekday) < 0)
          element?.children?.[1]?.firstChild?.nextSibling?.remove();
        addShowsToList(
          element.children[1],
          oldList.filter((item) => new Date(item.time).getDay() == weekday)
        );
      });
    }
  }
  async function Crunchyroll_ReleaseCalendar() {
    if (url2.includes("simulcastcalendar")) {
      filterFunctions();
      if (!document.querySelector("#filterQueued")) addButtons();
      addSavedCrunchyList();
    }
  }
  startCrunchyroll();
})();
/*! Bundled license information:

@vue/shared/dist/shared.esm-bundler.js:
  (**
  * @vue/shared v3.5.43
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/reactivity/dist/reactivity.esm-bundler.js:
  (**
  * @vue/reactivity v3.5.43
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/runtime-core/dist/runtime-core.esm-bundler.js:
  (**
  * @vue/runtime-core v3.5.43
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

vue/dist/vue.runtime.esm-bundler.js:
  (**
  * vue v3.5.43
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)
*/

})();