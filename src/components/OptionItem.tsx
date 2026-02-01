import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface OptionItemProps {
    text: string;
    isSelected: boolean;
    isCorrect?: boolean; // null if not yet answered or not selected
    isWrong?: boolean;   // true if selected and wrong
    onPress: () => void;
    disabled: boolean;
}

const OptionItem: React.FC<OptionItemProps> = ({
    text,
    isSelected,
    isCorrect,
    isWrong,
    onPress,
    disabled,
}) => {
    let backgroundColor = '#FFFFFF';
    let borderColor = '#E0E0E0';
    let textColor = '#333333';

    if (isSelected) {
        if (isCorrect) {
            backgroundColor = '#4CAF50'; // Green
            borderColor = '#4CAF50';
            textColor = '#FFFFFF';
        } else if (isWrong) {
            backgroundColor = '#F44336'; // Red
            borderColor = '#F44336';
            textColor = '#FFFFFF';
        } else {
            // Just selected but answer not revealed? (Logic might be immediate, but keeping flexibility)
            backgroundColor = '#E0E0E0';
        }
    } else if (isCorrect && disabled) {
        // If disabled (answered), show the correct answer in green even if not selected?
        // User requirements didn't explicitly say to show correct answer if wrong selected, 
        // but usually standard. Implementing "Show Correct" logic can be passed in.
        // For now, let's stick to user spec: "if selected option is wrong then that option turns red"
        // It doesn't explicitly say "show green on correct one". 
        // I'll stick to strictly affecting the selected one, but maybe usually we want to see the right one.
        // Let's hold off on showing correct answer on unselected items unless needed.
    }

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor, borderColor }]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <View style={[styles.radioCircle, { borderColor: textColor }]}>
                {isSelected && <View style={[styles.selectedRb, { backgroundColor: textColor }]} />}
            </View>
            <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        marginBottom: 12,
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
        flex: 1,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});

export default OptionItem;
