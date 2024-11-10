import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface RecordingCardProps {
  title: string;
  description: string;
  type: "today" | "saved";
}

export const RecordingCard = (props: RecordingCardProps) => {
  return (
    <ThemedView>
      <ThemedView style={styles.mainContainer}>
        <ThemedView style={styles.textContainer}>
          <ThemedText type="defaultSemiBold">{props.title}</ThemedText>
          <ThemedText>{props.description}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.playButton}>
          <TouchableOpacity
            onPress={() => {
              console.log("play");
            }}
          >
            <Ionicons color={"#555"} name={"play"} size={24} />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {props.type === "today" && (
        <ThemedView style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log("discard");
            }}
            style={styles.discardButton}
          >
            <ThemedText lightColor="white">Delete</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log("save");
            }}
            style={styles.saveButton}
          >
            <ThemedText lightColor="white">Save</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    width: "100%",
  },
  discardButton: {
    alignItems: "center",
    backgroundColor: "#D27878",
    borderRadius: 5,
    display: "flex",
    flex: 1,
    padding: 5,
  },
  input: {
    margin: 2,
    padding: 10,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    padding: 4,
    width: "100%",
  },
  playButton: {
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#8ED489",
    borderRadius: 5,
    display: "flex",
    flex: 1,
    padding: 5,
  },
  textContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    paddingRight: 8,
  },
});
