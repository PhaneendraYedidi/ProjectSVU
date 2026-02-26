import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { apiClient } from '../../api/client';
import CustomDrawer from '../../components/CustomDrawer';
import { useMockStore } from './mock.store';

const DEFAULT_DURATION_SECONDS = 20 * 60; // 20 minutes

interface MockQuestion {
  _id: string;
  question: string;
  options: { key: string; text: string }[];
}

const MockTestScreen = () => {
  const navigation = useNavigation<any>();
  const mockStore = useMockStore();

  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION_SECONDS);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [mockTestId, setMockTestId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({}); // key is questionId, value is option key
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadMockTest();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadMockTest = async () => {
    try {
      setIsLoading(true);

      // Priority 1: Use the mock test data loaded from the template (List Screen)
      if (mockStore.mockSessionId && mockStore.questions?.length > 0) {
        setQuestions(mockStore.questions);
        setMockTestId(mockStore.mockSessionId);

        // Duration is coming in minutes, convert to seconds
        const durationSec = (mockStore.duration || 20) * 60;
        setTimeLeft(durationSec);
        startTimer();
        return;
      }

      // Priority 2: Fallback (Legacy/Direct navigation) - Fetch random mock test
      const res = await apiClient.post('/mock/start', {});
      setQuestions(res.data.questions);
      setMockTestId(res.data.mockTestId);
      setTimeLeft(DEFAULT_DURATION_SECONDS);
      startTimer();
    } catch (error: any) {
      console.error("Failed to start mock test:", error);
      Alert.alert("Error", "Failed to load mock test. Please try again.");
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(true); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (qId: string, optionKey: string) => {
    setAnswers(prev => ({ ...prev, [qId]: optionKey }));
  };

  const handleSubmit = async (auto = false) => {
    if (isSubmitting) return;

    if (timerRef.current) clearInterval(timerRef.current);

    if (!auto) {
      // Confirmation if manually submitting
      const unanswered = questions.length - Object.keys(answers).length;
      if (unanswered > 0) {
        // Optional: ask for confirmation
      }
    }

    try {
      setIsSubmitting(true);
      const res = await apiClient.post(`/mock/${mockTestId}/submit`, {
        answers
      });

      const { score, total, percentage } = res.data;

      Alert.alert(
        "Test Submitted",
        `You scored ${score}/${total} (${percentage}%)`,
        [
          { text: "Go to Dashboard", onPress: () => navigation.navigate('Dashboard') }
        ]
      );
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", "Failed to submit test. Please try again.");
      setIsSubmitting(false);
      // Resume timer if error? Probably better to just let them try submitting again.
    }
  };

  const getStatusColor = (index: number) => {
    const q = questions[index];
    if (index === activeQuestionIndex) return '#2196F3'; // Current
    if (answers[q._id]) return '#4CAF50'; // Answered
    return 'transparent'; // Unattempted
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Preparing your test...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>No questions available.</Text>
      </View>
    );
  }

  const activeQuestion = questions[activeQuestionIndex];

  return (
    <View style={styles.container}>
      <CustomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
          <Icon name="menu-outline" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.timerBadge}>
          <Icon name="alarm-outline" size={20} color={timeLeft < 60 ? "#FF5252" : "#FFF"} />
          <Text style={[styles.timerText, timeLeft < 60 && { color: '#FF5252' }]}>
            {formatTime(timeLeft)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Matrix Toggle */}
      <TouchableOpacity
        style={styles.matrixToggle}
        onPress={() => setIsMatrixOpen(!isMatrixOpen)}
      >
        <Icon name="grid-outline" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Question Matrix Overlay */}
      {isMatrixOpen && (
        <View style={styles.matrixContainer}>
          <Text style={styles.matrixTitle}>Question Map</Text>
          <View style={styles.grid}>
            {questions.map((q, idx) => (
              <TouchableOpacity
                key={q._id}
                style={[
                  styles.gridItem,
                  { backgroundColor: getStatusColor(idx), borderColor: '#555', borderWidth: 1 }
                ]}
                onPress={() => {
                  setActiveQuestionIndex(idx);
                  setIsMatrixOpen(false);
                }}
              >
                <Text style={{ color: '#FFF' }}>{idx + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Question Content */}
      <View style={styles.content}>
        <View style={styles.questionHeader}>
          <Text style={styles.qIndex}>Question {activeQuestionIndex + 1} of {questions.length}</Text>
          <Text style={styles.qText}>{activeQuestion.question}</Text>
        </View>

        {activeQuestion.options.map((option, idx) => {
          const isSelected = answers[activeQuestion._id] === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionItem,
                isSelected && styles.optionSelected
              ]}
              onPress={() => handleSelectOption(activeQuestion._id, option.key)}
            >
              <View style={[styles.radioCircle, isSelected && { borderColor: '#2196F3' }]}>
                {isSelected && <View style={styles.selectedRb} />}
              </View>
              <Text style={[styles.optionText, isSelected && { color: '#FFF' }]}>{option.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={activeQuestionIndex === 0}
          onPress={() => setActiveQuestionIndex(i => i - 1)}
          style={[styles.navBtn, activeQuestionIndex === 0 && { opacity: 0.3 }]}
        >
          <Icon name="chevron-back" size={24} color="#FFF" />
          <Text style={styles.navText}>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={activeQuestionIndex === questions.length - 1}
          onPress={() => setActiveQuestionIndex(i => i + 1)}
          style={[styles.navBtn, activeQuestionIndex === questions.length - 1 && { opacity: 0.3 }]}
        >
          <Text style={styles.navText}>Next</Text>
          <Icon name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#1E1E1E',
    elevation: 5,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center'
  },
  submitText: {
    color: '#000',
    fontWeight: 'bold',
  },
  matrixToggle: {
    position: 'absolute',
    top: 110,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 8,
  },
  matrixContainer: {
    position: 'absolute',
    top: 160,
    right: 20,
    width: 200,
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 12,
    zIndex: 20,
    elevation: 10,
  },
  matrixTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    width: 30,
    height: 30,
    margin: 4,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionHeader: {
    marginBottom: 30,
  },
  qIndex: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 8,
  },
  qText: {
    color: '#FFF',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  optionSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#152535',
  },
  optionText: {
    color: '#DDD',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1E1E1E',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  navText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
});

export default MockTestScreen;
