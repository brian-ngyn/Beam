import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

interface LivestreamCardProps {
  onPress: (id: string) => void;
  name: string;
  id: string;
}

export const LivestreamCard = (props: LivestreamCardProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("pressing livestream card");
        props.onPress(props.id);
      }}
      style={styles.liveRecordingCard}
    >
      <ThemedView style={styles.liveRecordingText}>
        <ThemedText lightColor="black" type="defaultSemiBold">
          {props.name}
        </ThemedText>
        <ThemedView style={styles.liveRecordingSubtitle}>
          <ThemedText lightColor="black">View Stream</ThemedText>
        </ThemedView>
      </ThemedView>
      <Ionicons
        color={"black"}
        name={"cellular-outline"}
        size={24}
        style={styles.liveRecordingChevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  liveRecordingCard: {
    backgroundColor: "#E3C7E5",
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    gap: 8,
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
