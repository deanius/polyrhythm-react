import React, { useState } from "react";
import { useListener } from "../useChannel";

/* Illustrates different scenarios with React hook closures */

export const CounterClosure = ({ id = "counter" }) => {
  const [count, setCount] = useState(0);

  // State changes ought to usually be done in filters, since
  // they have no async part.
  // const [trigger] = useFilter("count/increment", (/* event */) => {
  //   // Deps alternatives:
  //   // You can use functional setState
  //   setCount(c => c + 1);

  //   // Or use a state value captured in the event handler
  //   // setCount(event.payload.count + 1);
  // });

  const [trigger] = useListener(
    "count/increment",
    (/* event */) => {
      // Deps alternatives:

      // You can use functional setState
      setCount(c => c + 1);

      // Or use a state value captured in the event handler
      // setCount(event.payload.count + 1);
    },
    {}
  );

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
