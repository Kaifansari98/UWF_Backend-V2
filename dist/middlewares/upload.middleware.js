"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadUserProfile = exports.uploadAcknowledgement = exports.uploadFormFileReplacement = exports.uploadFormData = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload folder exists for FormData
const formDataPath = path_1.default.join(__dirname, '../../assets/FormData');
if (!fs_1.default.existsSync(formDataPath)) {
    fs_1.default.mkdirSync(formDataPath, { recursive: true });
}
const formStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        console.log('✅ Destination confirmed for:', file.originalname);
        cb(null, formDataPath);
    },
    filename: (req, file, cb) => {
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
        const ext = path_1.default.extname(file.originalname);
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
exports.uploadFormData = (0, multer_1.default)({
    storage: formStorage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});
// Replacing a single already-submitted FormData file (super admin re-upload).
// Filename is derived from :formId + :field (not the multipart fieldname),
// so the route can accept a single canonical field (e.g. "file") for any of
// the replaceable columns.
const REPLACEABLE_FORM_FIELDS = ['feesStructure', 'marksheet', 'signature', 'parentApprovalLetter'];
const formReplacementStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, formDataPath);
    },
    filename: (req, file, cb) => {
        const { formId, field } = req.params;
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${formId}${field}${ext}`);
    }
});
exports.uploadFormFileReplacement = (0, multer_1.default)({
    storage: formReplacementStorage,
    fileFilter: (req, file, cb) => {
        if (!REPLACEABLE_FORM_FIELDS.includes(req.params.field)) {
            cb(new Error('Invalid field'));
            return;
        }
        const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF or image files are allowed'));
        }
    }
});
// Separate middleware for user profile pictures
const userDataPath = path_1.default.join(__dirname, '../../assets/UserData');
if (!fs_1.default.existsSync(userDataPath)) {
    fs_1.default.mkdirSync(userDataPath, { recursive: true });
}
const userStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, userDataPath);
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname); // keep original name
    }
});
const acknowledgementPath = path_1.default.join(__dirname, '../../assets/Acknowledgment_Data');
if (!fs_1.default.existsSync(acknowledgementPath)) {
    fs_1.default.mkdirSync(acknowledgementPath, { recursive: true });
}
const acknowledgementStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, acknowledgementPath);
    },
    filename: (req, file, cb) => {
        const { formId } = req.params;
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${formId}Invoice${ext}`);
    }
});
exports.uploadAcknowledgement = (0, multer_1.default)({
    storage: acknowledgementStorage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});
exports.uploadUserProfile = (0, multer_1.default)({ storage: userStorage });
