import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const postRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  create: protectedProcedure
    .input(z.object({ content: z.string(), title: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({ data: input });
    }),
});
