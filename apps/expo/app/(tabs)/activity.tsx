import { RefreshControl, StyleSheet } from "react-native";

import ParallaxScrollView from "../../components/ParallaxScrollView";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { RecordingCard } from "../../components/recordingCard/RecordingCard";
import { trpc } from "../../utils/trpc";
import { useUser } from "@clerk/clerk-expo";
import { useCallback, useState } from "react";

export default function HomeScreen() {
  const { user } = useUser();
  const utils = trpc.useUtils();
  const allFullRecordings = trpc.recording.getAllFullRecordings.useQuery({
    clerkIdToFetchFrom: user!.id,
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await utils.recording.getAllFullRecordings.invalidate();
    setRefreshing(false);
  }, [utils.recording.getAllFullRecordings]);

  const refreshControl = (
    <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
  );
  return (
    <ParallaxScrollView refreshControl={refreshControl}>
      <ThemedView>
        <ThemedText type="title">Activity</ThemedText>
      </ThemedView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.activityContainer}>
          <ThemedText type="subtitle">Today</ThemedText>
          {allFullRecordings?.data?.map((recording, i) => {
            return (
              <RecordingCard
                description={recording.label ?? ""}
                fullRecordingId={recording.id}
                key={recording.id}
                summary={recording.summary ?? ''}
                supabaseUrl={recording.supabaseUrl}
                title={`Event ${i + 1}`}
                type="saved"
              />
            );
          })}
        </ThemedView>
        {/* <ThemedView style={styles.activityContainer}>
          <ThemedText type="subtitle">Saved Recordings</ThemedText>
        </ThemedView> */}
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
