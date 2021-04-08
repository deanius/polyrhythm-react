// eslint-disable-next-line
// @ts-nocheck
import { renderHook } from "@testing-library/react-hooks";
import { after } from "polyrhythm";
import { of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import {
  useCancelableEffect,
  useASAPEffect,
  useRestartingEffect,
  useQueuedEffect,
  useThrottledEffect,
  useToggledEffect
} from "../src/useEffects";

describe("useCancelableEffect", () => {
  const listeners = {
    num: (n: number) => of(n)
  };
  describe("args", () => {
    it.todo("accepts a T=>ObservableInput");
    it.todo("accepts an operator");
  });

  describe("return tuple", () => {
    it("contains [trigger(T), unsub]", async () => {
      const { result } = await renderHook(() =>
        useCancelableEffect(listeners.num, mergeMap)
      );
      const [trigger, unsub] = result.current;
      expect(trigger).toBeInstanceOf(Function);
      expect(unsub).toBeInstanceOf(Function);
    });

    it.todo("is memoized");
  });

  describe("cancelation", () => {
    it("cancels when unmounted", async () => {
      const calls = [];
      const listenerSpy = jest.fn().mockImplementation(i => {
        calls.push(`start:${i}`);
        return after(100, () => calls.push(`done:${i}`));
      });
      const { result, unmount } = await renderHook(() =>
        useCancelableEffect(listenerSpy, mergeMap)
      );
      const [trigger] = result.current;

      trigger(1);
      trigger(2);
      unmount();

      await after(100 + 1);
      // prettier-ignore
      expect(calls).toEqual([
        'start:1',
        'start:2'
      ]);
    });
  });

  describe("useASAPEffect", () => {
    it("invokes the effect right away when triggered", async () => {
      const calls = [];
      const listenerSpy = jest.fn().mockImplementation(i => {
        calls.push(`start:${i}`);
        return after(100, () => calls.push(`done:${i}`));
      });
      const { result } = await renderHook(() =>
        useASAPEffect<number, any>(listenerSpy)
      );
      const [trigger] = result.current;

      trigger(1);
      trigger(2);

      await after(100 + 1);
      // prettier-ignore
      expect(calls).toEqual([
        'start:1',
        'start:2',
        'done:1',
        'done:2'
      ]);
    });
  });

  describe("useRestartingEffect", () => {
    it("cancels the first and starts a second listener invocation", async () => {
      const calls = [];
      const listenerSpy = jest.fn().mockImplementation(i => {
        calls.push(`start:${i}`);
        return after(100, () => calls.push(`done:${i}`));
      });
      const { result } = await renderHook(() =>
        useRestartingEffect<number, any>(listenerSpy)
      );
      const [trigger] = result.current;

      trigger(1);
      trigger(2);

      await after(100 + 1);
      // prettier-ignore
      expect(calls).toEqual([
        'start:1',
        'start:2',
        'done:2'
      ]);
    });
  });

  describe("useQueuedEffect", () => {
    it("starts the second after the first completes", async () => {
      const calls = [];
      const listenerSpy = jest.fn().mockImplementation(i => {
        calls.push(`start:${i}`);
        return after(100, () => calls.push(`done:${i}`));
      });
      const { result } = await renderHook(() =>
        useQueuedEffect<number, any>(listenerSpy)
      );
      const [trigger] = result.current;

      trigger(1);
      trigger(2);

      await after(300 + 1);
      // prettier-ignore
      expect(calls).toEqual([
        'start:1',
        'done:1',
        'start:2',
        'done:2'
      ]);
    });
  });

  describe("useThrottledEffect", () => {
    it("ignores a second, when a first is already going", async () => {
      const calls = [];
      const listenerSpy = jest.fn().mockImplementation(i => {
        calls.push(`start:${i}`);
        return after(100, () => calls.push(`done:${i}`));
      });
      const { result } = await renderHook(() =>
        useThrottledEffect<number, any>(listenerSpy)
      );
      const [trigger] = result.current;

      trigger(1);
      trigger(2);

      await after(200 + 1);
      // prettier-ignore
      expect(calls).toEqual([
        'start:1',
        'done:1'
      ]);
    });
  });

  describe("useToggledEffect", () => {
    it("cancels it, beginning nothing, when a first is already going", async () => {
      const calls = [];
      const listenerSpy = jest.fn().mockImplementation(i => {
        calls.push(`start:${i}`);
        return after(100, () => calls.push(`done:${i}`));
      });
      const { result } = await renderHook(() =>
        useToggledEffect<number, any>(listenerSpy)
      );
      const [trigger] = result.current;

      trigger(1);
      trigger(2);

      await after(200 + 1);
      // prettier-ignore
      expect(calls).toEqual([
        'start:1'
      ]);
    });
  });
});
