// @ts-nocheck
import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { channel, Channel } from "polyrhythm";
import { ChannelContext } from "../src/useChannel";
import { Counter } from "../src/7GUIs/01-Counter-Channel";

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
});
