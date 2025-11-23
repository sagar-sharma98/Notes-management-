import { colors } from "@/styles/style";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function LoginScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const user = users.find(
        (u: any) =>
          u.email.toLowerCase() === form.email.toLowerCase() &&
          u.password === form.password
      );

      if (!user) {
        Alert.alert("Invalid", "Incorrect email or password");
        return;
      }

      await AsyncStorage.setItem("loggedInUser", JSON.stringify(user));

      router.replace("/home");
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.scrollContainer}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      extraHeight={100}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <Text style={styles.header}>Login</Text>

        {/* Email */}
        <View style={styles.labelRow}>
          <Ionicons name="mail" size={18} color={colors.accentStrong} />
          <Text style={styles.label}>Email</Text>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter email"
            style={styles.input}
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
          />
        </View>

        <View style={styles.labelRow}>
          <Ionicons name="lock-closed" size={18} color={colors.accentStrong} />
          <Text style={styles.label}>Password</Text>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter password"
            secureTextEntry
            style={styles.input}
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 10 }}>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Don't have an account? Signup</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.accentSoft,
  },
  formContainer: {
    backgroundColor: colors.backgroundLight,
    padding: 20,
    borderRadius: 20,
    margin: 30,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#333",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    marginLeft: 4,
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
    marginLeft: 6,
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.accentStrong,
    marginBottom: 15,
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: colors.accentStrong,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  link: {
    color: colors.accentStrong,
    textAlign: "center",
    fontWeight: "600",
  },
});
