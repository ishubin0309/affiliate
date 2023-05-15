import type { AuthUser } from "./auth";
import axios from "axios";
import { env } from "@/env.mjs";

export const loginAccountCallToRemote = async (
  username: string,
  password: string
): Promise<AuthUser | null> => {
  const apiRes = await axios.post(
    `${env.NEXT_PUBLIC_API}/api/auth/bridge-to-db`,
    { username, password },
    {
      headers: {
        "x-api-key": process.env.ADMIN_SECRET,
      },
    }
  );

  console.log(`muly:loginAccountCallToRemote`, { data: apiRes.data });

  // TODO: Fix this
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return apiRes.data;
};
