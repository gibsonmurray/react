/*!
 * @gsap/react 2.0.1
 * https://gsap.com
 *
 * @license Copyright 2023, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('gsap')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'gsap'], factory) :
  (global = global || self, factory(global.window = global.window || {}, global.react, global.gsap));
}(this, (function (exports, react, gsap) { 'use strict';

  gsap = gsap && Object.prototype.hasOwnProperty.call(gsap, 'default') ? gsap['default'] : gsap;

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? react.useLayoutEffect : react.useEffect,
    isConfig = value => value && !Array.isArray(value) && typeof value === "object",
    emptyArray = [],
    defaultConfig = {};
  const useGSAP = (callback, dependencies = emptyArray) => {
    let config = defaultConfig;
    if (isConfig(callback)) {
      config = callback;
      callback = null;
      dependencies = "dependencies" in config ? config.dependencies : emptyArray;
    } else if (isConfig(dependencies)) {
      config = dependencies;
      dependencies = "dependencies" in config ? config.dependencies : emptyArray;
    }
    let {
        scope,
        revertOnUpdate
      } = config,
      mounted;
    callback && typeof callback !== "function" && console.warn("First parameter must be a function or config object");
    const context = gsap.context(() => {}, scope),
      contextSafe = func => context.add(null, func),
      cleanup = () => context.revert(),
      deferCleanup = dependencies && dependencies.length && !revertOnUpdate;
    useIsomorphicLayoutEffect(() => {
      callback && context.add(callback, scope);
      if (!deferCleanup || !mounted) {
        return cleanup;
      }
    }, dependencies);
    deferCleanup && useIsomorphicLayoutEffect(() => {
      mounted = true;
      return cleanup;
    }, emptyArray);
    return {
      context,
      contextSafe
    };
  };

  exports.useGSAP = useGSAP;

  if (typeof(window) === 'undefined' || window !== exports) {Object.defineProperty(exports, '__esModule', { value: true });} else {delete window.default;}

})));
