import { StyleSheet } from "react-native";

import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import ParallaxScrollView from "../components/ParallaxScrollView";
import SignInWithDiscord from "./(auth)/discord";

export default function LandingScreen() {
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Beam</ThemedText>
      </ThemedView>
      <SignInWithDiscord />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    height: "auto",
    justifyContent: "center",
  },
});
