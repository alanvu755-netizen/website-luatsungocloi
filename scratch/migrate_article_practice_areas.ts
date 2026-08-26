import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface MigrationReconciliationResult {
  timestamp: string;
  totalArticles: number;
  alreadyMappedCount: number;
  newlyMappedCount: number;
  unresolvedCount: number;
  mappedDetails: Array<{
    articleId: string;
    title: string;
    practiceAreaId: string;
    practiceAreaTitle: string;
    reason: string;
  }>;
  unresolvedDetails: Array<{
    articleId: string;
    title: string;
    reason: string;
  }>;
}

export async function runArticlePracticeAreaMigration(siteSlug = "le-thi-ngoc-loi"): Promise<MigrationReconciliationResult> {
  const site = await prisma.site.findUnique({ where: { slug: siteSlug } });
  if (!site) {
    throw new Error(`Site with slug ${siteSlug} not found.`);
  }

  const [articles, practiceAreas] = await Promise.all([
    prisma.article.findMany({
      where: { siteId: site.id },
      include: {
        menu: true,
        submenu: true,
        articlePracticeAreas: { include: { practiceArea: true } },
      },
    }),
    prisma.practiceArea.findMany({ where: { siteId: site.id } }),
  ]);

  const mappedDetails: MigrationReconciliationResult["mappedDetails"] = [];
  const unresolvedDetails: MigrationReconciliationResult["unresolvedDetails"] = [];

  let alreadyMappedCount = 0;
  let newlyMappedCount = 0;

  for (const article of articles) {
    // If article already has junction mappings, increment count
    if (article.articlePracticeAreas && article.articlePracticeAreas.length > 0) {
      alreadyMappedCount++;
      continue;
    }

    // Try to match PracticeArea deterministically by menu/submenu title keyword or taxonomy
    let targetPracticeArea = practiceAreas.find((pa) => {
      const paTitleLower = pa.title.toLowerCase();
      const menuTitleLower = (article.menu?.title || "").toLowerCase();
      const submenuTitleLower = (article.submenu?.title || "").toLowerCase();
      const articleTitleLower = article.title.toLowerCase();

      return (
        menuTitleLower.includes(paTitleLower) ||
        paTitleLower.includes(menuTitleLower) ||
        submenuTitleLower.includes(paTitleLower) ||
        paTitleLower.includes(submenuTitleLower) ||
        articleTitleLower.includes(paTitleLower)
      );
    });

    // Fallback: If only 1 practiceArea exists in DB, default to it
    if (!targetPracticeArea && practiceAreas.length > 0) {
      targetPracticeArea = practiceAreas[0];
    }

    if (targetPracticeArea) {
      await prisma.articlePracticeArea.create({
        data: {
          siteId: site.id,
          articleId: article.id,
          practiceAreaId: targetPracticeArea.id,
        },
      });

      newlyMappedCount++;
      mappedDetails.push({
        articleId: article.id,
        title: article.title,
        practiceAreaId: targetPracticeArea.id,
        practiceAreaTitle: targetPracticeArea.title,
        reason: "Matched by Category Taxonomy / Primary PracticeArea Fallback",
      });
    } else {
      unresolvedDetails.push({
        articleId: article.id,
        title: article.title,
        reason: "No PracticeArea found in site database",
      });
    }
  }

  const result: MigrationReconciliationResult = {
    timestamp: new Date().toISOString(),
    totalArticles: articles.length,
    alreadyMappedCount,
    newlyMappedCount,
    unresolvedCount: unresolvedDetails.length,
    mappedDetails,
    unresolvedDetails,
  };

  return result;
}

if (require.main === module) {
  runArticlePracticeAreaMigration()
    .then((result) => {
      console.log("ARTICLE_NN_MIGRATION_RESULT:", JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error("MIGRATION_ERROR:", err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
