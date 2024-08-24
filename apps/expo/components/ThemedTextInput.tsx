import { type TextInputProps, StyleSheet, TextInput } from "react-native";

import { useThemeColor } from "../hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedTextInput({
  darkColor,
  lightColor,
  style,
  type = "default",
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ dark: darkColor, light: lightColor }, "text");

  return (
    <TextInput
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  link: {
    color: "#0a7ea4",
    fontSize: 16,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
});
