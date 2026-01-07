import React from "react";
import { View, Text } from "react-native";

export default function ExplanationCard({
  correct,
  explanation,
}: {
  correct: boolean;
  explanation: string;
}) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontWeight: "bold", color: correct ? "green" : "red" }}>
        {correct ? "Correct ✅" : "Wrong ❌"}
      </Text>

      <Text style={{ marginTop: 10 }}>{explanation}</Text>
    </View>
  );
}
