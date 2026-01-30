import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


import { MOCK_QUESTIONS } from '../../data/questions'; // Using local mock data for prototype
import CustomDrawer from '../../components/CustomDrawer';

const DURATION_SECONDS = 20 * 60; // 20 minutes

const MockTestScreen = () => {
  const navigation = useNavigation<any>();
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isExampleSubmitted, setIsExampleSubmitted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (qId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsExampleSubmitted(true);
    Alert.alert("Test Submitted", "See your results in the history tab.");
    navigation.navigate('Dashboard');
  };

  const activeQuestion = MOCK_QUESTIONS[activeQuestionIndex];

  const getStatusColor = (index: number) => {
    const q = MOCK_QUESTIONS[index];
    if (index === activeQuestionIndex) return '#2196F3'; // Current
    if (answers[q.id] !== undefined) return '#4CAF50'; // Answered
    return 'transparent'; // Unattempted
  };

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

        <TouchableOpacity onPress={() => handleSubmit()} style={styles.submitBtn}>
          <Text style={styles.submitText}>Submit</Text>
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
            {MOCK_QUESTIONS.map((q, idx) => (
              <TouchableOpacity
                key={q.id}
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
          <Text style={styles.qIndex}>Question {activeQuestionIndex + 1} of {MOCK_QUESTIONS.length}</Text>
          <Text style={styles.qText}>{activeQuestion.text}</Text>
        </View>

        {activeQuestion.options.map((option, idx) => {
          const isSelected = answers[activeQuestion.id] === idx;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionItem,
                isSelected && styles.optionSelected
              ]}
              onPress={() => handleSelectOption(activeQuestion.id, idx)}
            >
              <View style={[styles.radioCircle, isSelected && { borderColor: '#2196F3' }]}>
                {isSelected && <View style={styles.selectedRb} />}
              </View>
              <Text style={[styles.optionText, isSelected && { color: '#FFF' }]}>{option}</Text>
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
          disabled={activeQuestionIndex === MOCK_QUESTIONS.length - 1}
          onPress={() => setActiveQuestionIndex(i => i + 1)}
          style={[styles.navBtn, activeQuestionIndex === MOCK_QUESTIONS.length - 1 && { opacity: 0.3 }]}
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
