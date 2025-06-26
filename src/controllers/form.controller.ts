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
      const { region, disbursement_amount } = req.body;
  
      const formId = await generateFormId(region);
      const form_link = `${FRONTEND_URL}/${formId}`;
  
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
  
