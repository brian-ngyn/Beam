// src/server/router/emergencyContact.ts

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const emergencyContactRouter = router({
  addEmergencyContact: protectedProcedure
    .input(
      z.object({
        contactId: z.number(), // Use z.string().uuid() if using UUIDs
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId; // From middleware

      // Check if the user already has 3 emergency contacts
      const contactCount = await ctx.prisma.emergencyContact.count({
        where: { userId },
      });

      if (contactCount >= 3) {
        throw new Error("You can only have up to 3 emergency contacts.");
      }

      // Check if the contact is already added
      const existingContact = await ctx.prisma.emergencyContact.findUnique({
        where: {
          userId_contactId: {
            userId,
            contactId: input.contactId,
          },
        },
      });

      if (existingContact) {
        throw new Error(
          "This contact is already added as an emergency contact.",
        );
      }

      // Add the emergency contact
      const newContact = await ctx.prisma.emergencyContact.create({
        data: {
          userId,
          contactId: input.contactId,
        },
      });

      return newContact;
    }),

  removeEmergencyContact: protectedProcedure
    .input(
      z.object({
        contactId: z.number(), // Use z.string().uuid() if using UUIDs
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      // Delete the emergency contact
      const deletedContact = await ctx.prisma.emergencyContact.delete({
        where: {
          userId_contactId: {
            userId,
            contactId: input.contactId,
          },
        },
      });

      return deletedContact;
    }),

  listEmergencyContacts: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    const contacts = await ctx.prisma.emergencyContact.findMany({
      where: { userId },
      include: {
        contact: true,
      },
    });

    // Return only the contact details
    return contacts.map((ec: { contact: any }) => ec.contact);
  }),
});
