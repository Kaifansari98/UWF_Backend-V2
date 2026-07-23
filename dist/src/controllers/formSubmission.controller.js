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
    get acceptFormSubmission () {
        return acceptFormSubmission;
    },
    get deleteFormSubmission () {
        return deleteFormSubmission;
    },
    get editFormSubmission () {
        return editFormSubmission;
    },
    get getAcceptedFormSubmissions () {
        return getAcceptedFormSubmissions;
    },
    get getAllDisbursedData () {
        return getAllDisbursedData;
    },
    get getAllNewStudentSubmissions () {
        return getAllNewStudentSubmissions;
    },
    get getCaseClosedForms () {
        return getCaseClosedForms;
    },
    get getCaseClosedFormsCurrentYear () {
        return getCaseClosedFormsCurrentYear;
    },
    get getDisbursedForms () {
        return getDisbursedForms;
    },
    get getPaymentInProgressForms () {
        return getPaymentInProgressForms;
    },
    get getRejectedFormSubmissions () {
        return getRejectedFormSubmissions;
    },
    get getSubmittedFormSubmissions () {
        return getSubmittedFormSubmissions;
    },
    get markFormAsCaseClosed () {
        return markFormAsCaseClosed;
    },
    get markFormAsDisbursed () {
        return markFormAsDisbursed;
    },
    get markRequestAsDisbursed () {
        return markRequestAsDisbursed;
    },
    get rejectFormSubmission () {
        return rejectFormSubmission;
    },
    get revertCaseClosed () {
        return revertCaseClosed;
    },
    get revertDisbursedForm () {
        return revertDisbursedForm;
    },
    get revertDisbursementToAccepted () {
        return revertDisbursementToAccepted;
    },
    get revertFormAcceptance () {
        return revertFormAcceptance;
    },
    get revertRejection () {
        return revertRejection;
    },
    get revertTreasuryApproval () {
        return revertTreasuryApproval;
    },
    get submitForm () {
        return submitForm;
    },
    get updateAcceptedAmount () {
        return updateAcceptedAmount;
    }
});
const _formSubmissionmodel = /*#__PURE__*/ _interop_require_default(require("../models/formSubmission.model"));
const _generatedFormmodel = /*#__PURE__*/ _interop_require_default(require("../models/generatedForm.model"));
const _sequelize = require("sequelize");
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _requestParams = require("../utils/requestParams");
const _formSubmissionservice = require("../services/formSubmission.service");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) resolve(value);
    else Promise.resolve(value).then(_next, _throw);
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
const submitForm = (req, res)=>_async_to_generator(function*() {
        try {
            var _files_feesStructure_, _files_feesStructure, _files_marksheet_, _files_marksheet, _files_signature_, _files_signature, _files_parentApprovalLetter_, _files_parentApprovalLetter;
            const formId = (0, _requestParams.getSingleParam)(req.params.formId);
            if (!formId) {
                res.status(400).json({
                    message: 'formId is required'
                });
                return;
            }
            const form = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!form) {
                res.status(404).json({
                    message: 'Form not found'
                });
                return;
            }
            const { firstName, fatherName, familyName, gender, schoolName, studyMedium, class: className, academicYear, parentName, mobile, alternateMobile, address, incomeSource, reason, requested_amount, bankAccountHolder, bankAccountNumber, ifscCode, bankName, coordinatorName, coordinatorMobile } = req.body;
            // ✅ Properly assert req.files type
            const files = req.files;
            const feesStructure = files === null || files === void 0 ? void 0 : (_files_feesStructure = files['feesStructure']) === null || _files_feesStructure === void 0 ? void 0 : (_files_feesStructure_ = _files_feesStructure[0]) === null || _files_feesStructure_ === void 0 ? void 0 : _files_feesStructure_.filename;
            const marksheet = files === null || files === void 0 ? void 0 : (_files_marksheet = files['marksheet']) === null || _files_marksheet === void 0 ? void 0 : (_files_marksheet_ = _files_marksheet[0]) === null || _files_marksheet_ === void 0 ? void 0 : _files_marksheet_.filename;
            const signature = files === null || files === void 0 ? void 0 : (_files_signature = files['signature']) === null || _files_signature === void 0 ? void 0 : (_files_signature_ = _files_signature[0]) === null || _files_signature_ === void 0 ? void 0 : _files_signature_.filename;
            let parentApprovalLetter = files === null || files === void 0 ? void 0 : (_files_parentApprovalLetter = files['parentApprovalLetter']) === null || _files_parentApprovalLetter === void 0 ? void 0 : (_files_parentApprovalLetter_ = _files_parentApprovalLetter[0]) === null || _files_parentApprovalLetter_ === void 0 ? void 0 : _files_parentApprovalLetter_.filename;
            // ✅ Step 2: If no parentApprovalLetter uploaded, try to fetch from old form
            if (!parentApprovalLetter) {
                const prefix = formId.charAt(0);
                const sequence = formId.slice(-4); // get last 4 digits
                const previousForm = yield _generatedFormmodel.default.findOne({
                    where: {
                        formId: {
                            [_sequelize.Op.like]: `${prefix}%${sequence}`
                        },
                        status: 'submitted'
                    },
                    order: [
                        [
                            'created_on',
                            'DESC'
                        ]
                    ]
                });
                if (previousForm) {
                    const previousSubmission = yield _formSubmissionmodel.default.findOne({
                        where: {
                            formId: previousForm.formId
                        }
                    });
                    parentApprovalLetter = (previousSubmission === null || previousSubmission === void 0 ? void 0 : previousSubmission.getDataValue('parentApprovalLetter')) || '';
                }
            }
            const submission = yield _formSubmissionmodel.default.create({
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
        } catch (err) {
            res.status(500).json({
                message: 'Form submission failed',
                error: err.message
            });
        }
    })();
const getSubmittedFormSubmissions = (_req, res)=>_async_to_generator(function*() {
        try {
            const submissions = yield _formSubmissionmodel.default.findAll({
                include: [
                    {
                        model: _generatedFormmodel.default,
                        where: {
                            status: 'submitted'
                        },
                        attributes: [
                            'status',
                            'formId',
                            'region',
                            'creator_name',
                            'submitted_on'
                        ]
                    }
                ]
            });
            res.status(200).json({
                submissions
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to fetch submitted form submissions',
                error
            });
        }
    })();
const editFormSubmission = (req, res)=>_async_to_generator(function*() {
        try {
            const { formId } = req.params;
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!submission) {
                res.status(404).json({
                    message: 'Submission not found'
                });
                return;
            }
            const files = req.files;
            // Determine which files to update (delete old ones if needed)
            const fileFields = [
                'feesStructure',
                'marksheet',
                'signature',
                'parentApprovalLetter'
            ];
            const updatedFiles = {};
            for (const field of fileFields){
                var _files_field;
                if (files === null || files === void 0 ? void 0 : (_files_field = files[field]) === null || _files_field === void 0 ? void 0 : _files_field[0]) {
                    const newFileName = files[field][0].filename;
                    const oldFileName = submission.getDataValue(field);
                    // Only delete the old file if the new one has a different filename
                    if (oldFileName && oldFileName !== newFileName) {
                        const oldFilePath = _path.default.join(__dirname, `../../assets/FormData/${oldFileName}`);
                        if (_fs.default.existsSync(oldFilePath)) {
                            _fs.default.unlinkSync(oldFilePath);
                        }
                    }
                    updatedFiles[field] = newFileName;
                } else {
                    // No new file uploaded, retain the existing filename
                    updatedFiles[field] = submission.getDataValue(field);
                }
            }
            // Update other fields from body
            const { firstName, fatherName, familyName, gender, schoolName, studyMedium, class: className, academicYear, parentName, mobile, alternateMobile, address, incomeSource, reason, requested_amount, bankAccountHolder, bankAccountNumber, ifscCode, bankName, coordinatorName, coordinatorMobile, form_accepted, form_disbursed, form_case_closed } = req.body;
            yield submission.update(_object_spread({
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
                bankAccountHolder,
                bankAccountNumber,
                ifscCode,
                bankName,
                coordinatorName,
                coordinatorMobile,
                form_accepted,
                form_disbursed,
                form_case_closed
            }, updatedFiles));
            res.status(200).json({
                message: 'Form submission updated successfully',
                submission
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to update form submission',
                error: error.message
            });
        }
    })();
const deleteFormSubmission = (req, res)=>_async_to_generator(function*() {
        try {
            const { formId } = req.body;
            if (!formId) {
                res.status(400).json({
                    message: "formId is required"
                });
                return;
            }
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!submission) {
                res.status(404).json({
                    message: "Submission not found"
                });
                return;
            }
            const form = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!form) {
                res.status(404).json({
                    message: "Generated form not found"
                });
                return;
            }
            // Extract prefix & suffix
            const suffix = formId.slice(-4); // "0001"
            const prefix = formId.charAt(0); // "J"
            const currentYear = parseInt(formId.slice(1, 5)); // 2026
            // Check if any earlier year form exists with same suffix (indicating this is an existing student)
            const existingForm = yield _generatedFormmodel.default.findOne({
                where: {
                    formId: {
                        [_sequelize.Op.like]: `${prefix}%${suffix}`
                    },
                    created_on: {
                        [_sequelize.Op.lt]: form.getDataValue('created_on')
                    }
                }
            });
            const isExistingStudent = !!existingForm;
            // Delete uploaded files
            const fileFields = [
                'feesStructure',
                'marksheet',
                'signature',
                'parentApprovalLetter'
            ];
            for (const field of fileFields){
                const fileName = submission.getDataValue(field);
                const filePath = _path.default.join(__dirname, `../../assets/FormData/${fileName}`);
                // ❗ If this is an existing student, skip deleting parentApprovalLetter
                if (isExistingStudent && field === 'parentApprovalLetter') continue;
                if (fileName && _fs.default.existsSync(filePath)) {
                    _fs.default.unlinkSync(filePath);
                }
            }
            // Delete both entries
            yield submission.destroy();
            yield form.destroy();
            res.status(200).json({
                message: `Form ${formId} and its submission deleted successfully${isExistingStudent ? ', parentApprovalLetter retained' : ''}`
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to delete submission and form",
                error: error.message
            });
        }
    })();
const rejectFormSubmission = (req, res)=>_async_to_generator(function*() {
        try {
            const { formId } = req.params;
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            const form = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!submission || !form) {
                res.status(404).json({
                    message: "Form or submission not found"
                });
                return;
            }
            // Update form status to rejected
            yield form.update({
                status: "rejected"
            });
            // ✅ Fixed this line
            if (submission.getDataValue('form_accepted') === true) {
                yield submission.update({
                    isRejected: true,
                    form_accepted: false
                });
            } else {
                yield submission.update({
                    isRejected: true
                });
            }
            res.status(200).json({
                message: "Form marked as rejected"
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to reject form submission",
                error: error.message
            });
        }
    })();
const revertRejection = (req, res)=>_async_to_generator(function*() {
        try {
            const { formId } = req.params;
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            const form = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!submission || !form) {
                res.status(404).json({
                    message: "Form or submission not found"
                });
                return;
            }
            yield submission.update({
                isRejected: false
            });
            yield form.update({
                status: "submitted"
            });
            res.status(200).json({
                message: "Form rejection reverted successfully"
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to revert rejection",
                error: error.message
            });
        }
    })();
const getRejectedFormSubmissions = (_req, res)=>_async_to_generator(function*() {
        try {
            const rejectedSubmissions = yield _formSubmissionmodel.default.findAll({
                include: [
                    {
                        model: _generatedFormmodel.default,
                        where: {
                            status: 'rejected'
                        },
                        attributes: [
                            'formId',
                            'region',
                            'form_link',
                            'status',
                            'created_on',
                            'submitted_on',
                            'creator_name',
                            'student_name'
                        ]
                    }
                ]
            });
            res.status(200).json({
                rejectedSubmissions
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to fetch rejected submissions',
                error: error.message
            });
        }
    })();
const acceptFormSubmission = (req, res)=>_async_to_generator(function*() {
        const { formId } = req.params;
        try {
            const form = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!form) {
                res.status(404).json({
                    message: "Generated form not found"
                });
                return;
            }
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!submission) {
                res.status(404).json({
                    message: "Form submission not found"
                });
                return;
            }
            // Update both tables
            yield form.update({
                status: "accepted"
            });
            yield submission.update({
                form_accepted: true
            });
            res.status(200).json({
                message: "Form marked as accepted"
            });
        } catch (err) {
            console.error("Error updating form acceptance:", err);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    })();
const revertFormAcceptance = (req, res)=>_async_to_generator(function*() {
        const { formId } = req.params;
        try {
            const form = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!form) {
                res.status(404).json({
                    message: "Generated form not found"
                });
                return;
            }
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!submission) {
                res.status(404).json({
                    message: "Form submission not found"
                });
                return;
            }
            // Revert both tables
            yield form.update({
                status: "submitted"
            });
            yield submission.update({
                form_accepted: false
            });
            res.status(200).json({
                message: "Form acceptance reverted successfully"
            });
        } catch (err) {
            console.error("Error reverting form acceptance:", err);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    })();
const getAcceptedFormSubmissions = (_req, res)=>_async_to_generator(function*() {
        try {
            const acceptedSubmissions = yield _formSubmissionmodel.default.findAll({
                where: {
                    acceptedAmount: null
                },
                include: [
                    {
                        model: _generatedFormmodel.default,
                        where: {
                            status: "accepted"
                        },
                        attributes: [
                            "formId",
                            "region",
                            "form_link",
                            "status",
                            "created_on",
                            "submitted_on",
                            "creator_name",
                            "student_name"
                        ]
                    }
                ]
            });
            res.status(200).json({
                acceptedSubmissions
            });
        } catch (err) {
            console.error("Error fetching accepted submissions:", err);
            res.status(500).json({
                message: "Failed to fetch accepted submissions"
            });
        }
    })();
const updateAcceptedAmount = (req, res)=>_async_to_generator(function*() {
        try {
            const formId = (0, _requestParams.getSingleParam)(req.params.formId);
            const { amount } = req.body;
            if (!formId) {
                res.status(400).json({
                    message: 'formId is required'
                });
                return;
            }
            const savedAmount = yield (0, _formSubmissionservice.updateAcceptedAmountService)(formId, Number(amount));
            res.status(200).json({
                message: "Accepted amount updated successfully",
                acceptedAmount: savedAmount
            });
        } catch (error) {
            console.error("Error updating accepted amount:", error);
            res.status(400).json({
                message: error.message || "Failed to update accepted amount"
            });
        }
    })();
const getPaymentInProgressForms = (_req, res)=>_async_to_generator(function*() {
        try {
            const submissions = yield (0, _formSubmissionservice.getPaymentInProgressFormsService)();
            res.status(200).json({
                paymentInProgress: submissions
            });
        } catch (err) {
            console.error("Error fetching payment in progress forms:", err);
            res.status(500).json({
                message: "Failed to fetch payment in progress forms"
            });
        }
    })();
const revertTreasuryApproval = (req, res)=>_async_to_generator(function*() {
        const { formId } = req.params;
        try {
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                },
                include: [
                    {
                        model: _generatedFormmodel.default,
                        as: "GeneratedForm"
                    }
                ]
            });
            if (!submission) {
                res.status(404).json({
                    message: "Submission not found"
                });
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
                    status: "accepted"
                }
            });
        } catch (error) {
            console.error("Error reverting treasury approval:", error);
            res.status(500).json({
                message: error.message || "Failed to revert treasury approval"
            });
        }
    })();
const markFormAsDisbursed = (req, res)=>_async_to_generator(function*() {
        const formId = (0, _requestParams.getSingleParam)(req.params.formId);
        if (!formId) {
            res.status(400).json({
                message: 'formId is required'
            });
            return;
        }
        try {
            const result = yield (0, _formSubmissionservice.markFormAsDisbursedService)(formId);
            res.status(200).json({
                message: `Form ${formId} marked as disbursed.`,
                data: result
            });
        } catch (error) {
            console.error("Error updating form_disbursed:", error);
            res.status(500).json({
                message: error.message || "Failed to update disbursement status"
            });
        }
    })();
const revertDisbursedForm = (req, res)=>_async_to_generator(function*() {
        const { formId } = req.params;
        try {
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                },
                include: [
                    {
                        model: _generatedFormmodel.default
                    }
                ]
            });
            if (!submission) {
                res.status(404).json({
                    message: "Submission not found"
                });
                return;
            }
            if (!submission.form_disbursed) {
                res.status(400).json({
                    message: "Form is not marked as disbursed"
                });
                return;
            }
            submission.form_disbursed = false;
            yield submission.save();
            res.status(200).json({
                message: `Disbursement reverted for form ${formId}`,
                data: {
                    formId,
                    form_disbursed: false
                }
            });
        } catch (error) {
            console.error("Error reverting disbursement:", error);
            res.status(500).json({
                message: error.message || "Failed to revert disbursement"
            });
        }
    })();
const getDisbursedForms = (_req, res)=>_async_to_generator(function*() {
        try {
            const submissions = yield (0, _formSubmissionservice.getDisbursedFormsService)();
            res.status(200).json({
                disbursedForms: submissions
            });
        } catch (err) {
            console.error("Error fetching disbursed forms:", err);
            res.status(500).json({
                message: "Failed to fetch disbursed forms"
            });
        }
    })();
const markRequestAsDisbursed = (req, res)=>_async_to_generator(function*() {
        const { formId } = req.params;
        try {
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                },
                include: [
                    {
                        model: _generatedFormmodel.default
                    }
                ]
            });
            if (!submission) {
                res.status(404).json({
                    message: "Form submission not found"
                });
                return;
            }
            const { acceptedAmount, form_accepted, form_disbursed, isRejected } = submission;
            if (!acceptedAmount || !form_accepted || !form_disbursed || isRejected) {
                res.status(400).json({
                    message: "Cannot disburse form. Ensure all conditions are met:\n• Accepted amount present\n• Form accepted\n• Form disbursed\n• Not rejected"
                });
                return;
            }
            const generatedForm = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!generatedForm) {
                res.status(404).json({
                    message: "Generated form not found"
                });
                return;
            }
            generatedForm.status = "disbursed";
            yield generatedForm.save();
            res.status(200).json({
                message: `Form ${formId} marked as disbursed`,
                data: {
                    formId,
                    status: "disbursed"
                }
            });
        } catch (error) {
            console.error("Error disbursing form:", error);
            res.status(500).json({
                message: error.message || "Failed to update form status"
            });
        }
    })();
const revertDisbursementToAccepted = (req, res)=>_async_to_generator(function*() {
        const { formId } = req.params;
        try {
            // Fetch form submission with associated generated form
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                },
                include: [
                    {
                        model: _generatedFormmodel.default
                    }
                ]
            });
            if (!submission) {
                res.status(404).json({
                    message: "Form submission not found"
                });
                return;
            }
            const { acceptedAmount, form_accepted, form_disbursed, isRejected } = submission;
            // Check required flags
            if (!acceptedAmount || !form_accepted || !form_disbursed || isRejected) {
                res.status(400).json({
                    message: "Cannot revert disbursement. Make sure:\n• Accepted amount exists\n• Form is accepted\n• Form is marked as disbursed\n• Form is not rejected"
                });
                return;
            }
            // Ensure generated form exists
            const generatedForm = submission.GeneratedForm;
            if (!generatedForm) {
                res.status(404).json({
                    message: "Generated form not found"
                });
                return;
            }
            if (generatedForm.status !== "disbursed") {
                res.status(400).json({
                    message: "Form is not currently marked as disbursed."
                });
                return;
            }
            // Revert to accepted
            generatedForm.status = "accepted";
            yield generatedForm.save();
            res.status(200).json({
                message: `Form ${formId} status reverted to accepted.`,
                data: {
                    formId,
                    status: "accepted"
                }
            });
        } catch (error) {
            console.error("Error reverting disbursement:", error);
            res.status(500).json({
                message: error.message || "Failed to revert disbursement status"
            });
        }
    })();
const getAllDisbursedData = (_req, res)=>_async_to_generator(function*() {
        try {
            const disbursedForms = yield (0, _formSubmissionservice.getAllDisbursedDataService)();
            res.status(200).json({
                disbursedForms
            });
        } catch (error) {
            console.error("Error fetching disbursed data:", error);
            res.status(500).json({
                message: "Failed to fetch disbursed forms data"
            });
        }
    })();
const getAllNewStudentSubmissions = (_req, res)=>_async_to_generator(function*() {
        try {
            const submissions = yield (0, _formSubmissionservice.getAllUniqueNewStudentSubmissions)();
            res.status(200).json({
                submissions
            });
        } catch (error) {
            console.error("Error fetching new student submissions:", error);
            res.status(500).json({
                message: "Failed to fetch new student submissions"
            });
        }
    })();
const markFormAsCaseClosed = (req, res)=>_async_to_generator(function*() {
        const { formId } = req.params;
        try {
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            const generatedForm = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!submission || !generatedForm) {
                res.status(404).json({
                    message: "Form or submission not found"
                });
                return;
            }
            const { form_accepted, form_disbursed, isRejected, acceptedAmount } = submission;
            if (!form_accepted || !form_disbursed || isRejected || !acceptedAmount || acceptedAmount <= 0) {
                res.status(400).json({
                    message: "Cannot close case. Make sure:\n• Form is accepted\n• Disbursed\n• Not rejected\n• Accepted amount is greater than 0"
                });
                return;
            }
            yield submission.update({
                form_case_closed: true
            });
            yield generatedForm.update({
                status: "case closed"
            });
            res.status(200).json({
                message: `Form ${formId} marked as case closed.`,
                data: {
                    formId,
                    status: "case closed",
                    form_case_closed: true
                }
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to mark form as case closed",
                error: error.message || error
            });
        }
    })();
const getCaseClosedForms = (_req, res)=>_async_to_generator(function*() {
        try {
            const forms = yield _formSubmissionmodel.default.findAll({
                where: {
                    form_case_closed: true
                }
            });
            res.status(200).json({
                caseClosedForms: forms
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch case closed forms",
                error: error.message || error
            });
        }
    })();
const revertCaseClosed = (req, res)=>_async_to_generator(function*() {
        const { formId } = req.params;
        try {
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            const generatedForm = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!submission || !generatedForm) {
                res.status(404).json({
                    message: "Form or submission not found"
                });
                return;
            }
            const { status } = generatedForm;
            if (status !== "case closed") {
                res.status(400).json({
                    message: "Form is not marked as case closed"
                });
                return;
            }
            yield submission.update({
                form_case_closed: false
            });
            yield generatedForm.update({
                status: "disbursed"
            });
            res.status(200).json({
                message: `Case closed reverted for form ${formId}`,
                data: {
                    formId,
                    status: "disbursed",
                    form_case_closed: false
                }
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to revert case closed status",
                error: error.message || error
            });
        }
    })();
const getCaseClosedFormsCurrentYear = (_req, res)=>_async_to_generator(function*() {
        try {
            const currentYear = new Date().getFullYear();
            const forms = yield _formSubmissionmodel.default.findAll({
                where: {
                    form_case_closed: true
                },
                include: [
                    {
                        model: _generatedFormmodel.default,
                        where: {
                            status: "case closed",
                            submitted_on: {
                                [_sequelize.Op.and]: [
                                    {
                                        [_sequelize.Op.ne]: null
                                    },
                                    (0, _sequelize.where)((0, _sequelize.fn)("EXTRACT", (0, _sequelize.literal)(`YEAR FROM "submitted_on"`)), currentYear)
                                ]
                            }
                        }
                    }
                ]
            });
            res.status(200).json({
                caseClosedForms: forms
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch case closed forms for current year",
                error: error.message || error
            });
        }
    })();

//# sourceMappingURL=formSubmission.controller.js.map