// @ts-nocheck
import React, { useState } from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useEffectAtMount, useEffectAfterMount } from "../src/useEffectAt";
import { useListener } from "../src/useChannel";
import { trigger } from "polyrhythm";

const ThingOne = ({ firstRun }) => {
  useEffectAtMount(firstRun);
  return null;
};

function getMocks() {
  const canceler = jest.fn();
  const effect = jest.fn(() => {
    return canceler;
  });
  return [canceler, effect];
}

describe("useEffectAtMount", () => {
  it("runs upon first mount", () => {
    const firstRun = jest.fn();
    const { queryByTestId: query } = render(<ThingOne firstRun={firstRun} />);
    expect(firstRun).toHaveBeenCalled();
  });

  it("runs the cancelation function upon unmount", () => {
    const [canceler, firstRun] = getMocks();
    const { unmount } = render(<ThingOne firstRun={firstRun} />);

    expect(firstRun).toHaveBeenCalled();
    expect(canceler).not.toHaveBeenCalled();

    unmount();

    expect(canceler).toHaveBeenCalled();
  });
});

const ThingTwo = ({ firstRun }) => {
  useEffectAfterMount(firstRun);
  return null;
};

const ThingThree = ({ count, effect }) => {
  useEffectAfterMount(effect, [count]);
  return null;
};

describe("useEffectAfterMount", () => {
  it("does not run upon the first mount", () => {
    const firstRun = jest.fn();
    render(<ThingTwo firstRun={firstRun} />);
    expect(firstRun).not.toHaveBeenCalled();
  });

  it("does not run the cancelation function on unmount", () => {
    const [canceler, firstRun] = getMocks();
    const { unmount } = render(<ThingTwo firstRun={firstRun} />);

    unmount();

    expect(canceler).not.toHaveBeenCalled();
  });

  it("skips mount and unmount, but runs effect upon changes", () => {
    const Wrapper = ({ effect }) => {
      const [count, setCount] = useState(0);
      useListener("inc", () => setCount(c => c + 1));
      useEffectAfterMount(effect, [count]);
      return null;
    };

    const [canceler, effect] = getMocks();

    const { unmount } = render(<Wrapper effect={effect} />);
    expect(effect).not.toHaveBeenCalled();

    act(() => {
      trigger("inc");
    });
    expect(effect).toHaveBeenCalledTimes(1);
    expect(canceler).not.toHaveBeenCalled();

    act(() => {
      trigger("inc");
    });
    expect(effect).toHaveBeenCalledTimes(2);
    expect(canceler).toHaveBeenCalledTimes(1);

    unmount();
    expect(canceler).toHaveBeenCalledTimes(2);
  });
});
