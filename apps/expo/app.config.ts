import { ExpoConfig, ConfigContext } from "@expo/config";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_ZW1pbmVudC1tdXN0YW5nLTY4LmNsZXJrLmFjY291bnRzLmRldiQ";
const SUPABASE_URL = "https://ubsqqcchbqdvjhlyrpic.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVic3FxY2NoYnFkdmpobHlycGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTM4NDYsImV4cCI6MjA0NjU4OTg0Nn0.JRizty_he9nD_2LCVLm0j0MOcV2pt1YZK6P75XDqQYI";

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
    SUPABASE_ANON_KEY,
    SUPABASE_URL,
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
    ["expo-video"],
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
      {
        microphonePermission: "Allow Beam to access your microphone.",
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
