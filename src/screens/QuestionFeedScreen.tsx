import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, ViewToken, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Alert, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import QuestionCard from '../components/QuestionCard';
import CustomDrawer from '../components/CustomDrawer';
import { apiClient } from '../api/client';
import { useDashboardStore } from '../features/dashboard/dashboard.store';

const QuestionFeedScreen = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // To avoid fetching multiple times
    const fetchedPages = useRef<Set<number>>(new Set());

    // Batch attempts
    const attemptQueue = useRef<any[]>([]);

    const navigation = useNavigation<any>();

    // Submit batch on blur or unmount
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            flushAttempts();
        });
        return unsubscribe;
    }, [navigation]);

    const flushAttempts = async () => {
        if (attemptQueue.current.length === 0) return;

        const attemptsToSubmit = [...attemptQueue.current];
        attemptQueue.current = []; // Clear queue immediately

        try {
            console.log("Flushing attempts:", attemptsToSubmit.length);
            await apiClient.post('/practice/submit-batch', { attempts: attemptsToSubmit });
        } catch (error) {
            console.error("Failed to submit batch:", error);
            // Optional: Re-queue failed attempts? 
            // For now, logging error. Re-queueing might cause infinite loops if server is broken.
        }
    };

    const fetchQuestions = async () => {
        if (loading || fetchedPages.current.has(page)) return;

        try {
            setLoading(true);
            const res = await apiClient.get(`/practice/questions?page=${page}`);

            // Adapt backend question to frontend QuestionCard format
            // Backend: { _id, question, options: [{key, text}], correctAnswer: 'key', ... }
            // Frontend Card: { id, text, options: string[], correctOptionIndex: number, explanation }

            const newQuestions = res.data.questions.map((q: any) => {
                // Find correct index
                const correctIndex = q.options.findIndex((o: any) => o.key === q.correctAnswer);

                return {
                    id: q._id,
                    text: q.question,
                    options: q.options.map((o: any) => o.text), // just text for display
                    correctOptionIndex: correctIndex, // Assuming we trust client side for feed
                    explanation: q.explanation || "No explanation provided.",
                    // Keep original for submission if needed
                    _original: q
                };
            });

            if (newQuestions.length > 0) {
                setQuestions(prev => [...prev, ...newQuestions]);
                fetchedPages.current.add(page);
                if (page === 1) setActiveQuestionId(newQuestions[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch feed:", error);
            // Alert.alert("Error", "Could not load questions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [page]);

    const handleAnswer = (question: any, optionIndex: number, isCorrect: boolean) => {
        // Queue attempt locally
        try {
            const originalQ = question._original;
            const selectedOptionKey = originalQ.options[optionIndex].key;

            attemptQueue.current.push({
                questionId: question.id,
                selectedOption: selectedOptionKey,
                isCorrect: isCorrect, // Just for ref, backend re-verifies
                timeTaken: 0,
                mode: "practice",
                topic: originalQ.subject,
                year: originalQ.year
            });
            console.log("Queued answer. Queue size:", attemptQueue.current.length);
        } catch (err) {
            console.error("Failed to queue answer:", err);
        }
    };

    const loadMore = () => {
        setPage(p => p + 1);
    };

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const activeItem = viewableItems[0];
            if (activeItem.item && activeItem.isViewable) {
                setActiveQuestionId(activeItem.item.id);
            }
        }
    }, []);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 80,
    });

    const handleBookmark = async (questionId: string) => {
        try {
            // Need userId? Route expects userId in body? 
            // practice.routes.ts: const { userId, questionId } = req.body;
            // But auth middleware is there. "userId" in body might be needed if endpoint relies on it.
            // Let's rely on apiClient sending auth token, but I might need to send userId if backend requires it explicitly from body.
            // Backend line 205: const { userId, questionId } = req.body;
            // It doesn't fallback to req.user.id there! I should fix backend or send userId.
            // I'll fix backend to use req.user.id for better security, but for now I'll try to just send it if I have it, or assume backend update.
            // Actually, I'll update backend logic for /bookmark to use req.user.id.

            await apiClient.post('/practice/bookmark', { questionId });
            console.log("Bookmarked:", questionId);
            // Could show a toast
        } catch (err) {
            console.error("Failed to bookmark:", err);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <CustomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

            {/* Top Profile Icon */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => setIsDrawerOpen(true)}
                >
                    <Icon name="person-circle-outline" size={40} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={questions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <QuestionCard
                        question={item}
                        isActive={item.id === activeQuestionId}
                        onAnswer={(idx, isCorrect) => handleAnswer(item, idx, isCorrect)}
                        onBookmark={() => handleBookmark(item.id)}
                    />
                )}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig.current}
                snapToAlignment="start"
                decelerationRate="fast"
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#2196F3" />
                        </View>
                    ) : (
                        <View style={styles.centerContainer}>
                            <Text style={{ color: 'white' }}>No questions found.</Text>
                        </View>
                    )
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 50,
    },
    profileButton: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    centerContainer: {
        flex: 1,
        height: 600, // Approximate height to center in empty list
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default QuestionFeedScreen;
