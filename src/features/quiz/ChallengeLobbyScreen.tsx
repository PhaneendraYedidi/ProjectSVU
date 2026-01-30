import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getChallenge } from './challenge.service';
import Icon from 'react-native-vector-icons/Ionicons';

const ChallengeLobbyScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { challengeId, isCreator } = route.params;

    const [challenge, setChallenge] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const pollChallenge = async () => {
        try {
            const data = await getChallenge(challengeId);
            setChallenge(data);
            setLoading(false);

            // Auto-start if Active? Or wait for user?
            if (data.status === 'ACTIVE') {
                // Game started!
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        pollChallenge();
        const interval = setInterval(pollChallenge, 3000); // 3s polling
        return () => clearInterval(interval);
    }, []);

    const handleStartGame = () => {
        if (!challenge) return;
        // Navigate to Quiz with special params
        navigation.navigate('Practice', {
            screen: 'Quiz', // Need to ensure Practice handles params or create separate GameScreen
            params: {
                mode: 'CHALLENGE',
                questions: challenge.questions,
                challengeId: challenge._id
            }
        });
    };

    if (loading) return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.text}>Loading Lobby...</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Challenge Lobby</Text>
                <Text style={styles.code}>{challenge?.code}</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.playerRow}>
                    <Icon name="person" size={24} color="#4CAF50" />
                    <Text style={styles.playerText}>
                        {challenge?.creator?.name} (Host)
                    </Text>
                    <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                </View>

                <View style={[styles.playerRow, { marginTop: 20 }]}>
                    <Icon name="person" size={24} color={challenge?.joiner ? "#2196F3" : "#666"} />
                    <Text style={[styles.playerText, !challenge?.joiner && { color: '#666', fontStyle: 'italic' }]}>
                        {challenge?.joiner ? challenge.joiner.name : "Waiting for opponent..."}
                    </Text>
                    {challenge?.joiner && <Icon name="checkmark-circle" size={20} color="#2196F3" />}
                </View>
            </View>

            <View style={styles.statusBox}>
                <Text style={styles.statusText}>
                    Status: <Text style={{ fontWeight: 'bold' }}>{challenge?.status}</Text>
                </Text>
            </View>

            {challenge?.status === 'ACTIVE' ? (
                <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                    <Text style={styles.btnText}>START GAME</Text>
                    <Icon name="play" size={20} color="#FFF" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            ) : (
                <View style={styles.waitBox}>
                    <ActivityIndicator color="#FFC107" />
                    <Text style={styles.waitText}>Waiting for opponent to join...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: { color: '#FFF', marginTop: 10 },
    header: { alignItems: 'center', marginBottom: 40 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
    code: { fontSize: 36, fontWeight: '900', color: '#FFC107', letterSpacing: 4 },
    card: {
        width: '100%',
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerText: {
        flex: 1,
        fontSize: 18,
        color: '#FFF',
        marginLeft: 15,
    },
    statusBox: {
        marginBottom: 30,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 8
    },
    statusText: { color: '#DDD', fontSize: 16 },
    startButton: {
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 5
    },
    btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    waitBox: { flexDirection: 'row', alignItems: 'center' },
    waitText: { color: '#AAA', marginLeft: 10 }
});

export default ChallengeLobbyScreen;
