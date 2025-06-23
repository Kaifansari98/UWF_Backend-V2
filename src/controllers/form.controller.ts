import { Request, Response } from 'express';
import GeneratedForm from '../models/generatedForm.model';
import { AuthRequest } from '../middlewares/auth.middleware';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api';

const generateFormId = async (region: string): Promise<string> => {
  const prefix = region.charAt(0).toUpperCase();
  const year = new Date().getFullYear();
  const count = await GeneratedForm.count({ where: { region } });
  const number = (count + 1).toString().padStart(4, '0');
  return `${prefix}${year}${number}`;
};

export const createForm = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = req.user;
      const { region, disbursement_amount } = req.body;
  
      const formId = await generateFormId(region);
      const form_link = `${BASE_URL}/${formId}`;
  
      const form = await GeneratedForm.create({
        formId,
        region,
        disbursement_amount,
        form_link,
        creatorId: user.id,
        creator_name: user.full_name  
      });
  
      res.status(201).json({ message: 'Form created successfully', form });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create form', error: err });
    }
  };
  
