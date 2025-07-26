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
exports.getCaseClosedFormsCurrentYear = exports.revertCaseClosed = exports.getCaseClosedForms = exports.markFormAsCaseClosed = exports.getAllNewStudentSubmissions = exports.getAllDisbursedData = exports.revertDisbursementToAccepted = exports.markRequestAsDisbursed = exports.getDisbursedForms = exports.revertDisbursedForm = exports.markFormAsDisbursed = exports.revertTreasuryApproval = exports.getPaymentInProgressForms = exports.updateAcceptedAmount = exports.getAcceptedFormSubmissions = exports.revertFormAcceptance = exports.acceptFormSubmission = exports.getRejectedFormSubmissions = exports.revertRejection = exports.rejectFormSubmission = exports.deleteFormSubmission = exports.editFormSubmission = exports.getSubmittedFormSubmissions = exports.submitForm = void 0;
const formSubmission_model_1 = __importDefault(require("../models/formSubmission.model"));
const generatedForm_model_1 = __importDefault(require("../models/generatedForm.model"));
const acknowledgementForm_model_1 = __importDefault(require("../models/acknowledgementForm.model"));
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Inside formSubmission.controller.ts
const formSubmission_service_1 = require("../services/formSubmission.service");
const submitForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const { formId } = req.params;
        const form = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!form) {
            res.status(404).json({ message: 'Form not found' });
            return;
        }
        const { firstName, fatherName, familyName, gender, schoolName, studyMedium, class: className, academicYear, parentName, mobile, alternateMobile, address, incomeSource, reason, requested_amount, bankAccountHolder, bankAccountNumber, ifscCode, bankName, coordinatorName, coordinatorMobile } = req.body;
        // ✅ Properly assert req.files type
        const files = req.files;
        const feesStructure = (_b = (_a = files === null || files === void 0 ? void 0 : files['feesStructure']) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.filename;
        const marksheet = (_d = (_c = files === null || files === void 0 ? void 0 : files['marksheet']) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.filename;
        const signature = (_f = (_e = files === null || files === void 0 ? void 0 : files['signature']) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.filename;
        let parentApprovalLetter = (_h = (_g = files === null || files === void 0 ? void 0 : files['parentApprovalLetter']) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.filename;
        // ✅ Step 2: If no parentApprovalLetter uploaded, try to fetch from old form
        if (!parentApprovalLetter) {
            const prefix = formId.charAt(0);
            const sequence = formId.slice(-4); // get last 4 digits
            const previousForm = yield generatedForm_model_1.default.findOne({
                where: {
                    formId: {
                        [sequelize_1.Op.like]: `${prefix}%${sequence}`
                    },
                    status: 'submitted'
                },
                order: [['created_on', 'DESC']]
            });
            if (previousForm) {
                const previousSubmission = yield formSubmission_model_1.default.findOne({
                    where: { formId: previousForm.formId }
                });
                parentApprovalLetter = (previousSubmission === null || previousSubmission === void 0 ? void 0 : previousSubmission.getDataValue('parentApprovalLetter')) || '';
            }
        }
        const submission = yield formSubmission_model_1.default.create({
            formId,
            firstName,
            fatherName,
            familyName,
            gender,
            schoolName,
            studyMedium,
            class: className,
            academicYear,
            parentName,
            mobile,
            alternateMobile,
            address,
            incomeSource,
            reason,
            requested_amount,
            feesStructure,
            marksheet,
            signature,
            parentApprovalLetter,
            bankAccountHolder,
            bankAccountNumber,
            ifscCode,
            bankName,
            coordinatorName,
            coordinatorMobile,
            submitted_at: new Date()
        });
        // ✅ Update the corresponding generated_forms record
        yield form.update({
            submitted_on: new Date(),
            status: 'submitted'
        });
        res.status(201).json({
            message: 'Form submitted successfully',
            submission
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Form submission failed',
            error: err.message
        });
    }
});
exports.submitForm = submitForm;
const getSubmittedFormSubmissions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissions = yield formSubmission_model_1.default.findAll({
            include: [
                {
                    model: generatedForm_model_1.default,
                    where: { status: 'submitted' }, // filter only 'submitted' forms
                    attributes: ['status', 'formId', 'region', 'creator_name', 'submitted_on'],
                }
            ]
        });
        res.status(200).json({ submissions });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to fetch submitted form submissions',
            error
        });
    }
});
exports.getSubmittedFormSubmissions = getSubmittedFormSubmissions;
const editFormSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { formId } = req.params;
        const submission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        if (!submission) {
            res.status(404).json({ message: 'Submission not found' });
            return;
        }
        const files = req.files;
        // Determine which files to update (delete old ones if needed)
        const fileFields = ['feesStructure', 'marksheet', 'signature', 'parentApprovalLetter'];
        const updatedFiles = {};
        for (const field of fileFields) {
            if ((_a = files === null || files === void 0 ? void 0 : files[field]) === null || _a === void 0 ? void 0 : _a[0]) {
                const newFileName = files[field][0].filename;
                const oldFileName = submission.getDataValue(field);
                // Only delete the old file if the new one has a different filename
                if (oldFileName && oldFileName !== newFileName) {
                    const oldFilePath = path_1.default.join(__dirname, `../../assets/FormData/${oldFileName}`);
                    if (fs_1.default.existsSync(oldFilePath)) {
                        fs_1.default.unlinkSync(oldFilePath);
                    }
                }
                updatedFiles[field] = newFileName;
            }
            else {
                // No new file uploaded, retain the existing filename
                updatedFiles[field] = submission.getDataValue(field);
            }
        }
        // Update other fields from body
        const { firstName, fatherName, familyName, gender, schoolName, studyMedium, class: className, academicYear, parentName, mobile, alternateMobile, address, incomeSource, reason, requested_amount, bankAccountHolder, bankAccountNumber, ifscCode, bankName, coordinatorName, coordinatorMobile, form_accepted, form_disbursed, form_case_closed } = req.body;
        yield submission.update(Object.assign({ firstName,
            fatherName,
            familyName,
            gender,
            schoolName,
            studyMedium, class: className, academicYear,
            parentName,
            mobile,
            alternateMobile,
            address,
            incomeSource,
            reason,
            requested_amount,
            bankAccountHolder,
            bankAccountNumber,
            ifscCode,
            bankName,
            coordinatorName,
            coordinatorMobile,
            form_accepted,
            form_disbursed,
            form_case_closed }, updatedFiles));
        res.status(200).json({ message: 'Form submission updated successfully', submission });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to update form submission',
            error: error.message
        });
    }
});
exports.editFormSubmission = editFormSubmission;
const deleteFormSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.body;
        if (!formId) {
            res.status(400).json({ message: "formId is required" });
            return;
        }
        const submission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        if (!submission) {
            res.status(404).json({ message: "Submission not found" });
            return;
        }
        const form = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!form) {
            res.status(404).json({ message: "Generated form not found" });
            return;
        }
        // Extract prefix & suffix
        const suffix = formId.slice(-4); // "0001"
        const prefix = formId.charAt(0); // "J"
        const currentYear = parseInt(formId.slice(1, 5)); // 2026
        // Check if any earlier year form exists with same suffix (indicating this is an existing student)
        const existingForm = yield generatedForm_model_1.default.findOne({
            where: {
                formId: {
                    [sequelize_1.Op.like]: `${prefix}%${suffix}`
                },
                created_on: {
                    [sequelize_1.Op.lt]: form.getDataValue('created_on')
                }
            }
        });
        const isExistingStudent = !!existingForm;
        // Delete uploaded files
        const fileFields = ['feesStructure', 'marksheet', 'signature', 'parentApprovalLetter'];
        for (const field of fileFields) {
            const fileName = submission.getDataValue(field);
            const filePath = path_1.default.join(__dirname, `../../assets/FormData/${fileName}`);
            // ❗ If this is an existing student, skip deleting parentApprovalLetter
            if (isExistingStudent && field === 'parentApprovalLetter')
                continue;
            if (fileName && fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        // Delete both entries
        yield submission.destroy();
        yield form.destroy();
        res.status(200).json({
            message: `Form ${formId} and its submission deleted successfully${isExistingStudent ? ', parentApprovalLetter retained' : ''}`
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to delete submission and form",
            error: error.message
        });
    }
});
exports.deleteFormSubmission = deleteFormSubmission;
const rejectFormSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.params;
        const submission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        const form = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!submission || !form) {
            res.status(404).json({ message: "Form or submission not found" });
            return;
        }
        // Update form status to rejected
        yield form.update({ status: "rejected" });
        // ✅ Fixed this line
        if (submission.getDataValue('form_accepted') === true) {
            yield submission.update({ isRejected: true, form_accepted: false });
        }
        else {
            yield submission.update({ isRejected: true });
        }
        res.status(200).json({ message: "Form marked as rejected" });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to reject form submission",
            error: error.message
        });
    }
});
exports.rejectFormSubmission = rejectFormSubmission;
const revertRejection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.params;
        const submission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        const form = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!submission || !form) {
            res.status(404).json({ message: "Form or submission not found" });
            return;
        }
        yield submission.update({ isRejected: false });
        yield form.update({ status: "submitted" });
        res.status(200).json({ message: "Form rejection reverted successfully" });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to revert rejection",
            error: error.message
        });
    }
});
exports.revertRejection = revertRejection;
const getRejectedFormSubmissions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rejectedSubmissions = yield formSubmission_model_1.default.findAll({
            include: [
                {
                    model: generatedForm_model_1.default,
                    where: { status: 'rejected' },
                    attributes: [
                        'formId',
                        'region',
                        'form_link',
                        'status',
                        'created_on',
                        'submitted_on',
                        'creator_name',
                        'student_name',
                    ]
                }
            ]
        });
        res.status(200).json({ rejectedSubmissions });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to fetch rejected submissions',
            error: error.message
        });
    }
});
exports.getRejectedFormSubmissions = getRejectedFormSubmissions;
const acceptFormSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    try {
        const form = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!form) {
            res.status(404).json({ message: "Generated form not found" });
            return;
        }
        const submission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        if (!submission) {
            res.status(404).json({ message: "Form submission not found" });
            return;
        }
        // Update both tables
        yield form.update({ status: "accepted" });
        yield submission.update({ form_accepted: true });
        res.status(200).json({ message: "Form marked as accepted" });
    }
    catch (err) {
        console.error("Error updating form acceptance:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.acceptFormSubmission = acceptFormSubmission;
const revertFormAcceptance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    try {
        const form = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!form) {
            res.status(404).json({ message: "Generated form not found" });
            return;
        }
        const submission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        if (!submission) {
            res.status(404).json({ message: "Form submission not found" });
            return;
        }
        // Revert both tables
        yield form.update({ status: "submitted" });
        yield submission.update({ form_accepted: false });
        res.status(200).json({ message: "Form acceptance reverted successfully" });
    }
    catch (err) {
        console.error("Error reverting form acceptance:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.revertFormAcceptance = revertFormAcceptance;
const getAcceptedFormSubmissions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const acceptedSubmissions = yield formSubmission_model_1.default.findAll({
            where: {
                acceptedAmount: null, // <-- Only include submissions where acceptedAmount is not set
            },
            include: [
                {
                    model: generatedForm_model_1.default,
                    where: { status: "accepted" },
                    attributes: [
                        "formId",
                        "region",
                        "form_link",
                        "status",
                        "created_on",
                        "submitted_on",
                        "creator_name",
                        "student_name",
                    ],
                },
            ],
        });
        res.status(200).json({ acceptedSubmissions });
    }
    catch (err) {
        console.error("Error fetching accepted submissions:", err);
        res.status(500).json({ message: "Failed to fetch accepted submissions" });
    }
});
exports.getAcceptedFormSubmissions = getAcceptedFormSubmissions;
const updateAcceptedAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.params;
        const { amount } = req.body;
        const savedAmount = yield (0, formSubmission_service_1.updateAcceptedAmountService)(formId, Number(amount));
        res.status(200).json({
            message: "Accepted amount updated successfully",
            acceptedAmount: savedAmount,
        });
    }
    catch (error) {
        console.error("Error updating accepted amount:", error);
        res.status(400).json({ message: error.message || "Failed to update accepted amount" });
    }
});
exports.updateAcceptedAmount = updateAcceptedAmount;
const getPaymentInProgressForms = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissions = yield (0, formSubmission_service_1.getPaymentInProgressFormsService)();
        res.status(200).json({ paymentInProgress: submissions });
    }
    catch (err) {
        console.error("Error fetching payment in progress forms:", err);
        res.status(500).json({ message: "Failed to fetch payment in progress forms" });
    }
});
exports.getPaymentInProgressForms = getPaymentInProgressForms;
const revertTreasuryApproval = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    try {
        const submission = yield formSubmission_model_1.default.findOne({
            where: { formId },
            include: [{ model: generatedForm_model_1.default, as: "GeneratedForm" }],
        });
        if (!submission) {
            res.status(404).json({ message: "Submission not found" });
            return;
        }
        // Reset acceptedAmount
        submission.acceptedAmount = null;
        yield submission.save();
        const generatedForm = submission.GeneratedForm;
        if (generatedForm) {
            generatedForm.status = "accepted";
            yield generatedForm.save();
        }
        res.status(200).json({
            message: `Treasury approval reverted for ${formId}`,
            data: {
                formId,
                status: "accepted",
            },
        });
    }
    catch (error) {
        console.error("Error reverting treasury approval:", error);
        res.status(500).json({
            message: error.message || "Failed to revert treasury approval",
        });
    }
});
exports.revertTreasuryApproval = revertTreasuryApproval;
const markFormAsDisbursed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    try {
        const result = yield (0, formSubmission_service_1.markFormAsDisbursedService)(formId);
        res.status(200).json({
            message: `Form ${formId} marked as disbursed.`,
            data: result,
        });
    }
    catch (error) {
        console.error("Error updating form_disbursed:", error);
        res.status(500).json({
            message: error.message || "Failed to update disbursement status",
        });
    }
});
exports.markFormAsDisbursed = markFormAsDisbursed;
const revertDisbursedForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    try {
        const submission = yield formSubmission_model_1.default.findOne({
            where: { formId },
            include: [{ model: generatedForm_model_1.default }],
        });
        if (!submission) {
            res.status(404).json({ message: "Submission not found" });
            return;
        }
        if (!submission.form_disbursed) {
            res.status(400).json({ message: "Form is not marked as disbursed" });
            return;
        }
        submission.form_disbursed = false;
        yield submission.save();
        res.status(200).json({
            message: `Disbursement reverted for form ${formId}`,
            data: {
                formId,
                form_disbursed: false,
            },
        });
    }
    catch (error) {
        console.error("Error reverting disbursement:", error);
        res.status(500).json({
            message: error.message || "Failed to revert disbursement",
        });
    }
});
exports.revertDisbursedForm = revertDisbursedForm;
const getDisbursedForms = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissions = yield (0, formSubmission_service_1.getDisbursedFormsService)();
        res.status(200).json({ disbursedForms: submissions });
    }
    catch (err) {
        console.error("Error fetching disbursed forms:", err);
        res.status(500).json({ message: "Failed to fetch disbursed forms" });
    }
});
exports.getDisbursedForms = getDisbursedForms;
const markRequestAsDisbursed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    try {
        const submission = yield formSubmission_model_1.default.findOne({
            where: { formId },
            include: [{ model: generatedForm_model_1.default }],
        });
        if (!submission) {
            res.status(404).json({ message: "Form submission not found" });
            return;
        }
        const { acceptedAmount, form_accepted, form_disbursed, isRejected } = submission;
        if (!acceptedAmount || !form_accepted || !form_disbursed || isRejected) {
            res.status(400).json({
                message: "Cannot disburse form. Ensure all conditions are met:\n• Accepted amount present\n• Form accepted\n• Form disbursed\n• Not rejected",
            });
            return;
        }
        const generatedForm = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!generatedForm) {
            res.status(404).json({ message: "Generated form not found" });
            return;
        }
        generatedForm.status = "disbursed";
        yield generatedForm.save();
        res.status(200).json({
            message: `Form ${formId} marked as disbursed`,
            data: {
                formId,
                status: "disbursed",
            },
        });
    }
    catch (error) {
        console.error("Error disbursing form:", error);
        res.status(500).json({ message: error.message || "Failed to update form status" });
    }
});
exports.markRequestAsDisbursed = markRequestAsDisbursed;
const revertDisbursementToAccepted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    try {
        // Fetch form submission with associated generated form
        const submission = yield formSubmission_model_1.default.findOne({
            where: { formId },
            include: [{ model: generatedForm_model_1.default }],
        });
        if (!submission) {
            res.status(404).json({ message: "Form submission not found" });
            return;
        }
        const { acceptedAmount, form_accepted, form_disbursed, isRejected } = submission;
        // Check required flags
        if (!acceptedAmount || !form_accepted || !form_disbursed || isRejected) {
            res.status(400).json({
                message: "Cannot revert disbursement. Make sure:\n• Accepted amount exists\n• Form is accepted\n• Form is marked as disbursed\n• Form is not rejected",
            });
            return;
        }
        // Ensure generated form exists
        const generatedForm = submission.GeneratedForm;
        if (!generatedForm) {
            res.status(404).json({ message: "Generated form not found" });
            return;
        }
        if (generatedForm.status !== "disbursed") {
            res.status(400).json({ message: "Form is not currently marked as disbursed." });
            return;
        }
        // Revert to accepted
        generatedForm.status = "accepted";
        yield generatedForm.save();
        res.status(200).json({
            message: `Form ${formId} status reverted to accepted.`,
            data: {
                formId,
                status: "accepted",
            },
        });
    }
    catch (error) {
        console.error("Error reverting disbursement:", error);
        res.status(500).json({
            message: error.message || "Failed to revert disbursement status",
        });
    }
});
exports.revertDisbursementToAccepted = revertDisbursementToAccepted;
const getAllDisbursedData = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const disbursedForms = yield (0, formSubmission_service_1.getAllDisbursedDataService)();
        res.status(200).json({ disbursedForms });
    }
    catch (error) {
        console.error("Error fetching disbursed data:", error);
        res.status(500).json({ message: "Failed to fetch disbursed forms data" });
    }
});
exports.getAllDisbursedData = getAllDisbursedData;
const getAllNewStudentSubmissions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissions = yield (0, formSubmission_service_1.getAllUniqueNewStudentSubmissions)();
        res.status(200).json({ submissions });
    }
    catch (error) {
        console.error("Error fetching new student submissions:", error);
        res.status(500).json({ message: "Failed to fetch new student submissions" });
    }
});
exports.getAllNewStudentSubmissions = getAllNewStudentSubmissions;
const markFormAsCaseClosed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    try {
        const submission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        const generatedForm = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!submission || !generatedForm) {
            res.status(404).json({ message: "Form or submission not found" });
            return;
        }
        const { form_accepted, form_disbursed, isRejected, acceptedAmount } = submission;
        if (!form_accepted || !form_disbursed || isRejected || !acceptedAmount || acceptedAmount <= 0) {
            res.status(400).json({
                message: "Cannot close case. Make sure:\n• Form is accepted\n• Disbursed\n• Not rejected\n• Accepted amount is greater than 0"
            });
            return;
        }
        yield submission.update({ form_case_closed: true });
        yield generatedForm.update({ status: "case closed" });
        res.status(200).json({
            message: `Form ${formId} marked as case closed.`,
            data: {
                formId,
                status: "case closed",
                form_case_closed: true
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to mark form as case closed",
            error: error.message || error
        });
    }
});
exports.markFormAsCaseClosed = markFormAsCaseClosed;
const getCaseClosedForms = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const forms = yield formSubmission_model_1.default.findAll({
            where: { form_case_closed: true },
            include: [
                {
                    model: generatedForm_model_1.default,
                    where: { status: "case closed" },
                },
                {
                    model: acknowledgementForm_model_1.default,
                    required: false
                }
            ]
        });
        res.status(200).json({ caseClosedForms: forms });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch case closed forms",
            error: error.message || error
        });
    }
});
exports.getCaseClosedForms = getCaseClosedForms;
const revertCaseClosed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    try {
        const submission = yield formSubmission_model_1.default.findOne({ where: { formId } });
        const generatedForm = yield generatedForm_model_1.default.findOne({ where: { formId } });
        if (!submission || !generatedForm) {
            res.status(404).json({ message: "Form or submission not found" });
            return;
        }
        const { status } = generatedForm;
        if (status !== "case closed") {
            res.status(400).json({ message: "Form is not marked as case closed" });
            return;
        }
        yield submission.update({ form_case_closed: false });
        yield generatedForm.update({ status: "disbursed" });
        res.status(200).json({
            message: `Case closed reverted for form ${formId}`,
            data: {
                formId,
                status: "disbursed",
                form_case_closed: false
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to revert case closed status",
            error: error.message || error
        });
    }
});
exports.revertCaseClosed = revertCaseClosed;
const getCaseClosedFormsCurrentYear = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentYear = new Date().getFullYear();
        const forms = yield formSubmission_model_1.default.findAll({
            where: { form_case_closed: true },
            include: [
                {
                    model: generatedForm_model_1.default,
                    where: {
                        status: "case closed",
                        submitted_on: {
                            [sequelize_1.Op.and]: [
                                { [sequelize_1.Op.ne]: null },
                                (0, sequelize_1.where)((0, sequelize_1.fn)("EXTRACT", (0, sequelize_1.literal)(`YEAR FROM "submitted_on"`)), currentYear)
                            ]
                        }
                    }
                }
            ]
        });
        res.status(200).json({ caseClosedForms: forms });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch case closed forms for current year",
            error: error.message || error
        });
    }
});
exports.getCaseClosedFormsCurrentYear = getCaseClosedFormsCurrentYear;
