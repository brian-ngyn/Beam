import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { featureFlagsRouter } from "./featureFlags";

export const appRouter = router({
  auth: authRouter,
  featureFlags: featureFlagsRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
