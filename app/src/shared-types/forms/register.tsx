import { z } from "zod";
import { schema as accountSchema } from "./account";
import { imUserTypes, numericCheckbox } from "./common";
import { LanguageSelectList } from "@/components/Dropdowns/LanguageSelectList";
import Link from "next/link";

export const schema = z
  .object({
    username: z.string().describe("Username"),
    password: z.string().describe("Password").meta({ type: "password" }),

    first_name: z.string().describe("First Name"),
    last_name: z.string().describe("Last Name"),
    mail: z.string().email().describe("Email"),
    // passwordRepeat: z.string().describe("Repeat Password"),
    phone: z.string().describe("Phone Number"),
    IMUserType: z
      .string()
      .describe("Instant Message Type // Choose IM Type")
      .default("")
      .meta({ choices: imUserTypes }),
    IMUser: z.string().describe("IM Account").default(""),
    lang: z
      .string()
      .describe("Language")
      .meta({ control: () => <LanguageSelectList /> }),
    company: z.string().describe("Company Name").default(""),
    website: z.string().url().describe("Website"),
    approvedTerms: z.coerce
      .number()
      .min(0)
      .max(1)
      .refine((v) => v === 1, {
        message: "You must accept the terms of service",
      })

      .meta({
        label: () => (
          <>
            I have read and accepted the{" "}
            <Link href="auth/terms">
              <span>Terms of Service</span>
            </Link>
          </>
        ),
        control: "Checkbox",
        choices: ["0", "1"],
        className: "col-span-2",
      }),
    // newsletter: numericCheckbox.describe(
    //   "Yes, I would like to receive the Affiliate newsletter"
    // ),
  })
  // .refine(
  //   ({ passwordRepeat, password }) => {
  //     return (password || "") === (passwordRepeat || "");
  //   },
  //   {
  //     message: "Passwords do not match. Please re-enter your passwords.",
  //     path: ["passwordRepeat"],
  //   }
  // )
  .meta({ className: "md:grid md:grid-cols-2 gap-x-6 gap-y-4" });