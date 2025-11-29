// src/components/QuestionCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
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

  const handleOptionPress = (optionId: string) => {
    if (isRevealed) return;

    setSelectedOptionId(optionId);
    setIsRevealed(true);
    const isCorrect = optionId === question.correctAnswerId;
    onAnswer(isCorrect);

    if (isCorrect) {
      setShowConfetti(true);
    }
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  questionText: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.lg,
  },
});

export default QuestionCard;
