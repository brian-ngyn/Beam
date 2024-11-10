// src/server/router/liveStream.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const liveStreamRouter = router({
    getLiveStream: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
        })
      )
      .query(async ({ ctx, input }) => {
        const liveStream = await ctx.prisma.liveStream.findUnique({
          where: { userId: input.userId },
        });
        if (!liveStream) {
          throw new Error('Live stream not found for this user.');
        }
        return liveStream;
      }),

      startLiveStream: protectedProcedure
    .input(
      z.object({
        uid: z.string(),
        link: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      // Check if user already has an active live stream
      const existingStream = await ctx.prisma.liveStream.findUnique({
        where: { userId },
      });

      if (existingStream) {
        throw new Error('You already have an active live stream.');
      }

      // Create new live stream
      const liveStream = await ctx.prisma.liveStream.create({
        data: {
          uid: input.uid,
          link: input.link,
          userId,
        },
      });

      return liveStream;
    }),

  endLiveStream: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;

    // Delete the live stream
    await ctx.prisma.liveStream.delete({
      where: { userId },
    });

    return { message: 'Live stream ended.' };
  }),
  });
  