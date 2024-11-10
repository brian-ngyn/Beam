import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { LivestreamCard } from "./LivestreamCard";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import { ResizeMode, Video } from "expo-av";

interface LivestreamsProps {
  onPress: () => void;
}

export const Livestreams = (props: LivestreamsProps) => {
  const communityMembersWithLivestreams =
    trpc.liveStream.getCommunityMembersWithLiveStream.useQuery();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  return (
    <ThemedView style={styles.container}>
      <ThemedText lightColor="black" type="title">
        Live Streams
      </ThemedText>
      <ThemedView style={styles.cardsContainer}>
        {communityMembersWithLivestreams.data?.map((member) => (
          <LivestreamCard
            id={member.clerkId}
            key={member.id}
            name={member.name}
            onPress={() => setSelectedUserId(member.clerkId)}
          />
        ))}
        {/* <LivestreamCard name="John Doe" />
        <LivestreamCard name="John Doe" />
        <LivestreamCard name="John Doe" /> */}
      </ThemedView>
      {selectedUserId && <LiveStream clerkId={selectedUserId} />}
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

const LiveStream = (props: { clerkId: string }) => {
  const { data } = trpc.recording.fetchMostRecentRecordingChunk.useQuery(
    { clerkIdToFetchFrom: props.clerkId },
    {
      refetchInterval: 5100,
    },
  );

  console.log("clerId", props.clerkId);

  const video = useRef<Video>(null);
  const [chunkPlayingIndex, setChunkPlayingIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if ((data?.length ?? 0) >= 3 && !isPlaying) {
      setIsPlaying(true);
      setChunkPlayingIndex(Math.max(...data?.map(v => v.chunkNumber) ?? []) - 3);
    }
  }, [data]);

  useEffect(() => {
    const playingChunk = chunkPlayingIndex != null ? data?.find(r => r.chunkNumber === chunkPlayingIndex)?.supabaseUrl : null;
    if (!video.current) {
      console.error("WERE FUCKEDD")
      return;
    } else {
      console.error("NOT ACTAULLY FUCKED")
    }
    playingChunk && video.current!.loadAsync({ uri: playingChunk }, { shouldPlay: true }, true)
  }, [chunkPlayingIndex])


  return <View style={styles.container}>
    {chunkPlayingIndex != null && <Video
      ref={video}
      style={styles.video}
      useNativeControls
      resizeMode={ResizeMode.CONTAIN}
      shouldPlay={true}
      shouldCorrectPitch
      isLooping
      onPlaybackStatusUpdate={async status => {
        if ((status as any).didJustFinish) {
          setChunkPlayingIndex(prev => (prev ?? -1) + 1)
          if (!video.current) {
            console.error("WERE COOKED")
          }
          await video.current!.unloadAsync()
        }
      }}
    />}
  </View>
}

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
  contentContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 10,
    paddingHorizontal: 50,
  },
  controlsContainer: {
    padding: 10,
  },
  returnToDashboard: {
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    marginTop: "90%",
    width: "100%",
  },
  video: {
    height: 275,
    width: 350,
  },
});
