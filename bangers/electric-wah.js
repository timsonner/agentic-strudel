samples({ kick: 'punch.wav' }, 'http://127.0.0.1:4401/thud/')
samples({ hat: 'hat.wav', snare: 'clap.wav' }, 'http://127.0.0.1:4401/palm/')

setcpm(122/4)

let kick = slider(0.72, 0, 2, 0.01)
let snare = slider(0.58, 0, 2, 0.01)
let hat = slider(0.16, 0, 2, 0.01)
let guitar = slider(0.42, 0, 2, 0.01)

let tone = (p) => p
  .voicing()
  .anchor("e2")
  .s("sawtooth")
  .attack(0.005).decay(0.2).sustain(0.5)
  .lpf(1800)
  .distort(1.6).distortvol(0.45).distorttype("diode")
  .gain(guitar)

// Em, G, A, Em. Em and G stay short. A holds a little longer.
let guitarLine = stack(
  tone(chord("<Em G ~ Em>").struct("x ~ x [x ~] x ~ x ~").clip(0.78).release(0.36)),
  tone(chord("<~ ~ A ~>").struct("x@2 ~ x").legato(1).clip(1).release(0.55))
)

let kickPat = s("kick*4").speed(0.72).lpf(140).gain(kick)
let snarePat = s("~ snare ~ snare").end(0.35).hpf(280).gain(snare)
let hatPat = s("hat*8").end(0.09).hpf(6200).gain(hat)

arrange(
  [4, stack(hatPat, guitarLine).label("hum").color("cyan")],
  [8, stack(kickPat, hatPat, guitarLine).label("current").color("yellow")],
  [16, stack(kickPat, snarePat, hatPat, guitarLine).label("arc").color("orange")],
  [8, stack(kickPat, hatPat, guitarLine).label("coast").color("blue")]
).pianoroll({ labels: 1, cycles: 8 })
