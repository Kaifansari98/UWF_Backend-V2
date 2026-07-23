"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getDashboardStats", {
    enumerable: true,
    get: function() {
        return getDashboardStats;
    }
});
const _sequelize = require("sequelize");
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
const createEmptySummary = ()=>({
        studentsAided: 0,
        amountDisbursed: 0,
        requestsReceived: 0,
        requestAccepted: 0,
        requestPending: 0,
        requestRejected: 0,
        casesDisbursed: 0,
        casesClosed: 0
    });
const getFinancialYearStart = (date)=>{
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    return month >= 3 ? year : year - 1;
};
const getFinancialYearKey = (dateInput)=>{
    const date = new Date(dateInput);
    const startYear = getFinancialYearStart(date);
    return `${startYear}-${startYear + 1}`;
};
const getFinancialYearLabel = (financialYearKey)=>{
    const [startYear, endYear] = financialYearKey.split('-');
    return `${startYear} \u2192 ${endYear}`;
};
const getDashboardStats = (_req, res)=>_async_to_generator(function*() {
        try {
            const generatedForms = yield _generatedFormmodel.default.findAll({
                attributes: [
                    'formId',
                    'status',
                    'created_on'
                ],
                raw: true
            });
            const disbursedSubmissions = yield _formSubmissionmodel.default.findAll({
                include: [
                    {
                        model: _generatedFormmodel.default,
                        attributes: [
                            'created_on'
                        ],
                        where: {
                            status: {
                                [_sequelize.Op.in]: [
                                    'case closed',
                                    'disbursed'
                                ]
                            }
                        }
                    }
                ],
                attributes: [
                    'acceptedAmount'
                ],
                raw: true,
                nest: true
            });
            const financialYearMap = new Map();
            const ensureSummary = (key)=>{
                if (!financialYearMap.has(key)) {
                    financialYearMap.set(key, createEmptySummary());
                }
                return financialYearMap.get(key);
            };
            const overall = createEmptySummary();
            for (const form of generatedForms){
                const financialYearKey = getFinancialYearKey(form.created_on);
                const summary = ensureSummary(financialYearKey);
                const targets = [
                    overall,
                    summary
                ];
                for (const target of targets){
                    target.requestsReceived += 1;
                    if (form.status === 'case closed') {
                        target.studentsAided += 1;
                        target.requestAccepted += 1;
                        target.casesClosed += 1;
                    }
                    if (form.status === 'accepted') {
                        target.requestAccepted += 1;
                    }
                    if (form.status === 'disbursed') {
                        target.requestAccepted += 1;
                        target.casesDisbursed += 1;
                    }
                    if (form.status === 'pending') {
                        target.requestPending += 1;
                    }
                    if (form.status === 'rejected') {
                        target.requestRejected += 1;
                    }
                }
            }
            for (const submission of disbursedSubmissions){
                var _submission_GeneratedForm;
                const createdOn = (_submission_GeneratedForm = submission.GeneratedForm) === null || _submission_GeneratedForm === void 0 ? void 0 : _submission_GeneratedForm.created_on;
                if (!createdOn) continue;
                const amount = Number(submission.acceptedAmount || 0);
                const financialYearKey = getFinancialYearKey(createdOn);
                const summary = ensureSummary(financialYearKey);
                overall.amountDisbursed += amount;
                summary.amountDisbursed += amount;
            }
            const financialYearKeys = [
                ...financialYearMap.keys()
            ].sort((a, b)=>{
                const [aStart] = a.split('-').map(Number);
                const [bStart] = b.split('-').map(Number);
                return aStart - bStart;
            });
            const financialYearOptions = financialYearKeys.map((key)=>({
                    key,
                    label: getFinancialYearLabel(key)
                }));
            res.status(200).json({
                financialYearOptions: [
                    ...financialYearOptions,
                    {
                        key: 'overall',
                        label: 'Overall'
                    }
                ],
                summary: {
                    overall,
                    byFinancialYear: Object.fromEntries(financialYearMap.entries())
                },
                studentsAidedPerFinancialYear: financialYearKeys.map((key)=>{
                    var _ref;
                    var _financialYearMap_get;
                    return {
                        key,
                        label: getFinancialYearLabel(key),
                        students: (_ref = (_financialYearMap_get = financialYearMap.get(key)) === null || _financialYearMap_get === void 0 ? void 0 : _financialYearMap_get.studentsAided) !== null && _ref !== void 0 ? _ref : 0
                    };
                }),
                amountDisbursedPerFinancialYear: financialYearKeys.map((key)=>{
                    var _ref;
                    var _financialYearMap_get;
                    return {
                        key,
                        label: getFinancialYearLabel(key),
                        amount: (_ref = (_financialYearMap_get = financialYearMap.get(key)) === null || _financialYearMap_get === void 0 ? void 0 : _financialYearMap_get.amountDisbursed) !== null && _ref !== void 0 ? _ref : 0
                    };
                })
            });
        } catch (error) {
            console.error('❌ Dashboard fetch error:', error);
            res.status(500).json({
                message: 'Failed to fetch dashboard data',
                error
            });
        }
    })();

//# sourceMappingURL=dashboard.controller.js.map