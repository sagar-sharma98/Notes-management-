import { colors } from "@/styles/style";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);

  const logoutUser = async () => {
    await AsyncStorage.removeItem("loggedInUser");
    setModalVisible(false);
    router.replace("/");
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: colors.accentSoft,
          },

          headerRight: () => (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="person-circle-outline"
                size={32}
                color={colors.accentStrong}
              />
            </TouchableOpacity>
          ),

          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.accentSoft,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarActiveTintColor: colors.accentStrong,
          tabBarInactiveTintColor: colors.accentSoft,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="home"
                size={26}
                color={focused ? colors.accentStrong : "#555"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            tabBarButton: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.middleButton}
                onPress={() => router.push("/(tabs)/create")}
              >
                <View style={styles.middleCircle}>
                  <Ionicons name="add" size={30} color="#fff" />
                </View>
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name="sort"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="funnel"
                size={24}
                color={focused ? colors.accentStrong : "#555"}
              />
            ),
          }}
        />
      </Tabs>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.logoutButton]}
                onPress={logoutUser}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  middleButton: {
    justifyContent: "center",
    alignItems: "center",
    top: -30,
  },
  middleCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentStrong,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "80%",
    backgroundColor: colors.backgroundLight,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },

  modalMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },

  cancelButton: {
    backgroundColor: colors.backgroundMedium,
  },

  logoutButton: {
    backgroundColor: colors.accentStrong,
  },

  cancelText: {
    fontWeight: "600",
    color: "#333",
  },

  logoutText: {
    fontWeight: "700",
    color: "#fff",
  },
});
