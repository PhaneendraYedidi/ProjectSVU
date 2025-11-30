// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useQuestionStore } from '../store/questionStore';
import { mockQuestions, Question } from '../data/questions'; // Import mock questions for now

const ProfileScreen: React.FC = () => {
  const { bookmarkedQuestionIds } = useQuestionStore();

  // Get the actual bookmarked questions from the mock data
  const bookmarkedQuestions = mockQuestions.filter(question =>
    bookmarkedQuestionIds.includes(question.id)
  );

  const renderItem = ({ item }: { item: Question }) => (
    <View style={styles.questionItem}>
      <Text>{item.question}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookmarked Questions</Text>
      <FlatList
        data={bookmarkedQuestions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ProfileScreen;
