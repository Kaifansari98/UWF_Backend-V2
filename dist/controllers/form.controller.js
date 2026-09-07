"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDuplicateStudent = exports.deletePendingFormById = exports.getPendingForms = exports.getFormStatus = exports.generateFormForExistingStudent = exports.generateNewStudentForm = exports.getAllGeneratedForms = exports.generateFormId = void 0;
const generatedForm_model_1 = __importDefault(require("../models/generatedForm.model"));
const formSubmission_model_1 = __importDefault(require("../models/formSubmission.model"));
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../database/sequelize"));
const requestParams_1 = require("../utils/requestParams");
const FRONTEND_URL = ((_a = process.env.FRONTEND_URL) === null || _a === void 0 ? void 0 : _a.trim()) || 'http://localhost:3000';
const generateFormId = (region, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const regionInitial = region.charAt(0).toUpperCase();
    const currentYear = new Date().getFullYear();
    // The last 4 digits are a *permanent* per-student sequence: when an
    // existing student's form is regenerated (generateFormForExistingStudent),
    // the same suffix is reused with just the year swapped. So a brand-new
    // student must get a suffix higher than any ever issued for this region,
    // in ANY year — not just the current year — otherwise a later
    // regeneration for an old student can collide with a fresh one.
    //
    // Order by the numeric value of the suffix (not created_on/formId text,
    // which can put a recently-regenerated old suffix "after" a numerically
    // higher one from an earlier new-student form). This selects a real row,
    // so it can still be locked inside a transaction to serialize concurrent
    // callers.
    const latestForm = yield generatedForm_model_1.default.findOne({
        where: {
            formId: {
                [sequelize_1.Op.like]: `${regionInitial}%`
            }
        },
        order: [[sequelize_1.Sequelize.literal(`CAST(RIGHT("formId", 4) AS INTEGER)`), 'DESC']],
        transaction,
        lock: transaction ? transaction.LOCK.UPDATE : undefined,
        logging: (sql) => console.log('[generateFormId DEBUG]', sql)
    });
    console.log('[generateFormId DEBUG] regionInitial=', regionInitial, 'latestForm=', (_a = latestForm === null || latestForm === void 0 ? void 0 : latestForm.formId) !== null && _a !== void 0 ? _a : null);
    let nextSequence = 1;
    if (latestForm === null || latestForm === void 0 ? void 0 : latestForm.formId) {
        // Extract the last 4 digits (sequence)
        const lastSeq = parseInt(latestForm.formId.slice(-4));
        if (!isNaN(lastSeq)) {
            nextSequence = lastSeq + 1;
        }
    }
    // Now build new formId with current year and next sequence
    const newFormId = `${regionInitial}${currentYear}${String(nextSequence).padStart(4, '0')}`;
    return newFormId;
});
exports.generateFormId = generateFormId;
const getAllGeneratedForms = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissions = yield formSubmission_model_1.default.findAll();
        const forms = submissions.map((submission) => {
            var _a, _b;
            const student_name = [
                submission.firstName,
                submission.fatherName,
                submission.familyName,
            ]
                .filter(Boolean)
                .join(' ')
                .trim();
            let status = 'submitted';
            if (submission.isRejected) {
                status = 'rejected';
            }
            else if (submission.form_case_closed) {
                status = 'case closed';
            }
            else if (submission.form_disbursed) {
                status = 'disbursed';
            }
            else if (submission.form_accepted) {
                status = 'accepted';
            }
            return {
                formId: submission.formId,
                student_name,
                status,
                form_link: `${FRONTEND_URL}/${submission.formId}`,
                created_on: (_b = (_a = submission.submitted_at) !== null && _a !== void 0 ? _a : submission.createdAt) !== null && _b !== void 0 ? _b : submission.updatedAt,
            };
        });
        res.status(200).json({ forms });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch forms', error });
    }
});
exports.getAllGeneratedForms = getAllGeneratedForms;
const generateNewStudentForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    const { region, name } = req.body;
    if (!region || !name) {
        res.status(400).json({ message: 'Both name and region are required' });
        return;
    }
    const MAX_RETRIES = 5;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const form = yield sequelize_2.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
                const formId = yield (0, exports.generateFormId)(region, t);
                const form_link = `${FRONTEND_URL}/${formId}`;
                return generatedForm_model_1.default.create({
                    formId,
                    region,
                    form_link,
                    creatorId: user.id,
                    creator_name: user.full_name,
                    student_name: name // ✅ Save name
                }, { transaction: t });
            }));
            res.status(201).json({ message: 'Form created for new student', form });
            return;
        }
        catch (err) {
            // Two requests can still both find "no existing row" (nothing to lock)
            // and race to insert sequence 1 for a brand new region/year. Retry a
            // few times on that specific conflict instead of failing the request.
            const isDuplicateFormId = (err === null || err === void 0 ? void 0 : err.name) === 'SequelizeUniqueConstraintError' &&
                ((_a = err === null || err === void 0 ? void 0 : err.fields) === null || _a === void 0 ? void 0 : _a.formId) !== undefined;
            if (isDuplicateFormId && attempt < MAX_RETRIES) {
                continue;
            }
            res.status(500).json({ message: 'Failed to create form', error: err });
            return;
        }
    }
});
exports.generateNewStudentForm = generateNewStudentForm;
const generateFormForExistingStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const { oldFormId } = req.body;
        const oldForm = yield generatedForm_model_1.default.findOne({ where: { formId: oldFormId } });
        if (!oldForm) {
            res.status(404).json({ message: 'Original student/form not found' });
            return;
        }
        const prefix = oldFormId.charAt(0);
        const sequence = oldFormId.slice(-4); // get last 4 digits
        const currentYear = new Date().getFullYear();
        const newFormId = `${prefix}${currentYear}${sequence}`;
        const form_link = `${FRONTEND_URL}/${newFormId}`;
        // This student's form for the current year may already have been
        // generated (e.g. a duplicate "resend" click) — return it instead of
        // hitting the formId unique constraint.
        const existingForm = yield generatedForm_model_1.default.findOne({ where: { formId: newFormId } });
        if (existingForm) {
            res.status(200).json({ message: 'Form already exists for this student and year', form: existingForm });
            return;
        }
        const newForm = yield generatedForm_model_1.default.create({
            formId: newFormId,
            region: oldForm.region,
            form_link,
            creatorId: user.id,
            creator_name: user.full_name,
            student_name: oldForm.student_name // ✅ copy name from old form
        });
        res.status(201).json({ message: 'Form created for existing student', form: newForm });
    }
    catch (err) {
        if ((err === null || err === void 0 ? void 0 : err.name) === 'SequelizeUniqueConstraintError' && ((_a = err === null || err === void 0 ? void 0 : err.fields) === null || _a === void 0 ? void 0 : _a.formId) !== undefined) {
            res.status(409).json({ message: 'Form already exists for this student and year', error: err });
            return;
        }
        res.status(500).json({ message: 'Failed to create form', error: err });
    }
});
exports.generateFormForExistingStudent = generateFormForExistingStudent;
const getFormStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formId = (0, requestParams_1.getSingleParam)(req.params.formId);
        if (!formId) {
            res.status(400).json({ message: 'formId is required' });
            return;
        }
        const form = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!form) {
            res.status(404).json({ message: "Form not found" });
            return;
        }
        // Extract form suffix and prefix
        const suffix = formId.slice(-4);
        const prefix = formId.charAt(0);
        // Find if an earlier form exists with the same suffix
        const earlierForm = yield generatedForm_model_1.default.findOne({
            where: {
                formId: {
                    [sequelize_1.Op.like]: `${prefix}%${suffix}`
                },
                created_on: {
                    [sequelize_1.Op.lt]: form.getDataValue('created_on')
                }
            }
        });
        const isNewStudent = !earlierForm;
        res.status(200).json({
            status: form.status,
            isNewStudent
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get form status", error });
    }
});
exports.getFormStatus = getFormStatus;
const getPendingForms = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingForms = yield generatedForm_model_1.default.findAll({
            where: { status: 'pending' }
        });
        res.status(200).json({ forms: pendingForms });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch pending forms', error });
    }
});
exports.getPendingForms = getPendingForms;
const deletePendingFormById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.body;
        if (!formId) {
            res.status(400).json({ message: 'formId is required' });
            return;
        }
        const form = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!form) {
            res.status(404).json({ message: 'Form not found' });
            return;
        }
        if (form.getDataValue('status') !== 'pending') {
            res.status(400).json({ message: 'Only forms with pending status can be deleted' });
            return;
        }
        yield form.destroy();
        res.status(200).json({ message: `Form ${formId} deleted successfully` });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete form', error });
    }
});
exports.deletePendingFormById = deletePendingFormById;
/**
 * POST /forms/check-duplicate
 * Body: { name: string, region: string }
 *
 * Checks form_submissions (joined with generated_forms for region) for a
 * student whose full name (firstName + fatherName + familyName) matches the
 * supplied name AND whose form was created for the given region.
 *
 * Returns:
 *   { isDuplicate: boolean, matches: { formId, firstName, fatherName, familyName, schoolName }[] }
 */
const checkDuplicateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, region } = req.body;
        if (!name || !region) {
            res.status(400).json({ message: 'Both name and region are required' });
            return;
        }
        const nameNormalized = name.trim().toLowerCase();
        // Pull all submissions whose generated form matches the region
        const submissions = yield formSubmission_model_1.default.findAll({
            include: [
                {
                    model: generatedForm_model_1.default,
                    required: true,
                    where: { region },
                    attributes: ['formId', 'region'],
                },
            ],
            attributes: ['formId', 'firstName', 'fatherName', 'familyName', 'schoolName'],
        });
        // Case-insensitive full-name comparison done in JS to avoid DB dialect differences
        const matches = submissions
            .filter((s) => {
            var _a, _b, _c;
            const parts = [
                (_a = s.getDataValue('firstName')) !== null && _a !== void 0 ? _a : '',
                (_b = s.getDataValue('fatherName')) !== null && _b !== void 0 ? _b : '',
                (_c = s.getDataValue('familyName')) !== null && _c !== void 0 ? _c : '',
            ]
                .map((p) => p.trim())
                .filter(Boolean);
            return parts.join(' ').toLowerCase() === nameNormalized;
        })
            .map((s) => ({
            formId: s.getDataValue('formId'),
            firstName: s.getDataValue('firstName'),
            fatherName: s.getDataValue('fatherName'),
            familyName: s.getDataValue('familyName'),
            schoolName: s.getDataValue('schoolName'),
        }));
        res.status(200).json({
            isDuplicate: matches.length > 0,
            matches,
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to check for duplicate student', error: err });
    }
});
exports.checkDuplicateStudent = checkDuplicateStudent;
