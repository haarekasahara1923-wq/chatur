export interface UploadResult {
  url: string;
  publicId: string;
  thumbnailUrl: string;
}

export async function uploadMedia(
  file: File,
  resourceType: "image" | "video" | "auto" = "auto"
): Promise<UploadResult> {
  // 1. Try Direct Signed Upload to Cloudinary first
  try {
    const sigRes = await fetch("/api/cloudinary-sign");
    if (sigRes.ok) {
      const sigData = await sigRes.json();
      if (sigData.signature && sigData.apiKey && sigData.cloudName) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp);
        formData.append("signature", sigData.signature);

        const endpoint =
          resourceType === "image"
            ? `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`
            : `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`;

        const uploadRes = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.secure_url || uploadData.url) {
            return {
              url: uploadData.secure_url || uploadData.url,
              publicId: uploadData.public_id || "manual_upload",
              thumbnailUrl: uploadData.thumbnail_url || uploadData.secure_url || uploadData.url,
            };
          }
        }
      }
    }
  } catch (directErr) {
    console.warn("Direct Cloudinary upload encountered an issue, trying server upload fallback:", directErr);
  }

  // 2. Server-side upload fallback via /api/upload
  const serverFormData = new FormData();
  serverFormData.append("file", file);

  const serverRes = await fetch("/api/upload", {
    method: "POST",
    body: serverFormData,
  });

  const serverData = await serverRes.json();
  if (!serverRes.ok || !serverData.success) {
    throw new Error(serverData.error || "Failed to upload file to Cloudinary");
  }

  return {
    url: serverData.secure_url || serverData.url,
    publicId: serverData.public_id || "manual_upload",
    thumbnailUrl: serverData.thumbnail_url || serverData.secure_url || serverData.url,
  };
}
