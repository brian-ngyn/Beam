// packages/api/src/router/sms.ts

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

export const smsRouter = router({
  sendSms: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1),
        toPhoneNumbers: z.array(z.string().min(10).max(15)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { message, toPhoneNumbers } = input;
      // Initialize Twilio client
      try {
        // Send SMS via Twilio
        const promises: Promise<MessageInstance>[] = [];
        if (toPhoneNumbers.length) {
          toPhoneNumbers.forEach((to) =>
            promises.push(
              ctx.twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to,
              }),
            ),
          );
        }
        const res = await Promise.all(promises);
        return {
          message: "SMS sent successfully.",
          sid: res[0]?.sid,
          success: true,
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
