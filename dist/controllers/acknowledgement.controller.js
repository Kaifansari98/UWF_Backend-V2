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
exports.revertAcknowledgementAcceptance = exports.markAcknowledgementFormAsAccepted = exports.getAllAcceptedAcknowledgementForms = exports.getAllSubmittedAcknowledgementForms = exports.getAllPendingAcknowledgementForms = exports.getCompleteStudentData = exports.uploadAcknowledgementInvoice = exports.generateAcknowledgementForm = void 0;
const acknowledgementForm_model_1 = __importDefault(require("../models/acknowledgementForm.model"));
const generatedForm_model_1 = __importDefault(require("../models/generatedForm.model"));
const formSubmission_model_1 = __importDefault(require("../models/formSubmission.model"));
const generateAcknowledgementForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.body;
        if (!formId) {
            res.status(400).json({ message: 'formId is required' });
            return;
        }
        const existingForm = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!existingForm) {
            res.status(404).json({ message: 'Generated form not found' });
            return;
        }
        const formSubmission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        if (!formSubmission) {
            res.status(404).json({ message: 'Form submission not found' });
            return;
        }
        const { firstName, fatherName, familyName } = formSubmission;
        const student_name = `${firstName} ${fatherName} ${familyName}`.trim();
        const form_link = `https://unitedwelfarefoundation.com/acknowledgement-form/${formId}`;
        const newAckForm = yield acknowledgementForm_model_1.default.create({
            formId,
            student_name,
            form_link,
            status: 'pending',
        });
        res.status(201).json({
            message: 'Acknowledgement form generated successfully',
            acknowledgement: newAckForm,
        });
    }
    catch (error) {
        console.error('Error generating acknowledgement form:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.generateAcknowledgementForm = generateAcknowledgementForm;
const uploadAcknowledgementInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.params;
        if (!req.file) {
            res.status(400).json({ message: 'Invoice PDF is required' });
            return;
        }
        const acknowledgement = yield acknowledgementForm_model_1.default.findOne({ where: { formId } });
        if (!acknowledgement) {
            res.status(404).json({ message: 'Acknowledgement form not found' });
            return;
        }
        const invoiceFileName = `${formId}Invoice.pdf`;
        acknowledgement.invoice = invoiceFileName;
        acknowledgement.status = 'submitted';
        acknowledgement.submitted_at = new Date();
        yield acknowledgement.save();
        res.status(200).json({
            message: 'Invoice uploaded and acknowledgement form updated successfully',
            acknowledgement,
        });
    }
    catch (error) {
        console.error('Error uploading invoice:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.uploadAcknowledgementInvoice = uploadAcknowledgementInvoice;
const getCompleteStudentData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.params;
        if (!formId) {
            res.status(400).json({ message: 'formId is required' });
            return;
        }
        const generatedForm = yield generatedForm_model_1.default.findOne({ where: { formId } });
        const formSubmission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        const acknowledgement = yield acknowledgementForm_model_1.default.findOne({ where: { formId } });
        if (!generatedForm && !formSubmission && !acknowledgement) {
            res.status(404).json({ message: 'No records found for this formId' });
            return;
        }
        res.status(200).json({
            formId,
            generatedForm,
            formSubmission,
            acknowledgement,
        });
    }
    catch (error) {
        console.error('Error fetching full student data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getCompleteStudentData = getCompleteStudentData;
// Utility to fetch full student data by formId
const fetchStudentDataByFormId = (formId) => __awaiter(void 0, void 0, void 0, function* () {
    const generatedForm = yield generatedForm_model_1.default.findOne({ where: { formId } });
    const formSubmission = yield formSubmission_model_1.default.findOne({ where: { formId } });
    const acknowledgement = yield acknowledgementForm_model_1.default.findOne({ where: { formId } });
    return {
        formId,
        generatedForm,
        formSubmission,
        acknowledgement,
    };
});
const getAllPendingAcknowledgementForms = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingAckForms = yield acknowledgementForm_model_1.default.findAll({ where: { status: 'pending' } });
        const results = yield Promise.all(pendingAckForms.map((ack) => fetchStudentDataByFormId(ack.formId)));
        res.status(200).json({ count: results.length, data: results });
    }
    catch (error) {
        console.error('Error fetching pending acknowledgements:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getAllPendingAcknowledgementForms = getAllPendingAcknowledgementForms;
const getAllSubmittedAcknowledgementForms = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submittedAckForms = yield acknowledgementForm_model_1.default.findAll({ where: { status: 'submitted' } });
        const results = yield Promise.all(submittedAckForms.map((ack) => fetchStudentDataByFormId(ack.formId)));
        res.status(200).json({ count: results.length, data: results });
    }
    catch (error) {
        console.error('Error fetching submitted acknowledgements:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getAllSubmittedAcknowledgementForms = getAllSubmittedAcknowledgementForms;
const getAllAcceptedAcknowledgementForms = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const acceptedAckForms = yield acknowledgementForm_model_1.default.findAll({ where: { status: 'accepted' } });
        const results = yield Promise.all(acceptedAckForms.map((ack) => fetchStudentDataByFormId(ack.formId)));
        res.status(200).json({ count: results.length, data: results });
    }
    catch (error) {
        console.error('Error fetching accepted acknowledgements:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getAllAcceptedAcknowledgementForms = getAllAcceptedAcknowledgementForms;
const markAcknowledgementFormAsAccepted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    try {
        const ackForm = yield acknowledgementForm_model_1.default.findOne({ where: { formId } });
        const generatedForm = yield generatedForm_model_1.default.findOne({ where: { formId } });
        const submission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        if (!ackForm || !generatedForm || !submission) {
            res.status(404).json({ message: 'Acknowledgement form, submission, or generated form not found' });
            return;
        }
        if (ackForm.status !== 'submitted') {
            res.status(400).json({
                message: 'Acknowledgement form must be in submitted state before accepting'
            });
            return;
        }
        const { form_accepted, form_disbursed, isRejected, acceptedAmount } = submission;
        if (!form_accepted || !form_disbursed || isRejected || !acceptedAmount || acceptedAmount <= 0) {
            res.status(400).json({
                message: 'Cannot accept acknowledgement. Ensure:\n• Form is accepted\n• Disbursed\n• Not rejected\n• Accepted amount > 0'
            });
            return;
        }
        // ✅ Update acknowledgement status
        yield ackForm.update({ status: 'accepted' });
        // ✅ Mark case closed in related tables
        yield submission.update({ form_case_closed: true });
        yield generatedForm.update({ status: 'case closed' });
        res.status(200).json({
            message: `Acknowledgement form ${formId} marked as accepted and case closed.`,
            data: {
                formId,
                acknowledgement_status: 'accepted',
                case_closed: true
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to accept and close acknowledgement form',
            error: error.message || error
        });
    }
});
exports.markAcknowledgementFormAsAccepted = markAcknowledgementFormAsAccepted;
const revertAcknowledgementAcceptance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    try {
        const ackForm = yield acknowledgementForm_model_1.default.findOne({ where: { formId } });
        const generatedForm = yield generatedForm_model_1.default.findOne({ where: { formId } });
        const submission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        if (!ackForm || !generatedForm || !submission) {
            res.status(404).json({ message: 'Form or data not found' });
            return;
        }
        if (ackForm.status !== 'accepted') {
            res.status(400).json({
                message: 'Only accepted acknowledgements can be reverted'
            });
            return;
        }
        // ✅ Revert status to submitted
        yield ackForm.update({ status: 'submitted' });
        // ✅ Revert case closed status
        yield submission.update({ form_case_closed: false });
        yield generatedForm.update({ status: 'disbursed' }); // Set it back to accepted
        res.status(200).json({
            message: `Acknowledgement ${formId} reverted to submitted.`,
            data: {
                formId,
                acknowledgement_status: 'submitted',
                case_closed: false
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to revert acknowledgement form',
            error: error.message || error
        });
    }
});
exports.revertAcknowledgementAcceptance = revertAcknowledgementAcceptance;
