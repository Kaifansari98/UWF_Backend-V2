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
    get checkDuplicateStudent () {
        return checkDuplicateStudent;
    },
    get deletePendingFormById () {
        return deletePendingFormById;
    },
    get generateFormForExistingStudent () {
        return generateFormForExistingStudent;
    },
    get generateFormId () {
        return generateFormId;
    },
    get generateNewStudentForm () {
        return generateNewStudentForm;
    },
    get getAllGeneratedForms () {
        return getAllGeneratedForms;
    },
    get getFormStatus () {
        return getFormStatus;
    },
    get getPendingForms () {
        return getPendingForms;
    }
});
const _generatedFormmodel = /*#__PURE__*/ _interop_require_default(require("../models/generatedForm.model"));
const _formSubmissionmodel = /*#__PURE__*/ _interop_require_default(require("../models/formSubmission.model"));
const _sequelize = require("sequelize");
const _sequelize1 = /*#__PURE__*/ _interop_require_default(require("../database/sequelize"));
const _requestParams = require("../utils/requestParams");
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
const generateFormId = (region, transaction)=>_async_to_generator(function*() {
        var _ref;
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
        const latestForm = yield _generatedFormmodel.default.findOne({
            where: {
                formId: {
                    [_sequelize.Op.like]: `${regionInitial}%`
                }
            },
            order: [
                [
                    _sequelize.Sequelize.literal(`CAST(RIGHT("formId", 4) AS INTEGER)`),
                    'DESC'
                ]
            ],
            transaction,
            lock: transaction ? transaction.LOCK.UPDATE : undefined,
            logging: (sql)=>console.log('[generateFormId DEBUG]', sql)
        });
        console.log('[generateFormId DEBUG] regionInitial=', regionInitial, 'latestForm=', (_ref = latestForm === null || latestForm === void 0 ? void 0 : latestForm.formId) !== null && _ref !== void 0 ? _ref : null);
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
    })();
const getAllGeneratedForms = (_req, res)=>_async_to_generator(function*() {
        try {
            const submissions = yield _formSubmissionmodel.default.findAll();
            const forms = submissions.map((submission)=>{
                var _ref, _submission_submitted_at;
                const student_name = [
                    submission.firstName,
                    submission.fatherName,
                    submission.familyName
                ].filter(Boolean).join(' ').trim();
                let status = 'submitted';
                if (submission.isRejected) {
                    status = 'rejected';
                } else if (submission.form_case_closed) {
                    status = 'case closed';
                } else if (submission.form_disbursed) {
                    status = 'disbursed';
                } else if (submission.form_accepted) {
                    status = 'accepted';
                }
                return {
                    formId: submission.formId,
                    student_name,
                    status,
                    form_link: `${FRONTEND_URL}/${submission.formId}`,
                    created_on: (_ref = (_submission_submitted_at = submission.submitted_at) !== null && _submission_submitted_at !== void 0 ? _submission_submitted_at : submission.createdAt) !== null && _ref !== void 0 ? _ref : submission.updatedAt
                };
            });
            res.status(200).json({
                forms
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to fetch forms',
                error
            });
        }
    })();
const generateNewStudentForm = (req, res)=>_async_to_generator(function*() {
        const user = req.user;
        const { region, name } = req.body;
        if (!region || !name) {
            res.status(400).json({
                message: 'Both name and region are required'
            });
            return;
        }
        const MAX_RETRIES = 5;
        for(let attempt = 1; attempt <= MAX_RETRIES; attempt++){
            try {
                const form = yield _sequelize1.default.transaction((t)=>_async_to_generator(function*() {
                        const formId = yield generateFormId(region, t);
                        const form_link = `${FRONTEND_URL}/${formId}`;
                        return _generatedFormmodel.default.create({
                            formId,
                            region,
                            form_link,
                            creatorId: user.id,
                            creator_name: user.full_name,
                            student_name: name // ✅ Save name
                        }, {
                            transaction: t
                        });
                    })());
                res.status(201).json({
                    message: 'Form created for new student',
                    form
                });
                return;
            } catch (err) {
                var _err_fields;
                // Two requests can still both find "no existing row" (nothing to lock)
                // and race to insert sequence 1 for a brand new region/year. Retry a
                // few times on that specific conflict instead of failing the request.
                const isDuplicateFormId = (err === null || err === void 0 ? void 0 : err.name) === 'SequelizeUniqueConstraintError' && (err === null || err === void 0 ? void 0 : (_err_fields = err.fields) === null || _err_fields === void 0 ? void 0 : _err_fields.formId) !== undefined;
                if (isDuplicateFormId && attempt < MAX_RETRIES) {
                    continue;
                }
                res.status(500).json({
                    message: 'Failed to create form',
                    error: err
                });
                return;
            }
        }
    })();
const generateFormForExistingStudent = (req, res)=>_async_to_generator(function*() {
        try {
            const user = req.user;
            const { oldFormId } = req.body;
            const oldForm = yield _generatedFormmodel.default.findOne({
                where: {
                    formId: oldFormId
                }
            });
            if (!oldForm) {
                res.status(404).json({
                    message: 'Original student/form not found'
                });
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
            const existingForm = yield _generatedFormmodel.default.findOne({
                where: {
                    formId: newFormId
                }
            });
            if (existingForm) {
                res.status(200).json({
                    message: 'Form already exists for this student and year',
                    form: existingForm
                });
                return;
            }
            const newForm = yield _generatedFormmodel.default.create({
                formId: newFormId,
                region: oldForm.region,
                form_link,
                creatorId: user.id,
                creator_name: user.full_name,
                student_name: oldForm.student_name // ✅ copy name from old form
            });
            res.status(201).json({
                message: 'Form created for existing student',
                form: newForm
            });
        } catch (err) {
            var _err_fields;
            if ((err === null || err === void 0 ? void 0 : err.name) === 'SequelizeUniqueConstraintError' && (err === null || err === void 0 ? void 0 : (_err_fields = err.fields) === null || _err_fields === void 0 ? void 0 : _err_fields.formId) !== undefined) {
                res.status(409).json({
                    message: 'Form already exists for this student and year',
                    error: err
                });
                return;
            }
            res.status(500).json({
                message: 'Failed to create form',
                error: err
            });
        }
    })();
const getFormStatus = (req, res)=>_async_to_generator(function*() {
        try {
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
                    message: "Form not found"
                });
                return;
            }
            // Extract form suffix and prefix
            const suffix = formId.slice(-4);
            const prefix = formId.charAt(0);
            // Find if an earlier form exists with the same suffix
            const earlierForm = yield _generatedFormmodel.default.findOne({
                where: {
                    formId: {
                        [_sequelize.Op.like]: `${prefix}%${suffix}`
                    },
                    created_on: {
                        [_sequelize.Op.lt]: form.getDataValue('created_on')
                    }
                }
            });
            const isNewStudent = !earlierForm;
            res.status(200).json({
                status: form.status,
                isNewStudent
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to get form status",
                error
            });
        }
    })();
const getPendingForms = (_req, res)=>_async_to_generator(function*() {
        try {
            const pendingForms = yield _generatedFormmodel.default.findAll({
                where: {
                    status: 'pending'
                }
            });
            res.status(200).json({
                forms: pendingForms
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to fetch pending forms',
                error
            });
        }
    })();
const deletePendingFormById = (req, res)=>_async_to_generator(function*() {
        try {
            const { formId } = req.body;
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
            if (form.getDataValue('status') !== 'pending') {
                res.status(400).json({
                    message: 'Only forms with pending status can be deleted'
                });
                return;
            }
            yield form.destroy();
            res.status(200).json({
                message: `Form ${formId} deleted successfully`
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to delete form',
                error
            });
        }
    })();
const checkDuplicateStudent = (req, res)=>_async_to_generator(function*() {
        try {
            const { name, region } = req.body;
            if (!name || !region) {
                res.status(400).json({
                    message: 'Both name and region are required'
                });
                return;
            }
            const nameNormalized = name.trim().toLowerCase();
            // Pull all submissions whose generated form matches the region
            const submissions = yield _formSubmissionmodel.default.findAll({
                include: [
                    {
                        model: _generatedFormmodel.default,
                        required: true,
                        where: {
                            region
                        },
                        attributes: [
                            'formId',
                            'region'
                        ]
                    }
                ],
                attributes: [
                    'formId',
                    'firstName',
                    'fatherName',
                    'familyName',
                    'schoolName'
                ]
            });
            // Case-insensitive full-name comparison done in JS to avoid DB dialect differences
            const matches = submissions.filter((s)=>{
                var _s_getDataValue, _s_getDataValue1, _s_getDataValue2;
                const parts = [
                    (_s_getDataValue = s.getDataValue('firstName')) !== null && _s_getDataValue !== void 0 ? _s_getDataValue : '',
                    (_s_getDataValue1 = s.getDataValue('fatherName')) !== null && _s_getDataValue1 !== void 0 ? _s_getDataValue1 : '',
                    (_s_getDataValue2 = s.getDataValue('familyName')) !== null && _s_getDataValue2 !== void 0 ? _s_getDataValue2 : ''
                ].map((p)=>p.trim()).filter(Boolean);
                return parts.join(' ').toLowerCase() === nameNormalized;
            }).map((s)=>({
                    formId: s.getDataValue('formId'),
                    firstName: s.getDataValue('firstName'),
                    fatherName: s.getDataValue('fatherName'),
                    familyName: s.getDataValue('familyName'),
                    schoolName: s.getDataValue('schoolName')
                }));
            res.status(200).json({
                isDuplicate: matches.length > 0,
                matches
            });
        } catch (err) {
            res.status(500).json({
                message: 'Failed to check for duplicate student',
                error: err
            });
        }
    })();

//# sourceMappingURL=form.controller.js.map