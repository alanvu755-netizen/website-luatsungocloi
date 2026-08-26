const { PrismaClient } = require('@prisma/client');
const http = require('http');

const prisma = new PrismaClient();

function calculatePercentiles(values) {
  if (!values || values.length === 0) return { min: 0, max: 0, p50: 0, p75: 0, p95: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const getIndex = (p) => Math.min(Math.floor(p * sorted.length), sorted.length - 1);
  return {
    min: Math.round(sorted[0]),
    max: Math.round(sorted[sorted.length - 1]),
    p50: Math.round(sorted[getIndex(0.5)]),
    p75: Math.round(sorted[getIndex(0.75)]),
    p95: Math.round(sorted[getIndex(0.95)]),
    count: sorted.length
  };
}

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

async function runBeforeBaseline() {
  console.log("=== BEFORE PERFORMANCE BASELINE MEASUREMENTS ===");

  // 1. Single DB RTT
  await prisma.$connect();
  const t0 = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  const singleRtt = Date.now() - t0;
  console.log(`Single DB RTT (SELECT 1): ${singleRtt} ms`);

  // 2. HTTP TTFB Benchmarks
  const routes = [
    { name: "Landing (/thu-vien-phap-luat)", path: "/thu-vien-phap-luat" },
    { name: "Submenu (/thu-vien-phap-luat/dat-dai)", path: "/thu-vien-phap-luat/dat-dai" },
    { name: "Article Detail (/thu-vien-phap-luat/dat-dai/nhung-dieu-can-biet-khi-sang-ten-so-do)", path: "/thu-vien-phap-luat/dat-dai/nhung-dieu-can-biet-khi-sang-ten-so-do" }
  ];

  const beforeResults = {};

  for (const r of routes) {
    const samples = [];
    for (let i = 0; i < 5; i++) {
      const res = await makeHttpRequest({
        hostname: 'localhost',
        port: 3006,
        path: r.path,
        method: 'GET',
        headers: { 'User-Agent': 'Antigravity-PerfBenchmark/1.0' }
      });
      if (res.ttfb) samples.push(res.ttfb);
    }
    const stats = calculatePercentiles(samples);
    beforeResults[r.name] = stats;
    console.log(`${r.name} HTTP TTFB: P50=${stats.p50}ms, P95=${stats.p95}ms, Min=${stats.min}ms, Max=${stats.max}ms`);
  }

  await prisma.$disconnect();
  console.log("================================================");
}

runBeforeBaseline().catch(console.error);
