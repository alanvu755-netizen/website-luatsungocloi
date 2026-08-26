import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function cleanBase64Articles() {
  console.log("🔍 Inspecting database articles for raw Base64 image tags...");

  const articles = await prisma.article.findMany({
    where: {
      content: {
        contains: "data:image/",
      },
    },
  });

  console.log(`Found ${articles.length} article(s) containing raw Base64 image tags.`);

  for (const article of articles) {
    console.log(`Cleaning article ID: ${article.id} - Title: ${article.title}`);

    // Replace huge base64 src attribute with a placeholder or clean image tag
    const cleanedContent = article.content.replace(
      /src=["']data:image\/[^;]+;base64,[^"']+["']/gi,
      'src="/customer-reference.png"'
    );

    await prisma.article.update({
      where: { id: article.id },
      data: { content: cleanedContent },
    });
  }

  console.log("✅ All Base64 image tags cleaned from database successfully!");
}

cleanBase64Articles()
  .catch((e) => console.error("Error cleaning base64 articles:", e))
  .finally(async () => await prisma.$disconnect());
