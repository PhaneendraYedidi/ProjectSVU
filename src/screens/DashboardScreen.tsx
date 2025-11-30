import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuestionStore } from '../store/questionStore';
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from 'victory-native';

const DashboardScreen: React.FC = () => {
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
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <Text>Average Time per Question: {averageTime.toFixed(2)}s</Text>
      <Text>Total Questions Answered: {numQuestionsAnswered}</Text>
      <Text>Percentage Correct: {percentageCorrect.toFixed(2)}%</Text>
      <Text>Number of Bookmarked Questions: {bookmarkedQuestionIds.length}</Text>

      <VictoryChart
        theme={VictoryTheme?.material}
        domainPadding={{ x: 20 }}
      >
        <VictoryAxis
          label="Question ID"
          style={{ axisLabel: { padding: 30 } }}
        />
        <VictoryAxis
          dependentAxis
          label="Time (s)"
          style={{ axisLabel: { padding: 30 } }}
        />
        <VictoryBar
          data={chartData}
          x="questionId"
          y="time"
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default DashboardScreen;