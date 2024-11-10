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
      projectId: "a1530664-c4a4-41af-b9c1-291b8cff6149",
    },
  },
  icon: "./assets/images/icon.png",
  ios: {
    bundleIdentifier: "com.example.myapp",
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
