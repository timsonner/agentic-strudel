(() => {
  if (window.__strudelHelper) return;
  window.__strudelHelper = true;
  const base = "__BASE__";
  let rev = 0;
  let busy = false;
  let hookError = null;

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
  }

  async function report(extra) {
    const m = window.strudelMirror;
    const code = m && typeof m.code === "string" ? m.code : "";
    const err = m && m.repl && m.repl.state && m.repl.state.error;
    const message = err ? String(err.message || err) : null;
    const body = {
      connected: !!m,
      playing: !!(m && m.repl && m.repl.scheduler && m.repl.scheduler.started),
      error: hookError || message,
      firstLine: (code.split("\n")[0] || "").slice(0, 200),
      hash: code ? await sha256(code) : "",
      pending: !!(m && m.repl && m.repl.state && m.repl.state.pending),
      audio: extra && extra.audio ? extra.audio : null,
    };
    await fetch(base + "/report", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async function apply(msg) {
    const m = window.strudelMirror;
    if (!m) {
      hookError = "window.strudelMirror is missing";
      await report();
      return;
    }
    if (msg.op === "code") {
      m.setCode(msg.code ?? "");
      hookError = null;
      await report();
      return;
    }
    if (msg.op === "stop") {
      m.stop();
      hookError = null;
      await report();
      return;
    }
    if (msg.op === "play") {
      if (typeof msg.code === "string") m.setCode(msg.code);
      const done = m.evaluate(true).then(
        () => "ok",
        (e) => "err:" + (e && e.message ? e.message : String(e)),
      );
      const result = await Promise.race([
        done,
        new Promise((resolve) => setTimeout(() => resolve("timeout"), 3000)),
      ]);
      if (result === "timeout") {
        hookError = "evaluate is waiting on the first mousedown in this tab. Click the page once. Playback continues on its own after that click.";
        await report({ audio: "locked" });
        done.then(async (later) => {
          if (typeof later === "string" && later.startsWith("err:")) hookError = later.slice(4);
          else hookError = null;
          await report({ audio: hookError ? "error" : "running" });
        });
        return;
      }
      if (typeof result === "string" && result.startsWith("err:")) {
        hookError = result.slice(4);
        await report({ audio: "error" });
        return;
      }
      hookError = null;
      await report({ audio: "running" });
    }
  }

  async function loop() {
    try {
      const res = await fetch(base + "/next?rev=" + rev);
      if (res.ok) {
        const msg = await res.json();
        if (msg && msg.rev && msg.rev !== rev && msg.op) {
          rev = msg.rev;
          if (!busy) {
            busy = true;
            try {
              await apply(msg);
            } catch (err) {
              hookError = String(err && err.message ? err.message : err);
              await report();
            } finally {
              busy = false;
            }
          }
        } else if (msg && msg.rev) {
          rev = msg.rev;
        }
      }
    } catch (err) {
      /* helper down or page still loading */
    }
    setTimeout(loop, 50);
  }

  setInterval(() => {
    report().catch(() => {});
  }, 1000);
  loop();
  console.log("[strudel-helper] hooked " + base);
})();
