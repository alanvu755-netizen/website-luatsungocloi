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

    // 1. Primary Cloud Upload Strategy: 0-Config Permanent High-Speed CDN (Catbox Cloud Storage)
    // Guarantees clean, short, permanent HTTPS image URLs (e.g., https://files.catbox.moe/...) without Vercel filesystem errors.
    try {
      const cloudFormData = new FormData();
      cloudFormData.append("reqtype", "fileupload");
      const blob = new Blob([buffer], { type: mimeType });
      cloudFormData.append("fileToUpload", blob, file.name);

      const cloudRes = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: cloudFormData,
      });

      if (cloudRes.ok) {
        const textUrl = (await cloudRes.text()).trim();
        if (textUrl.startsWith("http://") || textUrl.startsWith("https://")) {
          return NextResponse.json({
            success: true,
            url: textUrl,
            fileName: file.name,
          });
        }
      }
    } catch (cloudErr: any) {
      console.warn("Catbox cloud upload failed, attempting local filesystem or data URL fallback...", cloudErr.message);
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

    // 3. Last Resort Fallback (if cloud CDN & local disk both fail):
    const base64String = buffer.toString("base64");
    return NextResponse.json({
      success: true,
      url: `data:${mimeType};base64,${base64String}`,
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
