import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Share, ActivityIndicator, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { apiClient } from '../api/client';
import { useNavigation } from '@react-navigation/native';

const ReferralScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        referralCode: '',
        referralCount: 0,
        referralEarnings: 0,
        referredUsers: []
    });

    useEffect(() => {
        fetchReferralData();
    }, []);

    const fetchReferralData = async () => {
        try {
            const res = await apiClient.get('/user/referrals');
            console.log(res.data);
            setData(res.data);
        } catch (error) {
            console.error("Failed to fetch referral data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Join ProjectSVU with my code ${data.referralCode} and start learning!`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Refer & Earn</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                </View>
            ) : (
                <View style={styles.content}>
                    {/* Stats Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Your Total Earnings</Text>
                        <Text style={styles.earnings}>₹{data.referralEarnings}</Text>
                        <View style={styles.row}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{data.referralCount}</Text>
                                <Text style={styles.statLabel}>Invited</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>50</Text>
                                <Text style={styles.statLabel}>Per Invite</Text>
                            </View>
                        </View>
                    </View>

                    {/* Code Section */}
                    <View style={styles.codeContainer}>
                        <Text style={styles.codeLabel}>Your Referral Code</Text>
                        <TouchableOpacity style={styles.codeBox} onPress={handleShare}>
                            <Text style={styles.codeText}>{data.referralCode || "LOADING..."}</Text>
                            <Icon name="copy-outline" size={20} color="#4CAF50" />
                        </TouchableOpacity>
                        <Text style={styles.shareHint}>Tap to share</Text>
                    </View>

                    {/* Referrals List */}
                    <Text style={styles.sectionTitle}>Your Referrals</Text>
                    <FlatList
                        data={data.referredUsers}
                        keyExtractor={(item: any) => item._id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={<Text style={styles.emptyText}>No referrals yet. Invite friends!</Text>}
                        renderItem={({ item }) => (
                            <View style={styles.userItem}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{item.name[0]?.toUpperCase()}</Text>
                                </View>
                                <View>
                                    <Text style={styles.userName}>{item.name}</Text>
                                    <Text style={styles.userDate}>Joined {new Date(item.createdAt).toLocaleDateString()}</Text>
                                </View>
                                <Text style={styles.userStatus}>Active</Text>
                            </View>
                        )}
                    />
                </View>
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
    content: {
        flex: 1,
        padding: 20,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#333',
    },
    cardLabel: {
        color: '#AAA',
        fontSize: 14,
        marginBottom: 5,
    },
    earnings: {
        color: '#4CAF50',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#333',
    },
    statValue: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#AAA',
        fontSize: 12,
        marginTop: 2,
    },
    codeContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    codeLabel: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 10,
    },
    codeBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    codeText: {
        color: '#4CAF50',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginRight: 15,
    },
    shareHint: {
        color: '#666',
        fontSize: 12,
        marginTop: 8,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    userName: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    userDate: {
        color: '#666',
        fontSize: 12,
    },
    userStatus: {
        marginLeft: 'auto',
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: '500',
    },
});

export default ReferralScreen;
