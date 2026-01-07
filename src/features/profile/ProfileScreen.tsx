import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useProfileStore } from "./profile.store";
import { getProfile } from "./profile.service";
import { useAuthStore } from "../../auth/auth.store";

export default function ProfileScreen() {
  const { profile, loadProfile, clear } = useProfileStore();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    getProfile().then(loadProfile);
  }, []);

  if (!profile) return <Text>Loading...</Text>;
  console.log("Profile ", profile)
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        {profile.name}
      </Text>
      <Text>{profile.email}</Text>
      <Text>{profile.phone}</Text>

      <View style={{ marginVertical: 15 }}>
        <Text>
          Subscription:{" "}
          {profile.subscription === "premium" ? "PRO" : "FREE"}
        </Text>
        {profile.subscription === "premium" && (
          <Text>
            Expires on:{" "}
            {new Date(profile.subscriptionEnd).toDateString()}
          </Text>
        )}
      </View>

      <View style={{ marginVertical: 15 }}>
        <Text>Referral Code: {profile.referralCode}</Text>
        <Text>Referred Users: {profile.referralCount}</Text>
        <Text>Earnings: ₹{profile.referralEarnings}</Text>
      </View>

      {profile.subscription?.toLowerCase() === "free" && (
        <Button title="Upgrade to PRO" onPress={() => {}} />
      )}

      <Button
        title="Logout"
        color="red"
        onPress={() => {
          clear();
          logout();
        }}
      />
    </View>
  );
}
