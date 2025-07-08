import { Request, Response } from 'express';
import FormSubmission from '../models/formSubmission.model';
import GeneratedForm from '../models/generatedForm.model';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

// Inside formSubmission.controller.ts
import 
{ getPaymentInProgressFormsService,
  updateAcceptedAmountService,
  markFormAsDisbursedService, 
  getDisbursedFormsService,
  getAllDisbursedDataService,
  getAllUniqueNewStudentSubmissions
} from "../services/formSubmission.service";

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
    let parentApprovalLetter = files?.['parentApprovalLetter']?.[0]?.filename;

    // ✅ Step 2: If no parentApprovalLetter uploaded, try to fetch from old form
    if (!parentApprovalLetter) {
      const prefix = formId.charAt(0);
      const sequence = formId.slice(-4); // get last 4 digits

      const previousForm = await GeneratedForm.findOne({
        where: {
          formId: {
            [Op.like]: `${prefix}%${sequence}`
          },
          status: 'submitted'
        },
        order: [['created_on', 'DESC']]
      });

      if (previousForm) {
        const previousSubmission = await FormSubmission.findOne({
          where: { formId: previousForm.formId }
        });

        parentApprovalLetter = previousSubmission?.getDataValue('parentApprovalLetter') || '';
      }
    }

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
      parentApprovalLetter,
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

export const getSubmittedFormSubmissions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await FormSubmission.findAll({
      include: [
        {
          model: GeneratedForm,
          where: { status: 'submitted' }, // filter only 'submitted' forms
          attributes: ['status', 'formId', 'region', 'creator_name', 'submitted_on'],
        }
      ]
    });

    res.status(200).json({ submissions });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch submitted form submissions',
      error
    });
  }
};

export const editFormSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId } = req.params;

    const submission = await FormSubmission.findOne({ where: { formId } });
    if (!submission) {
      res.status(404).json({ message: 'Submission not found' });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Determine which files to update (delete old ones if needed)
    const fileFields = ['feesStructure', 'marksheet', 'signature', 'parentApprovalLetter'];
    const updatedFiles: Record<string, string | undefined> = {};

    for (const field of fileFields) {
      if (files?.[field]?.[0]) {
        const newFileName = files[field][0].filename;
        const oldFileName = submission.getDataValue(field);

        // Only delete the old file if the new one has a different filename
        if (oldFileName && oldFileName !== newFileName) {
          const oldFilePath = path.join(__dirname, `../../assets/FormData/${oldFileName}`);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }

        updatedFiles[field] = newFileName;
      } else {
        // No new file uploaded, retain the existing filename
        updatedFiles[field] = submission.getDataValue(field);
      }
    }

    // Update other fields from body
    const {
      firstName, fatherName, familyName, gender,
      schoolName, studyMedium, class: className, academicYear,
      parentName, mobile, alternateMobile, address, incomeSource,
      reason, requested_amount,
      bankAccountHolder, bankAccountNumber, ifscCode, bankName,
      coordinatorName, coordinatorMobile,
      form_accepted, form_disbursed, form_case_closed
    } = req.body;

    await submission.update({
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
      bankAccountHolder,
      bankAccountNumber,
      ifscCode,
      bankName,
      coordinatorName,
      coordinatorMobile,
      form_accepted,
      form_disbursed,
      form_case_closed,
      ...updatedFiles
    });

    res.status(200).json({ message: 'Form submission updated successfully', submission });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to update form submission',
      error: (error as Error).message
    });
  }
};

export const deleteFormSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId } = req.body;

    if (!formId) {
      res.status(400).json({ message: "formId is required" });
      return;
    }

    const submission = await FormSubmission.findOne({ where: { formId } });
    if (!submission) {
      res.status(404).json({ message: "Submission not found" });
      return;
    }

    const form = await GeneratedForm.findOne({ where: { formId } });
    if (!form) {
      res.status(404).json({ message: "Generated form not found" });
      return;
    }

    // Extract prefix & suffix
    const suffix = formId.slice(-4);       // "0001"
    const prefix = formId.charAt(0);       // "J"
    const currentYear = parseInt(formId.slice(1, 5)); // 2026

    // Check if any earlier year form exists with same suffix (indicating this is an existing student)
    const existingForm = await GeneratedForm.findOne({
      where: {
        formId: {
          [Op.like]: `${prefix}%${suffix}`
        },
        created_on: {
          [Op.lt]: form.getDataValue('created_on')
        }
      }
    });

    const isExistingStudent = !!existingForm;

    // Delete uploaded files
    const fileFields = ['feesStructure', 'marksheet', 'signature', 'parentApprovalLetter'];
    for (const field of fileFields) {
      const fileName = submission.getDataValue(field);
      const filePath = path.join(__dirname, `../../assets/FormData/${fileName}`);

      // ❗ If this is an existing student, skip deleting parentApprovalLetter
      if (isExistingStudent && field === 'parentApprovalLetter') continue;

      if (fileName && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete both entries
    await submission.destroy();
    await form.destroy();

    res.status(200).json({
      message: `Form ${formId} and its submission deleted successfully${isExistingStudent ? ', parentApprovalLetter retained' : ''}`
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete submission and form",
      error: (error as Error).message
    });
  }
};

export const rejectFormSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId } = req.params;

    const submission = await FormSubmission.findOne({ where: { formId } });
    const form = await GeneratedForm.findOne({ where: { formId } });

    if (!submission || !form) {
      res.status(404).json({ message: "Form or submission not found" });
      return;
    }

    // Update form status to rejected
    await form.update({ status: "rejected" });

    // ✅ Fixed this line
    if (submission.getDataValue('form_accepted') === true) {
      await submission.update({ isRejected: true, form_accepted: false });
    } else {
      await submission.update({ isRejected: true });
    }

    res.status(200).json({ message: "Form marked as rejected" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject form submission",
      error: (error as Error).message
    });
  }
};

export const revertRejection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId } = req.params;

    const submission = await FormSubmission.findOne({ where: { formId } });
    const form = await GeneratedForm.findOne({ where: { formId } });

    if (!submission || !form) {
      res.status(404).json({ message: "Form or submission not found" });
      return;
    }

    await submission.update({ isRejected: false });
    await form.update({ status: "submitted" });

    res.status(200).json({ message: "Form rejection reverted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to revert rejection",
      error: (error as Error).message
    });
  }
};

export const getRejectedFormSubmissions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rejectedSubmissions = await FormSubmission.findAll({
      include: [
        {
          model: GeneratedForm,
          where: { status: 'rejected' },
          attributes: [
            'formId',
            'region',
            'form_link',
            'status',
            'created_on',
            'submitted_on',
            'creator_name',
            'student_name',
          ]
        }
      ]
    });

    res.status(200).json({ rejectedSubmissions });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch rejected submissions',
      error: (error as Error).message
    });
  }
};

export const acceptFormSubmission = async (req: Request, res: Response): Promise<void> => {
  const { formId } = req.params;

  try {
    const form = await GeneratedForm.findOne({ where: { formId } });
    if (!form) {
      res.status(404).json({ message: "Generated form not found" });
      return;
    }

    const submission = await FormSubmission.findOne({ where: { formId } });
    if (!submission) {
      res.status(404).json({ message: "Form submission not found" });
      return;
    }

    // Update both tables
    await form.update({ status: "accepted" });
    await submission.update({ form_accepted: true });

    res.status(200).json({ message: "Form marked as accepted" });
  } catch (err) {
    console.error("Error updating form acceptance:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const revertFormAcceptance = async (req: Request, res: Response): Promise<void> => {
  const { formId } = req.params;

  try {
    const form = await GeneratedForm.findOne({ where: { formId } });
    if (!form) {
      res.status(404).json({ message: "Generated form not found" });
      return;
    }

    const submission = await FormSubmission.findOne({ where: { formId } });
    if (!submission) {
      res.status(404).json({ message: "Form submission not found" });
      return;
    }

    // Revert both tables
    await form.update({ status: "submitted" });
    await submission.update({ form_accepted: false });

    res.status(200).json({ message: "Form acceptance reverted successfully" });
  } catch (err) {
    console.error("Error reverting form acceptance:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAcceptedFormSubmissions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const acceptedSubmissions = await FormSubmission.findAll({
      where: {
        acceptedAmount: null, // <-- Only include submissions where acceptedAmount is not set
      },
      include: [
        {
          model: GeneratedForm,
          where: { status: "accepted" },
          attributes: [
            "formId",
            "region",
            "form_link",
            "status",
            "created_on",
            "submitted_on",
            "creator_name",
            "student_name",
          ],
        },
      ],
    });

    res.status(200).json({ acceptedSubmissions });
  } catch (err) {
    console.error("Error fetching accepted submissions:", err);
    res.status(500).json({ message: "Failed to fetch accepted submissions" });
  }
};

export const updateAcceptedAmount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId } = req.params;
    const { amount } = req.body;

    const savedAmount = await updateAcceptedAmountService(formId, Number(amount));

    res.status(200).json({
      message: "Accepted amount updated successfully",
      acceptedAmount: savedAmount,
    });
  } catch (error: any) {
    console.error("Error updating accepted amount:", error);
    res.status(400).json({ message: error.message || "Failed to update accepted amount" });
  }
};

export const getPaymentInProgressForms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await getPaymentInProgressFormsService();
    res.status(200).json({ paymentInProgress: submissions });
  } catch (err) {
    console.error("Error fetching payment in progress forms:", err);
    res.status(500).json({ message: "Failed to fetch payment in progress forms" });
  }
};

export const revertTreasuryApproval = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { formId } = req.params;

  try {
    const submission = await FormSubmission.findOne({
      where: { formId },
      include: [{ model: GeneratedForm, as: "GeneratedForm" }],
    });

    if (!submission) {
      res.status(404).json({ message: "Submission not found" });
      return;
    }

    // Reset acceptedAmount
    (submission as any).acceptedAmount = null;
    await submission.save();

    const generatedForm = (submission as any).GeneratedForm;
    if (generatedForm) {
      generatedForm.status = "accepted";
      await generatedForm.save();
    }

    res.status(200).json({
      message: `Treasury approval reverted for ${formId}`,
      data: {
        formId,
        status: "accepted",
      },
    });
  } catch (error: any) {
    console.error("Error reverting treasury approval:", error);
    res.status(500).json({
      message: error.message || "Failed to revert treasury approval",
    });
  }
};

export const markFormAsDisbursed = async (req: Request, res: Response) => {
  const { formId } = req.params;

  try {
    const result = await markFormAsDisbursedService(formId);
    res.status(200).json({
      message: `Form ${formId} marked as disbursed.`,
      data: result,
    });
  } catch (error: any) {
    console.error("Error updating form_disbursed:", error);
    res.status(500).json({
      message: error.message || "Failed to update disbursement status",
    });
  }
};

export const revertDisbursedForm = async (req: Request, res: Response): Promise<void> => {
  const { formId } = req.params;

  try {
    const submission = await FormSubmission.findOne({
      where: { formId },
      include: [{ model: GeneratedForm }],
    });

    if (!submission) {
      res.status(404).json({ message: "Submission not found" });
      return;
    }

    if (!(submission as any).form_disbursed) {
      res.status(400).json({ message: "Form is not marked as disbursed" });
      return;
    }

    (submission as any).form_disbursed = false;
    await submission.save();

    res.status(200).json({
      message: `Disbursement reverted for form ${formId}`,
      data: {
        formId,
        form_disbursed: false,
      },
    });
  } catch (error: any) {
    console.error("Error reverting disbursement:", error);
    res.status(500).json({
      message: error.message || "Failed to revert disbursement",
    });
  }
};

export const getDisbursedForms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await getDisbursedFormsService();
    res.status(200).json({ disbursedForms: submissions });
  } catch (err) {
    console.error("Error fetching disbursed forms:", err);
    res.status(500).json({ message: "Failed to fetch disbursed forms" });
  }
};

export const markRequestAsDisbursed = async (req: Request, res: Response): Promise<void> => {
  const { formId } = req.params;

  try {
    const submission = await FormSubmission.findOne({
      where: { formId },
      include: [{ model: GeneratedForm }],
    });

    if (!submission) {
      res.status(404).json({ message: "Form submission not found" });
      return;
    }

    const { acceptedAmount, form_accepted, form_disbursed, isRejected } = submission as any;

    if (!acceptedAmount || !form_accepted || !form_disbursed || isRejected) {
      res.status(400).json({
        message: "Cannot disburse form. Ensure all conditions are met:\n• Accepted amount present\n• Form accepted\n• Form disbursed\n• Not rejected",
      });
      return;
    }

    const generatedForm = await GeneratedForm.findOne({ where: { formId } });
    if (!generatedForm) {
      res.status(404).json({ message: "Generated form not found" });
      return;
    }

    generatedForm.status = "disbursed";
    await generatedForm.save();

    res.status(200).json({
      message: `Form ${formId} marked as disbursed`,
      data: {
        formId,
        status: "disbursed",
      },
    });
  } catch (error: any) {
    console.error("Error disbursing form:", error);
    res.status(500).json({ message: error.message || "Failed to update form status" });
  }
};

export const revertDisbursementToAccepted = async (req: Request, res: Response): Promise<void> => {
  const { formId } = req.params;

  try {
    // Fetch form submission with associated generated form
    const submission = await FormSubmission.findOne({
      where: { formId },
      include: [{ model: GeneratedForm }],
    });

    if (!submission) {
      res.status(404).json({ message: "Form submission not found" });
      return;
    }

    const { acceptedAmount, form_accepted, form_disbursed, isRejected } = submission as any;

    // Check required flags
    if (!acceptedAmount || !form_accepted || !form_disbursed || isRejected) {
      res.status(400).json({
        message:
          "Cannot revert disbursement. Make sure:\n• Accepted amount exists\n• Form is accepted\n• Form is marked as disbursed\n• Form is not rejected",
      });
      return;
    }

    // Ensure generated form exists
    const generatedForm = (submission as any).GeneratedForm;
    if (!generatedForm) {
      res.status(404).json({ message: "Generated form not found" });
      return;
    }

    if (generatedForm.status !== "disbursed") {
      res.status(400).json({ message: "Form is not currently marked as disbursed." });
      return;
    }

    // Revert to accepted
    generatedForm.status = "accepted";
    await generatedForm.save();

    res.status(200).json({
      message: `Form ${formId} status reverted to accepted.`,
      data: {
        formId,
        status: "accepted",
      },
    });
  } catch (error: any) {
    console.error("Error reverting disbursement:", error);
    res.status(500).json({
      message: error.message || "Failed to revert disbursement status",
    });
  }
};

export const getAllDisbursedData = async (_req: Request, res: Response) => {
  try {
    const disbursedForms = await getAllDisbursedDataService();
    res.status(200).json({ disbursedForms });
  } catch (error: any) {
    console.error("Error fetching disbursed data:", error);
    res.status(500).json({ message: "Failed to fetch disbursed forms data" });
  }
};

export const getAllNewStudentSubmissions = async (_req: Request, res: Response) => {
  try {
    const submissions = await getAllUniqueNewStudentSubmissions();
    res.status(200).json({ submissions });
  } catch (error: any) {
    console.error("Error fetching new student submissions:", error);
    res.status(500).json({ message: "Failed to fetch new student submissions" });
  }
};