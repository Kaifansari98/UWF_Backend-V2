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
exports.getAllUniqueNewStudentSubmissions = exports.getAllDisbursedDataService = exports.getDisbursedFormsService = exports.markFormAsDisbursedService = exports.getPaymentInProgressFormsService = exports.updateAcceptedAmountService = void 0;
// src/services/formSubmission.service.ts
const formSubmission_model_1 = __importDefault(require("../models/formSubmission.model"));
const generatedForm_model_1 = __importDefault(require("../models/generatedForm.model"));
const acknowledgementForm_model_1 = __importDefault(require("../models/acknowledgementForm.model"));
const sequelize_1 = require("sequelize");
const updateAcceptedAmountService = (formId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (!amount || isNaN(amount)) {
        throw new Error("Valid amount is required");
    }
    const form = yield generatedForm_model_1.default.findOne({ where: { formId } });
    if (!form || form.status !== "accepted") {
        throw new Error("Form must be in 'accepted' state to update amount");
    }
    const submission = yield formSubmission_model_1.default.findOne({ where: { formId } });
    if (!submission) {
        throw new Error("Form submission not found");
    }
    // ✅ Store plain number without comma formatting
    yield submission.update({ acceptedAmount: amount });
    return amount;
});
exports.updateAcceptedAmountService = updateAcceptedAmountService;
const getPaymentInProgressFormsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield formSubmission_model_1.default.findAll({
        where: {
            acceptedAmount: {
                [sequelize_1.Op.not]: null,
            },
            form_disbursed: false, // ✅ only fetch if not disbursed
        },
        include: [
            {
                model: generatedForm_model_1.default,
                where: {
                    status: "accepted",
                },
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
});
exports.getPaymentInProgressFormsService = getPaymentInProgressFormsService;
const markFormAsDisbursedService = (formId) => __awaiter(void 0, void 0, void 0, function* () {
    const submission = yield formSubmission_model_1.default.findOne({
        where: {
            formId,
            acceptedAmount: { [sequelize_1.Op.not]: null },
            isRejected: false,
        },
        include: [
            {
                model: generatedForm_model_1.default,
                as: "GeneratedForm",
                where: { status: "accepted" },
            },
        ],
    });
    if (!submission) {
        throw new Error("Eligible form not found or doesn't meet the conditions");
    }
    submission.form_disbursed = true;
    yield submission.save();
    return {
        formId,
        form_disbursed: true,
    };
});
exports.markFormAsDisbursedService = markFormAsDisbursedService;
const getDisbursedFormsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield formSubmission_model_1.default.findAll({
        where: {
            acceptedAmount: { [sequelize_1.Op.not]: null },
            form_disbursed: true,
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
});
exports.getDisbursedFormsService = getDisbursedFormsService;
const getAllDisbursedDataService = () => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Get all acknowledged formIds
    const acknowledgedFormIds = yield acknowledgementForm_model_1.default.findAll({
        attributes: ['formId'],
        raw: true,
    });
    const excludedFormIds = acknowledgedFormIds.map((entry) => entry.formId);
    // Step 2: Return disbursed forms that are NOT in the above list
    return yield formSubmission_model_1.default.findAll({
        where: {
            acceptedAmount: { [sequelize_1.Op.not]: null },
            form_accepted: true,
            form_disbursed: true,
            isRejected: false,
            formId: {
                [sequelize_1.Op.notIn]: excludedFormIds.length ? excludedFormIds : [''], // avoids SQL error on empty array
            },
        },
        include: [
            {
                model: generatedForm_model_1.default,
                where: {
                    status: "disbursed",
                },
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
});
exports.getAllDisbursedDataService = getAllDisbursedDataService;
// Helper to extract region initial and suffix
const parseFormId = (formId) => {
    const regionInitial = formId.charAt(0); // e.g. "J"
    const suffix = formId.slice(-4); // e.g. "0001"
    return { regionInitial, suffix };
};
const getAllUniqueNewStudentSubmissions = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get all non-pending submissions with their generated form
    const all = yield formSubmission_model_1.default.findAll({
        include: [
            {
                model: generatedForm_model_1.default,
                where: {
                    status: { [sequelize_1.Op.ne]: "pending" },
                },
            },
        ],
    });
    const seenKeys = new Set();
    const uniqueNewStudentForms = [];
    for (const submission of all) {
        const formId = submission.formId;
        const { regionInitial, suffix } = parseFormId(formId);
        const key = `${regionInitial}-${suffix}`;
        if (!seenKeys.has(key)) {
            seenKeys.add(key);
            uniqueNewStudentForms.push(submission);
        }
    }
    return uniqueNewStudentForms;
});
exports.getAllUniqueNewStudentSubmissions = getAllUniqueNewStudentSubmissions;
