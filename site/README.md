# Novel Loop Board

An Astro + shadcn/ui companion site for this repository's creative iteration loop:

`Benchmark -> Hypothesis / Direction -> Work Upon It -> Complete -> Benchmark`

The app is designed to stay on one screen on desktop by default, with a compact kanban layout and an auto-cycle mode that advances one card per lane each round.

## Run it

```sh
cd site
npm install
npm run dev
```

## Build it

```sh
cd site
npm run build
```

## Notes

- Add a new novel by typing a title into the input and pressing Enter.
- `Complete` feeds back into `Benchmark`, increasing the pass count each time the loop turns over.
- Board state is saved in `localStorage`, so refreshes keep your current queue.
