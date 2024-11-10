import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { LivestreamCard } from "./LivestreamCard";

interface LivestreamsProps {
  onPress: () => void;
}

export const Livestreams = (props: LivestreamsProps) => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText lightColor="black" type="title">
        Live Streams
      </ThemedText>
      <ThemedView style={styles.cardsContainer}>
        <LivestreamCard name="John Doe" />
        <LivestreamCard name="John Doe" />
        <LivestreamCard name="John Doe" />
      </ThemedView>
      <TouchableOpacity
        onPress={props.onPress}
        style={styles.returnToDashboard}
      >
        <ThemedText lightColor="black" type="default">
          Return to Dashboard
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 16,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    position: "relative",
  },
  returnToDashboard: {
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    marginTop: "90%",
    width: "100%",
  },
});
