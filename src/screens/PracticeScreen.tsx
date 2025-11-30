// src/screens/PracticeScreen.tsx
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Text, ActivityIndicator } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Question } from '../data/questions';
import { fetchQuestions } from '../api/questionService';
import QuestionCard from '../components/QuestionCard';
import ExplanationView from '../components/ExplanationView';
import SideActionPanel from '../components/SideActionPanel';
import { lightColors, darkColors } from '../styles/theme';
import { ThemeContext } from '../context/ThemeContext';
const { height } = Dimensions.get('window');

const PracticeScreen: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showExplanationId, setShowExplanationId] = useState<string | null>(null);
  const { isDarkMode } = useContext(ThemeContext);
  const colors = isDarkMode ? darkColors : lightColors;
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
                <View style={styles.contentContainer}>
                  <View style={styles.cardContainer}>
                    <QuestionCard
                      question={item}
                      onAnswer={isCorrect => handleAnswer(item.id, isCorrect)}
                    />
                  </View>
                  <SideActionPanel questionId={item.id} />
                </View>
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
    flex: 1
  },
  page: {
    height,
    width: '100%',
    justifyContent: 'flex-start', // changed to flex-start
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PracticeScreen;