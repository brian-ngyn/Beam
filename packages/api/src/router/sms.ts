// packages/api/src/router/sms.ts

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import twilio from "twilio";

export const smsRouter = router({
  sendSms: protectedProcedure
    .input(
      z.object({
        toPhoneNumber: z.string().min(10).max(15),
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const { toPhoneNumber, message } = input;

      // Initialize Twilio client
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );

      try {
        // Send SMS via Twilio
        const response = await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: toPhoneNumber,
        });

        return {
          success: true,
          sid: response.sid,
          message: "SMS sent successfully.",
        };
      } catch (error) {
        console.error("Error sending SMS:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send SMS.",
        });
      }
    }),
});
