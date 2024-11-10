// src/server/router/invite.ts

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const inviteRouter = router({
  sendInvite: protectedProcedure
    .input(
      z.object({
        toUserId: z.number(),
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

      // Now allow the sender to add the recipient as an emergency contact
      // This could be done automatically here or require the sender to manually add them

      return { message: 'Invite accepted.' };
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

  listReceivedInvites: protectedProcedure.query(async ({ ctx }) => {
    const toUserId = ctx.userId;

    const invites = await ctx.prisma.invite.findMany({
      where: {
        toId: toUserId,
        status: 'PENDING',
      },
      include: {
        from: true,
      },
    });

    return invites;
  }),
});
