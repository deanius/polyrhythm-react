import React, { useState } from "react";
import { useChannel } from "../useChannel";

/* Illustrates different scenarios with React hook closures */

export const CounterClosure = ({ id = "counter" }) => {
  const [count, setCount] = useState(0);

  const { useFilter, trigger } = useChannel();

  // State changes ought to usually be done in filters, since
  // they have no async part. Deps are the last argument.
  useFilter(
    "count/increment",
    (/* event */) => {
      // You can avoid a bug by passing deps
      setCount(count + 1);

      // Deps alternatives:

      // You can use functional setState
      // setCount(c => c + 1);

      // Or use a state value captured in the event handler
      // setCount(event.payload.count + 1);
    },
    [count]
  );

  // If you use a listener that closes over variables, deps get passed
  // as an option to the ListenerConfig, or as a final argument.

  // useListener(
  //   "count/increment",
  //   (/* event */) => {
  //     // You can avoid a bug by passing deps
  //     setCount(count + 1);

  //     // Deps alternatives:

  //     // You can use functional setState
  //     // setCount(c => c + 1);

  //     // Or use a state value captured in the event handler
  //     // setCount(event.payload.count + 1);
  //   },
  //   {},
  //   [count]
  // );

  return (
    <section>
      <output data-testid={id}>{count}</output>
      <button
        data-testid={`${id}-button`}
        onClick={() => trigger("count/increment", { count })}
      >
        Count
      </button>
    </section>
  );
};
