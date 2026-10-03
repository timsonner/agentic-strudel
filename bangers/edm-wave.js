samples({ bd: 'bd.wav', clap: 'clap.wav', hat: 'hat.wav', chord: 'chord.wav' }, 'http://127.0.0.1:4401/club/')
setcpm(128/4)

let kick = s("bd*4").gain(0.8)
let hat = s("hat*8").gain(0.2)
let hatBusy = s("hat*16").gain(0.12)
let clap = s("~ clap ~ clap").gain(0.38)

// moving deep sine bass — not a stuck root
let bass = n("0 ~ 0 -2 ~ 3 5 3").scale("a1:minor").s("sine")
  .lpf(150).decay(0.3).sustain(0.12).gain(0.52)
let bassDrive = n("0 0 -2 0 3 ~ 5 3").scale("a1:minor").s("sine")
  .lpf(190).decay(0.22).sustain(0.08).gain(0.55)
// rise: filter opens across the section
let bassRise = n("0 ~ 0 -2 ~ 3 5 3").scale("a1:minor").s("sine")
  .lpf(sine.range(70, 380).slow(8)).decay(0.32).sustain(0.1).gain(0.45)

// stab lands on beat 4, sometimes doubles — not every beat
let stab = s("chord").struct("~ ~ ~ <1 [1 1?]>").gain(0.3).room(0.28)
let stabHard = s("chord").struct("~ ~ ~ [1 1?]").gain(0.32).room(0.3)
let pad = s("chord").slow(4).gain(0.14).room(0.45)

arrange(
  [8, hat.label("intro").color("cyan")],
  [8, stack(hat, bassRise).label("rise").color("yellow")],
  [8, stack(kick, hat, bass).label("groove").color("white")],
  [16, stack(kick, hat, clap, bassDrive, stab).label("drop").color("orange")],
  [8, stack(hatBusy, pad, bass.lpf(65).gain(0.2)).label("break").color("violet")],
  [16, stack(kick, hat, hatBusy, clap, bassDrive.gain(0.58), stabHard).label("wave").color("red")],
  [8, stack(kick.gain(0.55), hat.gain(0.12), pad).label("outro").color("blue")]
).pianoroll({ labels: 1, cycles: 16 })
