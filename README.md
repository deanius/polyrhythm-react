[![npm version](https://badge.fury.io/js/polyrhythm-react.svg)](https://badge.fury.io/js/polyrhythm-react)
[![Travis](https://img.shields.io/travis/deanius/polyrhythm-react.svg)](https://travis-ci.org/deanius/polyrhythm-react)

# polyrhythm-react 🎵🎶

`polyrhythm-react` gives you ways to use `polyrhythm` in a React context.

`polyrhythm` is a Domain Specific Language for building UIs with JavaScript. [See the `polyrhythm` README](https://github.com/deanius/polyrhtyhm)

It's a synthesis of ideas from:

- 💙JQuery, particularly [#on](https://api.jquery.com/on/) and [#trigger](https://api.jquery.com/trigger/).
- 💜RxJS. Older than Promises, nearly as old as JQuery.
- 💜Redux-Observable, Redux Saga, Redux Thunk.

and can functionally replace parts or all of these in your app, adding under 8Kb to your bundle size.

## Installation

```
npm install polyrhythm-react
```

# Responding to events

`useFilter` and `useListener` are React wrappers over the `polyrhythm` exported functions `filter` and `listen`. What these hooks do is scope the lifetime of the event listener, and its side-effects, to the lifetime of the component. This has the benefit that effects will not accidentally linger beyond the lifetime of the component (and you can "lift" their listeners to a higher component in the tree if you want those effects to continue.)

`deps`, may be passed, so as not to close over stale values - however, a best practice is not to read state in the event listener, but in the triggerer, and pass that along in the event.

_TODO: Examples_

# Mount-time Hooks

`useEffectAtMount` - there should be a lint rule to insist that calls to `useEffect(fn, [])` get rewritten to the more self-explanatory "use effect at mount". Its purpose is to scope the lifetime of a cancelable effect to that of its component.

`useEffectAfterMount` allows you to skip running the effect upon component's first render. Perfect for when you mean to specify an effect to run only upon changes of a certain value, with cancelation, but not at mount time. Example `useEffectAfterMount(sendToAnalytics, [clickCount])`.

# Multiple Channel support

`useChannel` is available for more advanced scenarios where a different channel is desired, such as for keeping one sub-tree's events separated from the default, for privacy, simulating a server in-browser (!), or other reasons.

## For More Information

See the benefits and learn more in the [`polyrhythm` README](https://github.com/deanius/polyrhythm).
