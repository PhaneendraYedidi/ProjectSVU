// src/screens/SwipeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Text, ActivityIndicator } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Question } from '../data/questions';
import { fetchQuestions } from '../api/questionService';
import QuestionCard from '../components/QuestionCard';
import ExplanationView from '../components/ExplanationView';
import { colors } from '../styles/theme';

const { height } = Dimensions.get('window');

const SwipeScreen: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showExplanationId, setShowExplanationId] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestions();
        setQuestions(fetchedQuestions);
      } catch (err) {
        setError('Failed to load questions.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = (questionId: string, isCorrect: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: isCorrect }));
  };

  const handleDoubleTap = useCallback((questionId: string) => {
    setShowExplanationId(prevId => (prevId === questionId ? null : questionId));
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={questions}
        renderItem={({ item }) => {
          const doubleTapGesture = Gesture.Tap()
            .numberOfTaps(2)
            .onEnd(() => {
              handleDoubleTap(item.id);
            });

          return (
            <GestureDetector gesture={doubleTapGesture}>
              <View style={styles.page}>
                <QuestionCard
                  question={item}
                  onAnswer={isCorrect => handleAnswer(item.id, isCorrect)}
                />
                {showExplanationId === item.id && (
                  <ExplanationView explanation={item.explanation} />
                )}
              </View>
            </GestureDetector>
          );
        }}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    height,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SwipeScreen;

