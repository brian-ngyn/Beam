// @ts-check
import { z } from "zod";

export const serverSchema = z.object({
  CLERK_SECRET_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

export const clientSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
});

export const clientEnv = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
};
