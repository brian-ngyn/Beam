import { ThemedText } from "../../ThemedText";
import { ThemedView } from "../../ThemedView";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface PersonProps {
  name: string;
  email: string;
  image_uri: string;
}

export const InvitesPerson = (props: PersonProps) => {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={{
          uri: props.image_uri,
        }}
      ></Image>
      <ThemedView style={styles.content}>
        <ThemedText type="defaultSemiBold">{props.name}</ThemedText>
        <ThemedText>{props.email}</ThemedText>
        <ThemedView style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log("delete");
            }}
            style={styles.deleteButton}
          >
            <ThemedText lightColor="white">Delete</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log("delete");
            }}
            style={styles.acceptButton}
          >
            <ThemedText lightColor="white">Accept</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  acceptButton: {
    alignItems: "center",
    backgroundColor: "#8ED489",
    borderRadius: 5,
    display: "flex",
    flex: 1,
    padding: 5,
  },
  actionsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    width: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  content: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 8,
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#D27878",
    borderRadius: 5,
    display: "flex",
    flex: 1,
    padding: 5,
  },
});
