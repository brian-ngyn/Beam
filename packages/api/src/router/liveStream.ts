// src/server/router/liveStream.ts
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const liveStreamRouter = router({
  endLiveStream: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;

    // Delete the live stream
    await ctx.prisma.liveStream.delete({
      where: { userId },
    });

    return { message: "Live stream ended." };
  }),

  getCommunityMembersWithLiveStream: protectedProcedure.query(
    async ({ ctx }) => {
      const userId = ctx.userId;

      // Get community members of the user
      const communityMembers1 = await ctx.prisma.emergencyContact.findMany({
        where: { contactClerkId: userId },
      });
      const communityMembers2 = await ctx.prisma.emergencyContact.findMany({
        where: { clerkId: userId },
      });
      //remove duplicates from 1 and 2
      const communityMembers = [
        ...new Map(
          [...communityMembers1, ...communityMembers2].map((item) => [
            item["clerkId"],
            item,
          ]),
        ).values(),
      ].filter((member) => member.clerkId !== userId);

      // Check if community members have live streams
      const communityMembersWithLiveStream = ctx.prisma.user.findMany({
        where: {
          clerkId: {
            in: communityMembers.map((member) => member.clerkId),
          },
          isLivestreaming: true,
        },
      });
      return communityMembersWithLiveStream;
    },
  ),

  getLiveStream: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const liveStream = await ctx.prisma.liveStream.findUnique({
        where: { userId: input.userId },
      });
      if (!liveStream) {
        throw new Error("Live stream not found for this user.");
      }
      return liveStream;
    }),
  startLiveStream: protectedProcedure
    .input(
      z.object({
        link: z.string(),
        uid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      // Check if user already has an active live stream
      const existingStream = await ctx.prisma.liveStream.findUnique({
        where: { userId },
      });

      if (existingStream) {
        throw new Error("You already have an active live stream.");
      }

      // Create new live stream
      const liveStream = await ctx.prisma.liveStream.create({
        data: {
          link: input.link,
          uid: input.uid,
          userId,
        },
      });

      return liveStream;
    }),
});
