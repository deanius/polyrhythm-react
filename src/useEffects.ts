import { ObservableInput, Subject } from "rxjs";
import { mergeMap, switchMap } from "rxjs/operators";
import { useEffect, useMemo } from "react";

/**
 * A function returning an Observable representing an effect.
 * Also may return Promises, generators, per RxJS' ObservableInput type.
 */
interface EffectFactory<T, U> {
  (item: T): ObservableInput<U>;
}

export function useConcurrentEffect<T, U>(
  listener: EffectFactory<T, U>,
  op: typeof switchMap
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

export function useASAPEffect<T, U>(listener: EffectFactory<T, U>) {
  return useConcurrentEffect(listener, mergeMap);
}
