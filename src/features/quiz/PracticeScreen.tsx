import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { fetchPracticeQuestions, fetchFilters, bookmarkQuestion } from "./quiz.service";
import CustomDrawer from "../../components/CustomDrawer";
import QuestionCard from "../../components/QuestionCard";
import { Question } from "../../data/questions"; // Interface reuse

export default function PracticeScreen() {
  const navigation = useNavigation<any>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mode State
  const [mode, setMode] = useState<'HOME' | 'QUIZ'>('HOME');
  const [filterType, setFilterType] = useState<'RANDOM' | 'TOPIC' | 'YEAR'>('RANDOM');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Data State
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [filters, setFilters] = useState<{ topics: string[], years: number[] }>({ topics: [], years: [] });

  // Modal State
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    // Pre-fetch filters
    fetchFilters().then(setFilters).catch(console.error);
  }, []);

  const startPractice = async (type: 'RANDOM' | 'TOPIC' | 'YEAR', value?: string) => {
    setFilterType(type);
    setSelectedFilter(value || null);

    if (type !== 'RANDOM' && !value) {
      setFilterModalVisible(true);
      return;
    }

    const params: any = { mode: type.toLowerCase() };
    if (type === 'TOPIC') params.topic = value;
    if (type === 'YEAR') params.year = value;

    try {
      const res = await fetchPracticeQuestions(params);
      if (res.questions && res.questions.length > 0) {
        // Adapt backend structure to frontend QuestionCard interface if needed
        // Backend: _id, question, options: [{key, text}], correctAnswer, explanation
        // Frontend: id, text, options: string[], correctOptionIndex, explanation
        // Need an adapter here.
        const adapted = res.questions.map((q: any) => ({
          id: q._id,
          text: q.question,
          // Assuming options come as array of objects or strings. 
          // Backend check showed options: [{key: 'A', text: '...'}]. 
          // Frontend QuestionCard expects simple string array for options.
          options: q.options.map((o: any) => o.text),
          // We need index. Backend sends "correctAnswer" as key "A", "B"? 
          // Or "correctAnswer" value? 
          // Checked backend: sends `correctAnswer`. 
          // We need to find index of option with key == correctAnswer.
          correctOptionIndex: q.options.findIndex((o: any) => o.key === q.correctAnswer),
          explanation: q.explanation
        }));

        setQuestions(adapted);
        setMode('QUIZ');
        setActiveQIndex(0);
      } else {
        Alert.alert("No questions found for this selection.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Failed to start practice.");
    }
  };

  const handleFilterSelect = (val: string) => {
    setFilterModalVisible(false);
    startPractice(filterType, val);
  };

  const renderHome = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Practice Mode</Text>
      <Text style={styles.subtitle}>Choose how you want to learn today.</Text>

      <TouchableOpacity style={styles.card} onPress={() => startPractice('RANDOM')}>
        <View style={[styles.iconBox, { backgroundColor: '#4CAF50' }]}>
          <Icon name="shuffle" size={30} color="#FFF" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Random Mix</Text>
          <Text style={styles.cardDesc}>Questions from all subjects.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => { setFilterType('TOPIC'); setFilterModalVisible(true); }}>
        <View style={[styles.iconBox, { backgroundColor: '#2196F3' }]}>
          <Icon name="library" size={30} color="#FFF" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Subject Wise</Text>
          <Text style={styles.cardDesc}>Focus on specific topics.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => { setFilterType('YEAR'); setFilterModalVisible(true); }}>
        <View style={[styles.iconBox, { backgroundColor: '#FFC107' }]}>
          <Icon name="calendar" size={30} color="#FFF" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Year Wise</Text>
          <Text style={styles.cardDesc}>Past year exam questions.</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderQuiz = () => (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        horizontal={false}
        pagingEnabled
        renderItem={({ item, index }) => (
          <QuestionCard
            question={item}
            isActive={index === activeQIndex}
          />
        )}
        onMomentumScrollEnd={(ev) => {
          const idx = Math.round(ev.nativeEvent.contentOffset.y / ev.nativeEvent.layoutMeasurement.height);
          setActiveQIndex(idx);
        }}
      />
      {/* Back Button Overlay */}
      <TouchableOpacity style={styles.backButton} onPress={() => setMode('HOME')}>
        <Icon name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Header only for HOME mode */}
      {mode === 'HOME' && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
            <Icon name="menu-outline" size={30} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Practice</Text>
          <View style={{ width: 30 }} />
        </View>
      )}

      {mode === 'HOME' ? renderHome() : renderQuiz()}

      {/* Filter Modal */}
      <Modal visible={isFilterModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {filterType === 'TOPIC' ? 'Topic' : 'Year'}</Text>
            <FlatList
              data={filterType === 'TOPIC' ? filters.topics : filters.years.map(String)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleFilterSelect(item)}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#1E1E1E",
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#AAA",
    marginBottom: 30,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    elevation: 3,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  cardDesc: {
    color: "#888",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "60%",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalItemText: {
    fontSize: 16,
    color: "#DDD",
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100
  }
});
