samples({
  abd: 'bd.wav',
  ahat: 'hat.wav'
}, 'http://127.0.0.1:4401/acid2/')

samples({ growl: 'growl.wav' }, 'http://127.0.0.1:4401/dirt/')

samples({ thump: 'thump.wav' }, 'http://127.0.0.1:4401/grunge/')

samples({ ssd: 'sd.wav' }, 'http://127.0.0.1:4401/slab/')


setcpm(106/4)

// One fader per part. slider(default, min, max, step) is the gain.
let kick = slider(0.72, 0, 2, 0.01)
let hats = slider(0.16, 0, 2, 0.01)
let wah = slider(0.34, 0, 2, 0.01)
let growl = slider(0.28, 0, 2, 0.01)
let thump = slider(0.4, 0, 2, 0.01)
let snare = slider(0.26, 0, 2, 0.01)

// Low saw in D minor. Filter stays under 800 Hz and takes four bars to sweep.
let wahPat = n("<[0@2 ~ 0] [3@2 ~ 5] [7@2 ~ 3] [5 ~ 0@2 ~]>")
  .scale("d1:minor")
  .s("sawtooth")
  .attack(0.04).decay(0.35).sustain(0.5).release(0.28)
  .lpf(sine.range(150, 760).slow(4))
  .lpq(7)
  .gain(wah)

let kickPat = s("abd ~ ~ ~ ~ abd ~ ~").gain(kick)
let hatPat = s("~ ahat ~ ahat ~ ~ ahat ~").hpf(6500).gain(hats)
let thumpPat = s("~ ~ thump ~ ~ ~ ~ thump").speed(0.62).lpf(160).gain(thump)
let growlPat = s("~ growl ~ ~").slow(2).lpf(480).gain(growl)
let snarePat = s("~ ~ ~ ~ ssd ~ ~ ~").gain(snare)

arrange(
  [8, stack(kickPat, hatPat, wahPat, thumpPat).label("groove").color("yellow")],
  [16, stack(kickPat, hatPat, snarePat, wahPat, thumpPat, growlPat).label("drop").color("orange")],
  [8, stack(hatPat, wahPat, thumpPat).label("outro").color("blue")]
).pianoroll({ labels: 1, cycles: 16 })
