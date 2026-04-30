import { Request, Response } from 'express';
import { Op } from 'sequelize';
import GeneratedForm from '../models/generatedForm.model';
import FormSubmission from '../models/formSubmission.model';

type DashboardSummary = {
  studentsAided: number;
  amountDisbursed: number;
  requestsReceived: number;
  requestAccepted: number;
  requestPending: number;
  requestRejected: number;
  casesDisbursed: number;
  casesClosed: number;
};

type GeneratedFormRow = {
  formId: string;
  status: string;
  created_on: Date | string;
};

type DisbursedSubmissionRow = {
  acceptedAmount: number | string | null;
  GeneratedForm?: {
    created_on?: Date | string;
  };
};

const createEmptySummary = (): DashboardSummary => ({
  studentsAided: 0,
  amountDisbursed: 0,
  requestsReceived: 0,
  requestAccepted: 0,
  requestPending: 0,
  requestRejected: 0,
  casesDisbursed: 0,
  casesClosed: 0,
});

const getFinancialYearStart = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  return month >= 3 ? year : year - 1;
};

const getFinancialYearKey = (dateInput: Date | string) => {
  const date = new Date(dateInput);
  const startYear = getFinancialYearStart(date);
  return `${startYear}-${startYear + 1}`;
};

const getFinancialYearLabel = (financialYearKey: string) => {
  const [startYear, endYear] = financialYearKey.split('-');
  return `${startYear} to ${endYear}`;
};

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const generatedForms = (await GeneratedForm.findAll({
      attributes: ['formId', 'status', 'created_on'],
      raw: true,
    })) as GeneratedFormRow[];

    const disbursedSubmissions = await FormSubmission.findAll({
      include: [
        {
          model: GeneratedForm,
          attributes: ['created_on'],
          where: { status: { [Op.in]: ['case closed', 'disbursed'] } },
        },
      ],
      attributes: ['acceptedAmount'],
      raw: true,
      nest: true,
    }) as unknown as DisbursedSubmissionRow[];

    const financialYearMap = new Map<string, DashboardSummary>();
    const ensureSummary = (key: string) => {
      if (!financialYearMap.has(key)) {
        financialYearMap.set(key, createEmptySummary());
      }
      return financialYearMap.get(key)!;
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
      const createdOn = submission.GeneratedForm?.created_on;
      if (!createdOn) continue;

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
      studentsAidedPerFinancialYear: financialYearKeys.map((key) => ({
        key,
        label: getFinancialYearLabel(key),
        students: financialYearMap.get(key)?.studentsAided ?? 0,
      })),
      amountDisbursedPerFinancialYear: financialYearKeys.map((key) => ({
        key,
        label: getFinancialYearLabel(key),
        amount: financialYearMap.get(key)?.amountDisbursed ?? 0,
      })),
    });
  } catch (error) {
    console.error('❌ Dashboard fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error });
  }
};
