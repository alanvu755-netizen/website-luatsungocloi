import fs from "fs";
import path from "path";

async function testCatboxUpload() {
  const sampleImagePath = path.join(process.cwd(), "public", "customer-reference.png");
  const blob = new Blob([fs.readFileSync(sampleImagePath)], { type: "image/png" });

  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, "customer-reference.png");

  console.log("Testing Catbox.moe 0-config Cloud Image API...");
  try {
    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
    });

    const textUrl = await res.text();
    console.log("Catbox API Result:", textUrl);
    if (textUrl.startsWith("https://files.catbox.moe/")) {
      console.log("🎉 SUCCESS PERMANENT IMAGE URL:", textUrl);
    }
  } catch (e: any) {
    console.error("Catbox Error:", e.message);
  }
}

testCatboxUpload();
