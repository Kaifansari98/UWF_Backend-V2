import { Response } from 'express';
import { Op } from 'sequelize';
import { AuthRequest } from '../middlewares/auth.middleware';
import BankInfoLetter from '../models/bankInfoLetter.model';
import User from '../models/user.model';

function getFinancialYear(dateInput?: Date | string | null): string | null {
  if (!dateInput) return null;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;
  const month = date.getMonth();
  const year = date.getFullYear();
  const fyStart = month >= 3 ? year : year - 1;
  return `${fyStart} → ${fyStart + 1}`;
}

export const searchBankInfoLetters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      search = '',
      financialYear = 'all',
      page = 1,
      pageSize = 20,
    } = req.body ?? {};

    const normalizedSearch = String(search).trim();
    const currentPage = Math.max(1, Number(page) || 1);
    const currentPageSize = Math.max(1, Number(pageSize) || 20);

    const bankInfoLetters = await BankInfoLetter.findAll({
      where: {
        is_deleted: false,
        ...(normalizedSearch
          ? {
              [Op.or]: [
                { principal_headmaster: { [Op.iLike]: `%${normalizedSearch}%` } },
                { school_college_name: { [Op.iLike]: `%${normalizedSearch}%` } },
                { address: { [Op.iLike]: `%${normalizedSearch}%` } },
                { student_name: { [Op.iLike]: `%${normalizedSearch}%` } },
                { admission_no_gr_no: { [Op.iLike]: `%${normalizedSearch}%` } },
                { student_parent_name: { [Op.iLike]: `%${normalizedSearch}%` } },
                { class_course_program: { [Op.iLike]: `%${normalizedSearch}%` } },
                { academic_year_term: { [Op.iLike]: `%${normalizedSearch}%` } },
              ],
            }
          : {}),
      },
      include: [
        {
          model: User,
          as: 'signatoryUser',
          attributes: ['id', 'full_name', 'username'],
        },
      ],
      order: [['generated_at', 'DESC']],
    });

    const mappedLetters = bankInfoLetters.map((letter: any) => ({
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
      signatory_name:
        letter.signatoryUser?.full_name ||
        letter.signatoryUser?.username ||
        '—',
    }));

    const financialYears = Array.from(
      new Set(
        mappedLetters
          .map((letter) => getFinancialYear(letter.generated_at))
          .filter(Boolean)
      )
    ).sort();

    const yearFilteredLetters =
      financialYear === 'all'
        ? mappedLetters
        : mappedLetters.filter(
            (letter) => getFinancialYear(letter.generated_at) === financialYear
          );

    const totalPages = Math.max(
      1,
      Math.ceil(yearFilteredLetters.length / currentPageSize)
    );
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * currentPageSize;
    const paginatedLetters = yearFilteredLetters.slice(
      startIndex,
      startIndex + currentPageSize
    );

    res.status(200).json({
      letters: paginatedLetters,
      financialYears,
      page: safePage,
      pageSize: currentPageSize,
      totalPages,
      totalCount: yearFilteredLetters.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bank info letters', error });
  }
};

export const createBankInfoLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const generatedBy = req.user?.id;

    if (!generatedBy) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const {
      principal_headmaster,
      school_college_name,
      address,
      student_name,
      admission_no_gr_no,
      student_parent_name,
      class_course_program,
      academic_year_term,
      signatory_user_id,
      bank_name,
      account_name,
      account_number,
      ifsc_code,
      branch_name_address,
    } = req.body;

    const requiredFields = [
      ['principal_headmaster', principal_headmaster],
      ['school_college_name', school_college_name],
      ['address', address],
      ['student_name', student_name],
      ['admission_no_gr_no', admission_no_gr_no],
      ['student_parent_name', student_parent_name],
      ['class_course_program', class_course_program],
      ['academic_year_term', academic_year_term],
      ['signatory_user_id', signatory_user_id],
    ];

    const missingFields = requiredFields
      .filter(([, value]) => value === undefined || value === null || value === '')
      .map(([field]) => field);

    if (missingFields.length > 0) {
      res.status(400).json({
        message: 'Missing required fields',
        missingFields,
      });
      return;
    }

    const signatoryUser = await User.findByPk(signatory_user_id);
    if (!signatoryUser) {
      res.status(404).json({ message: 'Signatory user not found' });
      return;
    }

    const bankInfoLetter = await BankInfoLetter.create({
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
      generated_by: generatedBy,
    });

    res.status(201).json({
      message: 'Bank info letter created successfully',
      bankInfoLetter,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create bank info letter', error });
  }
};
