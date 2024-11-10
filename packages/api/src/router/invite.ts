// src/server/router/invite.ts

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const inviteRouter = router({
  acceptInvite: protectedProcedure
    .input(
      z.object({
        fromClerkId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const toUserId = ctx.userId;

      const invite = await ctx.prisma.invite.findFirst({
        where: {
          fromClerkId: input.fromClerkId,
          toClerkId: toUserId,
        },
      });

      if (invite) {
        await ctx.prisma.invite.delete({
          where: {
            id: invite.id,
          },
        });
        await ctx.prisma.emergencyContact.create({
          data: {
            clerkId: ctx.userId,
            contactClerkId: input.fromClerkId,
          },
        });
        await ctx.prisma.emergencyContact.create({
          data: {
            clerkId: input.fromClerkId,
            contactClerkId: ctx.userId,
          },
        });
      }
    }),

  listReceivedInvites: protectedProcedure.query(async ({ ctx }) => {
    const toUserId = ctx.userId;

    const invites = await ctx.prisma.invite.findMany({
      where: {
        toClerkId: toUserId,
      },
    });

    return invites;
  }),

  rejectInvite: protectedProcedure
    .input(
      z.object({
        fromClerkId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const toUserId = ctx.userId;

      const invite = await ctx.prisma.invite.findFirst({
        where: {
          fromClerkId: input.fromClerkId,
          toClerkId: toUserId,
        },
      });
      if (invite) {
        await ctx.prisma.invite.delete({
          where: {
            id: invite.id,
          },
        });
      }
    }),

  sendInvite: protectedProcedure
    .input(
      z.object({
        idToSendInviteTo: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingInite = await ctx.prisma.invite.findFirst({
        where: {
          fromClerkId: ctx.userId,
          toClerkId: input.idToSendInviteTo,
        },
      });
      if (!existingInite) {
        await ctx.prisma.invite.create({
          data: {
            fromClerkId: ctx.userId,
            toClerkId: input.idToSendInviteTo,
          },
        });
      }
    }),
});
