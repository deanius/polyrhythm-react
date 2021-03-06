// @ts-nocheck
import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { channel, Channel } from "polyrhythm";
import { ChannelContext } from "../src/useChannel";
import { Counter } from "./examples/01-Counter-Channel";
import { CounterClosure } from "./examples/01-Counter-Channel-Closure";

describe("ChannelContext/useChannel", () => {
  it("shares events by default (usually good)", () => {
    const { queryByTestId: query } = render(
      <ChannelContext.Provider value={channel}>
        <Counter id="counter1" />
        <Counter id="counter2" />
      </ChannelContext.Provider>
    );
    fireEvent.click(query("counter1-button"));
    fireEvent.click(query("counter2-button"));
    expect(query("counter1")).toHaveTextContent("2");
    expect(query("counter2")).toHaveTextContent("2");
  });

  it("separates events with a distinct channel per context", () => {
    const [channel1, channel2] = [new Channel(), new Channel()];
    const { queryByTestId: query } = render(
      <div>
        <ChannelContext.Provider value={channel1}>
          <Counter id="counter1" />
        </ChannelContext.Provider>
        <ChannelContext.Provider value={channel2}>
          <Counter id="counter2" />
        </ChannelContext.Provider>
      </div>
    );
    fireEvent.click(query("counter1-button"));
    fireEvent.click(query("counter2-button"));
    expect(query("counter1")).toHaveTextContent("1");
    expect(query("counter2")).toHaveTextContent("1");
  });

  describe("Returned useListen function", () => {
    it("doesnt close over stale state", () => {
      expect.assertions(1);
      const { queryByTestId: query } = render(<CounterClosure id="cc1" />);

      fireEvent.click(query("cc1-button"));
      fireEvent.click(query("cc1-button"));
      expect(query("cc1")).toHaveTextContent("2");
    });
  });
});
