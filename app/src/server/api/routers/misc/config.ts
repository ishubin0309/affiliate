import { protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { getConfig as _getConfig, settingFullModel } from "@/server/get-config";

export const getConfig = publicProcedure
  .output(settingFullModel)
  .query(async ({ ctx }) => {
    return _getConfig(ctx.prisma);
  });
