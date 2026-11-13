# Agentic Strudel

This repo is a local control channel for a [Strudel](https://codeberg.org/uzu/strudel) REPL, plus original one-shot sample packs and pattern files. The helper queues play, code, and stop commands for a hook pasted into the REPL page. The packs are synthesized 16-bit, 44.1 kHz mono wav files, served so the REPL can load them.

## Prerequisites

- Node.js 18 or newer. `server.mjs` uses the built-in `fetch` and has no npm dependencies.
- Python 3. `pack_server.py` uses only the standard library.
- A local [uzu/strudel](https://codeberg.org/uzu/strudel) checkout, which needs [pnpm](https://pnpm.io/installation).

Nothing in this repo is installed or built.

## Run

Start the official REPL and leave it running. `pnpm dev` runs the website dev server, which listens on port 4321:

```bash
git clone https://codeberg.org/uzu/strudel.git
cd strudel
pnpm i
pnpm dev
```

The REPL is at http://localhost:4321.

From this repo, in two terminals:

```bash
node server.mjs serve
```

```bash
python3 pack_server.py
```

The helper listens on http://127.0.0.1:4399. The pack server listens on http://127.0.0.1:4401 and serves `packs/` with CORS.

This repo has no test runner. Confirm both servers:

```bash
curl -fsS http://127.0.0.1:4399/state
curl -fsSI http://127.0.0.1:4401/starter/bd.wav
```

## Usage

Open the local REPL, then paste this once in the page console (not the editor). The paste does not survive a reload. `node server.mjs paste` prints the same line.

```js
fetch('http://127.0.0.1:4399/hook.js').then(r=>r.text()).then(eval)
```

The first `play` in a tab waits until the page is clicked, then playback continues.

Send a pattern while the helper is running:

```bash
curl -fsS http://127.0.0.1:4399/play -X POST --data-binary @pattern.js
curl -fsS http://127.0.0.1:4399/play -X POST --data-binary @bangers/science.js
curl -fsS http://127.0.0.1:4399/code -X POST --data-binary @pattern.js
curl -fsS http://127.0.0.1:4399/stop -X POST
curl -fsS http://127.0.0.1:4399/state
```

`/play` evaluates the body. An empty body evaluates the last code sent. `/code` updates the editor and does not evaluate. A JSON body is `{"code":"..."}`.

The client reads `play` and `code` from stdin:

```bash
node server.mjs play < bangers/science.js
node server.mjs state
node server.mjs stop
```

`pattern.js` uses a built-in Strudel bank. Tracks under `bangers/` that call `samples(..., 'http://127.0.0.1:4401/...')` need the pack server. `bangers/electric-wah.js` loads `thud/` and `palm/`. `packs/README.txt` describes every hit.

```js
samples({ bd: 'bd.wav', hh: 'hh.wav' }, 'http://127.0.0.1:4401/starter/')
setcpm(120/4)
s("bd ~ hh ~")
```

## Layout

- `server.mjs` — helper on port 4399 (`serve`, `state`, `play`, `stop`, `code`, `paste`)
- `hook.js` — script the REPL page evaluates
- `pack_server.py` — serves `packs/` on port 4401
- `packs/` — wav directories, including `starter/`; see `packs/README.txt`
- `bangers/` — Strudel pattern files
- `pattern.js` — short pattern used by the helper examples
