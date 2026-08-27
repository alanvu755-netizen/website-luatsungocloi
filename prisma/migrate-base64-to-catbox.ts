import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function uploadBase64ToCatbox(base64Data: string, mimeType: string = "image/png"): Promise<string | null> {
  try {
    const cleanBase64 = base64Data.replace(/^data:image\/[^;]+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    const blob = new Blob([buffer], { type: mimeType });
    formData.append("fileToUpload", blob, "converted-article-image.png");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const textUrl = (await res.text()).trim();
      if (textUrl.startsWith("http://") || textUrl.startsWith("https://")) {
        return textUrl;
      }
    }
  } catch (e: any) {
    console.error("Catbox upload failed during migration:", e.message);
  }
  return null;
}

export async function migrateAllBase64Articles() {
  console.log("🔍 Scanning PostgreSQL Database for articles with raw Base64 image tags...");

  const articles = await prisma.article.findMany({
    where: {
      content: {
        contains: "data:image/",
      },
    },
  });

  console.log(`Found ${articles.length} article(s) with raw Base64 image tags in database.`);

  for (const article of articles) {
    console.log(`Processing article ID: ${article.id} - Title: ${article.title}`);

    let updatedContent = article.content;
    const base64Matches = article.content.match(/data:image\/[^;]+;base64,[^"'\s>]+/gi);

    if (base64Matches && base64Matches.length > 0) {
      console.log(`Article ${article.id} contains ${base64Matches.length} Base64 image(s). Converting to Catbox Cloud CDN...`);

      for (const base64Str of base64Matches) {
        const mimeMatch = base64Str.match(/data:(image\/[^;]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/png";

        const cdnUrl = await uploadBase64ToCatbox(base64Str, mimeType);
        if (cdnUrl) {
          console.log(`✅ Uploaded to CDN: ${cdnUrl}`);
          updatedContent = updatedContent.replace(base64Str, cdnUrl);
        } else {
          console.warn("⚠️ Cloud CDN upload failed, stripping raw base64 string to keep editor clean.");
          updatedContent = updatedContent.replace(base64Str, "/customer-reference.png");
        }
      }

      await prisma.article.update({
        where: { id: article.id },
        data: { content: updatedContent },
      });

      console.log(`🎉 Successfully cleaned article ID: ${article.id}`);
    }
  }

  // Also check if any article has raw un-tagged base64 string without src="data:image"
  const allArticles = await prisma.article.findMany();
  for (const art of allArticles) {
    if (art.content.length > 50000 && /gCwB1AI|AAAA|iVBORw0KGgo/i.test(art.content)) {
      console.log(`Cleaning heavy raw base64 text in article ID: ${art.id}...`);
      let cleanContent = art.content
        .replace(/<img[^>]*src=["']data:image\/[^"']+["'][^>]*>/gi, "")
        .replace(/data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+/gi, "")
        .replace(/(?:[A-Za-z0-9+/]{100,}=*)/g, ""); // Strip huge base64 blocks

      await prisma.article.update({
        where: { id: art.id },
        data: { content: cleanContent.trim() },
      });
      console.log(`🎉 Cleaned heavy raw base64 string in article ID: ${art.id}`);
    }
  }

  console.log("✅ Database migration complete!");
}

migrateAllBase64Articles()
  .catch((e) => console.error("Migration error:", e))
  .finally(async () => await prisma.$disconnect());
