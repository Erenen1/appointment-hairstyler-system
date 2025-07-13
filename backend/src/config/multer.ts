import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils';

// Upload klasörlerini oluşturma
const ensureUploadDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Dosya türlerini kontrol etme
const imageFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Sadece resim dosyalarını kabul et
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir! (JPG, PNG, GIF, WEBP)'));
  }
};

// Dosya adını temizleme
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Özel karakterleri _ ile değiştir
    .replace(/_+/g, '_') // Birden fazla _ olan yerleri tek _ yap
    .toLowerCase(); // Küçük harfe çevir
};

// Galeri resimleri için storage konfigürasyonu
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/gallery');
    ensureUploadDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const sanitizedName = sanitizeFileName(baseName);
    cb(null, `gallery-${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// Hizmet resimleri için storage konfigürasyonu
const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/services');
    ensureUploadDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const sanitizedName = sanitizeFileName(baseName);
    cb(null, `service-${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// Profil fotoğrafları için storage konfigürasyonu
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/profiles');
    ensureUploadDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const sanitizedName = sanitizeFileName(baseName);
    cb(null, `profile-${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// Ortak multer konfigürasyonu
const commonConfig = {
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maksimum dosya boyutu
    files: 5 // Maksimum 5 dosya
  }
};

// Farklı upload türleri için middleware'ler
export const uploadGalleryImage = multer({
  storage: galleryStorage,
  ...commonConfig
});

export const uploadServiceImage = multer({
  storage: serviceStorage,
  ...commonConfig
});

export const uploadProfileImage = multer({
  storage: profileStorage,
  ...commonConfig
});

// Tek dosya upload'ı için wrapper'lar
export const uploadSingleGalleryImage = uploadGalleryImage.single('image');
export const uploadSingleServiceImage = uploadServiceImage.single('image');
export const uploadSingleProfileImage = uploadProfileImage.single('image');

// Çoklu dosya upload'ı için wrapper'lar
export const uploadMultipleGalleryImages = uploadGalleryImage.array('images', 5);
export const uploadMultipleServiceImages = uploadServiceImage.array('images', 5);

// Dosya URL'sini oluşturma yardımcı fonksiyonu
export const generateFileUrl = (req: any, filePath: string): string => {
  const protocol = req.protocol;
  const host = req.get('host');
  const relativePath = filePath.replace(/\\/g, '/'); // Windows path'lerini Linux formatına çevir
  return `${protocol}://${host}/uploads/${relativePath}`;
};

export const generateFileName = (fileName: string, type: string) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);
  const sanitizedName = sanitizeFileName(baseName);
  return `${type}-${sanitizedName}-${uniqueSuffix}${ext}`;
};

// Dosya silme yardımcı fonksiyonu
export const deleteFile = (filePath: string): Promise<boolean> => {
  return new Promise((resolve) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Dosya silme hatası:', err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}; 