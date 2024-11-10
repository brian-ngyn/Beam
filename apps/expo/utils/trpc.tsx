import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@shared/api";
import Constants from "expo-constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  httpBatchLink,
  loggerLink,
  splitLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client";
import { transformer } from "@shared/api/transformer";
import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export const trpc = createTRPCReact<AppRouter>();
export const supabase = createClient(
  Constants.expoConfig?.extra?.SUPABASE_URL,
  Constants.expoConfig?.extra?.SUPABASE_ANON_KEY,
);

const getBaseUrl = () => {
  const localhost = Constants.expoConfig?.hostUri?.split(":")[0];
  if (!localhost)
    throw new Error("failed to get localhost, configure it manually");
  return `http://${localhost}:3000`;
};

export const TRPCProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        splitLink({
          condition: (op) => op.type === "subscription",
          false: httpBatchLink({
            async headers() {
              const token = await getToken();
              return {
                authorization: `Bearer ${token}`,
              };
            },
            /**
             * @see https://trpc.io/docs/v11/data-transformers
             */
            transformer: transformer,
            url: `${getBaseUrl()}/api/trpc`,
          }),
          true: unstable_httpSubscriptionLink({
            /**
             * @see https://trpc.io/docs/v11/data-transformers
             */
            transformer: transformer,
            url: `${getBaseUrl()}/api/trpc`,
          }),
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
