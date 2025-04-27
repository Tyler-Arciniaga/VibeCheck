import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import {
  UpdateProfile,
  deleteAccount,
  updateAvatar,
} from "@/services/profileService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { reloadAppAsync } from "expo";

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  avatar: string;
}

const EditProfileScreen = () => {
  const { user } = useAuth();
  const currentProfile: ProfileData = {
    name: user.name,
    username: user.username,
    bio: user.bio,
    avatar: user.avatar,
  };
  const [profileData, setProfileData] = useState<ProfileData>(currentProfile);

  const [isLoading, setIsLoading] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  // Add state for delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const modalPosition = useRef(new Animated.Value(0)).current;

  const router = useRouter();

  // Handle field editing - placeholder for your implementation
  const startEditing = (field: string, value: string) => {
    setEditField(field);
    setTempValue(value);
  };

  const saveField = () => {
    if (editField) {
      setProfileData({
        ...profileData,
        [editField]: tempValue,
      });
      setEditField(null);
    }
  };

  const cancelEditing = () => {
    setEditField(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileData({
        ...profileData,
        avatar: result.assets[0].uri,
      });
      setNewAvatar(result.assets[0].uri);
    }
  };

  // Handle save changes - placeholder for your implementation
  const saveChanges = async () => {
    setIsLoading(true);
    if (newAvatar != "") {
      console.log("Newest of avatars", newAvatar);
      const base64 = await FileSystem.readAsStringAsync(newAvatar, {
        encoding: "base64",
      });
      const { success, data, msg, url } = await updateAvatar(
        decode(base64),
        user.id
      );
      console.log("Data:", data);
      console.log("URL:", url);
    }
    const finalProf = {
      name: profileData.name,
      username: profileData.username,
      bio: profileData.bio,
    };
    const { success, data, msg } = await UpdateProfile(finalProf, user.id);
    if (success === false) {
      Alert.alert(
        "Error updating profile",
        "Could not update profile at this time"
      );
    } else {
      setIsLoading(false);
      reloadAppAsync();
      router.back();
    }
  };

  // Toggle delete account modal
  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  // Render delete account modal
  const renderDeleteAccountModal = () => {
    return (
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowDeleteModal(false)}
          />
          <View style={styles.deleteModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.deleteModalTitle}>Delete Account</Text>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.deleteModalBody}>
              <Feather
                name="alert-triangle"
                size={48}
                color="#FF3B30"
                style={styles.warningIcon}
              />
              <Text style={styles.warningTitle}>
                Warning: This cannot be undone
              </Text>
              <Text style={styles.warningText}>
                Deleting your account will permanently remove all your data,
                including:
              </Text>
              <View style={styles.warningList}>
                <Text style={styles.warningItem}>
                  • Your profile information
                </Text>
                <Text style={styles.warningItem}>• Your song posts</Text>
                <Text style={styles.warningItem}>
                  • All connections and followers
                </Text>
              </View>
              <Text style={styles.warningText}>
                This action is permanent and cannot be reversed.
              </Text>
            </View>

            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.cancelDeleteButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelDeleteText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={async () => {
                  const { success, data, msg } = await deleteAccount(user.id);
                  if (!success) {
                    console.log(msg);
                  } else {
                    console.log(data);
                  }
                  setShowDeleteModal(false);
                }}
              >
                <Text style={styles.confirmDeleteText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Render edit modal
  const renderEditModal = () => {
    if (!editField) return null;

    let fieldLabel = "";
    let maxLength = 100;
    let multiline = false;
    let placeholder = "";
    let placeholderTextColor = "";

    switch (editField) {
      case "name":
        fieldLabel = "Name";
        maxLength = 50;
        placeholder = "Enter your full name";
        break;
      case "username":
        fieldLabel = "Username";
        maxLength = 30;
        placeholder = "Enter your username";
        break;
      case "bio":
        fieldLabel = "Bio";
        maxLength = 50;
        multiline = true;
        placeholder = "Tell others about yourself :)";
        placeholderTextColor = "#888";
        break;
    }

    return (
      <Modal
        visible={!!editField}
        transparent
        animationType="slide"
        onRequestClose={cancelEditing}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={cancelEditing}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit {fieldLabel}</Text>
              <TouchableOpacity onPress={cancelEditing}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                style={[
                  styles.modalInput,
                  multiline && { height: 100, textAlignVertical: "top" },
                ]}
                value={tempValue}
                onChangeText={setTempValue}
                maxLength={maxLength}
                multiline={multiline}
                autoFocus
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
              />

              <Text style={styles.charCount}>
                {tempValue ? tempValue.length : 0}/{maxLength}
              </Text>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelEditing}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={saveField}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#1DB954" />
        </TouchableOpacity>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatarButton} onPress={pickImage}>
            <Text style={styles.editAvatarText}>Edit Avatar</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Fields */}
        <View style={styles.fieldsContainer}>
          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Name</Text>
            <TouchableOpacity
              style={styles.fieldValueContainer}
              onPress={() => startEditing("name", profileData.name)}
            >
              <Text style={styles.fieldValue}>{profileData.name}</Text>
              <Feather name="edit-2" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Username</Text>
            <TouchableOpacity
              style={styles.fieldValueContainer}
              onPress={() => startEditing("username", profileData.username)}
            >
              <Text style={styles.fieldValue}>@ {profileData.username}</Text>
              <Feather name="edit-2" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <TouchableOpacity
              style={styles.fieldValueContainer}
              onPress={() => startEditing("bio", profileData.bio)}
            >
              {profileData.bio ? (
                <Text style={styles.fieldValue} numberOfLines={3}>
                  {profileData.bio}
                </Text>
              ) : (
                <Text style={styles.fieldValueNull} numberOfLines={3}>
                  Add Bio...
                </Text>
              )}
              <Feather
                name="edit-2"
                size={16}
                color="#666"
                style={styles.bioEditIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveChangesButton}
          onPress={saveChanges}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveChangesText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity
          style={styles.deleteAccountButton}
          onPress={toggleDeleteModal}
        >
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {renderEditModal()}
      {renderDeleteAccountModal()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
    marginTop: 35,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
  },
  editAvatarButton: {
    marginTop: 10,
  },
  editAvatarText: {
    color: "#1DB954", // Spotify green
    fontSize: 16,
    fontWeight: "500",
  },
  fieldsContainer: {
    marginTop: 20,
  },
  fieldItem: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  fieldValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    paddingRight: 10,
  },
  fieldValueNull: {
    fontSize: 16,
    color: "#888",
    flex: 1,
    paddingRight: 10,
  },
  bioEditIcon: {
    alignSelf: "flex-start",
    marginTop: 4,
  },
  saveChangesButton: {
    backgroundColor: "#1DB954", // Spotify green
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  saveChangesText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Delete Account Button Styles
  deleteAccountButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF3B30", // Red color
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 30,
  },
  deleteAccountText: {
    color: "#FF3B30", // Red color
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: "auto", // Push to bottom of screen
    maxHeight: "80%", // Limit height to ensure visibility
  },
  // Delete Account Modal Styles
  deleteModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: "auto", // Push to bottom of screen
    maxHeight: "80%", // Limit height to ensure visibility
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF3B30", // Red color
  },
  deleteModalBody: {
    alignItems: "center",
    paddingVertical: 20,
  },
  warningIcon: {
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF3B30", // Red color
    marginBottom: 16,
    textAlign: "center",
  },
  warningText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  warningList: {
    alignSelf: "stretch",
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  warningItem: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
  },
  deleteModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelDeleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10,
  },
  cancelDeleteText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: "#FF3B30", // Red color
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 10,
  },
  confirmDeleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  charCount: {
    alignSelf: "flex-end",
    color: "#666",
    fontSize: 12,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#1DB954", // Spotify green
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProfileScreen;
