import { createContext, useContext, useRef, useEffect } from "react";

import {
  channel as defaultChannel,
  Event,
  EventMatcher,
  Filter,
  Listener,
  ListenerConfig
} from "polyrhythm";
import { Subscription } from "rxjs";
export { trigger } from "polyrhythm";

interface ListenerConfigWithDeps extends ListenerConfig {
  deps?: Array<any>;
}

/** Sets up a channel - a domain for events. It's not always necessary or
 * advantageous to use multiple channels - a single channel may suffice, and
 * different slices of it managed via namespacing.
 */
export const ChannelContext = createContext(defaultChannel);

/**
 * An alternative to the top-level static imports of useListener, trigger, etc.
 * that implicitly use the default channel. Uses a channel provided by a ChannelContext,
 * or falls back to the default channel.
 * @example: const { trigger, useListener } = useChannel();
 */
export const useChannel = () => {
  const channel = useContext(ChannelContext) || defaultChannel;
  return {
    channel,
    trigger(type: string, payload?: any) {
      channel.trigger(type, payload);
    },
    query(matcher: EventMatcher) {
      return channel.query(matcher);
    },
    useListener(
      eventSpec: EventMatcher,
      handler: Listener<Event>,
      options: ListenerConfigWithDeps = {},
      deps?: Array<any>
    ) {
      const _deps = deps || options.deps || [];
      useEffect(() => {
        const sub = channel.on(eventSpec, handler, options);
        return () => sub.unsubscribe();
      }, _deps);
    },
    useFilter(
      eventSpec: EventMatcher,
      filter: Filter<Event>,
      deps: Array<any> = []
    ) {
      useEffect(() => {
        const sub = channel.filter(eventSpec, filter);
        return () => sub.unsubscribe();
      }, deps);
    }
  };
};

/** Allows a component to attach (maybe async) consequences
 * to event patterns: strings, regexes, or function predicates.
 * Handlers return Observables for flexible scheduling/cancelation.
 * Cleans up when the component is unmounted.
 * @argument eventSpec - the criteria for the event to listen for
 * @argument handler - the function to be run upon the event, after all filters
 * @argument options - If the handler closes over React hook variables which
 * are not stable, provide the variables in the `deps` field of this object.
 * @returns A ref to a subscription, on which you may invoke .current.unsubscribe()
 */
export const useListener = (
  eventSpec: EventMatcher,
  handler: Listener<Event>,
  options: ListenerConfigWithDeps = {}
) => {
  const { deps = [], ...config } = options;
  const subscriptionRef = useRef(new Subscription(() => null));

  useEffect(() => {
    const subscription = defaultChannel.on(eventSpec, handler, config);
    subscriptionRef.current = subscription;
    return () => subscription.unsubscribe();
  }, deps);

  return subscriptionRef;
};

/** Allows a component to intercept and run synchronous
   consequences, alter events, or throw errors to cancel the processing
   * @argument eventSpec - the criteria for the event to listen for
   * @argument handler - the function to be run synchronously upon the event before all listeners
   * @argument options - If the handler closes over React hook variables which
   * are not stable, provide the variables in the `deps` field of this object.
  */
export const useFilter = (
  eventSpec: EventMatcher,
  handler: Listener<Event>,
  options: ListenerConfigWithDeps = {}
) => {
  const { deps = [] } = options;
  const subscriptionRef = useRef(new Subscription(() => null));

  useEffect(() => {
    const subscription = defaultChannel.filter(eventSpec, handler);
    subscriptionRef.current = subscription;
    return () => subscription.unsubscribe();
  }, deps);

  return subscriptionRef;
};
