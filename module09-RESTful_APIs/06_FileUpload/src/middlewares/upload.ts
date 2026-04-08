import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// # Learning Concept: Multer + Cloudinary Upload Middleware
// * This middleware teaches how Express can accept multipart form-data and stream files directly to a cloud storage provider.
// * `upload.single(...)` puts one file on `req.file`, while `upload.array(...)` puts many files on `req.files`.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// # Storage Engine
// * CloudinaryStorage replaces local disk storage, so each uploaded file already has a hosted URL on `file.path`.
const storage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'SD72_post',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    public_id: `post-${Date.now()}`,
  }),
});

// # Upload Middleware
// ! The field name in the route must match the client form-data key, otherwise `req.file` or `req.files` will be empty.
const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

export default upload;
