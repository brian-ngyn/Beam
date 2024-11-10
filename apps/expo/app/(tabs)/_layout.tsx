import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "../../components/navigation/TabBarIcon";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const color = useColorScheme();
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#BD8DBF",
        tabBarStyle: {
          backgroundColor: color ?? "light",
        },
      }}
    >
      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "bar-chart" : "bar-chart-outline"}
            />
          ),
          title: "Activity",
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "home" : "home-outline"}
            />
          ),
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "settings" : "settings-outline"}
            />
          ),
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
