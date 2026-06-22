import { Request, Response } from 'express';
import GeneratedForm from '../models/generatedForm.model';
import FormSubmission from '../models/formSubmission.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Op, Sequelize } from 'sequelize';
import { getSingleParam } from '../utils/requestParams';

const FRONTEND_URL = process.env.FRONTEND_URL?.trim() || 'http://localhost:3000';

export const generateFormId = async (region: 'Jubail' | 'Dammam' | 'Maharashtra') => {
  const regionInitial = region.charAt(0).toUpperCase();
  const currentYear = new Date().getFullYear();

  // Find the max sequence for this region across all years
  const latestForm = await GeneratedForm.findOne({
    where: {
      formId: {
        [Op.like]: `${regionInitial}%`
      }
    },
    order: [['created_on', 'DESC']]
  });

  let nextSequence = 1;

  if (latestForm?.formId) {
    // Extract the last 4 digits (sequence)
    const lastSeq = parseInt(latestForm.formId.slice(-4));
    if (!isNaN(lastSeq)) {
      nextSequence = lastSeq + 1;
    }
  }

  // Now build new formId with current year and next sequence
  const newFormId = `${regionInitial}${currentYear}${String(nextSequence).padStart(4, '0')}`;
  return newFormId;
};

export const getAllGeneratedForms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await FormSubmission.findAll();

    const forms = submissions.map((submission: any) => {
      const student_name = [
        submission.firstName,
        submission.fatherName,
        submission.familyName,
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

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
        created_on: submission.submitted_at ?? submission.createdAt ?? submission.updatedAt,
      };
    });

    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch forms', error });
  }
};

export const generateNewStudentForm = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { region, name } = req.body;

    if (!region || !name) {
      res.status(400).json({ message: 'Both name and region are required' });
      return;
    }

    const formId = await generateFormId(region);
    const form_link = `${FRONTEND_URL}/${formId}`;

    const form = await GeneratedForm.create({
      formId,
      region,
      form_link,
      creatorId: user.id,
      creator_name: user.full_name,
      student_name: name // ✅ Save name
    });

    res.status(201).json({ message: 'Form created for new student', form });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create form', error: err });
  }
};

export const generateFormForExistingStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { oldFormId } = req.body;

    const oldForm = await GeneratedForm.findOne({ where: { formId: oldFormId } });
    if (!oldForm) {
      res.status(404).json({ message: 'Original student/form not found' });
      return;
    }

    const prefix = oldFormId.charAt(0);
    const sequence = oldFormId.slice(-4); // get last 4 digits
    const currentYear = new Date().getFullYear();
    const newFormId = `${prefix}${currentYear}${sequence}`;
    const form_link = `${FRONTEND_URL}/${newFormId}`;
  
    const newForm = await GeneratedForm.create({
      formId: newFormId,
      region: oldForm.region,
      form_link,
      creatorId: user.id,
      creator_name: user.full_name,
      student_name: oldForm.student_name // ✅ copy name from old form
    });

    res.status(201).json({ message: 'Form created for existing student', form: newForm });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create form', error: err });
  }
};

export const getFormStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const formId = getSingleParam(req.params.formId);

    if (!formId) {
      res.status(400).json({ message: 'formId is required' });
      return;
    }

    const form = await GeneratedForm.findOne({ where: { formId } });

    if (!form) {
      res.status(404).json({ message: "Form not found" });
      return;
    }

    // Extract form suffix and prefix
    const suffix = formId.slice(-4);
    const prefix = formId.charAt(0);

    // Find if an earlier form exists with the same suffix
    const earlierForm = await GeneratedForm.findOne({
      where: {
        formId: {
          [Op.like]: `${prefix}%${suffix}`
        },
        created_on: {
          [Op.lt]: form.getDataValue('created_on')
        }
      }
    });

    const isNewStudent = !earlierForm;

    res.status(200).json({
      status: form.status,
      isNewStudent
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to get form status", error });
  }
};

export const getPendingForms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pendingForms = await GeneratedForm.findAll({
      where: { status: 'pending' }
    });

    res.status(200).json({ forms: pendingForms });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending forms', error });
  }
};

export const deletePendingFormById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId } = req.body;

    if (!formId) {
      res.status(400).json({ message: 'formId is required' });
      return;
    }

    const form = await GeneratedForm.findOne({ where: { formId } });

    if (!form) {
      res.status(404).json({ message: 'Form not found' });
      return;
    }

    if (form.getDataValue('status') !== 'pending') {
      res.status(400).json({ message: 'Only forms with pending status can be deleted' });
      return;
    }

    await form.destroy();

    res.status(200).json({ message: `Form ${formId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete form', error });
  }
};

/**
 * POST /forms/check-duplicate
 * Body: { name: string, region: string }
 *
 * Checks form_submissions (joined with generated_forms for region) for a
 * student whose full name (firstName + fatherName + familyName) matches the
 * supplied name AND whose form was created for the given region.
 *
 * Returns:
 *   { isDuplicate: boolean, matches: { formId, firstName, fatherName, familyName, schoolName }[] }
 */
export const checkDuplicateStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, region } = req.body;

    if (!name || !region) {
      res.status(400).json({ message: 'Both name and region are required' });
      return;
    }

    const nameNormalized = (name as string).trim().toLowerCase();

    // Pull all submissions whose generated form matches the region
    const submissions = await FormSubmission.findAll({
      include: [
        {
          model: GeneratedForm,
          required: true,
          where: { region },
          attributes: ['formId', 'region'],
        },
      ],
      attributes: ['formId', 'firstName', 'fatherName', 'familyName', 'schoolName'],
    });

    // Case-insensitive full-name comparison done in JS to avoid DB dialect differences
    const matches = submissions
      .filter((s) => {
        const parts = [
          s.getDataValue('firstName') ?? '',
          s.getDataValue('fatherName') ?? '',
          s.getDataValue('familyName') ?? '',
        ]
          .map((p: string) => p.trim())
          .filter(Boolean);

        return parts.join(' ').toLowerCase() === nameNormalized;
      })
      .map((s) => ({
        formId: s.getDataValue('formId'),
        firstName: s.getDataValue('firstName'),
        fatherName: s.getDataValue('fatherName'),
        familyName: s.getDataValue('familyName'),
        schoolName: s.getDataValue('schoolName'),
      }));

    res.status(200).json({
      isDuplicate: matches.length > 0,
      matches,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check for duplicate student', error: err });
  }
};
