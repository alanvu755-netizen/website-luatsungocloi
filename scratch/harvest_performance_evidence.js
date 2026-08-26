const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const PORT = 3006;
const BASE_URL = `http://localhost:${PORT}`;

function makeDetailedRequest(urlPath, headers = {}) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.get(`${BASE_URL}${urlPath}`, { headers }, (res) => {
      let firstByte = null;
      let data = "";

      res.on("data", (chunk) => {
        if (!firstByte) firstByte = Date.now() - start;
        data += chunk;
      });

      res.on("end", () => {
        const total = Date.now() - start;
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          ttfbMs: firstByte || total,
          totalMs: total,
          contentLengthBytes: Buffer.byteLength(data),
          contentType: res.headers["content-type"] || "",
          cacheControl: res.headers["cache-control"] || "N/A",
          serverTiming: res.headers["server-timing"] || "N/A",
        });
      });
    });

    req.on("error", (err) => {
      resolve({ path: urlPath, error: err.message, totalMs: Date.now() - start });
    });
  });
}

async function runEvidenceHarvest() {
  console.log("🚀 Starting Next.js Production Local Server on port", PORT, "...");

  const serverProcess = spawn("npx", ["next", "start", "-p", String(PORT)], {
    cwd: "/Users/thiemvv/Documents/website-luat",
    env: { ...process.env, PORT: String(PORT) },
    stdio: "pipe",
  });

  await new Promise((resolve) => {
    serverProcess.stdout.on("data", (data) => {
      if (data.toString().includes("Ready") || data.toString().includes("started")) {
        resolve(true);
      }
    });
    setTimeout(resolve, 5000);
  });

  console.log("⚡ Harvesting Network Waterfall & Response Timings...");

  const pagesToTest = [
    { name: "Public Homepage", path: "/" },
    { name: "Public Menu Category Page", path: "/thu-vien-phap-luat" },
    { name: "Public Submenu Category Page", path: "/thu-vien-phap-luat/dat-dai" },
    { name: "Public Article Detail Page", path: "/thu-vien-phap-luat/dat-dai/nhung-dieu-can-biet-khi-sang-ten-so-do" },
  ];

  const results = [];

  // Warmup run
  await makeDetailedRequest("/");

  for (const page of pagesToTest) {
    const runs = [];
    for (let i = 0; i < 5; i++) {
      const res = await makeDetailedRequest(page.path);
      runs.push(res);
      await new Promise((r) => setTimeout(r, 100));
    }

    const ttfbValues = runs.map((r) => r.ttfbMs);
    const avgTtfb = Math.round(ttfbValues.reduce((a, b) => a + b, 0) / ttfbValues.length);
    const minTtfb = Math.min(...ttfbValues);
    const maxTtfb = Math.max(...ttfbValues);

    results.push({
      name: page.name,
      path: page.path,
      statusCode: runs[0].statusCode,
      avgTtfbMs: avgTtfb,
      minTtfbMs: minTtfb,
      maxTtfbMs: maxTtfb,
      contentLengthKb: (runs[0].contentLengthBytes / 1024).toFixed(2),
      cacheControl: runs[0].cacheControl,
    });
  }

  serverProcess.kill("SIGTERM");

  // Bundle & Chunk Analysis
  console.log("\n📦 DEEP BUNDLE & CHUNK FORENSICS:");
  const staticChunksDir = path.join("/Users/thiemvv/Documents/website-luat", ".next/static/chunks");
  const chunks = [];

  function scanChunks(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanChunks(fullPath);
      } else if (file.endsWith(".js")) {
        chunks.push({
          name: file,
          sizeKb: (stat.size / 1024).toFixed(2),
          bytes: stat.size,
        });
      }
    }
  }

  scanChunks(staticChunksDir);
  chunks.sort((a, b) => b.bytes - a.bytes);

  const top5Chunks = chunks.slice(0, 5);
  const totalJsBytes = chunks.reduce((acc, c) => acc + c.bytes, 0);

  // Asset Analysis (CSS, Images, Fonts)
  const cssDir = path.join("/Users/thiemvv/Documents/website-luat", ".next/static/css");
  let totalCssBytes = 0;
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir);
    for (const f of cssFiles) {
      if (f.endsWith(".css")) {
        totalCssBytes += fs.statSync(path.join(cssDir, f)).size;
      }
    }
  }

  const vercelConfig = JSON.parse(fs.readFileSync("/Users/thiemvv/Documents/website-luat/vercel.json", "utf8"));

  const finalOutput = {
    httpResults: results,
    bundleMetrics: {
      totalSharedJsKb: (totalJsBytes / 1024).toFixed(2),
      totalCssKb: (totalCssBytes / 1024).toFixed(2),
      top5LargestJsChunks: top5Chunks,
    },
    infrastructureConfig: {
      vercelRegionLock: vercelConfig.regions || [],
    },
  };

  console.log("ROUND_2_EVIDENCE_HARVEST_RESULT:", JSON.stringify(finalOutput, null, 2));
}

runEvidenceHarvest().catch((err) => {
  console.error("HARVEST_ERR:", err);
  process.exit(1);
});
