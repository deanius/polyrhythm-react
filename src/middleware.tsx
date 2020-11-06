import { channel as defaultChannel, Channel } from "polyrhythm";
import { Dispatch, AnyAction } from "redux";
export const triggerAllMiddleware = (
  channel: Channel = defaultChannel
) => () => (next: Dispatch) => (action: AnyAction) => {
  // trigger first so channel spies and filters preceed everything
  channel.trigger(action);
  next(action);
};
