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
          bodyLength: body.length,
          headers: res.headers
        });
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message, duration: Date.now() - startTime });
    });
    req.end();
  });
}

async function runSubmenuPerformanceTrace() {
  console.log("=== ANTIGRAVITY P0 SUBMENU RUNTIME PERFORMANCE TRACE ===");
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log("Database URL Host:", (process.env.DATABASE_URL || "").split("@")[1]?.split("/")[0] || "Unknown");
  console.log("----------------------------------------------------\n");

  // 1. BASELINE DB NETWORK RTT
  console.log("--- 1. BASELINE DB NETWORK RTT (SELECT 1) ---");
  await prisma.$connect();
  const rttSamples = [];
  for (let i = 0; i < 5; i++) {
    const t0 = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    rttSamples.push(Date.now() - t0);
  }
  const rttStats = calculatePercentiles(rttSamples);
  console.log(`Single DB Round-Trip RTT: P50=${rttStats.p50}ms, P95=${rttStats.p95}ms, Min=${rttStats.min}ms, Max=${rttStats.max}ms`);
  console.log("----------------------------------------------------\n");

  // 2. SUBMENU DATA QUERY TRACE FOR /thu-vien-phap-luat AND /thu-vien-phap-luat/dat-dai
  console.log("--- 2. SUBMENU ROUTE QUERY TRACE & DEPENDENCIES ---");
  const site = await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
  
  // Menu Query Trace for /thu-vien-phap-luat
  console.log("\n>>> Route A: Menu Listing (/thu-vien-phap-luat)");
  const menuTraces = [];

  // Q1: generateMetadata -> site.findUnique
  let t = Date.now();
  await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
  menuTraces.push({ step: 1, name: "Q1: generateMetadata -> site.findUnique", duration: Date.now() - t, seq: true, duplicate: false });

  // Q2: generateMetadata -> getPublicHeaderMenus
  t = Date.now();
  const menusQ2 = await prisma.menu.findMany({
    where: { siteId: site.id, status: "VISIBLE" },
    include: { submenus: { where: { status: "VISIBLE" }, orderBy: { displayOrder: "asc" } } },
    orderBy: { displayOrder: "asc" }
  });
  menuTraces.push({ step: 2, name: "Q2: generateMetadata -> menu.findMany (submenus)", duration: Date.now() - t, seq: true, duplicate: false });

  const targetMenu = menusQ2.find(m => m.slug === "thu-vien-phap-luat") || menusQ2[0];

  // Q3: Page -> site.findUnique
  t = Date.now();
  await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
  menuTraces.push({ step: 3, name: "Q3: Page -> site.findUnique", duration: Date.now() - t, seq: true, duplicate: true });

  // Q4-Q5: Page -> Promise.all([getPublicHeaderMenus, getEnabledContactChannels])
  t = Date.now();
  const [headerMenusP, channelsP] = await Promise.all([
    prisma.menu.findMany({
      where: { siteId: site.id, status: "VISIBLE" },
      include: { submenus: { where: { status: "VISIBLE" }, orderBy: { displayOrder: "asc" } } },
      orderBy: { displayOrder: "asc" }
    }),
    prisma.contactChannel.findMany({ where: { siteId: site.id, status: true }, orderBy: { displayOrder: "asc" } })
  ]);
  menuTraces.push({ step: 4, name: "Q4-Q5: Page -> Promise.all([menu.findMany (duplicate!), channels])", duration: Date.now() - t, seq: false, duplicate: true });

  // Q6-Q7: Page -> getPublicArticles (articles.findMany + articles.count)
  t = Date.now();
  const whereMenu = { siteId: site.id, menuId: targetMenu.id, status: "PUBLISHED", menu: { status: "VISIBLE" } };
  const [artsMenu, countMenu] = await Promise.all([
    prisma.article.findMany({
      where: whereMenu,
      select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true, menu: true, submenu: true },
      orderBy: { publishedAt: "desc" },
      take: 10
    }),
    prisma.article.count({ where: whereMenu })
  ]);
  menuTraces.push({ step: 5, name: "Q6-Q7: Page -> getPublicArticles (findMany + count)", duration: Date.now() - t, seq: false, duplicate: false });

  // Q8-Q9: Header Component -> site.findUnique & getPublicHeaderMenus
  t = Date.now();
  await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
  await prisma.menu.findMany({
    where: { siteId: site.id, status: "VISIBLE" },
    include: { submenus: { where: { status: "VISIBLE" }, orderBy: { displayOrder: "asc" } } },
    orderBy: { displayOrder: "asc" }
  });
  menuTraces.push({ step: 6, name: "Q8-Q9: Header -> site.findUnique (3x duplicate!) & menu.findMany (3x duplicate!)", duration: Date.now() - t, seq: true, duplicate: true });

  console.table(menuTraces);
  const totalMenuDbTime = menuTraces.reduce((acc, q) => acc + q.duration, 0);
  console.log(`Total DB Time for Menu Page (/thu-vien-phap-luat): ${totalMenuDbTime} ms (Across 6 waterfall steps / 9 SQL operations)`);

  // Submenu Query Trace for /thu-vien-phap-luat/dat-dai
  console.log("\n>>> Route B: Submenu Listing (/thu-vien-phap-luat/dat-dai)");
  const targetSubmenu = targetMenu.submenus.find(s => s.slug === "dat-dai") || targetMenu.submenus[0];
  const subTraces = [];

  // Q1: Page -> site.findUnique
  t = Date.now();
  await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
  subTraces.push({ step: 1, name: "Q1: Page -> site.findUnique", duration: Date.now() - t, seq: true });

  // Q2-Q3: Page -> Promise.all([getPublicHeaderMenus, getEnabledContactChannels])
  t = Date.now();
  await Promise.all([
    prisma.menu.findMany({
      where: { siteId: site.id, status: "VISIBLE" },
      include: { submenus: { where: { status: "VISIBLE" }, orderBy: { displayOrder: "asc" } } },
      orderBy: { displayOrder: "asc" }
    }),
    prisma.contactChannel.findMany({ where: { siteId: site.id, status: true }, orderBy: { displayOrder: "asc" } })
  ]);
  subTraces.push({ step: 2, name: "Q2-Q3: Page -> Promise.all([menu.findMany, channels])", duration: Date.now() - t, seq: false });

  // Q4-Q5: Page -> getPublicArticles for Submenu
  t = Date.now();
  const whereSub = { siteId: site.id, submenuId: targetSubmenu.id, status: "PUBLISHED", menu: { status: "VISIBLE" }, submenu: { status: "VISIBLE" } };
  await Promise.all([
    prisma.article.findMany({
      where: whereSub,
      select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true, menu: true, submenu: true },
      orderBy: { publishedAt: "desc" },
      take: 10
    }),
    prisma.article.count({ where: whereSub })
  ]);
  subTraces.push({ step: 3, name: "Q4-Q5: Page -> getPublicArticles (findMany + count)", duration: Date.now() - t, seq: false });

  // Q6-Q7: Header Component -> site.findUnique & getPublicHeaderMenus
  t = Date.now();
  await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
  await prisma.menu.findMany({
    where: { siteId: site.id, status: "VISIBLE" },
    include: { submenus: { where: { status: "VISIBLE" }, orderBy: { displayOrder: "asc" } } },
    orderBy: { displayOrder: "asc" }
  });
  subTraces.push({ step: 4, name: "Q6-Q7: Header -> site.findUnique (duplicate!) & menu.findMany (duplicate!)", duration: Date.now() - t, seq: true });

  console.table(subTraces);
  const totalSubDbTime = subTraces.reduce((acc, q) => acc + q.duration, 0);
  console.log(`Total DB Time for Submenu Page (/thu-vien-phap-luat/dat-dai): ${totalSubDbTime} ms`);
  console.log("----------------------------------------------------\n");

  // 3. HTTP RUNTIME BENCHMARK ON LOCALHOST:3006
  console.log("--- 3. HTTP RUNTIME BENCHMARK AGAINST LOCALHOST:3006 ---");
  
  // Menu Page TTFB
  const menuHttpSamples = [];
  for (let i = 0; i < 5; i++) {
    const res = await makeHttpRequest({
      hostname: 'localhost',
      port: 3006,
      path: '/thu-vien-phap-luat',
      method: 'GET',
      headers: { 'User-Agent': 'Antigravity-SubmenuProfiler/1.0' }
    });
    if (res.ttfb) menuHttpSamples.push(res.ttfb);
  }
  const menuHttpStats = calculatePercentiles(menuHttpSamples);
  console.log(`Menu Page (/thu-vien-phap-luat) HTTP TTFB: P50=${menuHttpStats.p50}ms, P95=${menuHttpStats.p95}ms, Min=${menuHttpStats.min}ms, Max=${menuHttpStats.max}ms (Sample size: 5)`);

  // Submenu Page TTFB
  const subHttpSamples = [];
  for (let i = 0; i < 5; i++) {
    const res = await makeHttpRequest({
      hostname: 'localhost',
      port: 3006,
      path: '/thu-vien-phap-luat/dat-dai',
      method: 'GET',
      headers: { 'User-Agent': 'Antigravity-SubmenuProfiler/1.0' }
    });
    if (res.ttfb) subHttpSamples.push(res.ttfb);
  }
  const subHttpStats = calculatePercentiles(subHttpSamples);
  console.log(`Submenu Page (/thu-vien-phap-luat/dat-dai) HTTP TTFB: P50=${subHttpStats.p50}ms, P95=${subHttpStats.p95}ms, Min=${subHttpStats.min}ms, Max=${subHttpStats.max}ms (Sample size: 5)`);

  await prisma.$disconnect();
  console.log("\n=== SUBMENU PERFORMANCE TRACE COMPLETED ===");
}

runSubmenuPerformanceTrace().catch(err => {
  console.error("Submenu trace error:", err);
  prisma.$disconnect();
});
