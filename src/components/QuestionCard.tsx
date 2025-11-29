// src/components/QuestionCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Question } from '../data/questions';
import { colors, spacing, typography } from '../styles/theme';
import Option from './Option';

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const shake = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shake.value }],
    };
  });

  const handleOptionPress = (optionId: string) => {
    if (isRevealed) return;

    setSelectedOptionId(optionId);
    setIsRevealed(true);
    const isCorrect = optionId === question.correctAnswerId;
    onAnswer(isCorrect);

    if (isCorrect) {
      setShowConfetti(true);
    } else {
      // Trigger the shake animation for incorrect answers
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.questionText}>{question.question}</Text>
      
      <View>
        {question.options.map(option => (
          <Option
            key={option.id}
            text={option.text}
            isSelected={selectedOptionId === option.id}
            isCorrect={option.id === question.correctAnswerId}
            isRevealed={isRevealed}
            onPress={() => handleOptionPress(option.id)}
          />
        ))}
      </View>
      
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          fadeOut={true}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    width: '85%', // Reduced width to make space
    marginLeft: spacing.md, // Added margin for spacing
    borderRadius: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.lg,
  },
});

export default QuestionCard;

