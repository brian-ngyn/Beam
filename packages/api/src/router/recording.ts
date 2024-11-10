// src/server/router/recording.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const recordingRouter = router({
    getRecordings: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
        })
      )
      .query(async ({ ctx, input }) => {
        const recordings = await ctx.prisma.recording.findMany({
          where: { userId: input.userId },
          orderBy: { timestamp: 'desc' },
        });
        return recordings;
      }),

      createRecording: protectedProcedure
      .input(
        z.object({
          label: z.string(),
          s3Link: z.string(),
          transcript: z.string(),
          summary: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.userId;
  
        const recording = await ctx.prisma.recording.create({
          data: {
            label: input.label,
            s3Link: input.s3Link,
            transcript: input.transcript,
            summary: input.summary,
            userId,
          },
        });
  
        return recording;
      }),
  });
  