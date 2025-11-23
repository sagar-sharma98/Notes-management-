import NoteModal from "@/modal/NoteModal";
import { colors } from "@/styles/style";
import type { Note } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadNotes = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("loggedInUser");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user) return;

      const key = `notes-${user.email}`;
      const storedNotes = await AsyncStorage.getItem(key);
      const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];

      setNotes(parsedNotes);
    } catch (error) {
      console.log("Error loading notes:", error);
    }
  }, []);

  const deleteNote = async () => {
    if (!selectedNote) return;

    const storedUser = await AsyncStorage.getItem("loggedInUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user) return;

    const key = `notes-${user.email}`;

    const updated = notes.filter((n) => n.id !== selectedNote.id);
    setNotes(updated);

    await AsyncStorage.setItem(key, JSON.stringify(updated));
    setModalVisible(false);
  };

  const editNote = () => {
    router.push({
      pathname: "/(tabs)/create",
      params: { note: JSON.stringify(selectedNote) },
    });
    setModalVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No notes yet. Create one!</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setSelectedNote(item);
              setModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.thumb} />
            ) : (
              <View style={styles.blankThumb} />
            )}

            <View style={styles.cardContent}>
              <Text style={styles.label}>Title:</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={styles.label}>Description:</Text>
              <Text numberOfLines={4} style={styles.cardBody}>
                {item.body}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <NoteModal
        visible={modalVisible}
        note={selectedNote}
        onClose={() => setModalVisible(false)}
        onDelete={deleteNote}
        onEdit={editNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accentSoft,
    padding: 16,
  },

  header: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#555",
  },

  card: {
    flexDirection: "row",
    backgroundColor: colors.backgroundLight,
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    alignItems: "center",
    minHeight: 120,
  },

  thumb: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 14,
  },

  blankThumb: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: colors.backgroundMedium,
  },

  cardContent: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.accentStrong,
    marginBottom: 2,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  cardBody: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "90%",
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderRadius: 14,
    maxHeight: "85%",
  },

  closeBtn: {
    alignSelf: "flex-end",
    padding: 6,
  },

  closeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  modalImage: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 16,
  },
  modalBlankImage: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    backgroundColor: colors.backgroundMedium,
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },

  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.accentStrong,
    marginBottom: 6,
  },

  modalDescription: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
    minHeight: 120,
    marginBottom: 20,
  },

  bottomCloseButton: {
    backgroundColor: colors.accentStrong,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  bottomCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
