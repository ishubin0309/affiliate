import { z } from "zod";
import Link from "next/link";
import React from "react";

export const schema = z.object({
  username: z.string().describe("Username"),
  password: z
    .string()
    .describe("Password")
    .meta({
      type: "password",
      afterElement: () => (
        <div className="mt-4 mb-4 flex w-full justify-end">
          <Link
            className="ml-1 inline-block font-bold "
            href="/auth/lost-password"
          >
            Forgot your password?
          </Link>
        </div>
      ),
    }),
});
