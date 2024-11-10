import { ButtonProps, Button } from "react-native";

import { useThemeColor } from "../hooks/useThemeColor";

export type ThemedButtonProps = ButtonProps & {
  darkColor?: string;
  lightColor?: string;
};

export function ThemedButton({
  darkColor,
  lightColor,
  ...otherProps
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { dark: darkColor, light: lightColor },
    "background",
  );

  return <Button color={backgroundColor} {...otherProps} />;
}
