const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure upload directory exists
const uploadsRoot = path.join(__dirname, '..', 'uploads');
const productUploadsDir = path.join(uploadsRoot, 'products');

for (const dir of [uploadsRoot, productUploadsDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productUploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${base || 'image'}-${unique}${ext || '.jpg'}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Tipo de archivo no permitido. Usa JPG, PNG o WEBP.'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = {
  uploadProductImage: upload.single('image'),
  // Redimensiona la imagen subida para tamaño consistente y optimiza
  resizeProductImage: async (req, res, next) => {
    try {
      if (!req.file) return next();

      const inputPath = path.join(productUploadsDir, req.file.filename);
      const ext = path.extname(req.file.filename).toLowerCase();
      const base = path.basename(req.file.filename, ext);

      // Mantener formato original (jpg/png/webp) pero redimensionado
      // Máximo 1024px en el lado más largo, calidad ~80
      const pipeline = sharp(inputPath).rotate().resize({
        width: 1024,
        height: 1024,
        fit: 'inside',
        withoutEnlargement: true,
      });

      if (ext === '.png') {
        await pipeline.png({ quality: 80, compressionLevel: 8 }).toFile(inputPath + '.tmp');
      } else if (ext === '.webp') {
        await pipeline.webp({ quality: 80 }).toFile(inputPath + '.tmp');
      } else {
        // default jpg
        await pipeline.jpeg({ quality: 80 }).toFile(inputPath + '.tmp');
      }

      // Reemplazar archivo original por la versión optimizada
      await fs.promises.rename(inputPath + '.tmp', inputPath);

      next();
    } catch (err) {
      console.error('Error al redimensionar imagen:', err);
      // No bloquear la operación por fallo de procesamiento; continuar
      next();
    }
  },
  uploadsRoot,
  productUploadsDir,
};
