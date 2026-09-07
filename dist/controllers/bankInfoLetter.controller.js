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
    get createBankInfoLetter () {
        return createBankInfoLetter;
    },
    get searchBankInfoLetters () {
        return searchBankInfoLetters;
    },
    get softDeleteBankInfoLetter () {
        return softDeleteBankInfoLetter;
    }
});
const _sequelize = require("sequelize");
const _bankInfoLettermodel = /*#__PURE__*/ _interop_require_default(require("../models/bankInfoLetter.model"));
const _usermodel = /*#__PURE__*/ _interop_require_default(require("../models/user.model"));
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
function getFinancialYear(dateInput) {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;
    const month = date.getMonth();
    const year = date.getFullYear();
    const fyStart = month >= 3 ? year : year - 1;
    return `${fyStart} → ${fyStart + 1}`;
}
const searchBankInfoLetters = (req, res)=>_async_to_generator(function*() {
        try {
            var _req_body;
            const { search = '', financialYear = 'all', page = 1, pageSize = 20 } = (_req_body = req.body) !== null && _req_body !== void 0 ? _req_body : {};
            const normalizedSearch = String(search).trim();
            const currentPage = Math.max(1, Number(page) || 1);
            const currentPageSize = Math.max(1, Number(pageSize) || 20);
            const bankInfoLetters = yield _bankInfoLettermodel.default.findAll({
                where: _object_spread({
                    is_deleted: false
                }, normalizedSearch ? {
                    [_sequelize.Op.or]: [
                        {
                            principal_headmaster: {
                                [_sequelize.Op.iLike]: `%${normalizedSearch}%`
                            }
                        },
                        {
                            school_college_name: {
                                [_sequelize.Op.iLike]: `%${normalizedSearch}%`
                            }
                        },
                        {
                            address: {
                                [_sequelize.Op.iLike]: `%${normalizedSearch}%`
                            }
                        },
                        {
                            student_name: {
                                [_sequelize.Op.iLike]: `%${normalizedSearch}%`
                            }
                        },
                        {
                            admission_no_gr_no: {
                                [_sequelize.Op.iLike]: `%${normalizedSearch}%`
                            }
                        },
                        {
                            student_parent_name: {
                                [_sequelize.Op.iLike]: `%${normalizedSearch}%`
                            }
                        },
                        {
                            class_course_program: {
                                [_sequelize.Op.iLike]: `%${normalizedSearch}%`
                            }
                        },
                        {
                            academic_year_term: {
                                [_sequelize.Op.iLike]: `%${normalizedSearch}%`
                            }
                        }
                    ]
                } : {}),
                include: [
                    {
                        model: _usermodel.default,
                        as: 'signatoryUser',
                        attributes: [
                            'id',
                            'full_name',
                            'username'
                        ]
                    }
                ],
                order: [
                    [
                        'generated_at',
                        'DESC'
                    ]
                ]
            });
            const mappedLetters = bankInfoLetters.map((letter)=>{
                var _letter_signatoryUser, _letter_signatoryUser1;
                return {
                    id: letter.id,
                    principal_headmaster: letter.principal_headmaster,
                    school_college_name: letter.school_college_name,
                    address: letter.address,
                    student_name: letter.student_name,
                    admission_no_gr_no: letter.admission_no_gr_no,
                    student_parent_name: letter.student_parent_name,
                    class_course_program: letter.class_course_program,
                    academic_year_term: letter.academic_year_term,
                    generated_at: letter.generated_at,
                    signatory_name: ((_letter_signatoryUser = letter.signatoryUser) === null || _letter_signatoryUser === void 0 ? void 0 : _letter_signatoryUser.full_name) || ((_letter_signatoryUser1 = letter.signatoryUser) === null || _letter_signatoryUser1 === void 0 ? void 0 : _letter_signatoryUser1.username) || '—'
                };
            });
            const financialYears = Array.from(new Set(mappedLetters.map((letter)=>getFinancialYear(letter.generated_at)).filter(Boolean))).sort();
            const yearFilteredLetters = financialYear === 'all' ? mappedLetters : mappedLetters.filter((letter)=>getFinancialYear(letter.generated_at) === financialYear);
            const totalPages = Math.max(1, Math.ceil(yearFilteredLetters.length / currentPageSize));
            const safePage = Math.min(currentPage, totalPages);
            const startIndex = (safePage - 1) * currentPageSize;
            const paginatedLetters = yearFilteredLetters.slice(startIndex, startIndex + currentPageSize);
            res.status(200).json({
                letters: paginatedLetters,
                financialYears,
                page: safePage,
                pageSize: currentPageSize,
                totalPages,
                totalCount: yearFilteredLetters.length
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to fetch bank info letters',
                error
            });
        }
    })();
const createBankInfoLetter = (req, res)=>_async_to_generator(function*() {
        try {
            var _req_user;
            const generatedBy = (_req_user = req.user) === null || _req_user === void 0 ? void 0 : _req_user.id;
            if (!generatedBy) {
                res.status(401).json({
                    message: 'Unauthorized'
                });
                return;
            }
            const { principal_headmaster, school_college_name, address, student_name, admission_no_gr_no, student_parent_name, class_course_program, academic_year_term, signatory_user_id, bank_name, account_name, account_number, ifsc_code, branch_name_address } = req.body;
            const requiredFields = [
                [
                    'principal_headmaster',
                    principal_headmaster
                ],
                [
                    'school_college_name',
                    school_college_name
                ],
                [
                    'address',
                    address
                ],
                [
                    'student_name',
                    student_name
                ],
                [
                    'admission_no_gr_no',
                    admission_no_gr_no
                ],
                [
                    'student_parent_name',
                    student_parent_name
                ],
                [
                    'class_course_program',
                    class_course_program
                ],
                [
                    'academic_year_term',
                    academic_year_term
                ],
                [
                    'signatory_user_id',
                    signatory_user_id
                ]
            ];
            const missingFields = requiredFields.filter(([, value])=>value === undefined || value === null || value === '').map(([field])=>field);
            if (missingFields.length > 0) {
                res.status(400).json({
                    message: 'Missing required fields',
                    missingFields
                });
                return;
            }
            const signatoryUser = yield _usermodel.default.findByPk(signatory_user_id);
            if (!signatoryUser) {
                res.status(404).json({
                    message: 'Signatory user not found'
                });
                return;
            }
            const bankInfoLetter = yield _bankInfoLettermodel.default.create({
                principal_headmaster,
                school_college_name,
                address,
                student_name,
                admission_no_gr_no,
                student_parent_name,
                class_course_program,
                academic_year_term,
                signatory_user_id: Number(signatory_user_id),
                bank_name: bank_name || null,
                account_name: account_name || null,
                account_number: account_number || null,
                ifsc_code: ifsc_code || null,
                branch_name_address: branch_name_address || null,
                generated_at: new Date(),
                generated_by: generatedBy
            });
            res.status(201).json({
                message: 'Bank info letter created successfully',
                bankInfoLetter
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to create bank info letter',
                error
            });
        }
    })();
const softDeleteBankInfoLetter = (req, res)=>_async_to_generator(function*() {
        try {
            var _req_user;
            const userId = (_req_user = req.user) === null || _req_user === void 0 ? void 0 : _req_user.id;
            const { id } = req.params;
            if (!userId) {
                res.status(401).json({
                    message: 'Unauthorized'
                });
                return;
            }
            const letter = yield _bankInfoLettermodel.default.findOne({
                where: {
                    id: Number(id),
                    is_deleted: false
                }
            });
            if (!letter) {
                res.status(404).json({
                    message: 'Bank info letter not found'
                });
                return;
            }
            yield letter.update({
                is_deleted: true,
                deleted_by: userId
            });
            res.status(200).json({
                message: 'Bank info letter deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to delete bank info letter',
                error
            });
        }
    })();

//# sourceMappingURL=bankInfoLetter.controller.js.map