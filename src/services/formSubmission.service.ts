// src/services/formSubmission.service.ts
import FormSubmission from "../models/formSubmission.model";
import GeneratedForm from "../models/generatedForm.model";
import { Op } from "sequelize";

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
  return await FormSubmission.findAll({
    where: {
      acceptedAmount: { [Op.not]: null },
      form_accepted: true,
      form_disbursed: true,
      isRejected: false,
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