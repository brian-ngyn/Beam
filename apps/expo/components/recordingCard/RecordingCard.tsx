import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef } from "react";
import { Video, VideoFullscreenUpdate, ResizeMode } from "expo-av";
import { trpc } from "../../utils/trpc";
import { Share } from "react-native";

interface RecordingCardProps {
  title: string;
  description: string;
  type: "today" | "saved";
  supabaseUrl: string;
  fullRecordingId: number;
}

export const RecordingCard = (props: RecordingCardProps) => {
  const videoRef = useRef<Video>(null);
  const utils = trpc.useUtils();

  const deleteRecordingMutation =
    trpc.recording.deleteFullRecordingById.useMutation({
      onSettled: () => {
        utils.recording.getAllFullRecordings.invalidate();
      },
    });

  const handlePlayFullscreen = async () => {
    if (videoRef.current) {
      await videoRef.current.presentFullscreenPlayer();
      await videoRef.current.playAsync();
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        url: props.supabaseUrl,
      });
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  return (
    <ThemedView>
      <ThemedView style={styles.mainContainer}>
        <ThemedView style={styles.textContainer}>
          <ThemedText type="defaultSemiBold">{props.title}</ThemedText>
          <ThemedText>{props.description}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.playButton}>
          {props.supabaseUrl && (
            <TouchableOpacity
              onPress={() => {
                handlePlayFullscreen();
              }}
            >
              <Ionicons color={"#555"} name={"play"} size={24} />
            </TouchableOpacity>
          )}
        </ThemedView>
        {props.supabaseUrl && (
          <Video
            onFullscreenUpdate={(event) => {
              if (
                event.fullscreenUpdate ===
                VideoFullscreenUpdate.PLAYER_WILL_DISMISS
              ) {
                videoRef?.current?.pauseAsync();
              }
            }}
            ref={videoRef}
            resizeMode={ResizeMode.CONTAIN}
            source={{ uri: props.supabaseUrl }}
            useNativeControls={false}
          />
        )}
      </ThemedView>

      <ThemedView style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={async () => {
            await deleteRecordingMutation.mutateAsync({
              id: props.fullRecordingId,
            });
          }}
          style={styles.discardButton}
        >
          <ThemedText lightColor="white">Delete</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} style={styles.saveButton}>
          <ThemedText lightColor="white">Save</ThemedText>
        </TouchableOpacity>
      </ThemedView>
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
