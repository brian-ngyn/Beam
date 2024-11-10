import { router } from "../trpc";
import { authRouter } from "./auth";
import { emergencyContactRouter } from "./emergencyContacts";
import { userRouter } from "./user";
import { recordingRouter } from "./recording";
import { liveStreamRouter } from "./liveStream";
import { inviteRouter } from "./invite";

export const appRouter = router({
  auth: authRouter,
  invite: inviteRouter,
  emergencyContacts: emergencyContactRouter,
  user: userRouter,
  recording: recordingRouter,
  liveStream: liveStreamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
