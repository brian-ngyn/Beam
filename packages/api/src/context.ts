import { prisma } from "../../db";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { createClerkClient, getAuth } from "@clerk/nextjs/server";
import type { AuthObject } from "@clerk/backend";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type AuthContextProps = {
  auth: AuthObject;
};

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async ({ auth }: AuthContextProps) => {
  return {
    auth,
    clerkClient,
    prisma,
    supabaseClient,
    twilioClient,
    userId: auth.userId,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  const session = getAuth(opts.req);
  const contextInner = await createContextInner({ auth: session });

  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
    userId: session.userId, // Add userId property
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
