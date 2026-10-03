samples({ bd: 'bd.wav', clap: 'clap.wav', hat: 'hat.wav', chord: 'chord.wav' }, 'http://127.0.0.1:4401/club/')
setcpm(102/4)

// slowed big beat: broken kicks, backbeat claps, not four-on-the-floor
let brk = s("[bd ~ ~ bd] [~ bd ~ ~] [bd ~ bd ~] [~ ~ bd ~]").gain(0.8)
let brkHard = s("[bd ~ bd ~] [~ ~ bd bd] [~ bd ~ ~] [bd ~ ~ bd]").gain(0.8)
let kickOne = s("bd ~ ~ ~ ~ ~ ~ ~").gain(0.72)
let hat = s("hat*8").gain(0.2).hpf(6500)
let hatOff = s("~ ~ hat ~ ~ ~ hat ~").gain(0.15)
let clap = s("~ ~ clap ~ ~ ~ clap ~").gain(0.4)
let clapPush = s("~ ~ clap ~ ~ clap? clap ~").gain(0.38)

let bass = n("0 ~ 0 ~ -2 0 ~ 3").scale("e1:minor").s("square")
  .lpf(240).lpq(9).attack(0.004).decay(0.1).sustain(0).release(0.04)
  .distort(0.16).gain(0.4)
let bassDrop = n("0 0 ~ 0 -2 ~ 3 0").scale("e1:minor").s("sine")
  .lpf(480).lpq(7).attack(0.003).decay(0.08).sustain(0).release(0.03)
  .distort(0.06).gain(0.44)
let bassWave = n("0 ~ -2 0 3 ~ 5 3").scale("e1:minor").s("square")
  .lpf(640).lpq(6).attack(0.003).decay(0.07).sustain(0).release(0.03)
  .distort(0.18).gain(0.42)

// three bars of the same stab, then a turnaround
let riff = note("<[e3 ~ g3 a3 ~ e3 bb3 a3] [e3 ~ g3 a3 ~ e3 bb3 a3] [e3 ~ g3 a3 ~ e3 bb3 a3] [g3 a3 bb3 c4 ~ bb3 a3 g3]>")
  .s("triangle")
  .lpf(1600).lpq(5)
  .attack(0.006).decay(0.14).sustain(0.04).release(0.05)
  .distort(0.08).gain(0.2)
let stab = note("~ [e3,g3,b3] ~ [e3,g3,bb3]").s("square")
  .attack(0.005).decay(0.18).sustain(0).release(0.06)
  .lpf(700).distort(0.16).gain(0.12)
let chordHit = s("chord").struct("~ ~ 1 ~ ~ ~ 1 ~").gain(0.2).lpf(1200).room(0.18)

let riffRise = riff.lpf(sine.range(180, 2400).slow(8)).gain(0.16)

arrange(
  [8, stack(hat.gain(0.12), kickOne.gain(0.55), riff.lpf(320).gain(0.1)).label("intro").color("cyan")],
  [8, stack(brk, hat, clap, bass, riff.lpf(900).gain(0.16)).label("groove").color("white")],
  [16, stack(brkHard, hat, hatOff, clapPush, bassDrop, riff, stab).label("drop").color("orange")],
  [8, stack(hat.gain(0.1), riffRise, stab.gain(0.06)).label("break").color("violet")],
  [16, stack(brk, hat, hatOff, clap, bassWave, riff, chordHit).label("wave").color("red")],
  [8, stack(kickOne.gain(0.5), hat.gain(0.08), riff.lpf(280).gain(0.08)).label("outro").color("blue")]
).pianoroll({ labels: 1, cycles: 16 })
