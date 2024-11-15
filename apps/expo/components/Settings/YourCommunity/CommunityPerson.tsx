import { trpc } from "../../../utils/trpc";
import { ThemedText } from "../../ThemedText";
import { ThemedView } from "../../ThemedView";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface PersonProps {
  clerkId: string;
  name: string;
  email: string;
  image_uri: string;
}

export const CommunityPerson = (props: PersonProps) => {
  const deleteCommunityPersonMutation =
    trpc.user.removeCommunityMember.useMutation({
      onSettled: () => {
        utils.user.listCommunityMembers.invalidate();
        utils.invite.listReceivedInvites.invalidate();
      },
    });
  const utils = trpc.useUtils();

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
        <TouchableOpacity
          onPress={() => {
            deleteCommunityPersonMutation.mutate({
              clerkIdToRemove: props.clerkId,
            });
          }}
          style={styles.deleteButton}
        >
          <ThemedText lightColor="white">Delete</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
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
    padding: 5,
    width: "100%",
  },
});
