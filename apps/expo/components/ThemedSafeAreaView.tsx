import { SafeAreaView, type ViewProps } from "react-native";

import { useThemeColor } from "../hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  darkColor?: string;
  lightColor?: string;
};

export function ThemedSafeAreaView({
  darkColor,
  lightColor,
  style,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { dark: darkColor, light: lightColor },
    "background",
  );

  return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}
