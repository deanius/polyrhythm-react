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

export function useConcurrentEffect<T, U>(
  listener: EffectFactory<T, U>,
  op: typeof switchMap
): [(item: T) => void, () => void] {
  const [trigger, unsub] = useMemo(() => {
    const subject = new Subject<T>();
    const trigger = (item: T) => subject.next(item);
    // @ts-ignore
    const combined = subject.asObservable().pipe(op(listener));
    const sub = combined.subscribe();
    const unsub = sub.unsubscribe.bind(sub);
    return [trigger, unsub];
  }, []);
  useEffect(() => unsub, []); // calls unsub at unmount time
  return [trigger, unsub];
}

export function useASAPEffect<T, U>(listener: EffectFactory<T, U>) {
  return useConcurrentEffect(listener, mergeMap);
}

export function useQueuedEffect<T, U>(listener: EffectFactory<T, U>) {
  return useConcurrentEffect(listener, concatMap);
}

export function useRestartingEffect<T, U>(listener: EffectFactory<T, U>) {
  return useConcurrentEffect(listener, switchMap);
}

export function useThrottledEffect<T, U>(listener: EffectFactory<T, U>) {
  return useConcurrentEffect(listener, exhaustMap);
}

export function useToggledEffect<T, U>(listener: EffectFactory<T, U>) {
  // @ts-ignore
  return useConcurrentEffect(listener, toggleMap);
}
