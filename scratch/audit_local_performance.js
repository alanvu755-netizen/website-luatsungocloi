const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const PORT = 3005;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(urlPath, headers = {}) {
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
        });
      });
    });

    req.on("error", (err) => {
      resolve({ path: urlPath, error: err.message, totalMs: Date.now() - start });
    });
  });
}

async function runLocalAudit() {
  console.log("🚀 Starting Next.js Local Server on port", PORT, "...");

  const serverProcess = spawn("npx", ["next", "start", "-p", String(PORT)], {
    cwd: "/Users/thiemvv/Documents/website-luat",
    env: { ...process.env, PORT: String(PORT) },
    stdio: "pipe",
  });

  // Wait for server to start
  await new Promise((resolve) => {
    serverProcess.stdout.on("data", (data) => {
      if (data.toString().includes("Ready") || data.toString().includes("started")) {
        resolve(true);
      }
    });
    setTimeout(resolve, 5000);
  });

  console.log("⚡ Measuring Local HTTP Response Times & Latencies...");

  const pagesToTest = [
    { name: "Public Homepage", path: "/" },
    { name: "Public Menu Page", path: "/thu-vien-phap-luat" },
    { name: "Public Submenu Page", path: "/thu-vien-phap-luat/dat-dai" },
    { name: "Public Article Detail Page", path: "/thu-vien-phap-luat/dat-dai/nhung-dieu-can-biet-khi-sang-ten-so-do" },
  ];

  const results = [];

  // Warmup run
  await makeRequest("/");

  for (const page of pagesToTest) {
    // Run 5 requests to calculate min, max, avg TTFB
    const runs = [];
    for (let i = 0; i < 5; i++) {
      const res = await makeRequest(page.path);
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
    });
  }

  console.log("\n📊 LOCAL HTTP MEASUREMENT RESULTS:");
  console.table(results);

  // Clean shutdown
  serverProcess.kill("SIGTERM");

  // Analyze Bundle Sizes
  console.log("\n📦 NEXT.JS BUNDLE SIZE ANALYSIS:");
  const staticDir = path.join("/Users/thiemvv/Documents/website-luat", ".next/static");
  let totalJsSize = 0;

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith(".js")) {
        totalJsSize += stat.size;
      }
    }
  }

  walkDir(staticDir);
  console.log(`Total Shared JS Size in .next/static: ${(totalJsSize / 1024).toFixed(2)} KB`);

  console.log("ACCURATE_MEASUREMENT_RESULT:", JSON.stringify({ results, totalJsKb: (totalJsSize / 1024).toFixed(2) }, null, 2));
}

runLocalAudit().catch((err) => {
  console.error("AUDIT_ERR:", err);
  process.exit(1);
});
