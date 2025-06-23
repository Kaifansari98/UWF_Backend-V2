import { Request, Response } from 'express';
import FormSubmission from '../models/formSubmission.model';
import GeneratedForm from '../models/generatedForm.model';

export const submitForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId } = req.params;

    const form = await GeneratedForm.findOne({ where: { formId } });
    if (!form) {
      res.status(404).json({ message: 'Form not found' });
      return;
    }

    const {
      firstName, fatherName, familyName, gender,
      schoolName, studyMedium, class: className, academicYear,
      parentName, mobile, alternateMobile, address, incomeSource,
      reason, requested_amount,
      bankAccountHolder, bankAccountNumber, ifscCode, bankName,
      coordinatorName, coordinatorMobile
    } = req.body;

    // ✅ Properly assert req.files type
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const feesStructure = files?.['feesStructure']?.[0]?.filename;
    const marksheet = files?.['marksheet']?.[0]?.filename;
    const signature = files?.['signature']?.[0]?.filename;

    const submission = await FormSubmission.create({
      formId,
      firstName,
      fatherName,
      familyName,
      gender,
      schoolName,
      studyMedium,
      class: className,
      academicYear,
      parentName,
      mobile,
      alternateMobile,
      address,
      incomeSource,
      reason,
      requested_amount,
      feesStructure,
      marksheet,
      signature,
      bankAccountHolder,
      bankAccountNumber,
      ifscCode,
      bankName,
      coordinatorName,
      coordinatorMobile,
      submitted_at: new Date()
    });

    // ✅ Update the corresponding generated_forms record
    await form.update({
      submitted_on: new Date(),
      status: 'submitted'
    });

    res.status(201).json({
      message: 'Form submitted successfully',
      submission
    });

  } catch (err) {
    res.status(500).json({
      message: 'Form submission failed',
      error: (err as Error).message
    });
  }
};
