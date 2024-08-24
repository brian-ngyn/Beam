import { useOAuth } from "@clerk/clerk-expo";
import React, { useCallback } from "react";
import { Button } from "react-native";
import { ThemedView } from "../../components/ThemedView";

const SignInWithDiscord = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_discord" });

  const handleSignInWithDiscordPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
      } else {
        throw new Error(
          "There are unmet requirements, modifiy this else to handle them",
        );
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log("error signing in", err);
    }
  }, [startOAuthFlow]);

  return (
    <ThemedView>
      <Button
        onPress={handleSignInWithDiscordPress}
        title="Sign in with Discord"
      />
    </ThemedView>
  );
};

export default SignInWithDiscord;
