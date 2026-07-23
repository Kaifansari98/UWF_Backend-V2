"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get uploadAcknowledgement () {
        return uploadAcknowledgement;
    },
    get uploadFormData () {
        return uploadFormData;
    },
    get uploadUserProfile () {
        return uploadUserProfile;
    }
});
const _multer = /*#__PURE__*/ _interop_require_default(require("multer"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Ensure upload folder exists for FormData
const formDataPath = _path.default.join(__dirname, '../../assets/FormData');
if (!_fs.default.existsSync(formDataPath)) {
    _fs.default.mkdirSync(formDataPath, {
        recursive: true
    });
}
const formStorage = _multer.default.diskStorage({
    destination: (req, file, cb)=>{
        console.log('✅ Destination confirmed for:', file.originalname);
        cb(null, formDataPath);
    },
    filename: (req, file, cb)=>{
        let formId = req.params.formId;
        // Fallback for PUT routes like /submissions/edit/:formId
        if (!formId && req.originalUrl.includes('/submissions/edit/')) {
            const parts = req.originalUrl.split('/');
            const index = parts.findIndex((part)=>part === 'edit');
            if (index !== -1 && parts[index + 1]) {
                formId = parts[index + 1];
            }
        }
        if (!formId) {
            console.error('❌ formId is undefined. URL:', req.originalUrl);
            return cb(new Error('Form ID not found in request'), '');
        }
        const suffix = file.fieldname;
        const ext = _path.default.extname(file.originalname);
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
const uploadFormData = (0, _multer.default)({
    storage: formStorage,
    fileFilter: (_req, file, cb)=>{
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});
// Separate middleware for user profile pictures
const userDataPath = _path.default.join(__dirname, '../../assets/UserData');
if (!_fs.default.existsSync(userDataPath)) {
    _fs.default.mkdirSync(userDataPath, {
        recursive: true
    });
}
const userStorage = _multer.default.diskStorage({
    destination: (_req, _file, cb)=>{
        cb(null, userDataPath);
    },
    filename: (_req, file, cb)=>{
        cb(null, file.originalname); // keep original name
    }
});
const acknowledgementPath = _path.default.join(__dirname, '../../assets/Acknowledgment_Data');
if (!_fs.default.existsSync(acknowledgementPath)) {
    _fs.default.mkdirSync(acknowledgementPath, {
        recursive: true
    });
}
const acknowledgementStorage = _multer.default.diskStorage({
    destination: (_req, _file, cb)=>{
        cb(null, acknowledgementPath);
    },
    filename: (req, file, cb)=>{
        const { formId } = req.params;
        const ext = _path.default.extname(file.originalname);
        cb(null, `${formId}Invoice${ext}`);
    }
});
const uploadAcknowledgement = (0, _multer.default)({
    storage: acknowledgementStorage,
    fileFilter: (_req, file, cb)=>{
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});
const uploadUserProfile = (0, _multer.default)({
    storage: userStorage
});

//# sourceMappingURL=upload.middleware.js.map