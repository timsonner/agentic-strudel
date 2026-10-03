samples({ bd: 'bd.wav', clap: 'clap.wav', hat: 'hat.wav', chord: 'chord.wav' }, 'http://127.0.0.1:4401/club/')
setcpm(118/4)
let kick = s("bd ~ ~ ~").gain(0.75)
let hat = s("~ hat ~ hat").gain(0.2)
let clap = s("~ clap ~ clap").gain(0.38)
let bass = n("0 ~ 0 -2 ~ 0 3 ~").scale("a1:minor").s("sine").lpf(140).decay(0.35).sustain(0.15).gain(0.5)
let keys = n("~ 7 [3 5] ~ 10 ~ 7 [0 3]").scale("a4:minor").s("triangle").decay(0.18).sustain(0).lpf(1200).gain(0.22)
let chord = s("chord").slow(4).gain(0.14)
arrange(
  [8, chord],
  [8, stack(chord, hat)],
  [8, stack(kick, hat, bass)],
  [16, stack(kick, hat, clap, bass, keys, chord)],
  [8, stack(bass.gain(0.35), keys)],
  [8, stack(hat, keys.gain(0.16))],
  [16, stack(kick, hat, clap, bass, keys, chord)],
  [8, stack(kick.gain(0.5), hat, bass, chord)]
)._scope()._spectrum()
