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
    const cloudFile = new File([buffer], file.name, { type: mimeType });

    // 1. Primary Cloud Provider: Catbox Permanent Cloud Storage
    try {
      const catboxData = new FormData();
      catboxData.append("reqtype", "fileupload");
      catboxData.append("fileToUpload", cloudFile);

      const catboxRes = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: catboxData,
      });

      if (catboxRes.ok) {
        const textUrl = (await catboxRes.text()).trim();
        if (textUrl.startsWith("http://") || textUrl.startsWith("https://")) {
          return NextResponse.json({
            success: true,
            url: textUrl,
            fileName: file.name,
          });
        }
      }
    } catch (catboxErr: any) {
      console.warn("Catbox CDN failed, attempting secondary cloud provider...", catboxErr.message);
    }

    // 2. Secondary Cloud Provider: Tmpfiles CDN Engine
    try {
      const tmpFormData = new FormData();
      tmpFormData.append("file", cloudFile);

      const tmpRes = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: tmpFormData,
      });

      if (tmpRes.ok) {
        const tmpJson = await tmpRes.json();
        if (tmpJson.status === "success" && tmpJson.data?.url) {
          const directUrl = tmpJson.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
          return NextResponse.json({
            success: true,
            url: directUrl,
            fileName: file.name,
          });
        }
      }
    } catch (tmpErr: any) {
      console.warn("Tmpfiles CDN failed:", tmpErr.message);
    }

    // 3. Local Development Fallback: Save to public/uploads
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
