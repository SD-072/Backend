import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'SD72_post',
    resource_type: 'auto', // "image" (default), "video", "raw", "auto"
    // format: 'avif',
    // allowed_formats: ['jpg', 'jpeg', 'png'],
    // public_id: `blogpost-${Date.now()}`,
    // transformation: [{ width: 1024, height: 1024, crop: 'limit' }],
    // ...
  }),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8 MiB
    // fileSize: 64 * 1024 * 1024, // 64 MiB
  },
});

export default upload;
