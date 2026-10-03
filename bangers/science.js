setcpm(132/4)
let cm7 = note("c3,eb3,g3,bb3").slow(4).s("sawtooth").sustain(1).gain(0.22)
let fm7 = note("f3,ab3,c4,eb4").slow(4).s("sawtooth").sustain(1).gain(0.22)
let pass = note("~@15 g3").slow(4).s("sawtooth").sustain(1).gain(0.22)
let melody = note("ab5 g5 bb5 f5 ~ ~ ~ ~").s("sawtooth").sustain(1).gain(0.22)
let cmelody = note("c4 f4 g4 ab4").s("sawtooth").sustain(1).gain(0.22)
let fmelody = note("c5 c5 c5 c5").fast(2).s("sawtooth").sustain(1).gain(0.22)

arrange(
  [4, stack(cm7, pass, melody, cmelody)],
  [4, stack(fm7, pass, melody, fmelody)]
)
