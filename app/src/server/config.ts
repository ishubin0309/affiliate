import * as z from "zod";
import type { PrismaClient } from "@prisma/client";
import { settingsModel } from "../../prisma/zod";
import { env } from "@/env.mjs";

export const settingFullModel = settingsModel.extend({
  dashboard_host: z.string(),
  legacy_host: z.string(),
});

type Settings = z.infer<typeof settingFullModel>;

let settings: Settings;

export const getConfig = async (prisma: PrismaClient): Promise<Settings> => {
  const dashboard_host = env.NEXTAUTH_URL;
  const legacy_host = env.LEGACY_PHP_URL;

  if (!settings) {
    settings = {
      ...(await prisma.settings.findFirstOrThrow()),
      dashboard_host,
      legacy_host,
    };
  }

  return settings;
};
