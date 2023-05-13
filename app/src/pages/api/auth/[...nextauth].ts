import NextAuth from "next-auth";
import { authOptions } from "../../../server/auth";

import cors from "cors";
import { createRouter, expressWrapper } from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

const router = createRouter<NextApiRequest, NextApiResponse>();

router
  .use(
    cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] })
  )
  .all(NextAuth(authOptions));

export default router.handler();
