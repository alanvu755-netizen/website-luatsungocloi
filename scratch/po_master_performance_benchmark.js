const http = require('http');

function makeHttpRequest(options) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let ttfb = 0;

    const req = http.request(options, (res) => {
      ttfb = Date.now() - startTime;
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const totalDuration = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          ttfb,
          totalDuration,
          bodyLength: body.length
        });
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message, duration: Date.now() - startTime });
    });
    req.end();
  });
}

async function runPOMasterBenchmark() {
  console.log("=== PO MASTER USER JOURNEY PERFORMANCE BENCHMARK ===");

  const journeys = [
    { name: "Journey A: Homepage", path: "/" },
    { name: "Journey B: Header -> Legal Library Landing", path: "/thu-vien-phap-luat" },
    { name: "Journey C: Legal Library -> Submenu Dat dai", path: "/thu-vien-phap-luat/dat-dai" },
    { name: "Journey D: Submenu -> Article #1", path: "/thu-vien-phap-luat/dat-dai/nhung-dieu-can-biet-khi-sang-ten-so-do" },
    { name: "Journey E: Submenu -> Article #2", path: "/thu-vien-phap-luat/dat-dai/thu-tuc-tach-thua-dat-dai-moi-nhat" },
    { name: "Journey F: Homepage -> Practice Area -> Dat dai", path: "/thu-vien-phap-luat/dat-dai" }
  ];

  for (const j of journeys) {
    const samples = [];
    for (let i = 0; i < 5; i++) {
      const res = await makeHttpRequest({
        hostname: 'localhost',
        port: 3006,
        path: j.path,
        method: 'GET',
        headers: { 'User-Agent': 'Antigravity-POMasterBenchmark/1.0' }
      });
      if (res.ttfb) samples.push(res.ttfb);
    }
    const sorted = [...samples].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[sorted.length - 1];
    console.log(`${j.name}: TTFB P50=${p50}ms, Max=${p95}ms`);
  }

  console.log("====================================================");
}

runPOMasterBenchmark().catch(console.error);
