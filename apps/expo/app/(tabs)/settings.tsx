import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import { CommunityPerson } from "../../components/Settings/YourCommunity/CommunityPerson";
import { InvitesPerson } from "../../components/Settings/Invites/InvitesPerson";
import { useState } from "react";
import { ThemedTextInput } from "../../components/ThemedTextInput";

export default function TestScreen() {
  const [emailInput, setEmailInput] = useState("");

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedView style={styles.yourCommunityContainer}>
        <ThemedText type="subtitle">Your Community</ThemedText>
        <CommunityPerson
          email="john.doe@gmail.com"
          image_uri="https://img.freepik.com/free-photo/happy-man-student-with-afro-hairdo-shows-white-teeth-being-good-mood-after-classes_273609-16608.jpg"
          name="John Doe"
        />
        <CommunityPerson
          email="jane.doe@gmail.com"
          image_uri="https://img.freepik.com/free-photo/happy-man-student-with-afro-hairdo-shows-white-teeth-being-good-mood-after-classes_273609-16608.jpg"
          name="Jane Doe"
        />
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
            console.log("add person");
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
        <InvitesPerson
          email="jane.doe@gmail.com"
          image_uri="https://img.freepik.com/free-photo/happy-man-student-with-afro-hairdo-shows-white-teeth-being-good-mood-after-classes_273609-16608.jpg"
          name="Jane Doe"
        />
      </ThemedView>
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
  },
});
