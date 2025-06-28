import { Request, Response } from 'express';
import GeneratedForm from '../models/generatedForm.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Op } from 'sequelize';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const generateFormId = async (region: string): Promise<string> => {
  const prefix = region.charAt(0).toUpperCase();
  const year = new Date().getFullYear();

  // Only count forms created in the same year and region
  const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
  const endOfYear = new Date(`${year}-12-31T23:59:59Z`);

  const count = await GeneratedForm.count({
    where: {
      region,
      created_on: {
        [Op.between]: [startOfYear, endOfYear] 
      }
    }
  });

  const number = (count + 1).toString().padStart(4, '0');
  return `${prefix}${year}${number}`;
};

export const createForm = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = req.user;
      const { region } = req.body;
  
      const formId = await generateFormId(region);
      const form_link = `${FRONTEND_URL}/${formId}`;
  
      const form = await GeneratedForm.create({
        formId,
        region,
        form_link,
        creatorId: user.id,
        creator_name: user.full_name  
      });
  
      res.status(201).json({ message: 'Form created successfully', form });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create form', error: err });
    }
};

export const getAllGeneratedForms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const forms = await GeneratedForm.findAll();
    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch forms', error });
  }
};

export const generateNewStudentForm = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { region } = req.body;

    const formId = await generateFormId(region);
    const form_link = `${FRONTEND_URL}/${formId}`;

    const form = await GeneratedForm.create({
      formId,
      region,
      form_link,
      creatorId: user.id,
      creator_name: user.full_name
    });

    res.status(201).json({ message: 'Form created for new student', form });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create form', error: err });
  }
};

export const generateFormForExistingStudent = async (req: AuthRequest, res: Response) => {
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
      creator_name: user.full_name
    });

    res.status(201).json({ message: 'Form created for existing student', form: newForm });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create form', error: err });
  }
};

export const getFormStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId } = req.params;
    const form = await GeneratedForm.findOne({ where: { formId } });

    if (!form) {
      res.status(404).json({ message: "Form not found" });
      return;
    }

    res.status(200).json({ status: form.status });
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
