import type { MailDataRequired } from "@sendgrid/mail";
import sgMail from "@sendgrid/mail";
import { env } from "@/env.mjs";

sgMail.setApiKey(env.SENDGRID_API_KEY);

const EMAIL_SUPPORT = "marketing@affiliatets.com";

export const sendgridEmailTemplates = {
  // verificationCode: "d-b9383307af154b15a91cf00d70f70a9f",
  resetPassword: "d-ad050cf206134ba0b728d08fa19fd2e5",
};

const sendEmail = async (
  email: string,
  templateId: string,
  data: object
): Promise<boolean> => {
  try {
    if (!email) {
      throw new Error("Invalid email address");
    }

    const msg: MailDataRequired = {
      to: email,
      from: EMAIL_SUPPORT,
      templateId,
      dynamicTemplateData: data,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }
};

export const sentEmailTemplate = async (
  email: string,
  emailTemplate: keyof typeof sendgridEmailTemplates,
  values: Record<string, any>
): Promise<boolean> => {
  console.log(`muly:setEmailByTemplate ${emailTemplate}`, { values });
  return sendEmail(email, sendgridEmailTemplates[emailTemplate], values);
};
