import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { useProfileStore } from "./profile.store";
import { getProfile, updateProfile } from "./profile.service";
import { useAuthStore } from "../../auth/auth.store";
import CustomDrawer from "../../components/CustomDrawer";

export default function ProfileScreen() {
  const { profile, loadProfile, clear } = useProfileStore();
  const logout = useAuthStore((s) => s.logout);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    getProfile().then((data) => {
      loadProfile(data);
      if (data) {
        setName(data.name);
        setPhone(data.phone);
      }
    });
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile({ name, phone });
      // Reload profile
      const data = await getProfile();
      loadProfile(data);

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (e) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  if (!profile) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading Profile...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
          <Icon name="menu-outline" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Icon name={isEditing ? "close" : "create-outline"} size={26} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Icon name="person-circle" size={80} color="#666" />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholderTextColor="#666"
              />
            ) : (
              <Text style={styles.value}>{name}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email (Read-only)</Text>
            <Text style={[styles.value, { color: '#888' }]}>{profile.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mobile</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#666"
              />
            ) : (
              <Text style={styles.value}>{phone}</Text>
            )}
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Subscription Badge */}
        <View style={styles.sectionCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <View style={[
              styles.badge,
              { backgroundColor: profile.subscription === "premium" ? "#4CAF50" : "#FFC107" }
            ]}>
              <Text style={styles.badgeText}>
                {profile.subscription === "premium" ? "PREMIUM" : "FREE PLAN"}
              </Text>
            </View>
          </View>
          {profile.subscription === "premium" ? (
            <Text style={styles.subText}>Expires on: {new Date(profile.subscriptionEnd).toDateString()}</Text>
          ) : (
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Referral Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Referrals</Text>
          <View style={styles.referralBox}>
            <Text style={styles.refLabel}>Your Code</Text>
            <Text style={styles.refCode}>{profile.referralCode}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.statText}>Referred Users: {profile.referralCount}</Text>
            <Text style={styles.statText}>Earnings: ₹{profile.referralEarnings}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            clear();
            logout();
          }}
        >
          <Icon name="log-out-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

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
  loadingText: { color: "#FFF" },
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
  profileCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#2C2C2C",
    color: "#FFF",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  sectionCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 15,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  subText: {
    color: "#AAA",
    marginTop: 10,
  },
  upgradeButton: {
    marginTop: 15,
    backgroundColor: "#FFC107",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  upgradeText: {
    color: "#000",
    fontWeight: "bold",
  },
  referralBox: {
    backgroundColor: "#252525",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
    borderStyle: 'dashed'
  },
  refLabel: {
    color: "#AAA",
    fontSize: 12,
    marginBottom: 4,
  },
  refCode: {
    color: "#4CAF50",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  statText: {
    color: "#DDD",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 12,
    marginBottom: 40,
  },
  logoutText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  }
});
