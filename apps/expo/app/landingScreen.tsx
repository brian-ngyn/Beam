import { useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  LivestreamPlayer,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-native-sdk";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import ParallaxScrollView from "../components/ParallaxScrollView";
import SignInWithDiscord from "./(auth)/discord";
import IncallManager from "react-native-incall-manager";

const apiKey = "mazghq649rd3";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJAc3RyZWFtLWlvL2Rhc2hib2FyZCIsImlhdCI6MTczMTE5Njc1NCwiZXhwIjoxNzMxMjgzMTU0LCJ1c2VyX2lkIjoiIWFub24iLCJyb2xlIjoidmlld2VyIiwiY2FsbF9jaWRzIjpbImxpdmVzdHJlYW06bGl2ZXN0cmVhbV80NWQ2Yzk1ZS05MzRkLTRkMDUtYmU2My02Yzc5ZTFlOGM1NTMiXX0.r89CraJEe22Sph6qC5VNwV3ir0gHdHxzvNWrEjs-zwI";
const callId = "livestream_45d6c95e-934d-4d05-be63-6c79e1e8c553";

const user: User = { type: "anonymous" };
const client = new StreamVideoClient({ apiKey, token, user });

export default function LandingScreen() {
  useEffect(() => {
    IncallManager.start({ media: "video" });
    return () => IncallManager.stop();
  });
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Beam</ThemedText>
        <StreamVideo client={client}>
          <LivestreamPlayer callId={callId} callType="livestream" />
        </StreamVideo>
      </ThemedView>
      <SignInWithDiscord />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    height: "auto",
    justifyContent: "center",
  },
});

// async function startRecording() {
//   const { granted } = await Audio.requestPermissionsAsync();
//   if (!granted) {
//     throw new Error("Permissions required");
//   }

//   try {
//     await Audio.setAudioModeAsync({
//       allowsRecordingIOS: true,
//       interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
//       interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
//       playThroughEarpieceAndroid: false,
//       playsInSilentModeIOS: true,
//       shouldDuckAndroid: true,
//       staysActiveInBackground: true,
//     });
//     const recording = new Audio.Recording();
//     await recording.prepareToRecordAsync();
//   } catch (err) {
//     console.error(err);
//   }
// }
