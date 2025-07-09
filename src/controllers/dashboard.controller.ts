import { Request, Response } from 'express';
import { Op, fn, col, literal } from 'sequelize';
import GeneratedForm from '../models/generatedForm.model';
import FormSubmission from '../models/formSubmission.model';

type YearlyStudents = { year: number; students: string };
type YearlyDisbursement = { year: number; amount: string };

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59Z`);

    // ✅ Reusable helper to count forms by status (multiple or single)
    const countForms = async (statuses: string[], isCurrentYear: boolean) => {
      return await GeneratedForm.count({
        where: {
          status: { [Op.in]: statuses },
          ...(isCurrentYear && {
            created_on: { [Op.between]: [startOfYear, endOfYear] }
          })
        }
      });
    };

    // 1️⃣ Students aided (status = 'case closed')
    const totalStudentsAided = await countForms(['case closed'], false);
    const currentYearStudentsAided = await countForms(['case closed'], true);

    // 2️⃣ Amount disbursed (from FormSubmission.acceptedAmount)
    const allDisbursedSubmissions = await FormSubmission.findAll({
      include: [
        {
          model: GeneratedForm,
          where: {
            status: { [Op.in]: ['case closed', 'disbursed'] }
          },
          attributes: []
        }
      ],
      attributes: [[fn('SUM', col('acceptedAmount')), 'total']],
      raw: true
    });

    const currentYearDisbursedSubmissions = await FormSubmission.findAll({
      include: [
        {
          model: GeneratedForm,
          where: {
            status: { [Op.in]: ['case closed', 'disbursed'] },
            created_on: { [Op.between]: [startOfYear, endOfYear] }
          },
          attributes: []
        }
      ],
      attributes: [[fn('SUM', col('acceptedAmount')), 'total']],
      raw: true
    });

    const parseAmount = (res: any[]) =>
      parseFloat(res[0]?.total || '0');

    // 3️⃣ Requests received (status ≠ pending)
    const validStatuses = ['submitted', 'disbursed', 'rejected', 'case closed', 'accepted'];

    const totalRequests = await countForms(validStatuses, false);
    const currentYearRequests = await countForms(validStatuses, true);

    // 📗 Request Accepted (accepted/disbursed/case closed)
    const requestAcceptedOverall = await countForms(
      ['accepted', 'disbursed', 'case closed'],
      false
    );
    const requestAcceptedCurrentYear = await countForms(
      ['accepted', 'disbursed', 'case closed'],
      true
    );

    // ⏳ Request Pending
    const requestPendingOverall = await countForms(['pending'], false);
    const requestPendingCurrentYear = await countForms(['pending'], true);

    // ❌ Request Rejected
    const requestRejectedOverall = await countForms(['rejected'], false);
    const requestRejectedCurrentYear = await countForms(['rejected'], true);

    // 💸 Cases Disbursed
    const casesDisbursedOverall = await countForms(['disbursed'], false);
    const casesDisbursedCurrentYear = await countForms(['disbursed'], true);

    // 📁 Cases Closed
    const casesClosedOverall = await countForms(['case closed'], false);
    const casesClosedCurrentYear = await countForms(['case closed'], true);

// 📊 Year-wise: Students Aided
const studentsAidedPerYear = await GeneratedForm.findAll({
    where: {
      status: { [Op.in]: ['case closed', 'disbursed'] }
    },
    attributes: [
      [literal('EXTRACT(YEAR FROM "created_on")'), 'year'],
      [fn('COUNT', col('formId')), 'students']
    ],
    group: ['year'],
    order: [['year', 'ASC']],
    raw: true
  });
  
  // 📊 Year-wise: Amount Disbursed
  const amountDisbursedPerYear = await FormSubmission.findAll({
    include: [
      {
        model: GeneratedForm,
        where: { status: { [Op.in]: ['case closed', 'disbursed'] } },
        attributes: []
      }
    ],
    attributes: [
      [literal('EXTRACT(YEAR FROM "GeneratedForm"."created_on")'), 'year'],
      [fn('SUM', col('acceptedAmount')), 'amount']
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
      studentsAidedPerYear: studentsAidedPerYear.map((item: any) => ({
        year: item.year,
        students: parseInt(item.students)
      })),
      amountDisbursedPerYear: amountDisbursedPerYear.map((item: any) => ({
        year: item.year,
        amount: parseFloat(item.amount)
      }))
    });
  } catch (error) {
    console.error('❌ Dashboard fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error });
  }
};
