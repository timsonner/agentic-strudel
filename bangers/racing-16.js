samples({ kick: 'punch.wav' }, 'http://127.0.0.1:4401/thud/')
samples({ hat: 'hat.wav', snare: 'clap.wav' }, 'http://127.0.0.1:4401/palm/')
samples({ noise: 'noise.wav' }, 'http://127.0.0.1:4401/arcade/')

setcpm(156/4)

let kick = slider(0.82, 0, 2, 0.01)
let snare = slider(0.4, 0, 2, 0.01)
let hat = slider(0, 0, 2, 0.01)
let bass = slider(0.5, 0, 2, 0.01)
let lead = slider(0.34, 0, 2, 0.01)
let pulse = slider(0.26, 0, 2, 0.01)
let arp = slider(0.2, 0, 2, 0.01)
let noise = slider(0.12, 0, 2, 0.01)

let kickDrive = s("kick*4").gain(kick)
let kickFast = s("[kick ~ kick kick]*2").gain(kick)
let snareBack = s("~ snare ~ snare").gain(snare)
let snareBuild = s("<[~ snare ~ snare] [snare*4] [snare*8] [snare*16]>").gain(snare.mul(0.55))
let hatTick = s("hat*16").end(0.07).hpf(5500).gain(hat)
let hatFast = s("hat*32").end(0.04).hpf(6000).gain(hat)

let bassLine = n("<[0 0 0 3] [3 4 3 0] [4 4 5 4] [3 0 4 0]>*2")
  .scale("e2:major")
  .s("square")
  .attack(0.005).decay(0.11).sustain(0.32).release(0.04)
  .lpf(1300)
  .crush(5)
  .gain(bass)

let bassFast = n("<[0 3 0 4] [3 4 5 4] [4 5 4 3] [0 4 3 0]>*2")
  .scale("e2:major")
  .s("square")
  .attack(0.004).decay(0.07).sustain(0.22).release(0.03)
  .lpf(1600)
  .crush(5)
  .gain(bass)

let leadHook = n("<[0 2 4 3] [2 1 0 4] [0 2 3 4] [5 4 2 0]>")
  .scale("e4:major")
  .s("square")
  .attack(0.004).decay(0.09).sustain(0.12).release(0.05)
  .lpf(3400)
  .crush(6)
  .gain(lead)

let leadFast = n("<[0 2 4 7] [5 4 2 4] [3 2 0 2] [4 5 7 4]>*2")
  .scale("e5:major")
  .s("square")
  .attack(0.003).decay(0.05).sustain(0.08).release(0.03)
  .lpf(4200)
  .crush(6)
  .gain(lead)

let pulseBed = n("<[0 0 2 0] [3 3 4 3]>")
  .scale("e3:major")
  .s("pulse").pw(0.28).pwrate(0.15)
  .attack(0.01).decay(0.14).sustain(0.45).release(0.08)
  .lpf(1700)
  .gain(pulse)

let pulseFast = n("<[4 2 0 2] [3 4 5 4] [2 0 2 4] [5 4 3 2]>*2")
  .scale("e4:major")
  .s("pulse").pw(0.18)
  .attack(0.003).decay(0.05).sustain(0.1).release(0.03)
  .lpf(2600)
  .gain(pulse)

let arpRise = n("0 2 4 6 7 6 4 2")
  .scale("e5:major")
  .s("pulse").pw(0.35)
  .attack(0.002).decay(0.07).sustain(0).release(0.03)
  .gain(arp)

let noisePuff = s("~ ~ noise ~").end(0.1).hpf(2200).gain(noise)
let noiseRush = s("noise*8").end(0.03).hpf(2800).lpf(9000).gain(noise.mul(0.65))

arrange(
  [4, stack(hatTick, arpRise, pulseBed).label("intro").color("cyan")],
  [8, stack(kickDrive, snareBack, hatTick, bassLine, leadHook, pulseBed, noisePuff).label("straight").color("yellow")],
  [4, stack(hatTick, snareBuild, bassLine, pulseBed, noiseRush).label("corner").color("white")],
  [8, stack(kickFast, snareBack, hatFast, bassFast, leadFast, pulseFast, noiseRush).label("chorus").color("orange")],
  [4, stack(hatTick, arpRise, pulseBed, noisePuff).label("outro").color("green")]
).pianoroll({ labels: 1, cycles: 16 })
