import fs from "fs";
import path from "path";

async function testCatboxNode() {
  const sampleImagePath = path.join(process.cwd(), "public", "customer-reference.png");
  const buffer = fs.readFileSync(sampleImagePath);

  // Use standard Node File/Blob API
  const file = new File([buffer], "customer-reference.png", { type: "image/png" });

  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", file);

  console.log("Testing Catbox Node File upload...");
  try {
    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
    });

    const textUrl = (await res.text()).trim();
    console.log("Catbox Node Result:", textUrl);
    if (textUrl.startsWith("http://") || textUrl.startsWith("https://")) {
      console.log("✅ CATBOX SUCCESS PERMANENT URL:", textUrl);
      return textUrl;
    }
  } catch (e: any) {
    console.error("Catbox Error:", e.message);
  }
}

testCatboxNode();
