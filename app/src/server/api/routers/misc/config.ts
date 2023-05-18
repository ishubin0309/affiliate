import { protectedProcedure } from "@/server/api/trpc";
import { getConfig as _getConfig, settingFullModel } from "@/server/config";

export const getConfig = protectedProcedure
  .output(settingFullModel)
  .query(async ({ ctx }) => {
    return _getConfig(ctx.prisma);
  });
