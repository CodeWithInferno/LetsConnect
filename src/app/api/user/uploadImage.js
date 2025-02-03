// pages/api/user/uploadImage.js
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File parsing error' });
    }

    if (!files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const file = files.file[0];
      const result = await cloudinary.uploader.upload(file.filepath, {
        upload_preset: 'your_upload_preset', // ⚠️ Replace with your actual preset
      });

      return res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error('Cloudinary error:', error);
      return res.status(500).json({ error: 'Image upload failed' });
    }
  });
}