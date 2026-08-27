import fs from "fs";
import path from "path";

async function testBinaryUpload() {
  const sampleImagePath = path.join(process.cwd(), "public", "customer-reference.png");
  const buffer = fs.readFileSync(sampleImagePath);
  const blob = new Blob([buffer], { type: "image/png" });

  // 1. Test FreeImage.host with binary file blob
  console.log("Testing FreeImage.host with Blob...");
  try {
    const formData = new FormData();
    formData.append("key", "6d207e02198a847eaf9d0d31fe07e356");
    formData.append("action", "upload");
    formData.append("source", blob, "customer-reference.png");
    formData.append("format", "json");

    const res = await fetch("https://freeimage.host/api/1/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("FreeImage Result:", JSON.stringify(data, null, 2));
    if (data.image?.url) {
      console.log("✅ SUCCESS FREEIMAGE URL:", data.image.url);
      return data.image.url;
    }
  } catch (e: any) {
    console.error("FreeImage Error:", e.message);
  }

  // 2. Test ImgBB with binary file blob
  console.log("Testing ImgBB with Blob...");
  try {
    const formData = new FormData();
    formData.append("image", blob, "customer-reference.png");

    const res = await fetch("https://api.imgbb.com/1/upload?key=6d207e02198a847eaf9d0d31fe07e356", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("ImgBB Result:", JSON.stringify(data, null, 2));
    if (data.data?.url) {
      console.log("✅ SUCCESS IMGBB URL:", data.data.url);
      return data.data.url;
    }
  } catch (e: any) {
    console.error("ImgBB Error:", e.message);
  }
}

testBinaryUpload();
