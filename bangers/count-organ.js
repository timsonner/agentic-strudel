samples({ cello: { c2: 'low.wav' }, viola: { g3: 'viola.wav' } }, 'http://127.0.0.1:4401/strings/')
samples({ viol: { d5: 'bow.wav' } }, 'http://127.0.0.1:4401/violin/')
samples({ horn: { c4: 'soft.wav' } }, 'http://127.0.0.1:4401/horn/')

setcpm(104/4)

let pulse = slider(0.32, 0, 2, 0.01)
let organ = slider(0.46, 0, 2, 0.01)
let piano = slider(0.34, 0, 2, 0.01)
let answer = slider(0.22, 0, 2, 0.01)
let harp = slider(0.16, 0, 2, 0.01)
let cello = slider(0.26, 0, 2, 0.01)
let viola = slider(0.16, 0, 2, 0.01)
let horn = slider(0.14, 0, 2, 0.01)
let violin = slider(0.11, 0, 2, 0.01)

// A harmonic minor. Pulse stays on the chord root, the same shape every bar.
let pulseBed = n("<[0 0 4 0] [3 3 7 3] [4 4 8 4] [0 0 4 0]>")
  .scale("a2:harmonic:minor")
  .s("pulse").pw(0.25).pwrate(0.12)
  .attack(0.02).decay(0.16).sustain(0.4).release(0.1)
  .lpf(980)
  .gain(pulse)

// Pipe organ, one chord a bar: Am, Dm, E, Am. A little crush for the reed.
let organChords = n("<[0,2,4] [3,5,7] [4,6,8] [0,2,4]>")
  .scale("a3:harmonic:minor")
  .s("gm_church_organ")
  .attack(0.05).decay(0.25).sustain(0.8).release(0.7)
    .lpf(2600)
  .room(0.35)
  .gain(organ)

// Two piano notes a bar, above the organ, not a run.
let pianoNotes = n("<[4 ~ 2 ~] [7 ~ 5 ~] [8 ~ 6 ~] [4 ~ 2 0]>")
  .scale("a4:harmonic:minor")
  .s("gm_piano")
  .attack(0.01).decay(0.3).sustain(0.2).release(0.4)
  .gain(piano)

// Ostinato strings/low.wav is a C power chord. Pitched per bar it follows Am Dm E Am.
let celloBed = n("<0 3 4 0>")
  .scale("a1:harmonic:minor")
  .s("cello")
  .attack(0.08).release(0.5)
  .gain(cello)

// strings/viola.wav is G3. Inner voice, one note a bar.
let violaLine = n("<2 5 6 4>")
  .scale("a3:harmonic:minor")
  .s("viola")
  .attack(0.12).release(0.45)
  .gain(viola)

// horn/soft.wav is C4. Only the dominant, once a phrase.
let hornCall = n("<~ ~ 4 ~>")
  .scale("a4:harmonic:minor")
  .s("horn")
  .attack(0.15).release(0.4)
  .gain(horn)

// violin/bow.wav is D5. One long A, every other bar, never a riff.
let violinHold = n("<0 ~ ~ ~>")
  .slow(2)
  .scale("a5:harmonic:minor")
  .s("viol")
  .attack(0.35).release(0.6)
  .gain(violin)


let answerNotes = n("<[~ 7 ~ 5] [~ 4 ~ 3] [~ 6 ~ 4] [~ 2 ~ 0]>")
  .scale("a4:harmonic")
  .s("gm_celesta")
  .decay(0.3).sustain(0.1)
  .gain(answer)


let harpNote = n("<[~ ~ 0 ~] [~ ~ 3 ~] [~ ~ 4 ~] [~ ~ 0 ~]>")
  .scale("a5:harmonic")
  .s("gm_orchestral_harp")
  .decay(0.45).sustain(0.05)
  .gain(harp)

arrange(
  [4, stack(pulseBed, pianoNotes, answerNotes, harpNote).label("intro").color("violet")],
  [8, stack(pulseBed, organChords, pianoNotes, answerNotes, harpNote).label("chapel").color("red")],
  [8, stack(pulseBed, organChords, pianoNotes, answerNotes, harpNote, celloBed, violaLine).label("gallery").color("orange")],
  [4, stack(pulseBed, pianoNotes, answerNotes, harpNote, celloBed).label("crypt").color("white")],
  [8, stack(pulseBed, organChords, pianoNotes, answerNotes, harpNote, celloBed, violaLine, hornCall, violinHold).label("return").color("green")]
).pianoroll({ labels: 1, cycles: 16 })
