import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "chaturvedi_uploads",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url || uploadResult.url,
      secure_url: uploadResult.secure_url || uploadResult.url,
      public_id: uploadResult.public_id || "uploaded_media",
      thumbnail_url: uploadResult.thumbnail_url || uploadResult.secure_url || uploadResult.url,
      resource_type: uploadResult.resource_type,
    });
  } catch (error: any) {
    console.error("Server upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload media to Cloudinary" },
      { status: 500 }
    );
  }
}
