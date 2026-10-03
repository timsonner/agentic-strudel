samples({ bd: 'bd.wav', clap: 'clap.wav', hat: 'hat.wav', chord: 'chord.wav' }, 'http://127.0.0.1:4401/club/')
setcpm(126/4)
let kick = s("bd*4").gain(0.8)
let hat = s("hat*8").gain(0.22)
let clap = s("~ clap ~ clap").gain(0.4)
let bass = n("0 0 0 0 3 3 -2 0").scale("f1:minor").s("sawtooth").lpf(180).decay(0.12).sustain(0.05).gain(0.4)
let stab = s("chord").struct("~ ~ ~ [1 1?]").gain(0.28).room(0.3)
arrange(
  [8, stack(hat, s("chord").slow(2).gain(0.16)).label("intro").color("cyan")],
  [8, stack(kick, hat, bass).label("groove").color("white")],
  [16, stack(kick, hat, clap, bass, stab).label("drop").color("orange")],
  [8, stack(hat, bass.lpf(80).gain(0.25)).label("break").color("violet")],
  [16, stack(kick, hat, clap, bass, stab).label("drop 2").color("orange")]
).pianoroll({ labels: 1, cycles: 16 })
