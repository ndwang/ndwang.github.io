// Dev utility: zoomed clip of the running site via CDP (real clock, like
// snap.mjs). Scrolls to an absolute Y, then captures a viewport-relative
// clip at 2x so hairline decoration is inspectable.
//   node scripts/snap-clip.mjs <url> <out.png> <scrollY> <x> <y> <w> <h>
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9333;
const [url, out, scrollY, cx, cy, cw, ch] = process.argv.slice(2);

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
  await sleep(4500);
  await send("Runtime.evaluate", {
    expression: `window.scrollTo({top: ${Number(scrollY)}, behavior: "instant"})`,
  });
  await sleep(2500);
  const r = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true, // clip coords are absolute document px
    clip: {
      x: Number(cx),
      y: Number(cy) + Number(scrollY),
      width: Number(cw),
      height: Number(ch),
      scale: 2,
    },
  });
  writeFileSync(out, Buffer.from(r.result.data, "base64"));
  console.log(`saved ${out}`);
  ws.close();
} finally {
  browser.kill();
}
