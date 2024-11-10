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
  const { data } = trpc.recording.fetchMostRecentRecordingChunk.useQuery(
    { clerkIdToFetchFrom: 'user_2oeXUBGUgbeQhgXYWEASa9kQFEU' }, {
    refetchInterval: 5000,
  })

  const video = useRef<Video>(null);
  const [chunkPlayingIndex, setChunkPlayingIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (data?.length === 3 && !isPlaying) {
      setIsPlaying(true);
    }
  }, [data])

  const playingChunk = chunkPlayingIndex != null ? data?.find(r => r.chunkNumber === chunkPlayingIndex)?.supabaseUrl : null;
  playingChunk && video.current?.unloadAsync().then(() => video.current?.loadAsync({ uri: playingChunk }, { shouldPlay: true }, true))

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
      <View style={styles.container}>
        {playingChunk && <Video
          ref={video}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          isLooping
          onPlaybackStatusUpdate={async status => {
            console.log({ status })
            if ((status as any).didJustFinish) {
              setChunkPlayingIndex(prev => prev + 1)
              await video.current?.unloadAsync()
            }
          }}
        />}
      </View>
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
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
});
