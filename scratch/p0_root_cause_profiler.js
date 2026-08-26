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

function makeHttpRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
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
          bodyLength: body.length,
          headers: res.headers
        });
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message, duration: Date.now() - startTime });
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runRootCauseAudit() {
  console.log("=== ANTIGRAVITY P0 PERFORMANCE ROOT-CAUSE AUDIT ===");
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log("Database URL Host:", (process.env.DATABASE_URL || "").split("@")[1]?.split("/")[0] || "Unknown");
  console.log("----------------------------------------------------\n");

  // 1. DATABASE RTT & CONNECTION ACQUISITION
  console.log("--- 1. DATABASE NETWORK RTT & CONNECTION ACQUISITION ---");
  const connStart = Date.now();
  await prisma.$connect();
  const connAcquisitionTime = Date.now() - connStart;
  console.log(`Prisma $connect acquisition latency: ${connAcquisitionTime} ms`);

  const rttSamples = [];
  for (let i = 0; i < 5; i++) {
    const t0 = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    rttSamples.push(Date.now() - t0);
  }
  const rttStats = calculatePercentiles(rttSamples);
  console.log(`Single DB Round-Trip RTT (SELECT 1): P50=${rttStats.p50}ms, P95=${rttStats.p95}ms, Min=${rttStats.min}ms, Max=${rttStats.max}ms`);
  console.log("----------------------------------------------------\n");

  // 2. ARTICLE DETAIL QUERY TRACE (ISOLATED PRISMA STATS)
  console.log("--- 2. ARTICLE DETAIL PAGE QUERY TRACE & DEPENDENCIES ---");
  
  // Find a target published article to trace
  const site = await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
  const article = await prisma.article.findFirst({
    where: { siteId: site.id, status: "PUBLISHED" },
    include: { menu: true, submenu: true }
  });

  if (!article) {
    console.error("No published article found for tracing!");
    return;
  }

  console.log(`Target Article for Trace: "${article.title}" (ID: ${article.id})`);
  console.log(`Menu Slug: ${article.menu.slug}, Submenu Slug: ${article.submenu?.slug || 'none'}, Article Slug: ${article.slug}`);

  // Trace individual queries sequentially to measure isolated duration
  const queryTraces = [];

  // Q1: generateMetadata - site findUnique
  let t = Date.now();
  await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
  queryTraces.push({ name: "Q1: generateMetadata -> site.findUnique", duration: Date.now() - t, scope: "generateMetadata", seq: true });

  // Q2: generateMetadata -> getPublicArticleBySlug
  t = Date.now();
  await prisma.article.findFirst({
    where: { siteId: site.id, slug: article.slug, status: "PUBLISHED", menu: { slug: article.menu.slug } },
    include: { menu: true, submenu: true }
  });
  queryTraces.push({ name: "Q2: generateMetadata -> article.findFirst", duration: Date.now() - t, scope: "generateMetadata", seq: true });

  // Q3: Page Component -> site.findUnique with settings
  t = Date.now();
  const pageSite = await prisma.site.findUnique({
    where: { slug: "le-thi-ngoc-loi" },
    include: { settings: true }
  });
  queryTraces.push({ name: "Q3: PublicPage -> site.findUnique (settings)", duration: Date.now() - t, scope: "Page Component", seq: true });

  // Q4: Page Component -> getPublicArticleBySlug
  t = Date.now();
  const pageArticle = await prisma.article.findFirst({
    where: { siteId: site.id, slug: article.slug, status: "PUBLISHED", menu: { slug: article.menu.slug } },
    include: { menu: true, submenu: true }
  });
  queryTraces.push({ name: "Q4: PublicPage -> article.findFirst", duration: Date.now() - t, scope: "Page Component", seq: true });

  // Q5, Q6, Q7: Promise.all in Page Component
  t = Date.now();
  const [channels, apa, related] = await Promise.all([
    prisma.contactChannel.findMany({ where: { siteId: site.id, status: true }, orderBy: { displayOrder: "asc" } }),
    prisma.articlePracticeArea.findMany({ where: { articleId: article.id }, include: { practiceArea: true } }),
    prisma.article.findMany({
      where: { siteId: site.id, status: "PUBLISHED", id: { not: article.id } },
      take: 3,
      orderBy: { publishedAt: "desc" }
    })
  ]);
  const promiseAllTime = Date.now() - t;
  queryTraces.push({ name: "Q5-Q7: Page Component -> Promise.all([channels, N-N practiceAreas, relatedArticles])", duration: promiseAllTime, scope: "Page Component", seq: false });

  // Q8: Header Component -> site.findUnique & getPublicHeaderMenus
  t = Date.now();
  const headerSite = await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
  const headerMenus = await prisma.menu.findMany({
    where: { siteId: headerSite.id, status: "VISIBLE" },
    include: { submenus: { where: { status: "VISIBLE" }, orderBy: { displayOrder: "asc" } } },
    orderBy: { displayOrder: "asc" }
  });
  queryTraces.push({ name: "Q8-Q9: Header -> site.findUnique & menu.findMany", duration: Date.now() - t, scope: "Header Component", seq: true });

  console.table(queryTraces);

  const totalArticleQueriesDuration = queryTraces.reduce((acc, q) => acc + q.duration, 0);
  console.log(`Total DB Execution Time for Article Detail: ${totalArticleQueriesDuration} ms`);
  console.log("----------------------------------------------------\n");

  // 3. VIEW API BREAKDOWN TRACE
  console.log("--- 3. VIEW API LATENCY TRACE (POST /api/public/articles/[id]/view) ---");
  const viewTraces = [];
  for (let i = 0; i < 5; i++) {
    const t0 = Date.now();
    const tValidationStart = Date.now();
    const targetArt = await prisma.article.findUnique({
      where: { id: article.id },
      select: { id: true, status: true }
    });
    const valTime = Date.now() - tValidationStart;

    const tIncrementStart = Date.now();
    const updated = await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
      select: { id: true, viewCount: true }
    });
    const incTime = Date.now() - tIncrementStart;
    const totalTime = Date.now() - t0;

    viewTraces.push({ sample: i + 1, validationMs: valTime, incrementMs: incTime, totalMs: totalTime });
  }
  console.table(viewTraces);
  const viewTotals = calculatePercentiles(viewTraces.map(v => v.totalMs));
  console.log(`View API DB operations summary: P50=${viewTotals.p50}ms, P95=${viewTotals.p95}ms`);
  console.log("----------------------------------------------------\n");

  // 4. SHARE API BREAKDOWN TRACE & ABNORMAL LATENCY INVESTIGATION
  console.log("--- 4. SHARE API LATENCY TRACE (POST /api/public/articles/[id]/share) ---");
  const shareTraces = [];
  for (let i = 0; i < 5; i++) {
    const t0 = Date.now();
    const tValidationStart = Date.now();
    const targetArt = await prisma.article.findUnique({
      where: { id: article.id },
      select: { id: true, status: true }
    });
    const valTime = Date.now() - tValidationStart;

    const tIncrementStart = Date.now();
    const updated = await prisma.article.update({
      where: { id: article.id },
      data: { shareCount: { increment: 1 } },
      select: { id: true, shareCount: true }
    });
    const incTime = Date.now() - tIncrementStart;
    const totalTime = Date.now() - t0;

    shareTraces.push({ sample: i + 1, validationMs: valTime, incrementMs: incTime, totalMs: totalTime });
  }
  console.table(shareTraces);
  const shareTotals = calculatePercentiles(shareTraces.map(s => s.totalMs));
  console.log(`Share API DB operations summary: P50=${shareTotals.p50}ms, P95=${shareTotals.p95}ms`);
  console.log("----------------------------------------------------\n");

  // 5. LOCAL RUNTIME HTTP BENCHMARK (HTTP requests to running localhost server)
  console.log("--- 5. HTTP RUNTIME BENCHMARK AGAINST LOCALHOST:3006 ---");
  
  // A. Homepage TTFB
  const hpSamples = [];
  for (let i = 0; i < 5; i++) {
    const res = await makeHttpRequest({
      hostname: 'localhost',
      port: 3006,
      path: '/',
      method: 'GET',
      headers: { 'User-Agent': 'Antigravity-Profiler/1.0' }
    });
    if (res.ttfb) hpSamples.push(res.ttfb);
  }
  const hpStats = calculatePercentiles(hpSamples);
  console.log(`Homepage (/) HTTP TTFB: P50=${hpStats.p50}ms, P95=${hpStats.p95}ms, Min=${hpStats.min}ms, Max=${hpStats.max}ms (Sample size: ${hpStats.count})`);

  // B. Article Detail TTFB
  const articlePath = `/${article.menu.slug}/${article.submenu?.slug || 'tin-tuc'}/${article.slug}`;
  const articleSamples = [];
  for (let i = 0; i < 5; i++) {
    const res = await makeHttpRequest({
      hostname: 'localhost',
      port: 3006,
      path: articlePath,
      method: 'GET',
      headers: { 'User-Agent': 'Antigravity-Profiler/1.0' }
    });
    if (res.ttfb) articleSamples.push(res.ttfb);
  }
  const artStats = calculatePercentiles(articleSamples);
  console.log(`Article Detail (${articlePath}) HTTP TTFB: P50=${artStats.p50}ms, P95=${artStats.p95}ms, Min=${artStats.min}ms, Max=${artStats.max}ms (Sample size: ${artStats.count})`);

  // C. View API HTTP Latency
  const viewHttpSamples = [];
  for (let i = 0; i < 5; i++) {
    const res = await makeHttpRequest({
      hostname: 'localhost',
      port: 3006,
      path: `/api/public/articles/${article.id}/view`,
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'X-Forwarded-For': `1.2.3.${i + 1}`
      }
    });
    if (res.totalDuration) viewHttpSamples.push(res.totalDuration);
  }
  const viewHttpStats = calculatePercentiles(viewHttpSamples);
  console.log(`View API (POST /api/public/articles/[id]/view) HTTP Latency: P50=${viewHttpStats.p50}ms, P95=${viewHttpStats.p95}ms, Min=${viewHttpStats.min}ms, Max=${viewHttpStats.max}ms (Sample size: ${viewHttpStats.count})`);

  // D. Share API HTTP Latency
  const shareHttpSamples = [];
  for (let i = 0; i < 5; i++) {
    const postData = JSON.stringify({ channel: 'FACEBOOK' });
    const res = await makeHttpRequest({
      hostname: 'localhost',
      port: 3006,
      path: `/api/public/articles/${article.id}/share`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Forwarded-For': `1.2.3.${i + 1}`
      }
    }, postData);
    if (res.totalDuration) shareHttpSamples.push(res.totalDuration);
  }
  const shareHttpStats = calculatePercentiles(shareHttpSamples);
  console.log(`Share API (POST /api/public/articles/[id]/share) HTTP Latency: P50=${shareHttpStats.p50}ms, P95=${shareHttpStats.p95}ms, Min=${shareHttpStats.min}ms, Max=${shareHttpStats.max}ms (Sample size: ${shareHttpStats.count})`);

  await prisma.$disconnect();
  console.log("\n=== AUDIT PROFILING COMPLETED ===");
}

runRootCauseAudit().catch(err => {
  console.error("Audit profiling error:", err);
  prisma.$disconnect();
});
