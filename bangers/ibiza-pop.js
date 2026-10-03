samples({ bd: 'bd.wav', clap: 'clap.wav', hat: 'hat.wav', chord: 'chord.wav' }, 'http://127.0.0.1:4401/club/')
setcpm(124/4)

let kick = slider(1, 0, 2, 0.01)
let hats = slider(1, 0, 2, 0.01)
let clap = slider(1, 0, 2, 0.01)
let bass = slider(1, 0, 2, 0.01)
let chords = slider(1, 0, 2, 0.01)
let hook = slider(1, 0, 2, 0.01)

let kickPat = s("bd*4").gain(kick.mul(0.76))
let tick = s("hat*8").gain(hats.mul(0.1)).hpf(7200)
let hat = s("~ hat ~ hat").gain(hats.mul(0.24))
let clapPat = s("~ clap ~ clap").gain(clap.mul(0.36))
let clapPop = s("~ clap ~ [clap clap?]").gain(clap.mul(0.38))

// offbeat bounce on F C Dm Bb, short triangle, not a sub drone
let bassPat = n("<[~ 0 ~ 0 ~ 2 ~ 4] [~ 4 ~ 4 ~ 6 ~ 1] [~ 5 ~ 5 ~ 7 ~ 2] [~ 3 ~ 3 ~ 5 ~ 0]>")
  .scale("f2:major").s("triangle")
  .lpf(480).lpq(3).attack(0.004).decay(0.09).sustain(0).release(0.04).gain(bass.mul(0.34))
let bassLift = bassPat.lpf(720).gain(bass.mul(0.36))

// I-V-vi-IV, F C Dm Bb
let chordsPat = n("<[0,2,4] [4,6,8] [5,7,9] [3,5,7]>")
  .scale("f4:major").s("triangle")
  .gain(chords.mul(0.15)).attack(0.02).decay(0.2).sustain(0.12).release(0.3)
  .lpf(2400).room(0.34)
let chordsOpen = chordsPat.lpf(sine.range(700, 3200).slow(8)).gain(chords.mul(0.2)).room(0.5)

// one quiet saw, chorus only
let shine = n("<[0,2,4] [4,6,8] [5,7,9] [3,5,7]>")
  .scale("f5:major").s("sawtooth")
  .gain(0.04).attack(0.04).decay(0.18).sustain(0.06).release(0.28)
  .lpf(1600).room(0.4)

let stab = n("<[~ ~ ~ 0] [~ ~ ~ 4] [~ ~ ~ 5] [~ ~ ~ 3]>")
  .scale("f3:major").s("chord").gain(0.24).room(0.24)
let stabPop = n("<[~ ~ ~ [0 0]] [~ ~ ~ [4 4?]] [~ ~ ~ [5 5]] [~ ~ ~ [3 3?]]>")
  .scale("f4:major").s("chord").gain(0.26).room(0.3)

// short pop hook, four notes a bar
let hookPat = n("<[0 2 4 7] [4 6 4 8] [5 7 5 4] [3 2 0 ~]>")
  .scale("f5:major").s("triangle")
  .attack(0.008).decay(0.16).sustain(0.04).release(0.1).gain(hook.mul(0.2))
let hookHigh = n("<[0 2 4 7] [4 6 4 8] [5 7 5 4] [3 2 0 ~]>")
  .scale("f6:major").s("sine")
  .attack(0.01).decay(0.14).sustain(0.02).release(0.1).gain(hook.mul(0.12))
let hookThird = n("<[2 4 6 9] [6 8 6 10] [7 9 7 6] [5 4 2 ~]>")
  .scale("f5:major").s("sine")
  .attack(0.01).decay(0.14).sustain(0).release(0.1).gain(hook.mul(0.08))

arrange(
  [4, stack(tick, hat.gain(hats.mul(0.14)), stab.gain(0.14), chordsPat.gain(chords.mul(0.08))).label("intro").color("cyan")],
  [8, stack(kickPat, tick, hat, bassPat, stab, chordsPat.gain(chords.mul(0.1))).label("groove").color("yellow")],
  [16, stack(kickPat, tick, hat, clapPat, bassPat, stab, chordsPat, hookPat).label("drop").color("orange")],
  [8, stack(tick.gain(hats.mul(0.08)), hat.gain(hats.mul(0.16)), chordsOpen, hookPat.gain(hook.mul(0.1))).label("breakdown").color("white")],
  [16, stack(kickPat, tick, hat, clapPop, bassLift, stabPop, chordsPat.gain(chords.mul(0.16)), shine, hookPat, hookHigh, hookThird).label("chorus").color("hotpink")],
  [8, stack(tick.gain(hats.mul(0.07)), stab.gain(0.1)).label("outro").color("blue")]
).pianoroll({ labels: 1, cycles: 16 })
