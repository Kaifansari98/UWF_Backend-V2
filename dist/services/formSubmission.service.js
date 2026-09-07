// src/services/formSubmission.service.ts
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
    get getAllDisbursedDataService () {
        return getAllDisbursedDataService;
    },
    get getAllUniqueNewStudentSubmissions () {
        return getAllUniqueNewStudentSubmissions;
    },
    get getDisbursedFormsService () {
        return getDisbursedFormsService;
    },
    get getPaymentInProgressFormsService () {
        return getPaymentInProgressFormsService;
    },
    get markFormAsDisbursedService () {
        return markFormAsDisbursedService;
    },
    get updateAcceptedAmountService () {
        return updateAcceptedAmountService;
    }
});
const _formSubmissionmodel = /*#__PURE__*/ _interop_require_default(require("../models/formSubmission.model"));
const _generatedFormmodel = /*#__PURE__*/ _interop_require_default(require("../models/generatedForm.model"));
const _acknowledgementFormmodel = /*#__PURE__*/ _interop_require_default(require("../models/acknowledgementForm.model"));
const _sequelize = require("sequelize");
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
const updateAcceptedAmountService = (formId, amount)=>_async_to_generator(function*() {
        if (!amount || isNaN(amount)) {
            throw new Error("Valid amount is required");
        }
        const form = yield _generatedFormmodel.default.findOne({
            where: {
                formId
            }
        });
        if (!form || form.status !== "accepted") {
            throw new Error("Form must be in 'accepted' state to update amount");
        }
        const submission = yield _formSubmissionmodel.default.findOne({
            where: {
                formId
            }
        });
        if (!submission) {
            throw new Error("Form submission not found");
        }
        // ✅ Store plain number without comma formatting
        yield submission.update({
            acceptedAmount: amount
        });
        return amount;
    })();
const getPaymentInProgressFormsService = ()=>_async_to_generator(function*() {
        return yield _formSubmissionmodel.default.findAll({
            where: {
                acceptedAmount: {
                    [_sequelize.Op.not]: null
                },
                form_disbursed: false
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
    })();
const markFormAsDisbursedService = (formId)=>_async_to_generator(function*() {
        const submission = yield _formSubmissionmodel.default.findOne({
            where: {
                formId,
                acceptedAmount: {
                    [_sequelize.Op.not]: null
                },
                isRejected: false
            },
            include: [
                {
                    model: _generatedFormmodel.default,
                    as: "GeneratedForm",
                    where: {
                        status: "accepted"
                    }
                }
            ]
        });
        if (!submission) {
            throw new Error("Eligible form not found or doesn't meet the conditions");
        }
        submission.form_disbursed = true;
        yield submission.save();
        return {
            formId,
            form_disbursed: true
        };
    })();
const getDisbursedFormsService = ()=>_async_to_generator(function*() {
        return yield _formSubmissionmodel.default.findAll({
            where: {
                acceptedAmount: {
                    [_sequelize.Op.not]: null
                },
                form_disbursed: true
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
    })();
const getAllDisbursedDataService = ()=>_async_to_generator(function*() {
        // Step 1: Get all acknowledged formIds
        const acknowledgedFormIds = yield _acknowledgementFormmodel.default.findAll({
            attributes: [
                'formId'
            ],
            raw: true
        });
        const excludedFormIds = acknowledgedFormIds.map((entry)=>entry.formId);
        // Step 2: Return disbursed forms that are NOT in the above list
        return yield _formSubmissionmodel.default.findAll({
            where: {
                acceptedAmount: {
                    [_sequelize.Op.not]: null
                },
                form_accepted: true,
                form_disbursed: true,
                isRejected: false,
                formId: {
                    [_sequelize.Op.notIn]: excludedFormIds.length ? excludedFormIds : [
                        ''
                    ]
                }
            },
            include: [
                {
                    model: _generatedFormmodel.default,
                    where: {
                        status: "disbursed"
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
    })();
// Helper to extract region initial and suffix
const parseFormId = (formId)=>{
    const regionInitial = formId.charAt(0); // e.g. "J"
    const suffix = formId.slice(-4); // e.g. "0001"
    return {
        regionInitial,
        suffix
    };
};
const getAllUniqueNewStudentSubmissions = ()=>_async_to_generator(function*() {
        const all = yield _formSubmissionmodel.default.findAll({
            where: {
                isRejected: false,
                form_case_closed: true
            }
        });
        const seenKeys = new Set();
        const uniqueNewStudentForms = [];
        for (const submission of all){
            const formId = submission.formId;
            const { regionInitial, suffix } = parseFormId(formId);
            const key = `${regionInitial}-${suffix}`;
            if (!seenKeys.has(key)) {
                seenKeys.add(key);
                uniqueNewStudentForms.push(submission);
            }
        }
        return uniqueNewStudentForms;
    })();

//# sourceMappingURL=formSubmission.service.js.map