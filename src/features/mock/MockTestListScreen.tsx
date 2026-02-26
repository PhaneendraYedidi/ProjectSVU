import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import CustomDrawer from "../../components/CustomDrawer";
import { listMockTests, startMockFromTemplate } from "./mock.service";
import { useMockStore } from "./mock.store";
import { useCallback } from "react";

export default function MockTestListScreen() {
    const navigation = useNavigation();
    const [mockTests, setMockTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const setMockData = useMockStore((state: any) => state.startMock);

    useFocusEffect(
        useCallback(() => {
            loadMockTests();
        }, [])
    );

    const loadMockTests = async () => {
        try {
            const data = await listMockTests();

            // Sort to put unattempted (NOT_STARTED) at the top, then IN_PROGRESS, then SUBMITTED
            const statusOrder: Record<string, number> = {
                NOT_STARTED: 0,
                IN_PROGRESS: 1,
                SUBMITTED: 2,
            };

            const sortedData = data.sort((a: any, b: any) => {
                return (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
            });

            setMockTests(sortedData);
        } catch (error) {
            console.error("Failed to load mock tests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTest = async (templateId: string) => {
        try {
            setLoading(true);
            const data = await startMockFromTemplate(templateId);

            // Store data in Zustand
            setMockData({
                mockSessionId: data.mockTestId,
                questions: data.questions,
                duration: data.duration,
            });

            // Navigate to Test Screen (using existing MockTest screen)
            navigation.navigate("MockTest" as never);
        } catch (error) {
            console.error("Failed to start mock test:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const isCompleted = item.status === "SUBMITTED";
        const isInProgress = item.status === "IN_PROGRESS";

        return (
            <TouchableOpacity
                style={[styles.card, isCompleted && styles.completedCard]}
                onPress={() => !isCompleted && handleStartTest(item._id)}
                activeOpacity={isCompleted ? 1 : 0.7}
            >
                <View style={styles.cardHeader}>
                    <Text style={[styles.title, isCompleted && styles.completedText]}>{item.title}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.duration} min</Text>
                    </View>
                </View>

                {isCompleted && (
                    <View style={styles.statusRow}>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusBadgeText}>Completed</Text>
                        </View>
                        {item.score !== undefined && item.total !== undefined && (
                            <View style={[styles.statusBadge, { backgroundColor: '#E0E7FF', marginLeft: 8 }]}>
                                <Text style={[styles.statusBadgeText, { color: '#4F46E5' }]}>
                                    Score: {item.score}/{item.total}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <Text style={styles.description}>{item.description || "No description provided."}</Text>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, isCompleted && styles.completedFooterText]}>
                        {isCompleted ? "Test Completed" : isInProgress ? "Resume Test" : "Start Test"}
                    </Text>
                    {!isCompleted && <Text style={styles.arrow}>→</Text>}
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => setIsDrawerOpen(true)} style={styles.menuButton}>
                    <Icon name="menu-outline" size={28} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Available Mock Tests</Text>
            </View>

            <FlatList
                data={mockTests}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No mock tests available at the moment.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        paddingTop: 60,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    menuButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    completedCard: {
        backgroundColor: "#F9FAFB",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        opacity: 0.85,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1F2937",
        flex: 1,
    },
    completedText: {
        color: "#6B7280",
    },
    badge: {
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: "#4F46E5",
        fontSize: 12,
        fontWeight: "600",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    statusBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#DEF7EC",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusBadgeText: {
        color: "#03543F",
        fontSize: 12,
        fontWeight: "bold",
    },
    description: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 16,
        lineHeight: 20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4F46E5",
    },
    completedFooterText: {
        color: "#10B981", // Green check color context
    },
    arrow: {
        fontSize: 18,
        color: "#4F46E5",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        paddingTop: 40,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#9CA3AF",
    }
});
