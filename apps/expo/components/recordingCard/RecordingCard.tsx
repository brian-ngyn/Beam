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
            <Ionicons color={"#BD8DBF"} name={"play"} size={24} />
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
            <ThemedText>Delete</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log("save");
            }}
            style={styles.saveButton}
          >
            <ThemedText>Save</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    alignContent: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  discardButton: {
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#EFB8B4",
    color: "#567E53",
    display: "flex",
    height: 30,
    justifyContent: "center",
    width: "50%",
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
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#B8EFB4",
    color: "#B1453D",
    display: "flex",
    height: 30,
    justifyContent: "center",
    width: "50%",
  },
  textContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    paddingRight: 8,
  },
});
