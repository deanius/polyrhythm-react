import { useRef, useEffect } from "react";

/** More readable version of useEffect(fn, []). Only on run at mount time. */
export const useEffectAtMount = (fn: React.EffectCallback) => useEffect(fn, []);

/** Run upon every render after the mount, subject to its deps */
export const useEffectAfterMount = (
  func: React.EffectCallback,
  deps: React.DependencyList = []
) => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current !== false) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};
