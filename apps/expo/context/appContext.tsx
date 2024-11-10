import React from "react";
import { createContext, PropsWithChildren, useContext } from "react";
import {
  useFeatureFlags,
  UseFeatureFlagsReturnType,
} from "../hooks/useFeatureFlags";
import LandingScreen from "../app/landingScreen";
import { useUser } from "@clerk/clerk-expo";

type AppContextReturnType = {
  featureFlags: UseFeatureFlagsReturnType;
};

const AppContext = createContext<AppContextReturnType>(
  {} as AppContextReturnType,
);

export function AppContextProvider({ children }: PropsWithChildren) {
  const flags = useFeatureFlags();
  const { user } = useUser();
  return (
    <AppContext.Provider value={{ featureFlags: flags }}>
      {user?.id ? <>{children}</> : <LandingScreen />}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextReturnType {
  return useContext(AppContext);
}
