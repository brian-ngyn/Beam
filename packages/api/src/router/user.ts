
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const userRouter = router({
  sendInvite: protectedProcedure
    .input(
      z.object({
        toUserId: z.number(), // Adjust to z.string() if using UUIDs
      })
    )
    .mutation(async ({ ctx, input }) => {
      const fromUserId = ctx.userId;

      // Check if invite already exists
      const existingInvite = await ctx.prisma.invite.findUnique({
        where: {
          fromId_toId: {
            fromId: fromUserId,
            toId: input.toUserId,
          },
        },
      });

      if (existingInvite) {
        throw new Error('Invite already sent to this user.');
      }

      // Create the invite
      const invite = await ctx.prisma.invite.create({
        data: {
          fromId: fromUserId,
          toId: input.toUserId,
          status: 'PENDING',
        },
      });

      return invite;
    }),

    getUser: protectedProcedure
    .input(
      z.object({
        userId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.userId;
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        include: {
          recordings: true,
          liveStream: true,
          emergencyContacts: {
            include: { contact: true },
          },
          sentInvites: {
            include: { to: true },
          },
          receivedInvites: {
            include: { from: true },
          },
        },
      });
      if (!user) {
        throw new Error('User not found.');
      }
      return user;
    }),

    acceptInvite: protectedProcedure
    .input(
      z.object({
        fromUserId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const toUserId = ctx.userId;

      const invite = await ctx.prisma.invite.findUnique({
        where: {
          fromId_toId: {
            fromId: input.fromUserId,
            toId: toUserId,
          },
        },
      });

      if (!invite || invite.status !== 'PENDING') {
        throw new Error('Invite not found or already processed.');
      }

      // Update invite status to ACCEPTED
      await ctx.prisma.invite.update({
        where: {
          fromId_toId: {
            fromId: input.fromUserId,
            toId: toUserId,
          },
        },
        data: { status: 'ACCEPTED' },
      });

      // Add as emergency contact
      await ctx.prisma.emergencyContact.create({
        data: {
          userId: input.fromUserId,
          contactId: toUserId,
        },
      });

      return { message: 'Invite accepted and emergency contact added.' };
    }),

  rejectInvite: protectedProcedure
    .input(
      z.object({
        fromUserId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const toUserId = ctx.userId;

      const invite = await ctx.prisma.invite.findUnique({
        where: {
          fromId_toId: {
            fromId: input.fromUserId,
            toId: toUserId,
          },
        },
      });

      if (!invite || invite.status !== 'PENDING') {
        throw new Error('Invite not found or already processed.');
      }

      // Update invite status to REJECTED
      await ctx.prisma.invite.update({
        where: {
          fromId_toId: {
            fromId: input.fromUserId,
            toId: toUserId,
          },
        },
        data: { status: 'REJECTED' },
      });

      return { message: 'Invite rejected.' };
    }),
});
