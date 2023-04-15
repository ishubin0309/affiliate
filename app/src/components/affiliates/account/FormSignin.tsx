import { Box, Flex, Link, Stack, Text } from "@chakra-ui/react";
import { Form } from "../../common/forms/Form";
import type { z } from "zod";
import { schema } from "../../../shared-types/forms/login";
import { signIn, useSession } from "next-auth/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

import { useState } from "react";
import NextLink from "next/link";
import { useTranslation } from "next-i18next";
import { usePrepareSchema } from "@/components/common/forms/usePrepareSchema";

// Sample user
// user001
// password user1

export const FormSignin = () => {
  const { t } = useTranslation("affiliate");
  const formContext = usePrepareSchema(t, schema);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    const callbackUrl = "/";
    setLoginError(null);

    const answer = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
      callbackUrl,
    });

    console.log(`muly:handleSubmit`, { answer });

    if (answer && !answer.ok && answer.error) {
      console.error(`authorize ERROR: ${answer.error}`);
      setLoginError(answer.error);
    }
  };

  console.log(`muly:FormSignin`, { session });

  return (
    <>
      <Form
        formContext={formContext}
        schema={schema}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit}
        formProps={{
          submit: {
            text: "Sign In",
            notification: false,
            className: "w-full mt-6",
          },
          link: {
            linkText: "Forgot your password?",
            routePath: "/auth/lost-password",
          },
          // haveLink={true}
        }}
      ></Form>
      <div className="mt-10 mb-10 text-center">
        Don’t have an account yet?
        <Link
          className="ml-1 inline-block font-bold text-primary"
          key={"/auth/signup"}
          as={NextLink}
          href={"/auth/signup"}
        >
          Sign Up
        </Link>
      </div>
      <hr />
      <div className="mt-10 text-center">
        Are you an admin?
        <Link
          className="ml-1 inline-block font-bold text-primary"
          // key={"/auth/signup"}
          // as={NextLink}
          // href={"/auth/signup"}
        >
          Sign In here
        </Link>
      </div>
      {!!loginError && (
        <Alert status="error">
          <AlertIcon />
          {loginError}
        </Alert>
      )}
    </>
  );
};
