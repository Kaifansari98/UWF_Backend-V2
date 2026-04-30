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
const getDashboardStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(`${currentYear}-01-01T00:00:00Z`);
        const endOfYear = new Date(`${currentYear}-12-31T23:59:59Z`);
        // ✅ Reusable helper to count forms by status (multiple or single)
        const countForms = (statuses, isCurrentYear) => __awaiter(void 0, void 0, void 0, function* () {
            return yield generatedForm_model_1.default.count({
                where: Object.assign({ status: { [sequelize_1.Op.in]: statuses } }, (isCurrentYear && {
                    created_on: { [sequelize_1.Op.between]: [startOfYear, endOfYear] }
                }))
            });
        });
        // 1️⃣ Students aided (status = 'case closed')
        const totalStudentsAided = yield countForms(['case closed'], false);
        const currentYearStudentsAided = yield countForms(['case closed'], true);
        // 2️⃣ Amount disbursed (from FormSubmission.acceptedAmount)
        const allDisbursedSubmissions = yield formSubmission_model_1.default.findAll({
            include: [
                {
                    model: generatedForm_model_1.default,
                    where: {
                        status: { [sequelize_1.Op.in]: ['case closed', 'disbursed'] }
                    },
                    attributes: []
                }
            ],
            attributes: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('acceptedAmount')), 'total']],
            raw: true
        });
        const currentYearDisbursedSubmissions = yield formSubmission_model_1.default.findAll({
            include: [
                {
                    model: generatedForm_model_1.default,
                    where: {
                        status: { [sequelize_1.Op.in]: ['case closed', 'disbursed'] },
                        created_on: { [sequelize_1.Op.between]: [startOfYear, endOfYear] }
                    },
                    attributes: []
                }
            ],
            attributes: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('acceptedAmount')), 'total']],
            raw: true
        });
        const parseAmount = (res) => { var _a; return parseFloat(((_a = res[0]) === null || _a === void 0 ? void 0 : _a.total) || '0'); };
        // 3️⃣ Requests received (status ≠ pending)
        const validStatuses = ['submitted', 'disbursed', 'rejected', 'case closed', 'accepted'];
        const totalRequests = yield countForms(validStatuses, false);
        const currentYearRequests = yield countForms(validStatuses, true);
        // 📗 Request Accepted (accepted/disbursed/case closed)
        const requestAcceptedOverall = yield countForms(['accepted', 'disbursed', 'case closed'], false);
        const requestAcceptedCurrentYear = yield countForms(['accepted', 'disbursed', 'case closed'], true);
        // ⏳ Request Pending
        const requestPendingOverall = yield countForms(['pending'], false);
        const requestPendingCurrentYear = yield countForms(['pending'], true);
        // ❌ Request Rejected
        const requestRejectedOverall = yield countForms(['rejected'], false);
        const requestRejectedCurrentYear = yield countForms(['rejected'], true);
        // 💸 Cases Disbursed
        const casesDisbursedOverall = yield countForms(['disbursed'], false);
        const casesDisbursedCurrentYear = yield countForms(['disbursed'], true);
        // 📁 Cases Closed
        const casesClosedOverall = yield countForms(['case closed'], false);
        const casesClosedCurrentYear = yield countForms(['case closed'], true);
        // 📊 Year-wise: Students Aided
        const studentsAidedPerYear = yield generatedForm_model_1.default.findAll({
            where: {
                status: { [sequelize_1.Op.in]: ['case closed', 'disbursed'] }
            },
            attributes: [
                [(0, sequelize_1.literal)('EXTRACT(YEAR FROM "created_on")'), 'year'],
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('formId')), 'students']
            ],
            group: ['year'],
            order: [['year', 'ASC']],
            raw: true
        });
        // 📊 Year-wise: Amount Disbursed
        const amountDisbursedPerYear = yield formSubmission_model_1.default.findAll({
            include: [
                {
                    model: generatedForm_model_1.default,
                    where: { status: { [sequelize_1.Op.in]: ['case closed', 'disbursed'] } },
                    attributes: []
                }
            ],
            attributes: [
                [(0, sequelize_1.literal)('EXTRACT(YEAR FROM "GeneratedForm"."created_on")'), 'year'],
                [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('acceptedAmount')), 'amount']
            ],
            group: ['year'],
            order: [['year', 'ASC']],
            raw: true
        });
        res.status(200).json({
            studentsAided: {
                overall: totalStudentsAided,
                currentYear: currentYearStudentsAided
            },
            amountDisbursed: {
                overall: parseAmount(allDisbursedSubmissions),
                currentYear: parseAmount(currentYearDisbursedSubmissions)
            },
            requestsReceived: {
                overall: totalRequests,
                currentYear: currentYearRequests
            },
            requestAccepted: {
                overall: requestAcceptedOverall,
                currentYear: requestAcceptedCurrentYear
            },
            requestPending: {
                overall: requestPendingOverall,
                currentYear: requestPendingCurrentYear
            },
            requestRejected: {
                overall: requestRejectedOverall,
                currentYear: requestRejectedCurrentYear
            },
            casesDisbursed: {
                overall: casesDisbursedOverall,
                currentYear: casesDisbursedCurrentYear
            },
            casesClosed: {
                overall: casesClosedOverall,
                currentYear: casesClosedCurrentYear
            },
            studentsAidedPerYear: studentsAidedPerYear.map((item) => ({
                year: item.year,
                students: parseInt(item.students)
            })),
            amountDisbursedPerYear: amountDisbursedPerYear.map((item) => ({
                year: item.year,
                amount: parseFloat(item.amount)
            }))
        });
    }
    catch (error) {
        console.error('❌ Dashboard fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data', error });
    }
});
exports.getDashboardStats = getDashboardStats;
