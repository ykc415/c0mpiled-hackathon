// Capture real screens of the deployed app for the concept video.
//   node video/capture.mjs   ->  video/screens/*.png (2880x1800)
// Drives headless Chrome over the DevTools protocol; no extra packages.
import { spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://c0mpiled-hackathon.vercel.app";
const DIR = dirname(fileURLToPath(import.meta.url));
const OUT = join(DIR, "screens");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(OUT, { recursive: true });
// Fresh profile each run, so saved apps and comments from a previous run don't show.
rmSync(join(DIR, "out", "chrome-capture"), { recursive: true, force: true });
const chrome = spawn(CHROME, [
  "--headless=new", "--hide-scrollbars", `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${join(DIR, "out", "chrome-capture")}`, "about:blank",
], { stdio: "ignore" });

let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    target = list.find((t) => t.type === "page");
  } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (pending.has(msg.id)) pending.get(msg.id)(msg.result), pending.delete(msg.id);
});
const send = (method, params = {}) =>
  new Promise((r, reject) => {
    const n = ++id;
    pending.set(n, r);
    ws.send(JSON.stringify({ id: n, method, params }));
    setTimeout(() => pending.has(n) && reject(new Error(`${method} timed out`)), 15000);
  });
const js = (expr) => send("Runtime.evaluate", { expression: expr, awaitPromise: true });

await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 750, deviceScaleFactor: 2.4, mobile: false });

async function go(path) {
  console.log("go", path);
  await send("Page.navigate", { url: `${SITE}${path}?t=${Date.now()}` });
  await sleep(3500);
}
// Click the first button/link whose text or aria-label starts with `label`.
async function click(label) {
  console.log("click", label);
  for (let tries = 0; ; tries++) {
    const ok = await js(`(() => {
      const el = [...document.querySelectorAll("button,a")].find((b) =>
        (b.getAttribute("aria-label") || b.textContent.trim()).startsWith(${JSON.stringify(label)}));
      el?.click();
      return !!el;
    })()`);
    if (ok.result.value) break;
    if (tries === 10) throw new Error(`No control "${label}"`);
    await sleep(500);
  }
  await sleep(1300);
}
// Type into a React-controlled field.
async function type(selector, text) {
  await js(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement;
    Object.getOwnPropertyDescriptor(proto.prototype, "value").set.call(el, ${JSON.stringify(text)});
    el.dispatchEvent(new Event("input", { bubbles: true }));
  })()`);
  await sleep(300);
}
async function shot(name) {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(join(OUT, `${name}.png`), Buffer.from(data, "base64"));
  console.log(name);
}

await go("/");
await shot("feed");
await click("Next image");
await shot("feed-2");
await click("Next image");
await shot("feed-3");
await click("Comment");
await type("#comment-text", "Asked it to call my carrier and switch plans. It did the whole call for me.");
await shot("comment-typing");
await click("Post comment");
await shot("comment-posted");

await go("/");
await click("Next app");
await shot("feed-aside");
await click("Next app");
await shot("feed-cal");
await js(`document.querySelectorAll(".reel-actions button")[1].click()`); // save to My Apps
await sleep(3600); // let the "Added" toast clear so the Try button shows
await shot("feed-cal-saved");
await click("Try the sample");
await shot("trial");
await click("Log a sample meal");
await shot("analyze");

await go("/register");
await type("#app-url", "https://snapreel.example");
await type("#trial-url", "https://snapreel.example/try");
await type("#intro", "Turn a few photos into a short video");
await shot("register");

await go("/trending");
await shot("trending");
await go("/explore");
await shot("explore");
await go("/apps/pickle");
await shot("pickle");

ws.close();
chrome.kill();
process.exit(0);
