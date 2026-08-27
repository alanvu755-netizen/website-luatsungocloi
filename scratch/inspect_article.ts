import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function inspectArticle() {
  const articleId = "cmtaph0hj0001845mchq6zo0e";
  console.log(`Inspecting article ID: ${articleId}...`);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    console.log("Article not found in database.");
    // Search for any article containing "vợ chồng ly hôn chia tài sản"
    const matched = await prisma.article.findMany({
      where: {
        title: {
          contains: "ly hôn",
        },
      },
    });
    console.log(`Found ${matched.length} articles with 'ly hôn':`);
    for (const m of matched) {
      console.log(`ID: ${m.id} | Title: ${m.title} | Content Length: ${m.content.length}`);
      console.log(`Content Snippet: ${m.content.slice(0, 300)}...`);
    }
  } else {
    console.log(`Article Title: ${article.title}`);
    console.log(`Content Length: ${article.content.length}`);
    console.log(`Content First 500 chars:\n${article.content.slice(0, 500)}`);
    console.log(`Content Last 500 chars:\n${article.content.slice(-500)}`);
  }
}

inspectArticle()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
