import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  createUser: protectedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        email: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { clerkId: input.clerkId },
      });
      if (!existingUser) {
        const user = await ctx.prisma.user.create({
          data: {
            clerkId: input.clerkId,
            email: input.email,
            name: input.name,
          },
        });
        return user;
      }
      return existingUser;
    }),

  updateUser: protectedProcedure.input(z.object({ phoneNumber: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.user.update({
      where: { clerkId: ctx.userId },
      data: {
        phoneNumber: input.phoneNumber
      }
    })
  }),

  getAllClerkUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.clerkClient.users.getUserList();
    return users.data.map((user) => ({
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      id: user.id,
      imageUrl: user.hasImage ? user.imageUrl : undefined,
      lastName: user.lastName,
      publicMetadata: user.publicMetadata,
      role: user.publicMetadata?.role,
      username: user.username,
    }));
  }),

  getUser: protectedProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.userId;
    const user = await ctx.prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  }),
  listCommunityMembers: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

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

    return communityMembers;
  }),
  removeCommunityMember: protectedProcedure
    .input(z.object({ clerkIdToRemove: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const emergencyContact = await ctx.prisma.emergencyContact.findFirst({
        where: {
          clerkId: userId,
          contactClerkId: input.clerkIdToRemove,
        },
      });
      if (emergencyContact) {
        await ctx.prisma.emergencyContact.delete({
          where: { id: emergencyContact.id },
        });
      }
      const emergencyContact1 = await ctx.prisma.emergencyContact.findFirst({
        where: {
          clerkId: input.clerkIdToRemove,
          contactClerkId: userId,
        },
      });
      if (emergencyContact1) {
        await ctx.prisma.emergencyContact.delete({
          where: { id: emergencyContact1.id },
        });
      }
    }),
});
