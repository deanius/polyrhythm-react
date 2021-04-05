import React, { useState } from "react";
import { useASAPEffect } from "../../src/useEffects";

export const Counter = ({ id = "counter" }) => {
  const [count, setCount] = useState(0);

  const [inc] = useASAPEffect((e: void) => {
    setCount(c => c + 1);
  });

  return (
    <section>
      <output data-testid={id}>{count}</output>
      <button data-testid={`${id}-button`} onClick={() => inc()}>
        Count
      </button>
    </section>
  );
};
