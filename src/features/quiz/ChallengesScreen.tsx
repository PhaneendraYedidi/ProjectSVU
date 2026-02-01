import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import CustomDrawer from '../../components/CustomDrawer';
import { createChallenge, joinChallenge } from './challenge.service';

const ChallengesScreen = () => {
    const navigation = useNavigation<any>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [activeTab, setActiveTab] = useState<'1v1' | 'GROUP'>('1v1');

    const handleCreateChallenge = async () => {
        try {
            const data = await createChallenge();
            Alert.alert("Challenge Created", `Share Code: ${data.code}`, [
                {
                    text: "Go to Lobby",
                    onPress: () => navigation.navigate('ChallengeLobby', { challengeId: data.challengeId, isCreator: true })
                }
            ]);
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Failed to create challenge");
        }
    };

    const handleJoinChallenge = async () => {
        if (!joinCode) {
            Alert.alert("Error", "Please enter a valid challenge code.");
            return;
        }
        try {
            const data = await joinChallenge(joinCode);
            navigation.navigate('ChallengeLobby', { challengeId: data.challengeId, isCreator: false });
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Failed to join challenge");
        }
    };

    return (
        <View style={styles.container}>
            <CustomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
                    <Icon name="menu-outline" size={30} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Challenges</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Mode Selector */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === '1v1' && styles.activeTab]}
                        onPress={() => setActiveTab('1v1')}
                    >
                        <Text style={[styles.tabText, activeTab === '1v1' && styles.activeTabText]}>1 vs 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'GROUP' && styles.activeTab]}
                        onPress={() => setActiveTab('GROUP')}
                    >
                        <Text style={[styles.tabText, activeTab === 'GROUP' && styles.activeTabText]}>Group Battle</Text>
                    </TouchableOpacity>
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Icon
                        name={activeTab === '1v1' ? "people" : "podium"}
                        size={80}
                        color="#FFC107"
                        style={{ marginBottom: 20 }}
                    />
                    <Text style={styles.heroTitle}>
                        {activeTab === '1v1' ? "Head to Head" : "Group Showdown"}
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        {activeTab === '1v1'
                            ? "Challenge a friend to a quick quiz battle. Highest score wins!"
                            : "Compete with multiple friends in a live quiz room."}
                    </Text>
                </View>

                {/* Actions */}
                <View style={styles.actionCard}>
                    <Text style={styles.cardTitle}>Join a Challenge</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Game Code"
                            placeholderTextColor="#666"
                            value={joinCode}
                            onChangeText={setJoinCode}
                            autoCapitalize="characters"
                        />
                        <TouchableOpacity style={styles.joinButton} onPress={handleJoinChallenge}>
                            <Text style={styles.joinButtonText}>JOIN</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.divider}>
                    <Text style={styles.dividerText}>OR</Text>
                </View>

                <TouchableOpacity style={styles.createButton} onPress={handleCreateChallenge}>
                    <Icon name="add-circle-outline" size={24} color="#FFF" style={{ marginRight: 10 }} />
                    <Text style={styles.createButtonText}>Create New Challenge</Text>
                </TouchableOpacity>

                {/* Recent History (Mock) */}
                <Text style={styles.historyTitle}>Recent Matches</Text>
                {/* Empty State for now */}
                <View style={styles.emptyHistory}>
                    <Text style={styles.emptyText}>No matches played yet.</Text>
                </View>

            </ScrollView>
        </View>
    );
};

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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 4,
        marginBottom: 30,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#2196F3',
    },
    tabText: {
        color: '#888',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#FFF',
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#AAA',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 20,
    },
    actionCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
    },
    input: {
        flex: 1,
        backgroundColor: '#2C2C2C',
        borderRadius: 8,
        paddingHorizontal: 15,
        color: '#FFF',
        height: 50,
        marginRight: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    joinButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 8,
    },
    joinButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    divider: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerText: {
        color: '#666',
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: '#FFC107',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 40,
    },
    createButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 15,
    },
    emptyHistory: {
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 12,
        borderStyle: 'dashed',
    },
    emptyText: {
        color: '#666',
    }
});

export default ChallengesScreen;
