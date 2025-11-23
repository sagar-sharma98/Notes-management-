import NoteModal from "@/modal/NoteModal";
import { colors } from "@/styles/style";
import type { Note } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SortScreen() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const loadNotes = useCallback(async () => {
    const storedUser = await AsyncStorage.getItem("loggedInUser");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) return;

    const key = `notes-${user.email}`;
    const storedNotes = await AsyncStorage.getItem(key);
    const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];

    setNotes(parsedNotes);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

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

  const getFilteredNotes = () => {
    let filtered = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.body.toLowerCase().includes(search.toLowerCase())
    );

    switch (sortOption) {
      case "newest":
        filtered.sort((a, b) => b.updatedAt - a.updatedAt);
        break;

      case "oldest":
        filtered.sort((a, b) => a.updatedAt - b.updatedAt);
        break;

      case "titleAZ":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "titleZA":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sortHeading}>Sort Your Notes</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor={colors.accentStrong}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.sortButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={dropdownVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setSortOption("newest");
                setDropdownVisible(false);
              }}
            >
              <Text>Newest → Oldest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setSortOption("oldest");
                setDropdownVisible(false);
              }}
            >
              <Text>Oldest → Newest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setSortOption("titleAZ");
                setDropdownVisible(false);
              }}
            >
              <Text>A → Z</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setSortOption("titleZA");
                setDropdownVisible(false);
              }}
            >
              <Text>Z → A</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <NoteModal
        visible={modalVisible}
        note={selectedNote}
        onClose={() => setModalVisible(false)}
        onDelete={deleteNote}
        onEdit={editNote}
      />
      {notes.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
           No notes available.
        </Text>
      ) : (
        <FlatList
          data={getFilteredNotes()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedNote(item);
                setModalVisible(true);
              }}
            >
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.thumb} />
              ) : (
                <View style={styles.blankThumb} />
              )}

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text numberOfLines={2} style={styles.cardBody}>
                  {item.body}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accentSoft,
    padding: 16,
  },

  sortHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.accentStrong,
    marginBottom: 10,
    textAlign: "left",
    letterSpacing: 0.5,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 10,
    borderWidth: 0.4,
    borderColor: colors.accentStrong,
    marginRight: 10,
  },

  sortButton: {
    backgroundColor: colors.accentStrong,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  sortButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  dropdownMenu: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    elevation: 5,
  },

  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  card: {
    flexDirection: "row",
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },

  blankThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.backgroundMedium,
    marginRight: 12,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  cardBody: {
    fontSize: 14,
    color: "#555",
  },
});
