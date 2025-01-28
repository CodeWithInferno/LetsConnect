// src/app/api/user/uploadImage/route.js
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Remove NEXT_PUBLIC_ prefix
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer and compress
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Compress with Sharp
    const compressedBuffer = await sharp(buffer)
      .resize(1200) // Resize width to 1200px (maintains aspect ratio)
      .jpeg({ 
        quality: 80, // Quality between 1-100
        mozjpeg: true // Better compression
      })
      .toBuffer();

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`,
      { upload_preset: 'letsconnect_upload' }
    );

    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}