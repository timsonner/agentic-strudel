# Agentic Strudel

This repo is the Strudel helper, the original sample packs, and the bangers. It sits on a local copy of the official Strudel REPL. Clone that first, run it, then start the helper from here.

## Official Strudel

Clone [uzu/strudel](https://codeberg.org/uzu/strudel) and run the REPL the way that repo documents it. You need Node.js 18 or newer, and pnpm.

    git clone https://codeberg.org/uzu/strudel.git
    cd strudel
    pnpm i
    pnpm dev

The REPL is at http://localhost:4321. Leave that process running.

## Helper

From this repo:

    node server.mjs serve

It listens on http://127.0.0.1:4399. Open the local REPL, then paste this once in the page console (not the editor):

    fetch('http://127.0.0.1:4399/hook.js').then(r=>r.text()).then(eval)

The paste does not survive a reload. Paste it again after the tab refreshes.

With the hook in place, post a pattern to http://127.0.0.1:4399/play and the REPL updates.

## Packs and tracks

Packs live in packs/. The kits are dust, shrine, break, acid, club, drone, and arcade. packs/README.txt describes each hit. The first kit (kick, snare, hat, and pad) is in packs/starter/.

Serve the packs so the REPL can load them:

    python3 pack_server.py

That listens on http://127.0.0.1:4401.

Tracks live in bangers/.
