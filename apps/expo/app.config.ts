import { ExpoConfig, ConfigContext } from "@expo/config";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_ZW1pbmVudC1tdXN0YW5nLTY4LmNsZXJrLmFjY291bnRzLmRldiQ";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  android: {
    adaptiveIcon: {
      backgroundColor: "#ffffff",
      foregroundImage: "./assets/images/adaptive-icon.png",
    },
  },
  experiments: {
    typedRoutes: true,
  },
  extra: {
    CLERK_PUBLISHABLE_KEY,
    eas: {
      projectId: "46aa830d-7066-4a87-9d8c-3c15fcc8bb91",
    },
  },
  icon: "./assets/images/icon.png",
  ios: {
    bundleIdentifier: "com.example.myapp",
    infoPlist: {
      UIBackgroundModes: ["audio"],
    },
    supportsTablet: true,
  },
  name: "my-expo-app",
  orientation: "portrait",
  plugins: [
    ["expo-router"],
    [
      "expo-camera",
      {
        cameraPermission: "Allow Beam to access your camera",
        microphonePermission: "Allow Beam to access your microphone",
        recordAudioAndroid: true,
      },
    ],
    [
      "expo-av",
      { microphonePermission: "Allow Beam to access your microphone." },
    ],
    "@config-plugins/react-native-webrtc",
  ],
  scheme: "myapp",
  slug: "my-expo-app",
  splash: {
    backgroundColor: "#ffffff",
    image: "./assets/images/splash.png",
    resizeMode: "contain",
  },
  userInterfaceStyle: "automatic",
  version: "1.0.0",
  web: {
    bundler: "metro",
    favicon: "./assets/images/favicon.png",
    output: "static",
  },
});

export default defineConfig;
