import { ConcurrencyMode } from "polyrhythm";
import { renderHook } from "@testing-library/react-hooks";
import { useListener } from "../src/useChannel";
import {
  useASAPListener,
  useQueuedListener,
  useReplacingListener,
  useIgnoringListener,
} from "../src/useListeners";

jest.mock("../src/useChannel", () => ({
  useListener: jest.fn(),
}));

describe("Concurrency Controlled Listeners", () => {
  const eventType = "event/type";
  const listener = () => null;

  beforeEach(() => jest.resetAllMocks());

  describe("useASAPListener", () => {
    it("calls useListener with mode: parallel", async () => {
      await renderHook(() => useASAPListener(eventType, listener, {}));
      expect(useListener).toHaveBeenCalledWith(
        eventType,
        listener,
        expect.objectContaining({
          mode: ConcurrencyMode.parallel,
        })
      );
    });
  });

  describe("useQueuedListener", () => {
    it("calls useListener with mode: serial", async () => {
      await renderHook(() => useQueuedListener(eventType, listener, {}));
      expect(useListener).toHaveBeenCalledWith(
        eventType,
        listener,
        expect.objectContaining({
          mode: ConcurrencyMode.serial,
        })
      );
    });
  });

  describe("useReplacingListener", () => {
    it("calls useListener with mode: replace", async () => {
      await renderHook(() => useReplacingListener(eventType, listener, {}));
      expect(useListener).toHaveBeenCalledWith(
        eventType,
        listener,
        expect.objectContaining({
          mode: ConcurrencyMode.replace,
        })
      );
    });
  });

  describe("useIgnoringListener", () => {
    it("calls useListener with mode: ignore", async () => {
      await renderHook(() => useIgnoringListener(eventType, listener, {}));
      expect(useListener).toHaveBeenCalledWith(
        eventType,
        listener,
        expect.objectContaining({
          mode: ConcurrencyMode.ignore,
        })
      );
    });
  });
});
