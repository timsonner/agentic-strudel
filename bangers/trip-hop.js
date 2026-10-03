samples({ kick: 'bd.wav', hat: 'hat.wav' }, 'http://127.0.0.1:4401/slab/')
samples({ snare: 'sd.wav' }, 'http://127.0.0.1:4401/slab/')
samples({ thump: 'thump.wav' }, 'http://127.0.0.1:4401/grunge/')
samples({ vinyl: 'vinyl.wav' }, 'http://127.0.0.1:4401/night/')

setcpm(90/4)

// One fader per part. slider(default, min, max, step) is the gain.
let kick = slider(0.68, 0, 2, 0.01)
let snare = slider(0.34, 0, 2, 0.01)
let hat = slider(0.1, 0, 2, 0.01)
let thump = slider(0.3, 0, 2, 0.01)
let bass = slider(0.46, 0, 2, 0.01)
let vinyl = slider(0.14, 0, 2, 0.01)

// A minor, low sine. Four bars that walk instead of sitting on one note.
let bassPat = n("<[0@6 3@2] [5@4 3@2 0@2] [-2@4 0@4] [3@4 5@2 0@2]>")
  .scale("a1:minor")
  .s("sine")
  .attack(0.03).decay(0.45).sustain(0.4).release(0.35)
  .lpf(150)
  .lpq(1)
  .gain(bass)

// Sparse boom-bap. Kick on 1 and the and of 3. Snare on 2 and 4.
let kickPat = s("kick ~ ~ ~ ~ kick ~ ~").gain(kick)
let snarePat = s("~ ~ snare ~ ~ ~ snare ~").room(0.22).gain(snare)
let hatPat = s("~ hat ~ ~ ~ hat ~ hat").hpf(6000).gain(hat)
let thumpPat = s("~ ~ ~ ~ ~ ~ ~ thump").speed(0.72).lpf(130).gain(thump)
let vinylPat = s("vinyl").slow(2).lpf(3200).gain(vinyl)

arrange(
  [8, stack(vinylPat, bassPat).label("intro").color("cyan")],
  [8, stack(kickPat, hatPat, bassPat, vinylPat).label("groove").color("white")],
  [16, stack(kickPat, snarePat, hatPat, thumpPat, bassPat, vinylPat).label("middle").color("orange")],
  [8, stack(hatPat, bassPat, vinylPat).label("outro").color("blue")]
).pianoroll({ labels: 1, cycles: 16 })
