import {
  Event,
  EventMatcher,
  Listener,
  ListenerConfig,
  ConcurrencyMode
} from "polyrhythm";
import { useListener } from "./useChannel";

/** Executes the Observable or Promise-returning listener in parallel (RxJS mergeMap) mode. */
export function useASAPListener(
  matcher: EventMatcher,
  listener: Listener<Event, any>,
  options: ListenerConfig = {}
) {
  const config: ListenerConfig = {
    ...options,
    mode: ConcurrencyMode.parallel
  };
  return useListener(matcher, listener, config);
}

/** Executes the Observable or Promise-returning listener in a serial, queueing (RxJS concatMap) mode. */
export function useQueuedListener(
  matcher: EventMatcher,
  listener: Listener<Event, any>,
  options: ListenerConfig = {}
) {
  const config: ListenerConfig = {
    ...options,
    mode: ConcurrencyMode.serial
  };
  return useListener(matcher, listener, config);
}

/** Executes the Observable or Promise-returning listener in a sliding, replacing (RxJS switchMap) mode. */
export function useReplacingListener(
  matcher: EventMatcher,
  listener: Listener<Event, any>,
  options: ListenerConfig = {}
) {
  const config: ListenerConfig = {
    ...options,
    mode: ConcurrencyMode.replace
  };
  return useListener(matcher, listener, config);
}

/** Executes the Observable or Promise-returning listener in a singletion, ignoring (RxJS exhaustMap) mode. */
export function useThrottledListener(
  matcher: EventMatcher,
  listener: Listener<Event, any>,
  options: ListenerConfig = {}
) {
  const config: ListenerConfig = {
    ...options,
    mode: ConcurrencyMode.ignore
  };
  return useListener(matcher, listener, config);
}
