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
exports.getDashboardStats = void 0;
const sequelize_1 = require("sequelize");
const generatedForm_model_1 = __importDefault(require("../models/generatedForm.model"));
const formSubmission_model_1 = __importDefault(require("../models/formSubmission.model"));
const createEmptySummary = () => ({
    studentsAided: 0,
    amountDisbursed: 0,
    requestsReceived: 0,
    requestAccepted: 0,
    requestPending: 0,
    requestRejected: 0,
    casesDisbursed: 0,
    casesClosed: 0,
});
const getFinancialYearStart = (date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    return month >= 3 ? year : year - 1;
};
const getFinancialYearKey = (dateInput) => {
    const date = new Date(dateInput);
    const startYear = getFinancialYearStart(date);
    return `${startYear}-${startYear + 1}`;
};
const getFinancialYearLabel = (financialYearKey) => {
    const [startYear, endYear] = financialYearKey.split('-');
    return `${startYear} \u2192 ${endYear}`;
};
const getDashboardStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const generatedForms = (yield generatedForm_model_1.default.findAll({
            attributes: ['formId', 'status', 'created_on'],
            raw: true,
        }));
        const disbursedSubmissions = yield formSubmission_model_1.default.findAll({
            include: [
                {
                    model: generatedForm_model_1.default,
                    attributes: ['created_on'],
                    where: { status: { [sequelize_1.Op.in]: ['case closed', 'disbursed'] } },
                },
            ],
            attributes: ['acceptedAmount'],
            raw: true,
            nest: true,
        });
        const financialYearMap = new Map();
        const ensureSummary = (key) => {
            if (!financialYearMap.has(key)) {
                financialYearMap.set(key, createEmptySummary());
            }
            return financialYearMap.get(key);
        };
        const overall = createEmptySummary();
        for (const form of generatedForms) {
            const financialYearKey = getFinancialYearKey(form.created_on);
            const summary = ensureSummary(financialYearKey);
            const targets = [overall, summary];
            for (const target of targets) {
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
        for (const submission of disbursedSubmissions) {
            const createdOn = (_a = submission.GeneratedForm) === null || _a === void 0 ? void 0 : _a.created_on;
            if (!createdOn)
                continue;
            const amount = Number(submission.acceptedAmount || 0);
            const financialYearKey = getFinancialYearKey(createdOn);
            const summary = ensureSummary(financialYearKey);
            overall.amountDisbursed += amount;
            summary.amountDisbursed += amount;
        }
        const financialYearKeys = [...financialYearMap.keys()].sort((a, b) => {
            const [aStart] = a.split('-').map(Number);
            const [bStart] = b.split('-').map(Number);
            return aStart - bStart;
        });
        const financialYearOptions = financialYearKeys.map((key) => ({
            key,
            label: getFinancialYearLabel(key),
        }));
        res.status(200).json({
            financialYearOptions: [...financialYearOptions, { key: 'overall', label: 'Overall' }],
            summary: {
                overall,
                byFinancialYear: Object.fromEntries(financialYearMap.entries()),
            },
            studentsAidedPerFinancialYear: financialYearKeys.map((key) => {
                var _a, _b;
                return ({
                    key,
                    label: getFinancialYearLabel(key),
                    students: (_b = (_a = financialYearMap.get(key)) === null || _a === void 0 ? void 0 : _a.studentsAided) !== null && _b !== void 0 ? _b : 0,
                });
            }),
            amountDisbursedPerFinancialYear: financialYearKeys.map((key) => {
                var _a, _b;
                return ({
                    key,
                    label: getFinancialYearLabel(key),
                    amount: (_b = (_a = financialYearMap.get(key)) === null || _a === void 0 ? void 0 : _a.amountDisbursed) !== null && _b !== void 0 ? _b : 0,
                });
            }),
        });
    }
    catch (error) {
        console.error('❌ Dashboard fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data', error });
    }
});
exports.getDashboardStats = getDashboardStats;
