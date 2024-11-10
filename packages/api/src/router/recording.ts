// src/server/router/recording.ts
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const recordingRouter = router({
  // createRecording: protectedProcedure
  //   .input(
  //     z.object({
  //       label: z.string(),
  //       s3Link: z.string(),
  //       summary: z.string(),
  //       transcript: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const userId = ctx.userId;

  //     const recording = await ctx.prisma.recording.create({
  //       data: {
  //         label: input.label,
  //         s3Link: input.s3Link,
  //         summary: input.summary,
  //         transcript: input.transcript,
  //         userId,
  //       },
  //     });

  //     return recording;
  //   }),
  createRecordingChunk: protectedProcedure
    .input(
      z.object({
        chunkNumber: z.number(),
        recordingId: z.string(),
        supabaseUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recordingChunk = await ctx.prisma.recording.create({
        data: {
          chunkNumber: input.chunkNumber,
          clerkId: ctx.userId,
          recordingId: input.recordingId,
          supabaseUrl: input.supabaseUrl,
        },
      });

      return recordingChunk;
    }),

  getRecordingChunks: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const recordings = await ctx.prisma.recording.findMany({
        orderBy: { createdAt: "desc" },
        where: { clerkId: input.userId },
      });
      return recordings;
    }),
});
