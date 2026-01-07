import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../features/dashboard/DashboardScreen";
import PracticeScreen from "../features/quiz/PracticeScreen";
import ProfileScreen from "../features/profile/ProfileScreen";
import MockResultScreen from "../features/mock/MockResultScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Practice" component={PracticeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="MockResult" component={MockResultScreen} />
    </Tab.Navigator>
  );
}
