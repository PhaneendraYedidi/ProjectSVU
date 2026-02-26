import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { VictoryPie, VictoryChart, VictoryTheme, VictoryBar, VictoryAxis } from "victory-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { getDashboard } from "./dashboard.service";
import { useDashboardStore } from "./dashboard.store";
import CustomDrawer from "../../components/CustomDrawer";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const { data, load } = useDashboardStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const fetchData = async () => {
    try {
      // Only show loading if we don't have data yet, to avoid flicker on re-focus
      if (!data) setIsLoading(true);
      setError(null);
      const res = await getDashboard();
      load(res);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      // Only show error state if we have no data
      if (!data) setError(err.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (isLoading && !data) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.loadingText}>Loading Analytics...</Text>
    </View>
  );

  if (error && !data) return (
    <View style={styles.loadingContainer}>
      <Icon name="alert-circle-outline" size={50} color="#F44336" />
      <Text style={{ ...styles.loadingText, color: "#F44336", marginBottom: 20 }}>{error}</Text>
      <TouchableOpacity style={styles.actionButton} onPress={fetchData}>
        <Text style={styles.actionButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (!data) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>No Data Available</Text>
      <TouchableOpacity style={[styles.actionButton, { marginTop: 20 }]} onPress={fetchData}>
        <Text style={styles.actionButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Prepare data for charts
  const pieData = [
    { x: "Correct", y: data.correct || 0 },
    { x: "Wrong", y: data.wrong || 0 },
    // { x: "Skipped", y: (data.totalAttempted || 0) - ((data.correct || 0) + (data.wrong || 0)) } // Optional if we track skipped
  ];

  const subjectData = data.subjectStats?.map((s: any) => ({
    x: s._id || 'Unknown',
    y: s.accuracy || 0
  })) || [];

  return (
    <View style={styles.container}>
      <CustomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
          <Icon name="menu-outline" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Summary Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="checkmark-circle-outline" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{data.accuracy || 0}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="flash-outline" size={24} color="#FFC107" />
            <Text style={styles.statValue}>{data.totalAttempted || 0}</Text>
            <Text style={styles.statLabel}>Attempted</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="school-outline" size={24} color="#9C27B0" />
            <Text style={styles.statValue}>{data.totalMocks || 0}</Text>
            <Text style={styles.statLabel}>Mock Tests</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="trending-up-outline" size={24} color="#FF9800" />
            <Text style={styles.statValue}>{data.avgMockScore || 0}%</Text>
            <Text style={styles.statLabel}>Avg Mock Score</Text>
          </View>
        </View>

        {/* Accuracy Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Performance Breakdown</Text>
          {data.totalAttempted > 0 ? (
            <VictoryPie
              data={pieData}
              colorScale={["#4CAF50", "#F44336", "#9E9E9E"]}
              innerRadius={70}
              radius={100}
              labels={({ datum }) => datum.y > 0 ? `${datum.x}: ${datum.y}` : ''}
              style={{
                labels: { fill: "white", fontSize: 12, fontWeight: "bold" }
              }}
              width={width - 40}
              height={250}
            />
          ) : (
            <Text style={styles.noDataText}>No data available yet. Start practicing!</Text>
          )}
        </View>

        {/* Take a Mock Test Card */}
        <TouchableOpacity
          style={styles.mockTestCard}
          onPress={() => navigation.navigate('MockTestList')}
        >
          <View style={styles.mockTestInfo}>
            <Text style={styles.mockTestTitle}>Take a Mock Test</Text>
            <Text style={styles.mockTestSubtitle}>Test your knowledge with curated exams</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Weak Areas Recommendation */}
        <View style={styles.recommendationCard}>
          <View style={styles.recHeader}>
            <Icon name="bulb-outline" size={24} color="#FFC107" />
            <Text style={styles.recTitle}>AI Recommendation</Text>
          </View>
          <Text style={styles.recText}>
            {(data.accuracy || 0) < 50
              ? "Focus on improving your accuracy in weak topics. Try 'Subject Wise' practice mode."
              : "Great job! Challenge yourself with a Mock Test to improve speed."}
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Practice')}
          >
            <Text style={styles.actionButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>

        {/* Subject Performance */}
        {subjectData.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Subject Accuracy</Text>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20} width={width - 20}>
              <VictoryAxis
                style={{
                  tickLabels: { fill: "#FFF", fontSize: 10, angle: -20 },
                  axis: { stroke: "#555" }
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  tickLabels: { fill: "#FFF", fontSize: 10 },
                  axis: { stroke: "#555" }
                }}
              />
              <VictoryBar
                data={subjectData}
                style={{ data: { fill: "#2196F3" } }}
                barWidth={20}
              />
            </VictoryChart>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#121212",
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
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
    paddingBottom: 100,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#AAA",
  },
  chartContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  noDataText: {
    color: "#AAA",
    marginVertical: 20,
    fontStyle: "italic",
  },
  recommendationCard: {
    backgroundColor: "#2C2C2C", // Slightly lighter for emphasis
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  recHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  recTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 8,
  },
  recText: {
    color: "#DDD",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  mockTestCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
  },
  mockTestInfo: {
    flex: 1,
  },
  mockTestTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  mockTestSubtitle: {
    fontSize: 14,
    color: "#E0E7FF",
  },
});
