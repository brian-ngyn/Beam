import { TouchableOpacity } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ThemedTextInput } from "../ThemedTextInput";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { trpc } from "../../utils/trpc";

export const NewPost = () => {
  const utils = trpc.useUtils();
  const { mutate } = trpc.post.create.useMutation({
    async onSuccess() {
      await utils.post.all.invalidate();
    },
  });

  const [title, onChangeTitle] = useState("");
  const [content, onChangeContent] = useState("");

  return (
    <ThemedView style={styles.container}>
      <ThemedTextInput
        onChangeText={onChangeTitle}
        placeholder="Title"
        style={styles.input}
      />
      <ThemedTextInput
        onChangeText={onChangeContent}
        placeholder="Content"
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => {
          mutate({
            content,
            title,
          });
        }}
        style={styles.publishButton}
      >
        <ThemedText>Publish post</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    padding: 4,
  },
  input: {
    margin: 2,
    padding: 10,
  },
  publishButton: {
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: 4,
    marginTop: 4,
    padding: 8,
  },
});
