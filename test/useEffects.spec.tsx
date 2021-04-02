import { renderHook } from "@testing-library/react-hooks";
import { useConcurrentEffect } from "../src/useEffects";
import { of } from "rxjs";
import { mergeMap } from "rxjs/operators";

describe.only("useConcurrentEffect", () => {
  let listeners = {
    num: (n: number) => of(n),
  };
  describe("args", () => {
    it.todo("accepts a T=>ObservableInput");
    it.todo("accepts an operator");
  });

  describe("return tuple", () => {
    it("contains [trigger(T), unsub]", async () => {
      const { result } = await renderHook(() =>
        useConcurrentEffect(listeners.num, mergeMap)
      );
      const [trigger, unsub] = result.current;
      expect(trigger).toBeInstanceOf(Function);
      expect(unsub).toBeInstanceOf(Function);
    });

    it("is memoized", async () => {
      const { result } = await renderHook(() =>
        useConcurrentEffect(listeners.num, mergeMap)
      );
      const [trigger, unsub] = result.current;

      const { result: second } = await renderHook(() =>
        useConcurrentEffect(listeners.num, mergeMap)
      );
      const [trigger2, unsub2] = second.current;

      expect(trigger2).toStrictEqual(trigger);
      expect(unsub2).toStrictEqual(unsub);
    });
  });

  describe("cancelation", () => {
    it.todo("unsubscribes on unmount");
  });

  describe("useASAPEffect", () => {
    it.todo("calls useConcurrentEffect with mergeMap");
  });
});
