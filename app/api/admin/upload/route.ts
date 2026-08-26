import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "Vui lòng chọn tệp ảnh để tải lên." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/png";
    const base64String = buffer.toString("base64");

    // 1. Primary Strategy for Serverless/Vercel & Production: Upload to ImgBB Free Cloud CDN
    // Ensures clean, short, permanent HTTPS image URLs (e.g., https://i.ibb.co/...)
    try {
      const imgbbApiKey = process.env.IMGBB_API_KEY || "6d207e02198a847eaf9d0d31fe07e356";
      const imgbbFormData = new FormData();
      imgbbFormData.append("image", base64String);
      imgbbFormData.append("name", file.name);

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: imgbbFormData,
      });

      if (imgbbRes.ok) {
        const imgbbData = await imgbbRes.json();
        if (imgbbData.success && imgbbData.data?.url) {
          return NextResponse.json({
            success: true,
            url: imgbbData.data.url,
            fileName: file.name,
          });
        }
      }
    } catch (cloudErr) {
      console.warn("ImgBB cloud upload failed, attempting local filesystem or data URL fallback...", cloudErr);
    }

    // 2. Secondary Strategy for Local Development: Save to public/uploads
    if (!process.env.VERCEL) {
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const uniqueFilename = `${Date.now()}_${sanitizedOriginalName}`;
        const filePath = path.join(uploadsDir, uniqueFilename);

        await writeFile(filePath, buffer);

        return NextResponse.json({
          success: true,
          url: `/uploads/${uniqueFilename}`,
          fileName: file.name,
        });
      } catch (fsError) {
        console.warn("Local filesystem write failed:", fsError);
      }
    }

    // 3. Last Resort Fallback: Base64 Data URL
    const base64Url = `data:${mimeType};base64,${base64String}`;
    return NextResponse.json({
      success: true,
      url: base64Url,
      fileName: file.name,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi khi tải ảnh lên server." },
      { status: 500 }
    );
  }
}
