import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthGate from "../auth/AuthGate";

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <AuthGate />
    </NavigationContainer>
  );
}
