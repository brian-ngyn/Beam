import { RefreshControl, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import { CommunityPerson } from "../../components/Settings/YourCommunity/CommunityPerson";
import { InvitesPerson } from "../../components/Settings/Invites/InvitesPerson";
import { useCallback, useState } from "react";
import { ThemedTextInput } from "../../components/ThemedTextInput";
import { trpc } from "../../utils/trpc";
import { useAppContext } from "../../context/appContext";
import SignOut from "../(auth)/signout";
import { FlatList } from "react-native-reanimated/lib/typescript/Animated";

export default function TestScreen() {
  const [emailInput, setEmailInput] = useState("");
  const { allClerkUsers } = useAppContext();
  const communityMembers = trpc.user.listCommunityMembers.useQuery();
  const incomingInvites = trpc.invite.listReceivedInvites.useQuery();
  const user = trpc.user.getUser.useQuery();

  const utils = trpc.useUtils();

  const updatePhoneNumberMutation = trpc.user.updateUser.useMutation({
    onSettled: () => utils.user.getUser.invalidate(),
  });
  const sendInviteMutation = trpc.invite.sendInvite.useMutation({
    onSettled: () => {
      setEmailInput("");
      utils.user.listCommunityMembers.invalidate();
      utils.invite.listReceivedInvites.invalidate();
    },
  });

  const sendInvite = useCallback(() => {
    const clerkIdToSendInviteTo = allClerkUsers?.find(
      (user) => user.email === emailInput,
    )?.id;
    if (clerkIdToSendInviteTo && emailInput !== "") {
      sendInviteMutation.mutate({
        idToSendInviteTo: allClerkUsers?.find(
          (user) => user.email === emailInput,
        )?.id as string,
      });
    }
  }, [allClerkUsers, emailInput, sendInviteMutation]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await utils.user.listCommunityMembers.invalidate();
    await utils.invite.listReceivedInvites.invalidate();
    setRefreshing(false);
  }, []);

  const refreshControl = (
    <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
  );

  return (
    <ParallaxScrollView refreshControl={refreshControl}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedView style={styles.yourCommunityContainer}>
        <ThemedText type="default">Your phone number</ThemedText>
        <ThemedView style={styles.addPersonInputContainer}>
          <ThemedTextInput
            onChangeText={async (text) => {
              await updatePhoneNumberMutation.mutateAsync({
                phoneNumber: text.trim(),
              });
            }}
            placeholder="Phone Number"
            value={user.data?.phoneNumber ?? ""}
          />
          <TouchableOpacity onPress={() => {}} style={styles.addPersonButton}>
            <ThemedText lightColor="black" type="defaultSemiBold">
              +
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.yourCommunityContainer}>
        <ThemedText type="subtitle">Your Community</ThemedText>
        {communityMembers.data?.map((member) => {
          const clerkUser = allClerkUsers?.find(
            (user) => user.id === member.clerkId,
          );
          return (
            <CommunityPerson
              clerkId={member.clerkId}
              email={clerkUser?.email ?? ""}
              image_uri="https://img.freepik.com/free-photo/happy-man-student-with-afro-hairdo-shows-white-teeth-being-good-mood-after-classes_273609-16608.jpg"
              key={member.id}
              name={clerkUser?.firstName + " " + (clerkUser?.lastName ?? "")}
            />
          );
        })}
      </ThemedView>
      <ThemedText type="default">Add Person</ThemedText>
      <ThemedView style={styles.addPersonInputContainer}>
        <ThemedTextInput
          onChangeText={setEmailInput}
          placeholder="Email"
          value={emailInput}
        />
        <TouchableOpacity
          onPress={() => {
            sendInvite();
          }}
          style={styles.addPersonButton}
        >
          <ThemedText lightColor="black" type="defaultSemiBold">
            +
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.invitesContainer}>
        <ThemedText type="subtitle">Invites</ThemedText>
        <ThemedText type="default">
          By accepting these invites you will join their community and receive
          live stream notifications.
        </ThemedText>
        {incomingInvites.data?.map((invite) => {
          const clerkUser = allClerkUsers?.find(
            (user) => user.id === invite.fromClerkId,
          );
          return (
            <InvitesPerson
              email={clerkUser?.email ?? ""}
              fromClerkId={invite.fromClerkId}
              image_uri="https://img.freepik.com/free-photo/happy-man-student-with-afro-hairdo-shows-white-teeth-being-good-mood-after-classes_273609-16608.jpg"
              key={invite.id}
              name={clerkUser?.firstName + " " + (clerkUser?.lastName ?? "")}
            />
          );
        })}
      </ThemedView>
      <SignOut />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  addPersonButton: {
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  addPersonInputContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    height: 20,
    justifyContent: "space-between",
  },
  invitesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  reactLogo: {
    bottom: 0,
    height: 178,
    left: 0,
    position: "absolute",
    width: 290,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  yourCommunityContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginTop: 8,
  },
});
