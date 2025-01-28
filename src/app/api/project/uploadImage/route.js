// src/app/api/project/uploadImage/route.js
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // No NEXT_PUBLIC prefix for server-side env vars
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // Parse the incoming form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Compress the image with sharp
    const compressedBuffer = await sharp(buffer)
      .resize(1200) // Resize to 1200px width, maintaining aspect ratio
      .jpeg({
        quality: 80, // Optimize quality
        mozjpeg: true, // Use MozJPEG for better compression
      })
      .toBuffer();

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`,
      {
        upload_preset: 'letsconnect_upload', // Use your Cloudinary upload preset
        folder: 'projects/banners', // Organize into a folder
        resource_type: 'image', // Explicitly set resource type
      }
    );

    // Return the secure URL
    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image. Please try again.' },
      { status: 500 }
    );
  }
}








