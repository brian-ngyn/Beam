import { StyleSheet, TouchableOpacity } from "react-native";

import ParallaxScrollView from "../../components/ParallaxScrollView";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { useUser } from "@clerk/clerk-expo";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraType, CameraView } from "expo-camera";
import { Video, ResizeMode } from "expo-av";
import { supabase } from "../../utils/trpc";
import * as FileSystem from "expo-file-system";
import fs from "fs";

export default function ExploreScreen() {
  const { user } = useUser();
  const [cameraViewOpen, setCameraViewOpen] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [videoUri, setVideoUri] = useState<string[] | null>([]);
  const [facing, setFacing] = useState<CameraType>("back");

  const openCameraView = useCallback(async () => {
    const { status: statusCamera } =
      await Camera.requestCameraPermissionsAsync();
    const { status: statusMicrophone } =
      await Camera.requestMicrophonePermissionsAsync();
    if (statusCamera === "granted" && statusMicrophone === "granted") {
      setCameraViewOpen(true);
      startRecording();
    }
  }, []);

  const toggleCameraFacing = useCallback(() => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }, []);

  const startRecording = async () => {
    try {
      if (cameraRef.current) {
        for (let i = 0; i < 100; i++) {
          await cameraRef.current
            .recordAsync({ maxDuration: 5 })
            .then(async (uri) => {
              if (uri) {
                const fileContents = await FileSystem.readAsStringAsync(
                  uri.uri,
                  {
                    encoding: FileSystem.EncodingType.Base64,
                  },
                );
                supabase.storage.from("videos").upload(
                  uri.uri,
                  Uint8Array.from(atob(fileContents), (c) => c.charCodeAt(0)),
                  {
                    cacheControl: "3600",
                    upsert: false,
                  },
                );

                setVideoUri((prev) => [...(prev ?? []), uri.uri]);
                return uri.uri;
              }
            });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log(videoUri);
  }, [videoUri]);

  const stopRecording = useCallback(async () => {
    if (cameraRef.current) {
      await cameraRef.current.stopRecording();
      setCameraViewOpen(false);
    }
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: "#353636", light: "#D0D0D0" }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hi, {user?.fullName}</ThemedText>
        <ThemedText type="subtitle">
          Feeling unsafe? Start a recording
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={cameraViewOpen ? styles.cameraContainer : styles.cameraHidden}
      >
        <CameraView
          facing={facing}
          mode="video"
          ref={cameraRef}
          style={styles.camera}
        />
      </ThemedView>
      <ThemedView style={styles.cameraModule}>
        {!cameraViewOpen && videoUri?.length === 0 && (
          <TouchableOpacity
            onPress={async () => {
              if (!cameraViewOpen) {
                openCameraView();
              }
            }}
            style={styles.recordingButtonContainer}
          >
            <ThemedView style={styles.recordingButton} />
            <ThemedView style={styles.recordingButton1} />
          </TouchableOpacity>
        )}
        {cameraViewOpen && (
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
                  setVideoUri(null);
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
    backgroundColor: "#DFC8E3",
    borderRadius: 999,
    width: "100%",
  },
  recordingButton1: {
    aspectRatio: "1/1",
    backgroundColor: "#B68FBC",
    borderRadius: 999,
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
