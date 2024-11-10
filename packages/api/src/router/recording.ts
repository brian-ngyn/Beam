// src/server/router/recording.ts
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { v4 as uuidv4 } from "uuid";
import { promisify } from "util";
import { join } from "path";
import { writeFile, readFile } from "fs/promises";
import { exec } from "child_process";

const execAsync = promisify(exec);

export const recordingRouter = router({
  clearRecordingChunks: protectedProcedure.mutation(async ({ ctx }) => {
    const { data: filesToDelete } = await ctx.supabaseClient.storage
      .from("videos")
      .list(`${ctx.userId}/`);
    if (filesToDelete?.length) {
      await ctx.supabaseClient.storage
        .from("videos")
        .remove(filesToDelete.map((file) => `${ctx.userId}/${file.name}`));
    }
    await ctx.prisma.recording.deleteMany({
      where: {
        clerkId: ctx.userId,
      },
    });
  }),
  createFullyStichedVideo: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;

    const recording = await ctx.prisma.recording.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!recording) {
      throw new Error("No recording found");
    }

    const recordingChunks = await ctx.prisma.recording.findMany({
      where: {
        clerkId: userId,
      },
    });
    const urls = recordingChunks.map((chunk) => chunk.supabaseUrl);

    const jobId = uuidv4();
    const tempDir = "./";
    const outputFormat = "mov";

    const concatFilePath = join(tempDir, `${jobId}_concat.txt`);
    const outputPath = join(tempDir, `${jobId}_output.${outputFormat}`);

    // Download all videos and create paths list
    const downloadPromises = urls.map(async (url, index) => {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const tempFilePath = join(tempDir, `${jobId}_video_${index}.mov`);
      await writeFile(tempFilePath, Buffer.from(buffer));
      return tempFilePath;
    });

    const videoFiles = await Promise.all(downloadPromises);

    // Create concat file for ffmpeg
    const concatContent = videoFiles.map((file) => `file '${file}'`).join("\n");
    await writeFile(concatFilePath, concatContent);

    // Execute ffmpeg command to concatenate videos
    const ffmpegCommand = `ffmpeg -f concat -safe 0 -i "${concatFilePath}" -c copy "${outputPath}"`;
    await execAsync(ffmpegCommand);

    // Read the output file and create blob
    const outputBuffer = await readFile(outputPath);
    const blob = new Blob([outputBuffer], { type: `video/${outputFormat}` });

    // Clean up temporary files
    await Promise.all([
      ...videoFiles.map((file) => execAsync(`rm "${file}"`)),
      execAsync(`rm "${concatFilePath}"`),
      execAsync(`rm "${outputPath}"`),
    ]);

    const { error } = await ctx.supabaseClient.storage
      .from("fullVideos")
      .upload(`${ctx.userId}/0.mov`, blob, {
        cacheControl: "3600",
        upsert: true,
      });
    console.error(error)

    return blob;
  }),

  createRecordingChunk: protectedProcedure
    .input(
      z.object({
        chunkNumber: z.number(),
        chunkPath: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recordingChunk = await ctx.prisma.recording.create({
        data: {
          chunkNumber: input.chunkNumber,
          clerkId: ctx.userId,
          supabaseUrl: `https://ubsqqcchbqdvjhlyrpic.supabase.co/storage/v1/object/public/videos/${input.chunkPath}`,
        },
      });

      // call python abod
      // ee.emit("newRecordingChunk", ctx.userId, recordingChunk);

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
