import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Ensure upload folder exists for FormData
const formDataPath = path.join(__dirname, '../../assets/FormData');
if (!fs.existsSync(formDataPath)) {
  fs.mkdirSync(formDataPath, { recursive: true });
}

const formStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('✅ Destination confirmed for:', file.originalname);
    cb(null, formDataPath);
  },
  filename: (req: Request, file, cb) => {
    let formId = req.params.formId;
  
    // Fallback for PUT routes like /submissions/edit/:formId
    if (!formId && req.originalUrl.includes('/submissions/edit/')) {
      const parts = req.originalUrl.split('/');
      const index = parts.findIndex(part => part === 'edit');
      if (index !== -1 && parts[index + 1]) {
        formId = parts[index + 1];
      }
    }
  
    if (!formId) {
      console.error('❌ formId is undefined. URL:', req.originalUrl);
      return cb(new Error('Form ID not found in request'), '');
    }
  
    const suffix = file.fieldname;
    const ext = path.extname(file.originalname);
    const filename = `${formId}${suffix}${ext}`;
  
    console.log('📂 Uploading file:', {
      formId,
      suffix,
      ext,
      finalFileName: filename
    });
  
    cb(null, filename);
  }  
});

export const uploadFormData = multer({
  storage: formStorage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Separate middleware for user profile pictures
const userDataPath = path.join(__dirname, '../../assets/UserData');
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

const userStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, userDataPath);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname); // keep original name
  }
});

export const uploadUserProfile = multer({ storage: userStorage });
