import { type PropsWithChildren, type ReactElement } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "../components/ThemedView";
import { ThemedSafeAreaView } from "./ThemedSafeAreaView";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerBackgroundColor?: { dark: string; light: string };
  headerImage?: ReactElement;
  refreshControl?: ReactElement;
}>;

export default function ParallaxScrollView({
  children,
  headerBackgroundColor,
  headerImage,
  refreshControl,
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  return (
    <ThemedSafeAreaView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        refreshControl={refreshControl}
        scrollEventThrottle={16}
      >
        {headerBackgroundColor && headerImage && (
          <Animated.View
            style={[
              styles.header,
              { backgroundColor: headerBackgroundColor[colorScheme] },
              headerAnimatedStyle,
            ]}
          >
            {headerImage}
          </Animated.View>
        )}
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 16,
    overflow: "hidden",
    padding: 32,
  },
  header: {
    height: 250,
    overflow: "hidden",
  },
});
