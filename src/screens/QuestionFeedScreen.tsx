import React, { useRef, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ViewToken, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { MOCK_QUESTIONS } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import CustomDrawer from '../components/CustomDrawer';

const QuestionFeedScreen = () => {
    const [activeQuestionId, setActiveQuestionId] = useState<string>(MOCK_QUESTIONS[0].id);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            // The first viewable item is considered active
            const activeItem = viewableItems[0];
            if (activeItem.item && activeItem.isViewable) {
                setActiveQuestionId(activeItem.item.id);
            }
        }
    }, []);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 80, // item is considered visible if 80% is on screen
    });

    const navigation = useNavigation<any>();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
                data={MOCK_QUESTIONS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <QuestionCard
                        question={item}
                        isActive={item.id === activeQuestionId}
                    />
                )}
                pagingEnabled // This gives the "snap" effect
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig.current}
                // Snap settings for smoother experience (optional combined with pagingEnabled)
                snapToAlignment="start"
                decelerationRate="fast"
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
        top: 50, // Adjust for status bar
        left: 20,
        zIndex: 50,
    },
    profileButton: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
});

export default QuestionFeedScreen;
