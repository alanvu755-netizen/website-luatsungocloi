import fs from "fs";
import path from "path";

async function testCloudinaryUpload() {
  const sampleImagePath = path.join(process.cwd(), "public", "customer-reference.png");
  const buffer = fs.readFileSync(sampleImagePath);
  const file = new File([buffer], "customer-reference.png", { type: "image/png" });

  console.log("Testing Cloudinary Unsigned Upload Endpoint...");
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // standard demo preset or direct base64

    const res = await fetch("https://api.cloudinary.com/v1_1/demo/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Cloudinary Result:", data);
    if (data.secure_url) {
      console.log("✅ CLOUDINARY SUCCESS URL:", data.secure_url);
      return data.secure_url;
    }
  } catch (e: any) {
    console.error("Cloudinary Error:", e.message);
  }
}

testCloudinaryUpload();
