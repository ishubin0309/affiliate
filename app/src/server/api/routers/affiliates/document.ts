import { z } from "zod";

import { protectedProcedure } from "../../trpc";
import { documentsModel } from "../../../../../prisma/zod";
import { documents_type, documents_doc_status } from "@prisma/client";
import { upsertSchema } from "../../../../../prisma/zod-add-schema";
import { serverStoragePath } from "@/components/utils";
import { checkIsUser } from "@/server/api/utils";

export const getDocuments = protectedProcedure.query(async ({ ctx }) => {
  const affiliate_id = checkIsUser(ctx);
  const data = await ctx.prisma.documents.findMany({
    where: {
      affiliate_id,
    },
  });

  return data.map(({ path, ...rest }) => ({
    ...rest,
    path: serverStoragePath(path),
  }));
});
