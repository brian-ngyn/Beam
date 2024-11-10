import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { recordingRouter } from "./recording";
import { liveStreamRouter } from "./liveStream";
import { inviteRouter } from "./invite";

export const appRouter = router({
  auth: authRouter,
  invite: inviteRouter,
  liveStream: liveStreamRouter,
  recording: recordingRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
