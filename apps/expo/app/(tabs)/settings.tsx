import { StyleSheet } from "react-native";

import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import { trpc } from "../../utils/trpc";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import SignInWithDiscord from "../(auth)/discord";
import SignOut from "../(auth)/signout";
import { NewPost } from "../../components/tweets/NewPost";
import { useAppContext } from "../../context/appContext";

export default function TestScreen() {
  const { featureFlags } = useAppContext();
  const posts = trpc.post.all.useQuery();
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Example Tweets Page With Login</ThemedText>
      </ThemedView>
      <SignedOut>
        <SignInWithDiscord />
      </SignedOut>
      <SignedIn>
        <NewPost />
        <SignOut />
      </SignedIn>
      <ThemedView style={styles.stepContainer}>
        {posts.data?.map((post) => {
          return (
            <ThemedView key={post.id}>
              <ThemedText type="subtitle">{post.title}</ThemedText>
              <ThemedText>{post.content}</ThemedText>
            </ThemedView>
          );
        })}
      </ThemedView>
      {featureFlags.flags?.map((flag) => (
        <ThemedView key={flag.flagName}>
          <ThemedText type="subtitle">
            {flag.flagName} - {String(flag.isEnabled)}
          </ThemedText>
        </ThemedView>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    bottom: 0,
    height: 178,
    left: 0,
    position: "absolute",
    width: 290,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
