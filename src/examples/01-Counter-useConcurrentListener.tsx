import React, { useState } from "react";
import { useASAPEffect } from "../useListeners";
import { trigger } from '../useChannel'

export const Counter = ({ id = "counter" }) => {
  const [count, setCount] = useState(0);

  useASAPEffect("count/increment", () => {
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
