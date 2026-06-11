// Dev utility: print document-space rects of selectors on the running site.
//   node scripts/probe.mjs <url> <selector> [selector...]
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9333;
const [url, ...selectors] = process.argv.slice(2);

const browser = spawn(EDGE, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${process.env.TEMP}\\edge-cdp`,
  "--no-first-run",
  "--window-size=1440,1000",
  "--hide-scrollbars",
  "about:blank",
]);

try {
  let targets;
  for (let i = 0; i < 50; i++) {
    await sleep(200);
    try {
      targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      if (targets.length) break;
    } catch {}
  }
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res) => {
      const mid = ++id;
      pending.set(mid, res);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

  await send("Page.enable");
  await send("Page.navigate", { url });
  await sleep(4000);
  const expr = `JSON.stringify(${JSON.stringify(selectors)}.map((sel) =>
    [...document.querySelectorAll(sel)].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        sel,
        x: Math.round(r.x + scrollX),
        y: Math.round(r.y + scrollY),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    })
  ).flat())`;
  const r = await send("Runtime.evaluate", { expression: expr });
  console.log(r.result.result.value);
  const env = await send("Runtime.evaluate", {
    expression: `JSON.stringify({
      innerWidth,
      innerHeight,
      spineDisplay: getComputedStyle(document.querySelector(".spine")).display,
      spineLeft: getComputedStyle(document.querySelector(".spine")).left,
      stations: document.querySelectorAll(".spine-station").length,
    })`,
  });
  console.log(env.result.result.value);
  ws.close();
} finally {
  browser.kill();
}
