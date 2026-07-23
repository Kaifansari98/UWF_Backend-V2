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
    get deletePendingAcknowledgementForm () {
        return deletePendingAcknowledgementForm;
    },
    get generateAcknowledgementForm () {
        return generateAcknowledgementForm;
    },
    get getAllAcceptedAcknowledgementForms () {
        return getAllAcceptedAcknowledgementForms;
    },
    get getAllPendingAcknowledgementForms () {
        return getAllPendingAcknowledgementForms;
    },
    get getAllSubmittedAcknowledgementForms () {
        return getAllSubmittedAcknowledgementForms;
    },
    get getCompleteStudentData () {
        return getCompleteStudentData;
    },
    get markAcknowledgementFormAsAccepted () {
        return markAcknowledgementFormAsAccepted;
    },
    get revertAcknowledgementAcceptance () {
        return revertAcknowledgementAcceptance;
    },
    get uploadAcknowledgementInvoice () {
        return uploadAcknowledgementInvoice;
    }
});
const _acknowledgementFormmodel = /*#__PURE__*/ _interop_require_default(require("../models/acknowledgementForm.model"));
const _generatedFormmodel = /*#__PURE__*/ _interop_require_default(require("../models/generatedForm.model"));
const _formSubmissionmodel = /*#__PURE__*/ _interop_require_default(require("../models/formSubmission.model"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var _process_env_FRONTEND_URL;
const FRONTEND_URL = ((_process_env_FRONTEND_URL = process.env.FRONTEND_URL) === null || _process_env_FRONTEND_URL === void 0 ? void 0 : _process_env_FRONTEND_URL.trim()) || 'http://localhost:3000';
const generateAcknowledgementForm = (req, res)=>_async_to_generator(function*() {
        try {
            const { formId } = req.body;
            if (!formId) {
                res.status(400).json({
                    message: 'formId is required'
                });
                return;
            }
            const existingForm = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!existingForm) {
                res.status(404).json({
                    message: 'Generated form not found'
                });
                return;
            }
            const formSubmission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!formSubmission) {
                res.status(404).json({
                    message: 'Form submission not found'
                });
                return;
            }
            const { firstName, fatherName, familyName } = formSubmission;
            const student_name = `${firstName} ${fatherName} ${familyName}`.trim();
            const form_link = `${FRONTEND_URL}/acknowledgement-form/${formId}`;
            const newAckForm = yield _acknowledgementFormmodel.default.create({
                formId,
                student_name,
                form_link,
                status: 'pending'
            });
            res.status(201).json({
                message: 'Acknowledgement form generated successfully',
                acknowledgement: newAckForm
            });
        } catch (error) {
            console.error('Error generating acknowledgement form:', error);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    })();
const uploadAcknowledgementInvoice = (req, res)=>_async_to_generator(function*() {
        try {
            const { formId } = req.params;
            if (!req.file) {
                res.status(400).json({
                    message: 'Invoice PDF is required'
                });
                return;
            }
            const acknowledgement = yield _acknowledgementFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!acknowledgement) {
                res.status(404).json({
                    message: 'Acknowledgement form not found'
                });
                return;
            }
            const invoiceFileName = `${formId}Invoice.pdf`;
            acknowledgement.invoice = invoiceFileName;
            acknowledgement.status = 'submitted';
            acknowledgement.submitted_at = new Date();
            yield acknowledgement.save();
            res.status(200).json({
                message: 'Invoice uploaded and acknowledgement form updated successfully',
                acknowledgement
            });
        } catch (error) {
            console.error('Error uploading invoice:', error);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    })();
const getCompleteStudentData = (req, res)=>_async_to_generator(function*() {
        try {
            const { formId } = req.params;
            if (!formId) {
                res.status(400).json({
                    message: 'formId is required'
                });
                return;
            }
            const generatedForm = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            const formSubmission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            const acknowledgement = yield _acknowledgementFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!generatedForm && !formSubmission && !acknowledgement) {
                res.status(404).json({
                    message: 'No records found for this formId'
                });
                return;
            }
            res.status(200).json({
                formId,
                generatedForm,
                formSubmission,
                acknowledgement
            });
        } catch (error) {
            console.error('Error fetching full student data:', error);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    })();
// Utility to fetch full student data by formId
const fetchStudentDataByFormId = (formId)=>_async_to_generator(function*() {
        const generatedForm = yield _generatedFormmodel.default.findOne({
            where: {
                formId
            }
        });
        const formSubmission = yield _formSubmissionmodel.default.findOne({
            where: {
                formId
            }
        });
        const acknowledgement = yield _acknowledgementFormmodel.default.findOne({
            where: {
                formId
            }
        });
        return {
            formId,
            generatedForm,
            formSubmission,
            acknowledgement
        };
    })();
const getAllPendingAcknowledgementForms = (_req, res)=>_async_to_generator(function*() {
        try {
            const pendingAckForms = yield _acknowledgementFormmodel.default.findAll({
                where: {
                    status: 'pending'
                }
            });
            const results = yield Promise.all(pendingAckForms.map((ack)=>fetchStudentDataByFormId(ack.formId)));
            res.status(200).json({
                count: results.length,
                data: results
            });
        } catch (error) {
            console.error('Error fetching pending acknowledgements:', error);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    })();
const getAllSubmittedAcknowledgementForms = (_req, res)=>_async_to_generator(function*() {
        try {
            const submittedAckForms = yield _acknowledgementFormmodel.default.findAll({
                where: {
                    status: 'submitted'
                }
            });
            const results = yield Promise.all(submittedAckForms.map((ack)=>fetchStudentDataByFormId(ack.formId)));
            res.status(200).json({
                count: results.length,
                data: results
            });
        } catch (error) {
            console.error('Error fetching submitted acknowledgements:', error);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    })();
const getAllAcceptedAcknowledgementForms = (_req, res)=>_async_to_generator(function*() {
        try {
            const acceptedAckForms = yield _acknowledgementFormmodel.default.findAll({
                where: {
                    status: 'accepted'
                }
            });
            const results = yield Promise.all(acceptedAckForms.map((ack)=>fetchStudentDataByFormId(ack.formId)));
            res.status(200).json({
                count: results.length,
                data: results
            });
        } catch (error) {
            console.error('Error fetching accepted acknowledgements:', error);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    })();
const markAcknowledgementFormAsAccepted = (req, res)=>_async_to_generator(function*() {
        const { formId } = req.params;
        try {
            const ackForm = yield _acknowledgementFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            const generatedForm = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!ackForm || !generatedForm || !submission) {
                res.status(404).json({
                    message: 'Acknowledgement form, submission, or generated form not found'
                });
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
            yield ackForm.update({
                status: 'accepted'
            });
            // ✅ Mark case closed in related tables
            yield submission.update({
                form_case_closed: true
            });
            yield generatedForm.update({
                status: 'case closed'
            });
            res.status(200).json({
                message: `Acknowledgement form ${formId} marked as accepted and case closed.`,
                data: {
                    formId,
                    acknowledgement_status: 'accepted',
                    case_closed: true
                }
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to accept and close acknowledgement form',
                error: error.message || error
            });
        }
    })();
const deletePendingAcknowledgementForm = (req, res)=>_async_to_generator(function*() {
        const { formId } = req.params;
        try {
            const ackForm = yield _acknowledgementFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!ackForm) {
                res.status(404).json({
                    message: 'Acknowledgement form not found'
                });
                return;
            }
            if (ackForm.status !== 'pending') {
                res.status(400).json({
                    message: 'Only pending acknowledgement forms can be deleted'
                });
                return;
            }
            yield ackForm.destroy();
            res.status(200).json({
                message: `Acknowledgement form ${formId} deleted successfully`
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to delete acknowledgement form',
                error: error.message
            });
        }
    })();
const revertAcknowledgementAcceptance = (req, res)=>_async_to_generator(function*() {
        const { formId } = req.params;
        try {
            const ackForm = yield _acknowledgementFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            const generatedForm = yield _generatedFormmodel.default.findOne({
                where: {
                    formId
                }
            });
            const submission = yield _formSubmissionmodel.default.findOne({
                where: {
                    formId
                }
            });
            if (!ackForm || !generatedForm || !submission) {
                res.status(404).json({
                    message: 'Form or data not found'
                });
                return;
            }
            if (ackForm.status !== 'accepted') {
                res.status(400).json({
                    message: 'Only accepted acknowledgements can be reverted'
                });
                return;
            }
            // ✅ Revert status to submitted
            yield ackForm.update({
                status: 'submitted'
            });
            // ✅ Revert case closed status
            yield submission.update({
                form_case_closed: false
            });
            yield generatedForm.update({
                status: 'disbursed'
            }); // Set it back to accepted
            res.status(200).json({
                message: `Acknowledgement ${formId} reverted to submitted.`,
                data: {
                    formId,
                    acknowledgement_status: 'submitted',
                    case_closed: false
                }
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to revert acknowledgement form',
                error: error.message || error
            });
        }
    })();

//# sourceMappingURL=acknowledgement.controller.js.map