import { Request, Response } from 'express';
import AcknowledgementForm from '../models/acknowledgementForm.model';
import GeneratedForm from '../models/generatedForm.model';
import FormSubmission from '../models/formSubmission.model';

export const generateAcknowledgementForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const { formId } = req.body;
  
      if (!formId) {
        res.status(400).json({ message: 'formId is required' });
        return;
      }
  
      const existingForm = await GeneratedForm.findOne({ where: { formId } });
  
      if (!existingForm) {
        res.status(404).json({ message: 'Generated form not found' });
        return;
      }
  
      const formSubmission = await FormSubmission.findOne({ where: { formId } });
  
      if (!formSubmission) {
        res.status(404).json({ message: 'Form submission not found' });
        return;
      }
  
      const { firstName, fatherName, familyName } = formSubmission as any;
      const student_name = `${firstName} ${fatherName} ${familyName}`.trim();
  
      const form_link = `https://unitedwelfarefoundation.com/acknowledgement-form/${formId}`;
  
      const newAckForm = await AcknowledgementForm.create({
        formId,
        student_name,
        form_link,
        status: 'pending',
      });
  
      res.status(201).json({
        message: 'Acknowledgement form generated successfully',
        acknowledgement: newAckForm,
      });
    } catch (error) {
      console.error('Error generating acknowledgement form:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};  
  
export const uploadAcknowledgementInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { formId } = req.params;
  
      if (!req.file) {
        res.status(400).json({ message: 'Invoice PDF is required' });
        return;
      }
  
      const acknowledgement = await AcknowledgementForm.findOne({ where: { formId } });
  
      if (!acknowledgement) {
        res.status(404).json({ message: 'Acknowledgement form not found' });
        return;
      }
  
      const invoiceFileName = `${formId}Invoice.pdf`;
  
      (acknowledgement as any).invoice = invoiceFileName;
      (acknowledgement as any).status = 'submitted';
      (acknowledgement as any).submitted_at = new Date();
  
      await acknowledgement.save();
  
      res.status(200).json({
        message: 'Invoice uploaded and acknowledgement form updated successfully',
        acknowledgement,
      });
    } catch (error) {
      console.error('Error uploading invoice:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getCompleteStudentData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { formId } = req.params;
  
      if (!formId) {
        res.status(400).json({ message: 'formId is required' });
        return;
      }
  
      const generatedForm = await GeneratedForm.findOne({ where: { formId } });
      const formSubmission = await FormSubmission.findOne({ where: { formId } });
      const acknowledgement = await AcknowledgementForm.findOne({ where: { formId } });
  
      if (!generatedForm && !formSubmission && !acknowledgement) {
        res.status(404).json({ message: 'No records found for this formId' });
        return;
      }
  
      res.status(200).json({
        formId,
        generatedForm,
        formSubmission,
        acknowledgement,
      });
    } catch (error) {
      console.error('Error fetching full student data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Utility to fetch full student data by formId
const fetchStudentDataByFormId = async (formId: string) => {
    const generatedForm = await GeneratedForm.findOne({ where: { formId } });
    const formSubmission = await FormSubmission.findOne({ where: { formId } });
    const acknowledgement = await AcknowledgementForm.findOne({ where: { formId } });
  
    return {
      formId,
      generatedForm,
      formSubmission,
      acknowledgement,
    };
};
  
export const getAllPendingAcknowledgementForms = async (_req: Request, res: Response): Promise<void> => {
    try {
      const pendingAckForms = await AcknowledgementForm.findAll({ where: { status: 'pending' } });
  
      const results = await Promise.all(
        pendingAckForms.map((ack) => fetchStudentDataByFormId((ack as any).formId))
      );
  
      res.status(200).json({ count: results.length, data: results });
    } catch (error) {
      console.error('Error fetching pending acknowledgements:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};
  
export const getAllSubmittedAcknowledgementForms = async (_req: Request, res: Response): Promise<void> => {
    try {
      const submittedAckForms = await AcknowledgementForm.findAll({ where: { status: 'submitted' } });
  
      const results = await Promise.all(
        submittedAckForms.map((ack) => fetchStudentDataByFormId((ack as any).formId))
      );
  
      res.status(200).json({ count: results.length, data: results });
    } catch (error) {
      console.error('Error fetching submitted acknowledgements:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAllAcceptedAcknowledgementForms = async (_req: Request, res: Response): Promise<void> => {
    try {
      const acceptedAckForms = await AcknowledgementForm.findAll({ where: { status: 'accepted' } });
  
      const results = await Promise.all(
        acceptedAckForms.map((ack) => fetchStudentDataByFormId((ack as any).formId))
      );
  
      res.status(200).json({ count: results.length, data: results });
    } catch (error) {
      console.error('Error fetching accepted acknowledgements:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const markAcknowledgementFormAsAccepted = async (req: Request, res: Response): Promise<void> => {
    const { formId } = req.params;
  
    try {
      const ackForm = await AcknowledgementForm.findOne({ where: { formId } });
      const generatedForm = await GeneratedForm.findOne({ where: { formId } });
      const submission = await FormSubmission.findOne({ where: { formId } });
  
      if (!ackForm || !generatedForm || !submission) {
        res.status(404).json({ message: 'Acknowledgement form, submission, or generated form not found' });
        return;
      }
  
      if ((ackForm as any).status !== 'submitted') {
        res.status(400).json({
          message: 'Acknowledgement form must be in submitted state before accepting'
        });
        return;
      }
  
      const {
        form_accepted,
        form_disbursed,
        isRejected,
        acceptedAmount
      } = submission as any;
  
      if (!form_accepted || !form_disbursed || isRejected || !acceptedAmount || acceptedAmount <= 0) {
        res.status(400).json({
          message: 'Cannot accept acknowledgement. Ensure:\n• Form is accepted\n• Disbursed\n• Not rejected\n• Accepted amount > 0'
        });
        return;
      }
  
      // ✅ Update acknowledgement status
      await ackForm.update({ status: 'accepted' });
  
      // ✅ Mark case closed in related tables
      await submission.update({ form_case_closed: true });
      await generatedForm.update({ status: 'case closed' });
  
      res.status(200).json({
        message: `Acknowledgement form ${formId} marked as accepted and case closed.`,
        data: {
          formId,
          acknowledgement_status: 'accepted',
          case_closed: true
        }
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to accept and close acknowledgement form',
        error: error.message || error
      });
    }
};
  
export const revertAcknowledgementAcceptance = async (req: Request, res: Response): Promise<void> => {
    const { formId } = req.params;
  
    try {
      const ackForm = await AcknowledgementForm.findOne({ where: { formId } });
      const generatedForm = await GeneratedForm.findOne({ where: { formId } });
      const submission = await FormSubmission.findOne({ where: { formId } });
  
      if (!ackForm || !generatedForm || !submission) {
        res.status(404).json({ message: 'Form or data not found' });
        return;
      }
  
      if ((ackForm as any).status !== 'accepted') {
        res.status(400).json({
          message: 'Only accepted acknowledgements can be reverted'
        });
        return;
      }
  
      // ✅ Revert status to submitted
      await ackForm.update({ status: 'submitted' });
  
      // ✅ Revert case closed status
      await submission.update({ form_case_closed: false });
      await generatedForm.update({ status: 'disbursed' }); // Set it back to accepted
  
      res.status(200).json({
        message: `Acknowledgement ${formId} reverted to submitted.`,
        data: {
          formId,
          acknowledgement_status: 'submitted',
          case_closed: false
        }
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to revert acknowledgement form',
        error: error.message || error
      });
    }
};
