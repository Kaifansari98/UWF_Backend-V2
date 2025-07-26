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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePendingFormById = exports.getPendingForms = exports.getFormStatus = exports.generateFormForExistingStudent = exports.generateNewStudentForm = exports.getAllGeneratedForms = exports.generateFormId = void 0;
const generatedForm_model_1 = __importDefault(require("../models/generatedForm.model"));
const sequelize_1 = require("sequelize");
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const generateFormId = (region) => __awaiter(void 0, void 0, void 0, function* () {
    const regionInitial = region.charAt(0).toUpperCase();
    const currentYear = new Date().getFullYear();
    // Find the max sequence for this region across all years
    const latestForm = yield generatedForm_model_1.default.findOne({
        where: {
            formId: {
                [sequelize_1.Op.like]: `${regionInitial}%`
            }
        },
        order: [['created_on', 'DESC']]
    });
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
        const forms = yield generatedForm_model_1.default.findAll();
        res.status(200).json({ forms }); // student_name is included by default
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch forms', error });
    }
});
exports.getAllGeneratedForms = getAllGeneratedForms;
const generateNewStudentForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { region, name } = req.body;
        if (!region || !name) {
            res.status(400).json({ message: 'Both name and region are required' });
            return;
        }
        const formId = yield (0, exports.generateFormId)(region);
        const form_link = `${FRONTEND_URL}/${formId}`;
        const form = yield generatedForm_model_1.default.create({
            formId,
            region,
            form_link,
            creatorId: user.id,
            creator_name: user.full_name,
            student_name: name // ✅ Save name
        });
        res.status(201).json({ message: 'Form created for new student', form });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create form', error: err });
    }
});
exports.generateNewStudentForm = generateNewStudentForm;
const generateFormForExistingStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.status(500).json({ message: 'Failed to create form', error: err });
    }
});
exports.generateFormForExistingStudent = generateFormForExistingStudent;
const getFormStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.params;
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
