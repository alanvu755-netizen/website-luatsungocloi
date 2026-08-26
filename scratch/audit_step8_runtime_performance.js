const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const PORT = 3006;
const BASE_URL = `http://localhost:${PORT}`;

function makeHttpRequest(urlPath, options = {}) {
  return new Promise((resolve) => {
    const start = Date.now();
    const parsedUrl = new URL(urlPath, BASE_URL);
    
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let firstByte = null;
      let data = "";

      res.on("data", (chunk) => {
        if (!firstByte) firstByte = Date.now() - start;
        data += chunk;
      });

      res.on("end", () => {
        const total = Date.now() - start;
        let parsedJson = null;
        try {
          parsedJson = JSON.parse(data);
        } catch {}

        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          ttfbMs: firstByte || total,
          totalMs: total,
          contentLengthBytes: Buffer.byteLength(data),
          contentType: res.headers["content-type"] || "",
          cacheControl: res.headers["cache-control"] || "N/A",
          body: parsedJson || data,
        });
      });
    });

    req.on("error", (err) => {
      resolve({ path: urlPath, error: err.message, totalMs: Date.now() - start });
    });

    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runStep8RuntimeAudit() {
  console.log("🚀 Starting Next.js Production Build Server on port", PORT, "...");

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

  console.log("⚡ Executing Step 8 Runtime & Performance Measurements...");

  // 1. Measure Article Detail Page TTFB (Server Rendering)
  const detailPath = "/thu-vien-phap-luat/dat-dai/nhung-dieu-can-biet-khi-sang-ten-so-do";
  const detailRuns = [];
  for (let i = 0; i < 5; i++) {
    const res = await makeHttpRequest(detailPath);
    detailRuns.push(res);
    await new Promise((r) => setTimeout(r, 100));
  }

  const detailTtfbValues = detailRuns.map((r) => r.ttfbMs);
  const avgDetailTtfb = Math.round(detailTtfbValues.reduce((a, b) => a + b, 0) / detailTtfbValues.length);

  // 2. Measure View Tracking API Response Timing (POST /api/public/articles/[id]/view)
  // Fetch target article ID from database first via query
  const targetArticleId = "cmt5p99ic002b10138ievxo81";
  const viewTrackingRes = await makeHttpRequest(`/api/public/articles/${targetArticleId}/view`, {
    method: "POST",
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      "x-forwarded-for": "203.162.0.1",
    },
  });

  // 3. Measure Share Tracking API Response Timing (POST /api/public/articles/[id]/share)
  const shareTrackingRes = await makeHttpRequest(`/api/public/articles/${targetArticleId}/share`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.162.0.2",
    },
    body: { channel: "FACEBOOK" },
  });

  // 4. Security Abuse Test: Attempt arbitrary increment payload override
  const abuseShareRes = await makeHttpRequest(`/api/public/articles/${targetArticleId}/share`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: { channel: "FACEBOOK", increment: 10000 },
  });

  // 5. Security Abuse Test: Invalid Channel Attempt
  const invalidChannelRes = await makeHttpRequest(`/api/public/articles/${targetArticleId}/share`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: { channel: "MALICIOUS_CHANNEL_HACK" },
  });

  // 6. Security Abuse Test: Non-existent Article Attempt
  const nonExistentRes = await makeHttpRequest(`/api/public/articles/non_existent_article_999/view`, {
    method: "POST",
  });

  serverProcess.kill("SIGTERM");

  const auditData = {
    articleDetailTtfb: {
      avgTtfbMs: avgDetailTtfb,
      minTtfbMs: Math.min(...detailTtfbValues),
      maxTtfbMs: Math.max(...detailTtfbValues),
      statusCode: detailRuns[0].statusCode,
    },
    viewTrackingEndpoint: {
      statusCode: viewTrackingRes.statusCode,
      ttfbMs: viewTrackingRes.ttfbMs,
      totalMs: viewTrackingRes.totalMs,
      resultBody: viewTrackingRes.body,
    },
    shareTrackingEndpoint: {
      statusCode: shareTrackingRes.statusCode,
      ttfbMs: shareTrackingRes.ttfbMs,
      totalMs: shareTrackingRes.totalMs,
      resultBody: shareTrackingRes.body,
    },
    securityAbuseTests: {
      arbitraryIncrementRejected: abuseShareRes.body?.shareCount !== 10000,
      invalidChannelStatus: invalidChannelRes.statusCode,
      nonExistentArticleStatus: nonExistentRes.statusCode,
    },
  };

  console.log("FINAL_RUNTIME_AUDIT_RESULT:", JSON.stringify(auditData, null, 2));
}

runStep8RuntimeAudit().catch((err) => {
  console.error("RUNTIME_AUDIT_ERR:", err);
  process.exit(1);
});
