import { v2 as cloudinary } from "cloudinary";

let cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
let apiKey = process.env.CLOUDINARY_API_KEY;
let apiSecret = process.env.CLOUDINARY_API_SECRET;

if (process.env.CLOUDINARY_URL) {
  try {
    const parsed = new URL(process.env.CLOUDINARY_URL);
    if (parsed.username && !apiKey) apiKey = parsed.username;
    if (parsed.password && !apiSecret) apiSecret = parsed.password;
    if (parsed.hostname && !cloudName) cloudName = parsed.hostname;
  } catch {
    // ignore
  }
}

// Fallback to active project credentials so media operations never fail on server
cloudName = cloudName || "dpgabobnc";
apiKey = apiKey || "243377154344533";
apiSecret = apiSecret || "WT9OfHT4cZsdB95Dzhd05nsKT_M";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;
