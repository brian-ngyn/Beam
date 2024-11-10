import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { featureFlagsRouter } from "./featureFlags";
import { emergencyContactRouter } from "./emergencyContacts";
import { userRouter } from "./user";
import { recordingRouter } from "./recording";
import { liveStreamRouter } from "./liveStream";
import { inviteRouter } from './invite';

export const appRouter = router({
  auth: authRouter,
  featureFlags: featureFlagsRouter,
  post: postRouter,
  invite: inviteRouter,
  emergencyContacts: emergencyContactRouter,
  user: userRouter,
  recording: recordingRouter,
  liveStream: liveStreamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
