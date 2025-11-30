import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuestionStore } from '../store/questionStore';
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from 'victory-native';
import { ThemeContext } from '../context/ThemeContext';
import { lightColors, darkColors, typography, spacing } from '../styles/theme';

const DashboardScreen: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const colors = isDarkMode ? darkColors : lightColors;
  const questionTimes = useQuestionStore(state => state.questionTimes);
  const bookmarkedQuestionIds = useQuestionStore(state => state.bookmarkedQuestionIds);
  const questionCorrect = useQuestionStore(state => state.questionCorrect);

  // Calculate average time
  const questionIds = Object.keys(questionTimes);
  const totalTime = questionIds.reduce((sum, id) => sum + questionTimes[id], 0);
  const averageTime = questionIds.length > 0 ? totalTime / questionIds.length : 0;
  const numQuestionsAnswered = questionIds.length;
  let numCorrectAnswers = 0;
  for (let id in questionCorrect) {
    if (questionCorrect[id]) {
      numCorrectAnswers++;
    }
  }
  const percentageCorrect = numQuestionsAnswered > 0 ? (numCorrectAnswers / numQuestionsAnswered) * 100 : 0;

  // Prepare chart data
  const chartData = questionIds.map(id => ({
    questionId: id,
    time: questionTimes[id],
  }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.textPrimary }]}>Dashboard</Text>
      <View style={styles.metricsContainer}>
        <Text style={[styles.metricText, { color: colors.textSecondary }]}>Average Time: {averageTime.toFixed(2)}s</Text>
        <Text style={[styles.metricText, { color: colors.textSecondary }]}>Answered: {numQuestionsAnswered}</Text>
        <Text style={[styles.metricText, { color: colors.textSecondary }]}>Correct: {percentageCorrect.toFixed(2)}%</Text>
        <Text style={[styles.metricText, { color: colors.textSecondary }]}>Bookmarked: {bookmarkedQuestionIds.length}</Text>
      </View>

      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: spacing.md }}
      >
        <VictoryAxis
          label="Question ID"
          style={{ axisLabel: { ...typography.body, padding: 30, color: colors.textSecondary } }}
        />
        <VictoryAxis
          dependentAxis
          label="Time (s)"
          style={{ axisLabel: { ...typography.body, padding: 30, color: colors.textSecondary } }}
        />
        <VictoryBar
          data={chartData}
          x="questionId"
          y="time"
          style={{ data: { fill: colors.primary } }}
        />
      </VictoryChart>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  header: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  metricsContainer: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: spacing.sm,
  },
  metricText: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
});

export default DashboardScreen;