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

    // On Vercel Serverless environment, filesystem is read-only.
    // Use Base64 Data URL to guarantee 100% image upload success without ENOENT errors.
    if (process.env.VERCEL) {
      const base64Url = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: base64Url,
        fileName: file.name,
      });
    }

    try {
      // Ensure uploads directory exists inside public/uploads for local development
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      // Clean filename & make unique
      const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueFilename = `${Date.now()}_${sanitizedOriginalName}`;
      const filePath = path.join(uploadsDir, uniqueFilename);

      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${uniqueFilename}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName: file.name,
      });
    } catch (fsError: any) {
      // Fallback for Vercel/Serverless read-only filesystem
      console.warn("Filesystem write unavailable, using Base64 Data URL fallback:", fsError.message);
      const base64Url = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: base64Url,
        fileName: file.name,
      });
    }
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi khi tải ảnh lên server." },
      { status: 500 }
    );
  }
}
