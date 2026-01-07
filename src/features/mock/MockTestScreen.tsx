import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { startMockApi, submitMockApi } from "./mock.service";
import { useMockStore } from "./mock.store";
import { useMockResultStore } from "./mockResult.store";
import { useNavigation } from "@react-navigation/native";

export default function MockTestScreen() {
  const {
    questions,
    answers,
    startMock,
    selectAnswer,
    mockSessionId,
    startTime,
    duration,
    reset,
  } = useMockStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    startMockApi().then(startMock);
  }, []);

  const q = questions[currentIndex];
  if (!q) return <Text>Loading mock...</Text>;

  const { setResult } = useMockResultStore();

    const submit = async () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    const result = await submitMockApi({
        mockSessionId,
        answers,
        timeTaken,
    });

    setResult(result);
    reset();
    const navigation = useNavigation<any>();
    navigation.navigate("MockResult");
    };

  return (
    <View style={{ padding: 20 }}>
      <Text>
        Time Left: {Math.max(0, duration - (Date.now() - startTime) / 1000)}s
      </Text>

      <Text style={{ marginVertical: 20 }}>{q.question}</Text>

      {q.options.map((o: any) => (
        <Button
          key={o.key}
          title={`${o.key}. ${o.value}`}
          onPress={() => selectAnswer(q.id, o.key)}
        />
      ))}

      <View style={{ marginTop: 20 }}>
        {currentIndex < questions.length - 1 ? (
          <Button title="Next" onPress={() => setCurrentIndex(i => i + 1)} />
        ) : (
          <Button title="Submit Mock" onPress={submit} />
        )}
      </View>
    </View>
  );
}
