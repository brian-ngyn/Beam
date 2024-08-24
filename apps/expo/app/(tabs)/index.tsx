import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity } from "react-native";

import ParallaxScrollView from "../../components/ParallaxScrollView";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { useUser } from "@clerk/clerk-expo";
import { useCallback, useEffect, useRef, useState } from "react";
import { Colors } from "../../constants/Colors";
import { CameraView, CameraType, Camera } from "expo-camera";

export default function ExploreScreen() {
  const { user } = useUser();
  const [isRecording, setIsRecording] = useState(false);
  const cameraInstance = useRef<CameraView | null>(null);
  const [recordingURI, setRecordingURI] = useState<string | undefined>(
    undefined,
  );

  const [facing, setFacing] = useState<CameraType>("back");

  const toggleCamera = useCallback(async () => {
    const { status: statusCamera } =
      await Camera.requestCameraPermissionsAsync();
    const { status: statusMicrophone } =
      await Camera.requestMicrophonePermissionsAsync();
    if (statusCamera === "granted" && statusMicrophone === "granted") {
      setIsRecording((prev) => !prev);
    }
  }, []);

  const toggleCameraFacing = useCallback(() => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }, []);

  useEffect(() => {
    const startRecording = async () => {
      const uri = await cameraInstance.current?.recordAsync({
        codec: "hvc1",
        maxDuration: 600,
      });
      console.log(uri);
      setRecordingURI(uri?.uri);
    };
    if (cameraInstance) {
      console.log("here");
      startRecording();
    }
  }, [cameraInstance.current]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: "#353636", light: "#D0D0D0" }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hi, {user?.fullName}</ThemedText>
      </ThemedView>
      {isRecording && (
        <ThemedView style={styles.cameraContainer}>
          <CameraView
            facing={facing}
            ref={cameraInstance}
            style={styles.camera}
          />
        </ThemedView>
      )}
      <ThemedView style={styles.cameraControls}>
        <TouchableOpacity
          onPress={() => {
            toggleCamera();
          }}
        >
          <Ionicons
            color={isRecording ? "#EA3323" : Colors.dark.icon}
            name={"videocam-outline"}
            size={45}
          />
        </TouchableOpacity>
        {isRecording && (
          <TouchableOpacity onPress={toggleCameraFacing}>
            <ThemedText>Flip Camera</ThemedText>
            <ThemedText>{recordingURI}</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
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
  cameraControls: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
