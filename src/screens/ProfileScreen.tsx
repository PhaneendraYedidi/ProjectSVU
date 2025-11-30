import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Switch } from 'react-native';
import { useQuestionStore } from '../store/questionStore';
import { mockQuestions, Question } from '../data/questions'; // Import mock questions for now
import { ThemeContext } from '../context/ThemeContext';
import { lightColors, darkColors, typography, spacing } from '../styles/theme';

const ProfileScreen: React.FC = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const colors = isDarkMode ? darkColors : lightColors;
  const { bookmarkedQuestionIds } = useQuestionStore();

  // Get the actual bookmarked questions from the mock data
  const bookmarkedQuestions = mockQuestions.filter(question =>
    bookmarkedQuestionIds.includes(question.id)
  );

  const renderItem = ({ item }: { item: Question }) => (
    <View style={[styles.questionItem, {backgroundColor: colors.surface, borderColor: colors.border}]}>
      <Text style={{color: colors.textPrimary}}>{item.question}</Text>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg}}>
        <Text style={[styles.questionItem, {color: colors.textPrimary}]}>Theme</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
        />
      </View>
      <Text style={[styles.header, {color: colors.textPrimary}]}>Bookmarked Questions</Text>
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
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  header: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  questionItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ProfileScreen;