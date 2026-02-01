import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    withRepeat,
    runOnJS
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import Icon from 'react-native-vector-icons/Ionicons';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import { Question } from '../data/questions';
import OptionItem from './OptionItem';
import SideActionBar from './SideActionBar';

const { width, height } = Dimensions.get('window');

interface QuestionCardProps {
    question: any;
    isActive: boolean; // To pause timer if scrolled away?
    onAnswer: (optionIndex: number, isCorrect: boolean) => void;
    onBookmark?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, isActive, onAnswer, onBookmark }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [timer, setTimer] = useState(0);

    // Timer Ref to clear interval
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastTapRef = useRef<number>(0);
    const confettiRef = useRef<ConfettiCannon>(null);

    // Animation values
    const shakeTranslateX = useSharedValue(0);

    useEffect(() => {
        if (isActive && !isAnswered) {
            intervalRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, isAnswered]);

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;

        setSelectedOption(index);
        setIsAnswered(true);

        if (intervalRef.current) clearInterval(intervalRef.current);

        if (index === question.correctOptionIndex) {
            setIsCorrect(true);
            if (confettiRef.current) confettiRef.current.start();
            onAnswer(index, true);
        } else {
            setIsCorrect(false);
            triggerShake();
            onAnswer(index, false);
        }
    };

    const triggerShake = () => {
        shakeTranslateX.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withRepeat(withTiming(10, { duration: 100 }), 5, true),
            withTiming(0, { duration: 50 })
        );
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shakeTranslateX.value }],
        };
    });

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
            setShowExplanation((prev) => !prev);
        }
        lastTapRef.current = now;
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSwipeBookmark = () => {
        console.log("Swipe Right: Bookmark triggered");
        if (onBookmark) onBookmark();
    };

    const swipeGesture = Gesture.Pan()
        .activeOffsetX(20)
        .failOffsetY(20)
        .onEnd((e) => {
            if (e.translationX > 50) {
                runOnJS(handleSwipeBookmark)();
            }
        });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={swipeGesture}>
                <TouchableWithoutFeedback onPress={handleDoubleTap}>
                    <Animated.View style={[styles.container, animatedStyle]}>
                        {/* Background / Main Content */}
                        <View style={styles.contentContainer}>
                            {/* Top Bar: Timer */}
                            <View style={styles.topBar}>
                                <View style={styles.timerBadge}>
                                    <Icon name="time-outline" size={16} color="#FFF" style={{ marginRight: 4 }} />
                                    <Text style={styles.timerText}>{formatTime(timer)}</Text>
                                </View>
                            </View>

                            {/* Question */}
                            <ScrollView contentContainerStyle={styles.scrollContent}>
                                <Text style={styles.questionText}>{question.text}</Text>

                                <View style={styles.optionsContainer}>
                                    {question.options.map((option: string, index: number) => (
                                        <OptionItem
                                            key={index}
                                            text={option}
                                            isSelected={selectedOption === index}
                                            isCorrect={isAnswered && index === question.correctOptionIndex}
                                            isWrong={isAnswered && selectedOption === index && index !== question.correctOptionIndex}
                                            onPress={() => handleOptionSelect(index)}
                                            disabled={isAnswered}
                                        />
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Side Action Bar */}
                        <SideActionBar
                            onLike={() => console.log('Like')}
                            onDislike={() => console.log('Dislike')}
                            onBookmark={onBookmark ? onBookmark : () => console.log('Bookmark')}
                            onComment={() => console.log('Comment')}
                            onShare={() => console.log('Share')}
                        />

                        {/* Chat / AI Option (Bottom) */}
                        <View style={styles.bottomChatBar}>
                            <Icon name="chatbubbles" size={24} color="#FFF" />
                            <Text style={styles.chatText}>Ask AI...</Text>
                        </View>

                        {/* Explanation Overlay */}
                        {showExplanation && (
                            <View style={styles.explanationOverlay}>
                                <Text style={styles.explanationTitle}>Explanation</Text>
                                <Text style={styles.explanationText}>{question.explanation}</Text>
                                <Text style={styles.explanationHint}>(Double tap to close)</Text>
                            </View>
                        )}

                        {/* Confetti */}
                        <ConfettiCannon
                            count={200}
                            origin={{ x: width / 2, y: -20 }}
                            autoStart={false}
                            ref={confettiRef}
                            fadeOut={true}
                        />
                    </Animated.View>
                </TouchableWithoutFeedback>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        width,
        height: height,
        backgroundColor: '#F5F5F5', // Or a darker theme color
        position: 'relative',
    },
    contentContainer: {
        flex: 1,
        paddingTop: 60,
        paddingLeft: 20,
        paddingRight: 20, // Standard padding as panel is collapsible
        paddingBottom: 100,
    },
    topBar: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    timerBadge: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center',
    },
    timerText: {
        color: 'white',
        fontWeight: 'bold',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 30,
        lineHeight: 32,
        textShadowColor: 'rgba(255,255,255,0.5)', // Subtle shadow
        textShadowRadius: 10,
    },
    optionsContainer: {
        width: '100%',
    },
    bottomChatBar: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        elevation: 5,
    },
    chatText: {
        color: '#FFF',
        marginLeft: 8,
        fontWeight: '600',
    },
    explanationOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        zIndex: 20,
    },
    explanationTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 20,
    },
    explanationText: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 26,
    },
    explanationHint: {
        marginTop: 40,
        color: '#AAA',
        fontSize: 14,
    }
});

export default QuestionCard;
