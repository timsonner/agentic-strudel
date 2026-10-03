# Agentic Strudel

This repo is the Strudel helper, the original sample packs, and the bangers.

Start the helper from this directory with:

    node server.mjs serve

It listens on http://127.0.0.1:4399. Hook the REPL by pasting this once in the page console:

    fetch('http://127.0.0.1:4399/hook.js').then(r=>r.text()).then(eval)

The paste does not survive a reload. Paste it again after the tab refreshes.

Packs live in packs/. The kits are dust, shrine, break, acid, club, drone, and arcade. packs/README.txt describes each hit. The first kit (kick, snare, hat, and pad) is in packs/starter/.

bangers/ is for patterns worth keeping. bangers/club-groove.js is the 118 bpm A minor groove. bangers/edm-drop.js is the 126 bpm F minor house track. bangers/edm-wave.js is the 128 bpm A minor fluctuation track. bangers/uplift-house.js is the 126 bpm G major house track. Each arrange section is labeled, and the pianoroll shows which one is playing.
