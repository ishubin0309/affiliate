import { withImageProxy } from "@blazity/next-image-proxy";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default withImageProxy({
  whitelistedPatterns: [/^https?:\/\/(go|partners|affiliate).(.*)/],
});
