import { useAuth } from "@clerk/clerk-expo";
import React, { useCallback } from "react";
import { Button } from "react-native";
import { ThemedView } from "../../components/ThemedView";

const SignOut = () => {
  const user = useAuth();

  const handleSignOutPress = useCallback(async () => {
    try {
      await user.signOut();
    } catch (err) {
      console.log("error signing out", err);
    }
  }, [user]);

  return (
    <ThemedView>
      <Button onPress={handleSignOutPress} title="Sign Out" />
    </ThemedView>
  );
};

export default SignOut;
