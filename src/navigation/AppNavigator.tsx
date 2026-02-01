import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../features/dashboard/DashboardScreen";
import PracticeScreen from "../features/quiz/PracticeScreen";
import ProfileScreen from "../features/profile/ProfileScreen";
import MockResultScreen from "../features/mock/MockResultScreen";

const Tab = createBottomTabNavigator();

import QuestionFeedScreen from "../screens/QuestionFeedScreen";

import ChallengesScreen from "../features/quiz/ChallengesScreen";
import ChallengeLobbyScreen from "../features/quiz/ChallengeLobbyScreen";
import MockTestScreen from "../features/mock/MockTestScreen";

export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tab.Screen name="QuestionFeed" component={QuestionFeedScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Practice" component={PracticeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      <Tab.Screen name="Challenges" component={ChallengesScreen} />
      <Tab.Screen name="ChallengeLobby" component={ChallengeLobbyScreen} />
      <Tab.Screen name="MockTest" component={MockTestScreen} />
      <Tab.Screen name="MockResult" component={MockResultScreen} />
      <Tab.Screen name="Bookmarks" component={PracticeScreen} />
      <Tab.Screen name="Referral" component={ProfileScreen} />
      <Tab.Screen name="About" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
