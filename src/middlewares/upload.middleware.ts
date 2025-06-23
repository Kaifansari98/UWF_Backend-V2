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
  destination: (_req, _file, cb) => {
    cb(null, formDataPath);
  },
  filename: (req: Request, file, cb) => {
    const formId = req.params.formId;
    const suffix = file.fieldname; // 'feesStructure', 'marksheet', 'signature'
    const ext = path.extname(file.originalname);
    const filename = `${formId}${suffix}${ext}`;
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
