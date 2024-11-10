import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";

export const LiveRecordingAlert = () => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("view live streams");
      }}
      style={styles.liveRecordingCard}
    >
      <ThemedView style={styles.liveRecordingText}>
        <ThemedText lightColor="white" type="defaultSemiBold">
          View Live Streams
        </ThemedText>
        <ThemedView style={styles.liveRecordingSubtitle}>
          <Ionicons color={"white"} name={"cellular-outline"} size={18} />
          <ThemedText lightColor="white">Abod and 3 others</ThemedText>
        </ThemedView>
      </ThemedView>
      <Ionicons
        color={"white"}
        name={"chevron-forward"}
        size={24}
        style={styles.liveRecordingChevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  liveRecordingCard: {
    backgroundColor: "#D27878",
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    marginTop: "20%",
    padding: 14,
    width: "100%",
  },
  liveRecordingChevron: {
    alignSelf: "center",
  },
  liveRecordingSubtitle: {
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    height: 30,
  },
  liveRecordingText: {
    backgroundColor: "transparent",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 8,
  },
});
