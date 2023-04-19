import { Form } from "@/components/common/forms/Form";
import { usePrepareSchema } from "@/components/common/forms/usePrepareSchema";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import type { z } from "zod";
import { schema } from "../../../shared-types/forms/register";
import { api } from "../../../utils/api";
export const FormSignup = () => {
  const router = useRouter();
  const { t } = useTranslation("affiliate");
  const formContext = usePrepareSchema(t, schema);
  // const { data: languages } = api.misc.getLanguages.useQuery();

  const registerAccount = api.affiliates.registerAccount.useMutation();
  const handleSubmit = async (values: z.infer<typeof schema>) => {
    await registerAccount.mutateAsync(values);
    void router.replace(`/`);
  };

  return (
    <div>
      {/* <div className="mt-20 mb-16 flex flex-col items-center text-4xl text-black md:mt-28 md:mb-24">
        Register to Your
        <div className="flex items-center">
          <Image className="mt-2" src="/img/logo.png" width="28" alt="Logo" />
          <span className="ml-3 text-black">account</span>
        </div>
      </div> */}

      <Form
        formContext={formContext}
        schema={schema}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        formProps={{ submit: { text: "Sign Up", notification: false } }}
        onSubmit={handleSubmit}
      />
      <div className="mt-6 mb-6 text-center">
        Already have an account?
        <Link
          className="ml-1 inline-block font-bold text-primary"
          href="/auth/signin"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};
