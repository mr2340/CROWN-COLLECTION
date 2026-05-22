import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Config Cloudinary if env vars are present
const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET)
  );
};

if (isCloudinaryConfigured()) {
  if (process.env.CLOUDINARY_URL) {
    // Already configured via URL
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Missing image data in request body' });
    }

    // 1. Cloudinary Upload if configured
    if (isCloudinaryConfigured()) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: 'crown_collection',
          resource_type: 'auto',
        });
        return res.status(200).json({
          url: uploadResponse.secure_url,
          source: 'cloudinary',
        });
      } catch (cloudinaryErr) {
        console.error('Cloudinary upload error, falling back:', cloudinaryErr);
        // Continue to fallback if Cloudinary fails
      }
    }

    // 2. Local Fallback - Save to public/uploads directory
    try {
      // Find where public folder is. In local dev, it is in the root directory.
      const publicDir = path.join(process.cwd(), 'public');
      const uploadsDir = path.join(publicDir, 'uploads');

      // Create directories if they do not exist
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Parse base64 string
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        // If not a standard base64 data URL, just return it directly (it might be a URL already)
        if (image.startsWith('http') || image.startsWith('/')) {
          return res.status(200).json({ url: image, source: 'direct' });
        }
        // Fallback: return the raw string if it's some other format
        return res.status(200).json({ url: image, source: 'raw' });
      }

      const fileExtension = matches[1].split('/')[1] || 'jpg';
      const fileBuffer = Buffer.from(matches[2], 'base64');
      const fileName = `product-${Date.now()}.${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, fileBuffer);

      return res.status(200).json({
        url: `/uploads/${fileName}`,
        source: 'local_disk',
      });
    } catch (fsErr) {
      console.error('File system upload fallback error, using base64 fallback:', fsErr);
      
      // 3. Absolute Fallback: Return raw base64 data URL if we cannot write to disk (e.g. read-only serverless environment without Cloudinary setup)
      // Limit size warning or check
      if (image.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image size too large for fallback storage' });
      }

      return res.status(200).json({
        url: image, // Return raw base64 data URL
        source: 'base64_fallback',
        warning: 'Saved as base64 in database. Configure Cloudinary for production hosting.',
      });
    }
  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
