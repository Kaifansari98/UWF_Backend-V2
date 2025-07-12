// src/services/formSubmission.service.ts
import FormSubmission from "../models/formSubmission.model";
import GeneratedForm from "../models/generatedForm.model";
import AcknowledgementForm from "../models/acknowledgementForm.model";
import { Op, literal } from "sequelize";

export const updateAcceptedAmountService = async (formId: string, amount: number) => {
  if (!amount || isNaN(amount)) {
    throw new Error("Valid amount is required");
  }

  const form = await GeneratedForm.findOne({ where: { formId } });
  if (!form || form.status !== "accepted") {
    throw new Error("Form must be in 'accepted' state to update amount");
  }

  const submission = await FormSubmission.findOne({ where: { formId } });
  if (!submission) {
    throw new Error("Form submission not found");
  }

  // ✅ Store plain number without comma formatting
  await submission.update({ acceptedAmount: amount });

  return amount;
};

export const getPaymentInProgressFormsService = async () => {
  return await FormSubmission.findAll({
    where: {
      acceptedAmount: {
        [Op.not]: null,
      },
      form_disbursed: false, // ✅ only fetch if not disbursed
    },
    include: [
      {
        model: GeneratedForm,
        where: {
          status: "accepted",
        },
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
};

export const markFormAsDisbursedService = async (formId: string) => {
  const submission = await FormSubmission.findOne({
    where: {
      formId,
      acceptedAmount: { [Op.not]: null },
      isRejected: false,
    },
    include: [
      {
        model: GeneratedForm,
        as: "GeneratedForm",
        where: { status: "accepted" },
      },
    ],
  });

  if (!submission) {
    throw new Error("Eligible form not found or doesn't meet the conditions");
  }

  (submission as any).form_disbursed = true;
  await submission.save();

  return {
    formId,
    form_disbursed: true,
  };
};

export const getDisbursedFormsService = async () => {
  return await FormSubmission.findAll({
    where: {
      acceptedAmount: { [Op.not]: null },
      form_disbursed: true,
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
};

export const getAllDisbursedDataService = async () => {
  // Step 1: Get all acknowledged formIds
  const acknowledgedFormIds = await AcknowledgementForm.findAll({
    attributes: ['formId'],
    raw: true,
  });

  const excludedFormIds = acknowledgedFormIds.map((entry) => (entry as any).formId);

  // Step 2: Return disbursed forms that are NOT in the above list
  return await FormSubmission.findAll({
    where: {
      acceptedAmount: { [Op.not]: null },
      form_accepted: true,
      form_disbursed: true,
      isRejected: false,
      formId: {
        [Op.notIn]: excludedFormIds.length ? excludedFormIds : [''], // avoids SQL error on empty array
      },
    },
    include: [
      {
        model: GeneratedForm,
        where: {
          status: "disbursed",
        },
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
};

// Helper to extract region initial and suffix
const parseFormId = (formId: string) => {
  const regionInitial = formId.charAt(0); // e.g. "J"
  const suffix = formId.slice(-4);        // e.g. "0001"
  return { regionInitial, suffix };
};

export const getAllUniqueNewStudentSubmissions = async () => {
  // Get all non-pending submissions with their generated form
  const all = await FormSubmission.findAll({
    include: [
      {
        model: GeneratedForm,
        where: {
          status: { [Op.ne]: "pending" },
        },
      },
    ],
  });

  const seenKeys = new Set<string>();
  const uniqueNewStudentForms: any[] = [];

  for (const submission of all) {
    const formId = (submission as any).formId;
    const { regionInitial, suffix } = parseFormId(formId);
    const key = `${regionInitial}-${suffix}`;
  
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueNewStudentForms.push(submission);
    }
  }  

  return uniqueNewStudentForms;
};