import { FLAGS } from "@prisma/client";
import { trpc } from "../utils/trpc";
import { useCallback, useEffect } from "react";
import { RouterOutput } from "@shared/api";

export type UseFeatureFlagsReturnType = {
  flags: RouterOutput["featureFlags"]["getFlags"] | undefined;
  getFlag: (flagName: FLAGS) => boolean | undefined;
};

export const useFeatureFlags = (): UseFeatureFlagsReturnType => {
  const flags = trpc.featureFlags.getFlags.useQuery(undefined, {
    gcTime: Infinity,
  });

  const getFlag = useCallback(
    (flagName: FLAGS) => {
      return flags.data?.find((flag) => flag.flagName === flagName)?.isEnabled;
    },
    [flags.data],
  );

  return {
    flags: flags.data,
    getFlag,
  };
};
