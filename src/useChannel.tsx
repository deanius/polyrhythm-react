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
      handler: Listener<Event, any>,
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
 * @argument options - Specify the output events to be triggered in this object.
 * @returns Array of [trigger, unsub] - where trigger fires ANY event, and unsub cancels any inflight events (and is called automatcially on unmount).
 */
export const useListener = (
  eventSpec: EventMatcher,
  handler: Listener<Event, any>,
  options: ListenerConfigWithDeps = {}
): [(type: string, payload: any) => void, () => Subscription] => {
  const { deps = [], ...config } = options;
  const { channel, trigger } = useChannel();
  const subscriptionRef = useRef(new Subscription(() => null));

  let cancelerRef = useRef(() => {});

  useEffect(() => {
    const subscription = channel.on(eventSpec, handler, config);
    subscriptionRef.current = subscription;
    const canceler = () => {
      subscription.unsubscribe();
    };
    cancelerRef.current = canceler;
    return canceler;
  }, deps);

  // @ts-ignore
  return [trigger, cancelerRef.current];
};

/** Allows a component to intercept and run synchronous
   consequences, alter events, or throw errors to cancel the processing
   * @argument eventSpec - the criteria for the event to listen for
   * @argument filter - the function to be run synchronously upon the event before all listeners
   * @returns Array of [trigger, unsub] - where trigger fires the event, and unsub stops filtering, (and is called automatcially on unmount)
   */
export const useFilter = (eventSpec: EventMatcher, filter: Filter<Event>) => {
  const { channel, trigger } = useChannel();

  let canceler: () => void;
  useEffect(() => {
    const subscription = channel.filter(eventSpec, filter);
    canceler = () => {
      subscription.unsubscribe();
      return subscription;
    };

    return () => subscription.unsubscribe();
  }, []);

  // @ts-ignore
  return [trigger, canceler];
};
