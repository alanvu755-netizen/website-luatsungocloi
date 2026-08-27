import fs from "fs";
import path from "path";

async function testTmpfiles() {
  const sampleImagePath = path.join(process.cwd(), "public", "customer-reference.png");
  const buffer = fs.readFileSync(sampleImagePath);
  const file = new File([buffer], "customer-reference.png", { type: "image/png" });

  console.log("Testing tmpfiles.org upload endpoint...");
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("tmpfiles Result:", data);
    if (data.data?.url) {
      // Direct file URL format: replace tmpfiles.org/ with tmpfiles.org/dl/
      const directUrl = data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
      console.log("✅ TMPFILES SUCCESS URL:", directUrl);
      return directUrl;
    }
  } catch (e: any) {
    console.error("tmpfiles Error:", e.message);
  }
}

testTmpfiles();
