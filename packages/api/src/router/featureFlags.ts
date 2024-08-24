import { protectedProcedure, router } from "../trpc";

export const featureFlagsRouter = router({
  getFlags: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.featureFlags.findMany();
  }),
});
