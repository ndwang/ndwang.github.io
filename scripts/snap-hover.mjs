// One-off verifier for the cursor-magnet interaction: real-clock headless
// Edge, dispatches synthetic pointermove events at viewport fractions and
// screenshots the settled result.
//   node scripts/snap-hover.mjs <url> <outPrefix> [fx,fy ...]
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9333;
const url = process.argv[2] ?? "http://localhost:4321/";
const prefix = process.argv[3] ?? "hover";
const spots = process.argv.slice(4).map((s) => s.split(",").map(Number));

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

  const shoot = async (name) => {
    const r = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(
      `${prefix}-${name}.png`,
      Buffer.from(r.result.data, "base64"),
    );
    console.log(`saved ${prefix}-${name}.png`);
  };

  await shoot("base");
  for (const [fx, fy] of spots) {
    await send("Runtime.evaluate", {
      expression: `window.dispatchEvent(new PointerEvent("pointermove", {
        clientX: innerWidth * ${fx}, clientY: innerHeight * ${fy}
      }))`,
    });
    await sleep(2000); // let uMouseOn lerp in
    await shoot(`${Math.round(fx * 100)}-${Math.round(fy * 100)}`);
  }
  ws.close();
} finally {
  browser.kill();
}
