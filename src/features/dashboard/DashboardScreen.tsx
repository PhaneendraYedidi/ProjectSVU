import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { getDashboard } from "./dashboard.service";
import { useDashboardStore } from "./dashboard.store";

export default function DashboardScreen() {
  const { data, load } = useDashboardStore();

  useEffect(() => {
    getDashboard().then(load);
  }, []);

  if (!data) return <Text>Loading...</Text>;

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Performance Overview
      </Text>

      {/* Stats */}
      <View style={{ marginVertical: 15 }}>
        <Text>Total Attempted: {data.totalAttempted}</Text>
        <Text>Correct: {data.correct}</Text>
        <Text>Wrong: {data.wrong}</Text>
        <Text>Accuracy: {data.accuracy}%</Text>
        <Text>Avg Time / Q: {data.avgTime}s</Text>
      </View>

      {/* Difficulty */}
      {/* <Text style={{ fontWeight: "bold" }}>By Difficulty</Text>
      <Text>Easy: {data.byDifficulty.easy}%</Text>
      <Text>Medium: {data.byDifficulty.medium}%</Text>
      <Text>Hard: {data.byDifficulty.hard}%</Text> */}

      {/* Subjects */}
      {/* <Text style={{ fontWeight: "bold", marginTop: 15 }}>
        Subject Accuracy
      </Text>
      {data.bySubject.map((s: any) => (
        <Text key={s.subject}>
          {s.subject}: {s.accuracy}%
        </Text>
      ))} */}

      {/* Recent */}
      {/* <Text style={{ fontWeight: "bold", marginTop: 15 }}>
        Recent Performance
      </Text>
      {data.recent.map((r: any) => (
        <Text key={r.date}>
          {r.date}: {r.accuracy}%
        </Text>
      ))} */}
    </ScrollView>
  );
}
