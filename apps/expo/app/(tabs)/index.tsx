import Ionicons from "@expo/vector-icons/Ionicons";

import { Animated, StyleSheet, TouchableOpacity } from "react-native";

import ParallaxScrollView from "../../components/ParallaxScrollView";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-expo";

import { Camera, CameraType, CameraView } from "expo-camera";
import { Video, ResizeMode } from "expo-av";
import { supabase } from "../../utils/trpc";
import * as FileSystem from "expo-file-system";
import { LiveRecordingAlert } from "../../components/LiveRecordingAlert";

export default function ExploreScreen() {
  const { user, isLoaded } = useUser();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [videoUri, setVideoUri] = useState<string[]>([]);
  const [facing, setFacing] = useState<CameraType>("back");
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const openCameraView = useCallback(async () => {
    const { status: statusCamera } =
      await Camera.requestCameraPermissionsAsync();
    const { status: statusMicrophone } =
      await Camera.requestMicrophonePermissionsAsync();
    if (statusCamera === "granted" && statusMicrophone === "granted") {
      setIsRecording(true);
    }
  }, []);

  useEffect(() => {
    const animate = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          duration: 1000,
          toValue: 1.05, // Scale up slightly
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          duration: 1000,
          toValue: 1, // Scale back to original
          useNativeDriver: true,
        }),
      ]),
    );
    animate.start();
    return () => animate.stop(); // Cleanup on unmount
  }, [scaleAnim]);

  const toggleCameraFacing = useCallback(() => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }, []);

  if (isLoaded && !user?.id) {
    throw new Error('wtf');
  }

  useEffect(() => {
    const recordChunks = async () => {
      try {
        if (isRecording && cameraRef.current) {
          const { data: filesToDelete } = await supabase.storage.from('videos').list(`${user!.id}/`)
          if (filesToDelete?.length) {
            const { error } = await supabase.storage.from("videos").remove(filesToDelete.map(file => `${user!.id}/${file.name}`))
            if (error) { console.error({ error }) }
          }
          const recording = await cameraRef.current.recordAsync({
            maxDuration: 5,
          });
          if (recording?.uri) {
            const fileContents = await FileSystem.readAsStringAsync(
              recording.uri,
              {
                encoding: FileSystem.EncodingType.Base64,
              },
            );
            supabase.storage.from("videos").upload(
              `${user!.id}/${videoUri.length}.mov`,
              Uint8Array.from(atob(fileContents), (c) => c.charCodeAt(0)),
              {
                cacheControl: "3600",
                upsert: false,
              },
            );

            setVideoUri((prev) => [...prev, recording.uri]);
            return recording.uri;
          } else {
            console.error("Couldn't get recording URI");
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    recordChunks();
    return () =>
      (cameraRef.current && cameraRef.current.stopRecording()) ?? undefined;
  }, [isRecording, videoUri]);

  useEffect(() => {
    console.log(videoUri);
  }, [videoUri]);

  const stopRecording = useCallback(async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: "#353636", light: "#D0D0D0" }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hi, {user?.fullName}</ThemedText>
        <ThemedText type="default">
          Feeling unsafe? Start a recording
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={isRecording ? styles.cameraContainer : styles.cameraHidden}
      >
        <CameraView
          facing={facing}
          mode="video"
          ref={cameraRef}
          style={styles.camera}
        />
      </ThemedView>
      <ThemedView style={styles.cameraModule}>
        {!isRecording && videoUri?.length === 0 && (
          <TouchableOpacity
            onPress={async () => {
              if (!isRecording) {
                openCameraView();
              }
            }}
            style={styles.recordingButtonContainer}
          >
            <Animated.View
              style={[
                styles.recordingButton,
                { transform: [{ scale: scaleAnim }] },
              ]}
            />
            <ThemedView style={styles.recordingButton1}>
              <Ionicons color={"white"} name={"videocam-outline"} size={48} />
            </ThemedView>
          </TouchableOpacity>
        )}
        {!isRecording && <LiveRecordingAlert />}
        {isRecording && (
          <ThemedView style={styles.videoControlsContainer}>
            <TouchableOpacity
              onPress={async () => {
                stopRecording();
              }}
            >
              <ThemedText style={styles.videoControl}>
                Stop Recording
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <ThemedText style={styles.videoControl}>Flip Camera</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ThemedView>
      {videoUri &&
        videoUri.length > 0 &&
        videoUri?.map((uri) => {
          return (
            <ThemedView key={uri} style={styles.videoPreviewContainer}>
              <Video
                isLooping
                resizeMode={ResizeMode.CONTAIN}
                source={{
                  uri,
                }}
                style={styles.videoPreview}
                useNativeControls
              />
              <TouchableOpacity
                onPress={() => {
                  setVideoUri([]);
                }}
              >
                <ThemedText style={styles.videoControl}>
                  Discard Video
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          );
        })}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    height: 500,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cameraHidden: {
    display: "none",
  },
  cameraModule: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  recordingButton: {
    aspectRatio: "1/1",
    backgroundColor: "#E3C7E5",
    borderRadius: 999,
    width: "100%",
  },
  recordingButton1: {
    alignItems: "center",
    aspectRatio: "1/1",
    backgroundColor: "#B68FBC",
    borderRadius: 999,
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    width: "90%",
  },
  recordingButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "30%",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
  },
  videoControl: {
    backgroundColor: "#B68FBC",
    borderColor: "#B68FBC",
    borderRadius: 10,
    borderWidth: 1,
    color: "white",
    overflow: "hidden",
    padding: 8,
    textAlign: "center",
    width: "100%",
  },
  videoControlsContainer: {
    alignItems: "center",
    columnGap: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  videoPreview: {
    height: 500,
  },
  videoPreviewContainer: {
    backgroundColor: "blue",
    flexDirection: "column",
    width: "100%",
  },
});
