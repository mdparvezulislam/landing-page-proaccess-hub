'use server';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary configuration missing');
  }

  // Simplified upload using direct fetch to Cloudinary
  // In a real production app, you might want to use their SDK
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Note: For a real production app, you should sign the request on the server
  // This is a placeholder for the logic
  
  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('upload_preset', 'pro_access_hub'); // User needs to create this preset

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: uploadData,
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error.message);

  return { url: result.secure_url, publicId: result.public_id };
}
