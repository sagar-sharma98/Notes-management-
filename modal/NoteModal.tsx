import { colors } from "@/styles/style";
import React from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function NoteModal({
  visible,
  note,
  onClose,
  onDelete,
  onEdit,
}: any) {
  if (!note) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {note.imageUri ? (
            <Image source={{ uri: note.imageUri }} style={styles.modalImage} />
          ) : (
            <View style={styles.modalBlankImage} />
          )}

          <Text style={styles.modalTitleLabel}>Title:</Text>
          <Text style={styles.modalTitle}>{note.title}</Text>

          <Text style={styles.modalLabel}>Description:</Text>
          <Text style={styles.modalDescription}>{note.body}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={onEdit}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={onDelete}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.accentStrong,
    marginBottom: 6,
  },

  modalTitleLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.accentStrong,
    marginBottom: 6,
  },
  modalDescription: {
    fontSize: 14,
    color: "#444",
    fontWeight: "400",
    lineHeight: 22,
    minHeight: 120,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionButton: {
    width: "48%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  editButton: { backgroundColor: colors.accentSoft },

  deleteButton: { backgroundColor: "#d9534f" },

  editText: { color: "#333", fontSize: 16, fontWeight: "600" },

  deleteText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  closeButton: {
    backgroundColor: colors.accentStrong,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
