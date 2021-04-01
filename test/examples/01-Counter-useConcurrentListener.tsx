import React, { useState } from "react";
import { useASAPListener } from "../../src/useListeners";
import { trigger } from "../../src/useChannel";

export const Counter = ({ id = "counter" }) => {
  const [count, setCount] = useState(0);

  useASAPListener("count/increment", () => {
    setCount(c => c + 1);
  });

  return (
    <section>
      <output data-testid={id}>{count}</output>
      <button
        data-testid={`${id}-button`}
        onClick={() => trigger("count/increment")}
      >
        Count
      </button>
    </section>
  );
};
