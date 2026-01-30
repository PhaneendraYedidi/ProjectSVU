import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "./auth.store";
import AppNavigator from "../navigation/AppNavigator";
import AuthNavigator from "../navigation/AuthNavigator";

export default function AuthGate() {
  const { accessToken, hydrate, isHydrated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate().finally(() => setLoading(false));
  }, []);

  if (loading || !isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AppNavigator />;
  // return accessToken ? <AppNavigator /> : <AuthNavigator />;
}
