// src/components/SideActionPanel.tsx
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import IconAction from './IconAction';
import { spacing } from '../styles/theme';
import { useQuestionStore } from '../store/questionStore';

interface SideActionPanelProps {
  questionId: string;
}

const SideActionPanel: React.FC<SideActionPanelProps> = ({ questionId }) => {
  const { bookmarkedQuestionIds, toggleBookmark } = useQuestionStore();
  const isBookmarked = bookmarkedQuestionIds.includes(questionId);

  // These onPress handlers are just placeholders for now
  const handleLike = () => Alert.alert('Liked!');
  const handleDislike = () => Alert.alert('Disliked!');
  const handleComment = () => Alert.alert('Opening comments...');
  const handleShare = () => Alert.alert('Sharing...');

  return (
    <View style={styles.container}>
      <IconAction iconName="thumb-up-outline" label="Like" onPress={handleLike} />
      <IconAction iconName="thumb-down-outline" label="Dislike" onPress={handleDislike} />
      <IconAction
        iconName={isBookmarked ? 'bookmark' : 'bookmark-outline'}
        label="Bookmark"
        onPress={() => toggleBookmark(questionId)}
        isActive={isBookmarked}
      />
      <IconAction iconName="comment-outline" label="Comment" onPress={handleComment} />
      <IconAction iconName="share-outline" label="Share" onPress={handleShare} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    paddingBottom: 100, // Adjust this value to align with the QuestionCard
    paddingRight: spacing.sm,
  },
});

export default SideActionPanel;
