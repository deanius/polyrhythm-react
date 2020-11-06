// @ts-nocheck
import "@testing-library/jest-dom";
import { triggerAllMiddleware } from "../src/middleware";
import { Observable } from "rxjs";
import { query } from "polyrhythm";

describe("triggerAllMiddleware", () => {
  const anyEvent = { type: "test-foo" };

  // Works, but verbose
  it("triggers any event", async () => {
    const nextSpy = () => null;
    const dispatch = triggerAllMiddleware()(null)(nextSpy);

    await eventsOf(query(true), async events => {
      await dispatch(anyEvent);

      expect(events).toEqual([anyEvent]);
    });
  });

  it(
    "triggers any event2",
    E$(async events => {
      const nextSpy = () => null;
      const dispatch = triggerAllMiddleware()(null)(nextSpy);
      await dispatch(anyEvent);
      expect(events).toEqual([anyEvent]);
    })
  );
});
function E$<T>(testFn: (arg: T[]) => void) {
  return function() {
    const seen = new Array<T>();
    const sub = query(true).subscribe(event => seen.push(event));
    return testFn(seen).finally(() => sub.unsubscribe());
  };
}

async function eventsOf<T>(
  observable: Observable<T>,
  tester: (arg: T[]) => void
) {
  const seen = new Array<T>();
  const sub = observable.subscribe(event => seen.push(event));
  try {
    await tester(seen);
    sub.unsubscribe();
  } finally {
    !sub.closed && sub.unsubscribe();
  }
}
