import { toggleMap } from "polyrhythm";
import { ObservableInput, Subject } from "rxjs";
import { mergeMap, concatMap, switchMap, exhaustMap } from "rxjs/operators";
import { useEffect, useMemo } from "react";

/**
 * A function returning an Observable representing an effect.
 * Also may return Promises, generators, per RxJS' ObservableInput type.
 */
interface EffectFactory<T, U> {
  (item: T): ObservableInput<U> | void;
}

/**
 * Like all use*Effect functions in this library, runs an async effect
 * (returning an Observable or Promise) in such a way as to cancel it
 * when the component unmounts (possible only with Observables).
 * Alias for `useASAPEffect`.
 *
 * If triggers 1 and 2 begin overlapping async processes,
 * marked by start:N and done:N events, the following order will occur:
 *
 * ```
 * trigger(1); trigger(2);
 * //
 * start:1
 * start:2
 * done:1 // done in either order
 * done:2
 * ```
 * @param listener T=>ObservableInput|void
 * @returns [ trigger(T), unsubscribe() ]
 */
export function useCancelableEffect<T, U>(
  listener: EffectFactory<T, U>,
  op = switchMap
): [(item: T) => void, () => void] {
  const [trigger, unsub] = useMemo(() => {
    const subject = new Subject<T>();
    const trigger = (item: T) => subject.next(item);
    const combined = subject.asObservable().pipe(op(listener));
    const sub = combined.subscribe();
    const unsub = sub.unsubscribe.bind(sub);
    return [trigger, unsub];
  }, []);
  useEffect(() => unsub, []); // calls unsub at unmount time
  return [trigger, unsub];
}

/**
 * Returns a trigger function for initiating an async process
 * running in 'parallel' or 'mergeMap' mode, which will be
 * unsubscribed (canceled) when the using component is unmounted.
 *
 * For ASAP mode, if triggers 1 and 2 begin overlapping async processes,
 * marked by start:N and done:N events, the following order will occur:
 *
 * ```
 * start:1
 * start:2
 * done:1 // done in either order
 * done:2
 * ```
 * @param listener
 * @returns
 */
export function useASAPEffect<T, U>(listener: EffectFactory<T, U>) {
  return useCancelableEffect(listener, mergeMap);
}

/**
 * Returns a trigger function for initiating an async process
 * running in 'serial' or 'concatMap' mode, which will be
 * unsubscribed (canceled) when the using component is unmounted.
 *
 * For Queued mode, if triggers 1 and 2 begin overlapping async processes,
 * marked by start:N and done:N events, the following order will occur:
 *
 * ```
 * start:1
 * done:1
 * start:2
 * done:2
 * ```
 * @param listener
 * @returns
 */
export function useQueuedEffect<T, U>(listener: EffectFactory<T, U>) {
  return useCancelableEffect(listener, concatMap);
}

/**
 * Returns a trigger function for initiating an async process
 * running in 'replace' or 'switchMap' mode, which will be
 * unsubscribed (canceled) when the using component is unmounted.
 *
 * For Restarting mode, if triggers 1 and 2 begin overlapping async processes,
 * marked by start:N and done:N events, the following order will occur:
 *
 * ```
 * start:1
 * start:2  // process 1 canceled
 * done:2
 * ```
 * @param listener
 * @returns
 */
export function useRestartingEffect<T, U>(listener: EffectFactory<T, U>) {
  return useCancelableEffect(listener, switchMap);
}

/**
 * Returns a trigger function for initiating an async process
 * running in 'ignore' or 'exhaustMap' mode, which will be
 * unsubscribed (canceled) when the using component is unmounted.
 *
 * For Throttled mode, if triggers 1 and 2 begin overlapping async processes,
 * marked by start:N and done:N events, the following order will occur:
 *
 * ```
 * start:1
 * done:1  // process 2 not started
 * ```
 * @param listener
 * @returns
 */
export function useThrottledEffect<T, U>(listener: EffectFactory<T, U>) {
  return useCancelableEffect(listener, exhaustMap);
}

/**
 * Returns a trigger function for initiating an async process
 * running in 'toggle' mode, which will be
 * unsubscribed (canceled) when the using component is unmounted.
 *
 * For Toggled mode, if triggers 1 and 2 begin overlapping async processes,
 * marked by start:N and done:N events, the following order will occur:
 *
 * ```
 * start:1 // process 1 canceled by trigger 2, unstarted as well
 * ```
 * @param listener
 * @returns
 */
export function useToggledEffect<T, U>(listener: EffectFactory<T, U>) {
  return useCancelableEffect(listener, toggleMap as typeof switchMap);
}
