import React, { useEffect } from "react";
import { createContext, PropsWithChildren, useContext } from "react";
import LandingScreen from "../app/landingScreen";
import { useUser } from "@clerk/clerk-expo";
import { trpc } from "../utils/trpc";
import { RouterOutput } from "@shared/api";

type AppContextReturnType = {
  allClerkUsers: RouterOutput["user"]["getAllClerkUsers"] | undefined;
  allDbUsers: RouterOutput["user"]["getAllDbUsers"] | undefined;
};

const AppContext = createContext<AppContextReturnType>(
  {} as AppContextReturnType,
);

export function AppContextProvider({ children }: PropsWithChildren) {
  const { user } = useUser();

  const addUserToDb = trpc.user.createUser.useMutation();
  const allClerkUsers = trpc.user.getAllClerkUsers.useQuery();
  const allDbUsers = trpc.user.getAllDbUsers.useQuery();

  useEffect(() => {
    if (user?.id) {
      addUserToDb.mutate({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <AppContext.Provider
      value={{ allClerkUsers: allClerkUsers.data, allDbUsers: allDbUsers.data }}
    >
      {user?.id ? <>{children}</> : <LandingScreen />}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextReturnType {
  return useContext(AppContext);
}
