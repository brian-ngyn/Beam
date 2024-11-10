import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import { Person } from "../../components/YourCommunity/Person";

export default function TestScreen() {
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedView style={styles.yourCommunityContainer}>
        <ThemedText type="subtitle">Your Community</ThemedText>
        <Person
          email="john.doe@gmail.com"
          image_uri="https://img.freepik.com/free-photo/happy-man-student-with-afro-hairdo-shows-white-teeth-being-good-mood-after-classes_273609-16608.jpg"
          name="John Doe"
        />
        <Person
          email="jane.doe@gmail.com"
          image_uri="https://img.freepik.com/free-photo/happy-man-student-with-afro-hairdo-shows-white-teeth-being-good-mood-after-classes_273609-16608.jpg"
          name="Jane Doe"
        />
        <TouchableOpacity
          onPress={() => {
            console.log("add person");
          }}
          style={styles.addPersonButton}
        >
          <ThemedText>+ Add Person</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.invitesContainer}>
        <ThemedText type="subtitle">Invites</ThemedText>
        <ThemedText type="default">
          By accepting these invites you will join their community and receive
          live stream notifications.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  addPersonButton: {
    alignItems: "center",
    display: "flex",
    width: "100%",
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
