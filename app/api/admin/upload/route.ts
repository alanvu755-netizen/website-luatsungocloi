import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Allowed MIME types policy
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
// File size limit: 5MB
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

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

    // Security & File Validation (AT-IMG-11, AT-IMG-12)
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { message: "Định dạng tệp không hợp lệ. Chỉ chấp nhận các định dạng ảnh: JPG, PNG, WEBP, GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { message: "Dung lượng tệp quá lớn. Vui lòng chọn tệp ảnh dưới 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/png";

    // 1. Primary Permanent Storage Strategy: Cloud Storage CDN (Catbox Cloud Storage)
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
      console.warn("Cloud CDN upload unavailable, falling back to local filesystem...", cloudErr.message);
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

    return NextResponse.json(
      { message: "Không thể lưu trữ ảnh. Vui lòng thử lại sau." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi khi tải ảnh lên server." },
      { status: 500 }
    );
  }
}
