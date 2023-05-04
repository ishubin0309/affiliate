import type { Configuration } from "@happykit/flags/config";
import { env } from "../env.mjs";

// You can replace this with your exact flag types
export type AppFlags = {
  enableBackdoorLogin: boolean;
  debugTopic: "none" | "billing";
};

export const config: Configuration<AppFlags> = {
  envKey: env.NEXT_PUBLIC_FLAGS_ENV_KEY,

  // You can provide defaults flag values here
  defaultFlags: {
    enableBackdoorLogin: false,
    debugTopic: "none",
  },
};
