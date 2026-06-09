import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "credentials_missing", message: "Cloudinary credentials (cloud name, API key, or API secret) are not configured." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "cafe";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided for upload." },
        { status: 400 }
      );
    }

    // Convert file to a buffer and then to base64 data URI
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Fetch real-world time from Cloudinary to correct system clock drift in dev/VPS environments
    let driftOffset = 0;
    try {
      const timeStart = Date.now();
      const timeRes = await fetch("https://api.cloudinary.com", { method: "HEAD" });
      const serverDateStr = timeRes.headers.get("date");
      if (serverDateStr) {
        const serverTime = new Date(serverDateStr).getTime();
        const latency = (Date.now() - timeStart) / 2;
        driftOffset = (serverTime + latency) - Date.now();
        console.log(`Cloudinary API clock drift detected: ${driftOffset}ms. Correcting timestamp.`);
      }
    } catch (e) {
      console.warn("Failed to fetch Cloudinary time for drift correction:", e);
    }

    // Always generate a fresh timestamp immediately before upload, corrected for clock drift
    const timestamp = Math.floor((Date.now() + driftOffset) / 1000);
    const paramsToSign = {
      timestamp,
      folder,
    };

    // Sign the request manually using api_secret
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    console.log("Cloudinary Upload Signature Parameters:", {
      ...paramsToSign,
      local_system_time: new Date().toISOString(),
      corrected_api_time: new Date(timestamp * 1000).toISOString(),
      timestamp_offset_seconds: Math.floor(driftOffset / 1000),
    });

    // Upload to Cloudinary using secure signed upload
    const uploadResult = await cloudinary.uploader.upload(fileBase64, {
      ...paramsToSign,
      signature,
      api_key: apiKey,
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary upload API error:", error);
    return NextResponse.json(
      { error: "upload_failed", message: error.message || "Failed to upload image to Cloudinary" },
      { status: 500 }
    );
  }
}
