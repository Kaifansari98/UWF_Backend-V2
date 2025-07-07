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