samples({ kick: 'bd.wav', grit: 'grit.wav', dub: 'dub.wav' }, 'http://127.0.0.1:4401/thud/')
samples({ hat: 'hat.wav', clap: 'clap.wav' }, 'http://127.0.0.1:4401/palm/')

setcpm(120/4)

let kick = slider(0.7, 0, 2, 0.01)
let clap = slider(0.36, 0, 2, 0.01)
let hat = slider(0.16, 0, 2, 0.01)
let grit = slider(0.3, 0, 2, 0.01)
let growl = slider(0.24, 0, 2, 0.01)
let dub = slider(0.2, 0, 2, 0.01)
let didge = slider(0.35, 0, 2, 0.01)
let bassPat = slider(0.85, 0, 2, 0.01)

// A dorian triad, three notes in the bar, turned one step each bar.

let bassLine = n("<[0 0 3 4] [4 3 2 0] [2 0 -1 0] [0 2 4 3]>")
  .scale("a0:dorian")
  .s("gm_acoustic_bass")
  .decay(0.4).sustain(0.15)
  .lpf(2200)
  .gain(bassPat)

let kickPat = s("kick*4").gain(kick)
let clapPat = s("~ clap ~ clap").gain(clap)
let hatPat = s("hat*8").hpf(7000).gain(hat)
let gritPat = s("grit").euclid(3, 8).lpf(420).gain(grit)
let growlPat = s("grit ~ ~ ~").speed(0.45).lpf(120).gain(growl.mul(1.8))
let dubPat = s("dub").slow(2).lpf(280).gain(dub)


let didgePat = n("<0 0 3 0 4 3 0 2>").scale("a1:dorian").s("sawtooth")
  .lpf(sine.range(90, 220).slow(8)).lpq(6)
  .attack(0.4).decay(0.2).sustain(0.8).release(1.2)
  .gain(didge)


arrange(
  [4, stack(didgePat, hatPat).label("intro").color("cyan")],
  [8, stack(didgePat, kickPat, hatPat, bassLine, gritPat).label("groove").color("yellow")],
  [16, stack(didgePat, kickPat, hatPat, clapPat, bassLine, gritPat, growlPat, dubPat).label("drop").color("orange")],
  [8, stack(didgePat, hatPat, bassLine, dubPat).label("break").color("white")],
  [16, stack(didgePat, kickPat, hatPat, clapPat, bassLine, gritPat, growlPat, dubPat).label("return").color("green")]
).pianoroll({ labels: 1, cycles: 16 })
