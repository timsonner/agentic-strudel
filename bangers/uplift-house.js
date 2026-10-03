samples({ bd: 'bd.wav', clap: 'clap.wav', hat: 'hat.wav', chord: 'chord.wav' }, 'http://127.0.0.1:4401/club/')
setcpm(126/4)

let kick = s("bd*4").gain(0.8)
let tick = s("hat*8").gain(0.11).hpf(7500)
let hat = s("~ hat ~ hat").gain(0.22)
let clap = s("~ clap ~ clap").gain(0.4)

// offbeat bounces in G major, short and filtered, not a sub drone
let bass = n("<[~ 0 ~ 0 ~ 2 ~ 4] [~ 4 ~ 4 ~ 6 ~ 1] [~ 5 ~ 5 ~ 7 ~ 2] [~ 3 ~ 3 ~ 5 ~ 0]>")
  .scale("g2:major").s("sawtooth")
  .lpf(680).lpq(5).attack(0.004).decay(0.08).sustain(0).release(0.03).gain(0.22)
let bassBright = n("<[~ 0 ~ 2 ~ 4 ~ 7] [~ 4 ~ 6 ~ 8 ~ 4] [~ 5 ~ 7 ~ 9 ~ 5] [~ 3 ~ 5 ~ 7 ~ 3]>")
  .scale("g2:major").s("sawtooth")
  .lpf(980).lpq(4).attack(0.004).decay(0.07).sustain(0).release(0.03).gain(0.2)

// major roots G D Em C, stab on beat 4; chorus doubles some of them
let stab = n("<[~ ~ ~ 0] [~ ~ ~ 4] [~ ~ ~ 5] [~ ~ ~ 3]>")
  .scale("g3:major").s("chord").gain(0.28).room(0.22)
let stabBright = n("<[~ ~ ~ [0 0]] [~ ~ ~ [4 4?]] [~ ~ ~ [5 5]] [~ ~ ~ [3 3?]]>")
  .scale("g4:major").s("chord").gain(0.3).room(0.28)

let chords = n("<[0,2,4] [4,6,8] [5,7,9] [3,5,7]>")
  .scale("g4:major").s("sawtooth")
  .gain(0.09).attack(0.03).decay(0.16).sustain(0.1).release(0.25)
  .lpf(1500).room(0.32)
let chordsOpen = n("<[0,2,4] [4,6,8] [5,7,9] [7,9,11]>")
  .scale("g4:major").s("sawtooth")
  .gain(0.14).attack(0.02).decay(0.2).sustain(0.16).release(0.4)
  .lpf(sine.range(800, 3000).slow(4)).room(0.48)

let air = n("0 2 4 7").scale("g5:major").slow(2).s("sine")
  .gain(0.05).attack(0.06).decay(0.28).sustain(0).release(0.18)

arrange(
  [4, stack(tick, hat.gain(0.14), stab.gain(0.16)).label("intro").color("cyan")],
  [8, stack(kick, tick, hat, bass, stab).label("groove").color("yellow")],
  [16, stack(kick, tick, hat, clap, bass, stab, chords).label("drop").color("orange")],
  [4, stack(tick, hat.gain(0.16), chordsOpen, air.gain(0.04)).label("lift").color("white")],
  [16, stack(kick, tick, hat, clap, bassBright, stabBright, chords.gain(0.12), air).label("chorus").color("green")],
  [8, stack(tick.gain(0.08), stab.gain(0.12)).label("outro").color("blue")]
).pianoroll({ labels: 1, cycles: 16 })
