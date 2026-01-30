import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SideActionBarProps {
    onLike?: () => void;
    onDislike?: () => void;
    onBookmark?: () => void;
    onComment?: () => void;
    onShare?: () => void;
}

const ActionButton = ({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <Icon name={icon} size={30} color="#FFFFFF" style={styles.shadow} />
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
    return (
        <View style={styles.container}>
            <ActionButton icon="heart-outline" label="Like" onPress={onLike} />
            <ActionButton icon="thumbs-down-outline" label="Dislike" onPress={onDislike} />
            <ActionButton icon="bookmark-outline" label="Save" onPress={onBookmark} />
            <ActionButton icon="chatbubble-outline" label="Comment" onPress={onComment} />
            <ActionButton icon="share-social-outline" label="Share" onPress={onShare} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 10,
        bottom: 100, // Adjust based on where chat option is
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    actionButton: {
        alignItems: 'center',
        marginBottom: 20,
    },
    actionLabel: {
        color: '#FFFFFF',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    shadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5,
    }
});

export default SideActionBar;
