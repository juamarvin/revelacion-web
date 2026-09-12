import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] || "C:/Users/pc/AppData/Local/Temp/opencode/render";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = "http://localhost:3000/comic?render=1";
const DUR = Number(process.argv[3] || 268); // segundos a grabar

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    "--window-size=1920,1080",
    "--force-device-scale-factor=1",
    "--autoplay-policy=no-user-gesture-required",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    "--mute-audio",
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await page.waitForFunction("window.__comicReady === true", { timeout: 180000 });
await page.evaluate(() => (document.fonts ? document.fonts.ready : true));
await new Promise((r) => setTimeout(r, 1500));

const client = await page.createCDPSession();
let idx = 0;
const times = [];
client.on("Page.screencastFrame", async (frame) => {
  try {
    await client.send("Page.screencastFrameAck", { sessionId: frame.sessionId });
  } catch {}
  const n = idx++;
  fs.writeFileSync(path.join(OUT, `f${String(n).padStart(6, "0")}.jpg`), Buffer.from(frame.data, "base64"));
  times.push(frame.metadata.timestamp);
});

await client.send("Page.startScreencast", {
  format: "jpeg",
  quality: 92,
  maxWidth: 1920,
  maxHeight: 1080,
  everyNthFrame: 2,
});

await new Promise((r) => setTimeout(r, 900)); // frames del slate
await page.evaluate("window.__comicStart()");

const t0 = Date.now();
while (Date.now() - t0 < (DUR + 1.2) * 1000) {
  await new Promise((r) => setTimeout(r, 1000));
}

await client.send("Page.stopScreencast").catch(() => {});
await browser.close();

fs.writeFileSync(path.join(OUT, "times.json"), JSON.stringify(times));
console.log(JSON.stringify({ frames: idx, out: OUT }));
