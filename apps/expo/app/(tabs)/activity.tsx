import { StyleSheet } from "react-native";

import ParallaxScrollView from "../../components/ParallaxScrollView";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { RecordingCard } from "../../components/recordingCard/RecordingCard";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: "#353636", light: "#FCFAFA" }}
    >
      <ThemedView>
        <ThemedText type="title">Activity</ThemedText>
      </ThemedView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.activityContainer}>
          <ThemedText type="subtitle">Today</ThemedText>
          <RecordingCard
            description="Description of event adfgiuhsi gfduihg dfiugbiudfh giubdfiuhg guihfdgiuhsdifughiusdfhg giubfdsiugh gidfsbiugh iubgiubqwh gugbfi"
            title="Event 1"
            type="today"
          />
          <RecordingCard
            description="Description of event"
            title="Event 2"
            type="today"
          />
          <RecordingCard
            description="Description of event"
            title="Event 3"
            type="today"
          />
        </ThemedView>
        <ThemedView style={styles.activityContainer}>
          <ThemedText type="subtitle">Saved Recordings</ThemedText>
          <RecordingCard
            description="Description of event"
            title="Event 1"
            type="saved"
          />
          <RecordingCard
            description="Description of eventDescription of eventDescription of eventDescription of eventDescription of eventDescription of eventDescription of eventDescription of eventDescription of eventDescription of eventDescription of eventDescription of eventDescription of eventDescription of eventDescription of eventDescription of event"
            title="Event 2"
            type="saved"
          />
          <RecordingCard
            description="Description of event"
            title="Event 3"
            type="saved"
          />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  activityContainer: {
    flexDirection: "column",
    gap: 20,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 45,
  },
});
