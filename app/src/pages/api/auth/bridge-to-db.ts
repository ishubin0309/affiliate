import type { NextApiRequest, NextApiResponse } from "next";
import { loginAccount } from "@/server/auth-affiliates-login";
import { prisma } from "@/server/db";
import * as z from "zod";

const UserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(404).end();
  if (req.headers["x-api-key"] !== process.env.ADMIN_SECRET) {
    throw new Error("Bad api-key");
  }

  const { username, password } = UserSchema.parse(req.body);

  const user = await loginAccount(prisma, username, password);

  console.log(`muly:handler`, { user });

  return user;
}
