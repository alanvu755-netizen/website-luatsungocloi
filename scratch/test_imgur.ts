import fs from "fs";
import path from "path";

async function testImgurUpload() {
  const sampleImagePath = path.join(process.cwd(), "public", "customer-reference.png");
  const buffer = fs.readFileSync(sampleImagePath);
  const base64String = buffer.toString("base64");

  const clientIds = [
    "546c25a59c58ad7",
    "c9a0bfd2ec8e547",
    "f29631ed3e0e7a1"
  ];

  for (const clientId of clientIds) {
    console.log(`Testing Imgur API Client-ID: ${clientId}...`);
    try {
      const formData = new FormData();
      formData.append("image", base64String);
      formData.append("type", "base64");

      const res = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Imgur Result:", JSON.stringify(data, null, 2));
      if (res.ok && data.data?.link) {
        console.log(`🎉 SUCCESS PERMANENT IMGUR URL: ${data.data.link}`);
        return data.data.link;
      }
    } catch (e: any) {
      console.error("Imgur Error:", e.message);
    }
  }
}

testImgurUpload();
