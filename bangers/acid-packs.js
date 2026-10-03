samples({
  abd: 'bd.wav',
  ahat: 'hat.wav',
  aoh: 'oh.wav',
  aclap: 'clap.wav',
  zap: 'zap.wav'
}, 'http://127.0.0.1:4401/acid2/')

samples({
  dhat: 'hat.wav',
  growl: 'growl.wav'
}, 'http://127.0.0.1:4401/dirt/')

samples({ thump: 'thump.wav' }, 'http://127.0.0.1:4401/grunge/')

samples({
  ring: 'ring.wav'
}, 'http://127.0.0.1:4401/rust/')

setcpm(132/4)

// slider(value, min, max, step). The value IS the gain. One fader per part.
// Variants that used a different baked level get their own fader so the arc stays put.
let kick = slider(0.7, 0, 2, 0.01)
let kickThin = slider(0.32, 0, 2, 0.01)
let hats = slider(0.16, 0, 2, 0.01)
let hatsSoft = slider(0.08, 0, 2, 0.01)
let oh = slider(0.15, 0, 2, 0.01)
let dirt = slider(0.14, 0, 2, 0.01)
let bass = slider(0.32, 0, 2, 0.01)
let bassIntroLv = slider(0.2, 0, 2, 0.01)
let bassDropLv = slider(0.36, 0, 2, 0.01)
let bassWaveLv = slider(0.38, 0, 2, 0.01)
let bassOutLv = slider(0.16, 0, 2, 0.01)
let hit = slider(0.24, 0, 2, 0.01)
let clap = slider(0.32, 0, 2, 0.01)
let zap = slider(0.38, 0, 2, 0.01)
let growl = slider(0.26, 0, 2, 0.01)

// 303-style one-voice square. Scale degrees, A minor, leaps and rests.
let line = n(`<
  [0 ~ 0 3 ~ 7 0 10 12 ~ 10 7 ~ 3 5 7]
  [0 ~ 3 ~ 7 10 ~ 12 10 7 ~ 5 3 ~ 0 ~]
  [0 0 3 ~ 7 ~ 8 10 ~ 12 15 12 10 7 3 0]
  [~ 0 3 7 10 12 10 7 5 ~ 3 0 ~ 3 7 10]
>`).scale("a2:minor").s("square")
  .attack(0.001).decay(0.11).sustain(0.08).release(0.04)
  .lpq(14)

let bassIntro = line.lpf(280).gain(bassIntroLv)
let bassGroove = line.lpf(sine.range(360, 1400).slow(4)).lpenv(2).gain(bass)
let bassDrop = line.lpf(sine.range(520, 3600).slow(8)).lpenv(sine.range(1.5, 6).slow(8)).gain(bassDropLv)
let bassBreak = line.lpf(sine.range(220, 800).slow(4)).gain(bassIntroLv)
let bassWave = line.lpf(sine.range(1100, 5400).slow(4)).lpenv(4).gain(bassWaveLv)
let bassOut = line.lpf(sine.range(1000, 240).slow(8)).gain(bassOutLv)

let kickPat = s("abd*4").gain(kick)
let kickThinPat = s("abd*4").gain(kickThin)

let hatPat = s("ahat*8").gain(hats).hpf(7000)
let hatSoft = s("ahat*8").gain(hatsSoft).hpf(7000)
let ohPat = s("~ aoh ~ aoh").gain(oh)
let dirtHats = s("dhat*8").gain(dirt).hpf(4200)

let blipPat = n("~ [c5 e5] ~ [e5 g5]").s("square").decay(0.05).sustain(0).gain(clap)

let hitOff = s("~ thump ~ thump").speed(0.5).lpf(180).gain(hit.mul(1.6))
let zapHit = s("~ ~ ~ zap").slow(4).gain(zap)
let growlPat = s("growl ~ ~ growl").gain(growl).lpf(700)

arrange(
  [8, stack(hatSoft, bassIntro).label("intro").color("cyan")],
  [8, stack(kickPat, hatPat, ohPat, bassGroove, hitOff).label("groove").color("yellow")],
  [16, stack(kickPat, hatPat, ohPat, blipPat, bassDrop, hitOff, zapHit).label("drop").color("orange")],
  [8, stack(hatSoft, bassBreak, growlPat).label("break").color("white")],
  [16, stack(kickPat, dirtHats, ohPat, blipPat, bassWave, hitOff, zapHit).label("second wave").color("hotpink")],
  [8, stack(kickThinPat, hatSoft, bassOut).label("outro").color("blue")]
).pianoroll({ labels: 1, cycles: 16 })
