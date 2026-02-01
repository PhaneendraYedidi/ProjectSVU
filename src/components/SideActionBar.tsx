import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

interface SideActionBarProps {
    onLike?: () => void;
    onDislike?: () => void;
    onBookmark?: () => void;
    onComment?: () => void;
    onShare?: () => void;
}

const ActionButton = ({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <Icon name={icon} size={24} color="#FFFFFF" />
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const SideActionBar: React.FC<SideActionBarProps> = ({
    onLike,
    onDislike,
    onBookmark,
    onComment,
    onShare,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const translateX = useSharedValue(60); // 60 is the width of the panel, so it starts moved 60px to right (hidden)

    const toggleMenu = () => {
        if (isOpen) {
            // Close: move to Right (translateX = 60)
            translateX.value = withTiming(60, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
        } else {
            // Open: move to 0 (visible)
            translateX.value = withTiming(0, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
        }
        setIsOpen(!isOpen);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <View style={styles.container}>
            {/* Sliding Container holds Toggle Button + Panel */}
            <Animated.View style={[styles.slidingContainer, animatedStyle]}>

                {/* Toggle Button (Chevron) attached to the left of the panel */}
                <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu} activeOpacity={0.8}>
                    <Icon name={isOpen ? "chevron-forward" : "chevron-back"} size={20} color="#FFF" />
                </TouchableOpacity>

                {/* Panel Content (The visible strip) */}
                <View style={styles.panelBackground}>
                    <ActionButton icon="heart-outline" label="Like" onPress={onLike} />
                    <ActionButton icon="thumbs-down-outline" label="Dislike" onPress={onDislike} />
                    <ActionButton icon="bookmark-outline" label="Save" onPress={onBookmark} />
                    <ActionButton icon="chatbubble-outline" label="Comment" onPress={onComment} />
                    <ActionButton icon="share-social-outline" label="Share" onPress={onShare} />
                </View>

            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        zIndex: 20,
        pointerEvents: 'box-none',
        width: 84, // 60 (panel) + 24 (button) space
        overflow: 'visible',
    },
    slidingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: 0, // Anchor to right edge
        // Initial state is controlled by translateX in component
    },
    toggleButton: {
        width: 24,
        height: 40,
        backgroundColor: 'rgba(30,30,30,0.85)',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow to match panel
        shadowColor: "#000",
        shadowOffset: { width: -2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    panelBackground: {
        backgroundColor: 'rgba(30, 30, 30, 0.85)',
        borderTopLeftRadius: 0, // Flat left side now as it connects to toggle
        borderBottomLeftRadius: 20, // Keep this styled if desired, or 0
        // Actually for Edge Panel aesthetics, maybe uniform or just let toggle be the handle
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,

        paddingVertical: 15,
        paddingHorizontal: 8,
        width: 60,
        alignItems: 'center',
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        // Shadow 
        shadowColor: "#000",
        shadowOffset: { width: -2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    actionButton: {
        alignItems: 'center',
        marginVertical: 12,
    },
    actionLabel: {
        color: '#FFFFFF',
        fontSize: 10,
        marginTop: 4,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default SideActionBar;
