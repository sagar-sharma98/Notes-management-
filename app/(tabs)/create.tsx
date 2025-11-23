import { colors } from "@/styles/style";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CreateNote() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editingNote =
    typeof params.note === "string" ? JSON.parse(params.note) : null;

  const [title, setTitle] = useState(editingNote?.title || "");
  const [body, setBody] = useState(editingNote?.body || "");
  const [image, setImage] = useState<string | null>(
    editingNote?.imageUri || null
  );

  useEffect(() => {
    if (!editingNote) {
      setTitle("");
      setBody("");
      setImage(null);
    }
  }, [editingNote]);

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveNote = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Error", "Please fill both Title and Body");
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem("loggedInUser");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user) {
        Alert.alert("Error", "User not found");
        return;
      }

      const storageKey = `notes-${user.email}`;
      const existing = await AsyncStorage.getItem(storageKey);
      let notes = existing ? JSON.parse(existing) : [];

      if (editingNote) {
        const updatedNotes = notes.map((n: any) =>
          n.id === editingNote.id
            ? {
                ...n,
                title,
                body,
                imageUri: image,
                updatedAt: Date.now(),
              }
            : n
        );

        await AsyncStorage.setItem(storageKey, JSON.stringify(updatedNotes));
        Alert.alert("Success", "Note updated!");
      } else {
        const newNote = {
          id: Date.now().toString(),
          title,
          body,
          imageUri: image,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        notes.push(newNote);
        await AsyncStorage.setItem(storageKey, JSON.stringify(notes));
        Alert.alert("Success", "Note saved!");
      }

      router.replace("/home");
    } catch (error) {
      console.log("Save note error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      extraHeight={200}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <Text style={styles.header}>
          {editingNote ? "Edit Note" : "Create Note"}
        </Text>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter note title"
          value={title}
          onChangeText={setTitle}
        />

        {/* Body */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 120 }]}
          placeholder="Write your note..."
          value={body}
          onChangeText={setBody}
          multiline
        />

        {/* Image Capture */}
        <View style={styles.captureHeader}>
          <Text style={styles.label}> Image </Text>
          <TouchableOpacity onPress={openCamera}>
            <Ionicons name="camera" size={40} color={colors.accentSoft} />
          </TouchableOpacity>
        </View>

        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        {/* Save */}
        <TouchableOpacity style={styles.button} onPress={saveNote}>
          <Text style={styles.buttonText}>
            {editingNote ? "Update Note" : "Save Note"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.backgroundLight,
    justifyContent: "center",
  },

  formContainer: {
    backgroundColor: colors.backgroundLight,
    padding: 20,
    borderRadius: 16,
    width: "90%",
    alignSelf: "center",
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#333",
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2C2C2C",
    marginBottom: 6,
    marginLeft: 4,
  },

  input: {
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.accentStrong,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 18,
  },

  captureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 20,
  },

  button: {
    backgroundColor: colors.accentStrong,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
