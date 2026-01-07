import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { login } from "./auth.service";
import { useAuthStore } from "./auth.store";
import { useSubscriptionStore } from "../subscription/subscription.store";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const setAuth = useAuthStore(state => state.setAuth);
  const setSubscription = useSubscriptionStore(state => state.setSubscription);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const LoginPayload = {
        email,
        password
      }
      const data = await login(LoginPayload);

      await setAuth(data);
      setSubscription(data.subscription);
    } catch (e: any) {
      Alert.alert("Login failed", e?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />

      <Button title={loading ? "Logging in..." : "Login"} onPress={onLogin} />
    </SafeAreaView>
  );
}
