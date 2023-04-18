import { Box, Flex, Image, Link, Stack, Text } from "@chakra-ui/react";
import { api } from "../../../utils/api";
import type { z } from "zod";
import { schema } from "../../../shared-types/forms/lost-password";
import { useTranslation } from "next-i18next";
import { usePrepareSchema } from "@/components/common/forms/usePrepareSchema";
import React from "react";
import { Form } from "@/components/common/forms/Form";

interface IProps {
  setIsSent: (open: boolean) => void;
}
export const RecoverLostPassword = ({ setIsSent }: IProps) => {
  const { t } = useTranslation("affiliate");
  const formContext = usePrepareSchema(t, schema);
  const mutation = api.affiliates.recoverPassword.useMutation();

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    // await mutation.mutateAsync(values);
    setIsSent(true);
    // setIsSent(false);
  };

  return (
    <div>
      <Form
        formContext={formContext}
        schema={schema}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit}
        formProps={{
          submit: { text: "Reset Password", notification: false },
        }}
      />
      {/* {!isSent && (
        <div className="mt-6">
          We have received your password reset request. If an account with the
          provided email address or user name exists, you will receive an email
          containing password reset instructions. Please check your inbox and
          follow the instructions to reset your password. If you don&apos;t see
          the email, make sure to check your spam or junk folders.
        </div>
      )} */}
    </div>
  );
};
