const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImageMime = (file.mimetype || '').startsWith('image/');
    const isImageExt = allowedExtensions.includes(ext);
    // نقبل الملف إذا كان نوعه صورة، أو كان امتداده صورة معروفة
    // (بعض تطبيقات الموبايل لا ترسل mimetype صحيح دائمًا)
    if (isImageMime || isImageExt) {
      cb(null, true);
    } else {
      cb(new Error('يجب أن يكون الملف صورة'));
    }
  },
});

module.exports = upload;
