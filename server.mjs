#!/usr/bin/env node
// Local control channel for the Strudel REPL page.
// The page has no socket of its own. Paste the one-liner from GET / once per tab.

import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 4399;
const HOST = "127.0.0.1";
const BASE = `http://${HOST}:${PORT}`;
const here = path.dirname(fileURLToPath(import.meta.url));
const hookSource = fs
  .readFileSync(path.join(here, "hook.js"), "utf8")
  .replaceAll("__BASE__", BASE);

const STALE_MS = 3000;
const LONG_POLL_MS = 20000;

let rev = 0;
let command = { rev: 0, op: null, code: null };
let lastCode = null;
const waiters = new Set();
let report = {
  connected: false,
  playing: null,
  error: null,
  firstLine: null,
  hash: null,
  pending: null,
  audio: null,
  lastSeen: 0,
};

function shortHash(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex").slice(0, 12);
}

function queue(op, code) {
  rev += 1;
  command = { rev, op, code };
  const pending = [...waiters];
  waiters.clear();
  for (const wake of pending) wake();
  const line = typeof code === "string" ? code.split("\n")[0] : "";
  console.log(`[helper] ${op} rev=${rev} ${line}`);
}

function waitForChange(since) {
  if (rev > since) return Promise.resolve();
  return new Promise((resolve) => {
    const wake = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(() => {
      waiters.delete(wake);
      resolve();
    }, LONG_POLL_MS);
    waiters.add(wake);
  });
}

function liveReport() {
  const age = report.lastSeen ? Date.now() - report.lastSeen : Infinity;
  const connected = !!report.connected && age < STALE_MS;
  return {
    playing: connected ? !!report.playing : null,
    error: connected ? report.error : null,
    hash: connected ? report.hash : null,
    firstLine: connected ? report.firstLine : null,
    connected,
    pending: connected ? !!report.pending : null,
    audio: connected ? report.audio : null,
    queued: command.op
      ? {
          op: command.op,
          rev: command.rev,
          firstLine: typeof command.code === "string" ? command.code.split("\n")[0] : null,
          hash: typeof command.code === "string" ? shortHash(command.code) : null,
        }
      : null,
  };
}

function send(res, status, body, type = "application/json; charset=utf-8") {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "content-type": type,
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "cross-origin-resource-policy": "cross-origin",
    "cache-control": "no-store",
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 1_000_000) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function codeFromBody(req, raw) {
  const ct = String(req.headers["content-type"] || "");
  if (ct.includes("application/json")) {
    if (!raw.trim()) return "";
    const parsed = JSON.parse(raw);
    if (parsed == null || typeof parsed.code !== "string") {
      throw new Error('JSON body needs {"code":"..."}');
    }
    return parsed.code;
  }
  return raw.replace(/^\uFEFF/, "");
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", BASE);
    if (req.method === "OPTIONS") {
      send(res, 204, "");
      return;
    }
    if (req.method === "GET" && url.pathname === "/") {
      send(
        res,
        200,
        `Strudel helper on ${BASE}\n\nPaste this once in the REPL page console (it does not survive a reload):\n\nfetch('${BASE}/hook.js').then(r=>r.text()).then(eval)\n\nThen:\n  curl -s ${BASE}/state\n  curl -s ${BASE}/stop -X POST\n  curl -s ${BASE}/play -X POST --data-binary @pattern.js\n  curl -s ${BASE}/code -X POST --data-binary @pattern.js\n`,
        "text/plain; charset=utf-8",
      );
      return;
    }
    if (req.method === "GET" && url.pathname === "/hook.js") {
      send(res, 200, hookSource, "text/javascript; charset=utf-8");
      return;
    }
    if (req.method === "GET" && url.pathname === "/state") {
      send(res, 200, liveReport());
      return;
    }
    if (req.method === "GET" && url.pathname === "/next") {
      const since = Number(url.searchParams.get("rev") || 0);
      await waitForChange(since);
      send(res, 200, command.rev > since ? command : { rev, op: null, code: null });
      return;
    }
    if (req.method === "POST" && url.pathname === "/report") {
      const raw = await readBody(req);
      const body = raw ? JSON.parse(raw) : {};
      report = {
        connected: !!body.connected,
        playing: !!body.playing,
        error: body.error == null ? null : String(body.error),
        firstLine: body.firstLine == null ? null : String(body.firstLine),
        hash: body.hash == null ? null : String(body.hash),
        pending: !!body.pending,
        audio: body.audio == null ? null : String(body.audio),
        lastSeen: Date.now(),
      };
      send(res, 200, { ok: true });
      return;
    }
    if (req.method === "POST" && (url.pathname === "/code" || url.pathname === "/play" || url.pathname === "/stop")) {
      const raw = await readBody(req);
      if (url.pathname === "/stop") {
        queue("stop", null);
      } else if (url.pathname === "/code") {
        lastCode = codeFromBody(req, raw);
        queue("code", lastCode);
      } else {
        const text = codeFromBody(req, raw);
        if (text.length) lastCode = text;
        queue("play", text.length ? text : lastCode);
      }
      send(res, 200, { ok: true, ...command, code: undefined, queued: liveReport().queued });
      return;
    }
    send(res, 404, { error: "not found" });
  } catch (err) {
    send(res, 400, { error: String(err && err.message ? err.message : err) });
  }
});

async function client(cmd) {
  if (cmd === "paste") {
    process.stdout.write(`fetch('${BASE}/hook.js').then(r=>r.text()).then(eval)\n`);
    return;
  }
  if (cmd === "state") {
    const res = await fetch(BASE + "/state");
    process.stdout.write(await res.text());
    if (!res.ok) process.exitCode = 1;
    return;
  }
  if (cmd === "stop") {
    const res = await fetch(BASE + "/stop", { method: "POST" });
    process.stdout.write(await res.text());
    return;
  }
  if (cmd === "play" || cmd === "code") {
    let text = "";
    if (!process.stdin.isTTY) {
      const chunks = [];
      for await (const chunk of process.stdin) chunks.push(chunk);
      text = Buffer.concat(chunks).toString("utf8");
    }
    const res = await fetch(BASE + "/" + cmd, {
      method: "POST",
      headers: { "content-type": "text/plain; charset=utf-8" },
      body: text,
    });
    process.stdout.write(await res.text());
    if (!res.ok) process.exitCode = 1;
    return;
  }
  console.error("usage: node server.mjs [serve|state|play|stop|code|paste]");
  process.exitCode = 1;
}

const cmd = process.argv[2];
if (cmd && cmd !== "serve") {
  await client(cmd);
} else {
  server.listen(PORT, HOST, () => {
    console.log(`[helper] listening on ${BASE}`);
  });
  server.on("error", (err) => {
    console.error(err.message);
    process.exit(1);
  });
}
