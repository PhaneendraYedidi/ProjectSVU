import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { fetchPracticeQuestions } from "./quiz.service";
import { useQuizStore } from "./quiz.store";
import { useSubscriptionStore } from "../../subscription/subscription.store";
import PaywallScreen from "../../subscription/PaywallScreen";
import ExplanationCard from "./ExplanationCard";
import { bookmarkQuestion, reportQuestion } from "./quiz.service";

export default function PracticeScreen() {
  const {
    questions,
    currentIndex,
    setQuestions,
    selectAnswer,
    next,
    startTimer,
    stopTimer,
    answers,
    showExplanation,
    revealExplanation
  } = useQuizStore();

  const { plan } = useSubscriptionStore();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limit = plan === "free" ? 5 : 20;

  // 🔹 Fetch questions
  const loadQuestions = async () => {
    try {
      const res = await fetchPracticeQuestions({
        // mode: "general",
        page,
        limit,
      });

      setQuestions(res.questions);
      setHasMore(res.hasMore);
    } catch (e: any) {
      console.log(e.response.data);
      Alert.alert("Error fetching questions");
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [page]);

  // 🔹 Start timer on question change
  useEffect(() => {
    if (questions?.[currentIndex]) {
      startTimer();
    }
  }, [currentIndex, questions]);

  // 🔒 Free user limit enforcement
  if (plan === "free" && currentIndex >= 5) {
    return <PaywallScreen />;
  }

  const q = questions?.[currentIndex];
  if (!q) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No questions available</Text>
      </View>
    );
  }

  const onAnswer = (option: string) => {
    stopTimer(q._id);
    selectAnswer(q._id, option);

    if (currentIndex + 1 < questions.length) {
      //next();
    } else if (hasMore && plan !== "free") {
      setPage((p) => p + 1);
    } else {
      Alert.alert("Practice Completed");
    }
  };

  const selected = answers[q._id];
  const isCorrect = selected === q.correctAnswer;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>
        Question {currentIndex + 1}
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        {q.question}
      </Text>

      {q.options.map((o: any) => (
        <Button
          key={o.key}
          title={`${o.key}. ${o.text}`}
          disabled={!!selected}
          onPress={() => onAnswer(o.key)}
        />
      ))}
      {showExplanation && (
        <>
          <ExplanationCard
            correct={isCorrect}
            explanation={q.explanation}
          />

          <Button title="Bookmark" onPress={() => bookmarkQuestion(q._id)} />

          <Button
            title="Report"
            onPress={() =>
              reportQuestion(q._id, "Incorrect explanation")
            }
          />

          <Button title="Next" onPress={next} />
        </>
      )}

    </View>
  );
}
