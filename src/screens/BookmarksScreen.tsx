import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity, ActivityIndicator, ViewToken } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';
import QuestionCard from '../components/QuestionCard';

const BookmarksScreen = () => {
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/practice/bookmarks');
            // Adapt data
            const adapted = res.data.bookmarks.map((q: any) => {
                const correctIndex = q.options.findIndex((o: any) => o.key === q.correctAnswer);
                return {
                    id: q._id,
                    text: q.question,
                    options: q.options.map((o: any) => o.text),
                    correctOptionIndex: correctIndex,
                    explanation: q.explanation,
                    _original: q
                };
            });
            setBookmarks(adapted);
            if (adapted.length > 0) setActiveQuestionId(adapted[0].id);
        } catch (error) {
            console.error("Failed to fetch bookmarks", error);
        } finally {
            setLoading(false);
        }
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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bookmarks</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            ) : (
                <FlatList
                    data={bookmarks}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <QuestionCard
                            question={item}
                            isActive={item.id === activeQuestionId}
                            onAnswer={() => { }} // Read-only or practice? maybe just view.
                        />
                    )}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig.current}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No bookmarks yet.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: '#1E1E1E',
        elevation: 4,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#AAA',
        fontSize: 16,
    }
});

export default BookmarksScreen;
