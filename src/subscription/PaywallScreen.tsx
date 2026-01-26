import React from "react";
import { View, Text, Button } from "react-native";

const PaywallScreen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Upgrade to Premium
      </Text>

      <Text style={{ marginBottom: 20 }}>
        Unlock unlimited questions, mock tests, and analytics.
      </Text>

      <Button
        title="Upgrade Now"
        onPress={() => navigation?.navigate("Subscription")}
      />
    </View>
  );
};

export default PaywallScreen;
