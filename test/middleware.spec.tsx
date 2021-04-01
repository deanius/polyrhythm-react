// @ts-nocheck
import "@testing-library/jest-dom";
import { triggerAllMiddleware } from "../src/middleware";
import { captureEvents } from "polyrhythm";

describe("triggerAllMiddleware", () => {
  const anyEvent = { type: "test-foo" };

  it(
    "triggers any event",
    captureEvents(async events => {
      const nextSpy = () => null;
      const dispatch = triggerAllMiddleware()(null)(nextSpy);
      await dispatch(anyEvent);
      expect(events).toEqual([anyEvent]);
    })
  );
});
