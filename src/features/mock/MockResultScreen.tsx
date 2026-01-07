import React from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { useMockResultStore } from "./mockResult.store";

export default function MockResultScreen() {
  const { result } = useMockResultStore();

  if (!result) {
    return <Text>No result found</Text>;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Mock Test Result
      </Text>

      {/* Score */}
      <View style={{ marginVertical: 20 }}>
        <Text>Score: {result.score}</Text>
        <Text>Accuracy: {result.accuracy}%</Text>
        <Text>
          Correct: {result.correct} / {result.total}
        </Text>
        <Text>Time Taken: {Math.round(result.timeTaken / 60)} mins</Text>
      </View>

      {/* Topic Breakdown */}
      <View>
        <Text style={{ fontWeight: "bold" }}>Topic Performance</Text>
        {result.topicBreakup.map((t: any) => (
          <Text key={t.topic}>
            {t.topic}: {t.correct}/{t.total}
          </Text>
        ))}
      </View>

      {/* Feedback */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontStyle: "italic" }}>
          {result.rankNote}
        </Text>
      </View>

      <Button title="Back to Dashboard" onPress={() => {}} />
    </ScrollView>
  );
}
