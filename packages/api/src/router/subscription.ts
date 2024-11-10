import EventEmitter, { on } from "events";
import { z } from "zod";

import { type Recording } from "@prisma/client";
import { type TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export interface MyEvents {
  newRecordingChunk: (clerkId: string, data: Recording) => void;
}

class MyEventEmitter extends EventEmitter {
  public toIterable<TEv extends keyof MyEvents>(
    event: TEv,
    opts: NonNullable<Parameters<typeof on>[2]>,
  ): AsyncIterable<Parameters<MyEvents[TEv]>> {
    return on(this, event, opts) as AsyncIterable<Parameters<MyEvents[TEv]>>;
  }
}

export const ee = new MyEventEmitter();

export const subscriptionRouter = {
  newRecordingChunk: protectedProcedure
    .input(
      z.object({
        clerkId: z.string(),
      }),
    )
    .subscription(async function* (opts) {
      function* maybeYield(incomingMessage: Recording) {
        yield incomingMessage;
      }

      for await (const [clerkId, message] of ee.toIterable(
        "newRecordingChunk",
        {
          signal: opts.signal,
        },
      )) {
        if (clerkId === opts.input.clerkId) {
          yield* maybeYield(message);
        }
      }
    }),
} satisfies TRPCRouterRecord;
