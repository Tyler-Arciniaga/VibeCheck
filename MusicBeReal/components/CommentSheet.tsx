"use client";

import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { createPostComment } from "@/services/postService";
import { Icon } from "@rneui/themed";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  comment_text: string;
}

interface CommentSheetProps {
  isVisible: boolean;
  onClose: () => void;
  postId: string;
  user_id: string;
  username: string;
  comments: Comment[];
  updateCount: (newComment: Comment) => void;
}

const CommentSheet = ({
  isVisible,
  onClose,
  postId,
  user_id,
  username,
  comments: initialComments = [],
  updateCount,
}: CommentSheetProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: screenHeight,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }).start();
      // Reset to half screen when closing
      setIsInputFocused(false);
    }
  }, [isVisible, slideAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isInputFocused, // Disable pan responder when input is focused
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return !isInputFocused && gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 40,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const handleSubmitComment = async () => {
    if (commentText.trim() === "") return;

    const newComment: Comment = {
      id: Date.now().toString(),
      post_id: postId,
      user_id: user_id,
      username: username,
      comment_text: commentText,
    };
    console.log("New Comment:", newComment);
    const res = await createPostComment(newComment);
    console.log(res);
    setComments([...comments, newComment]);
    setCommentText("");
    Keyboard.dismiss();
    setIsInputFocused(false);
    updateCount(newComment);
  };

  // Determine which modal content to show based on input focus state
  const renderModalContent = () => {
    if (isInputFocused) {
      // Full screen comment input view
      return (
        <View style={styles.fullScreenContainer}>
          <View style={styles.fullscreenHeader}>
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                setIsInputFocused(false);
              }}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#000" />
            </Pressable>
            <View style={{ width: 24 }} />
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.commentText}>{item.comment_text}</Text>
              </View>
            )}
            contentContainerStyle={styles.commentsListContent}
            style={styles.commentsList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No comments yet. Be the first!
                </Text>
              </View>
            }
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#9e9e9e"
              value={commentText}
              onChangeText={setCommentText}
              keyboardType="twitter"
              multiline
              autoFocus
              onBlur={() => setIsInputFocused(false)}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitComment}
              disabled={commentText.trim() === ""}
            >
              <Feather
                name="send"
                size={20}
                color={commentText.trim() === "" ? "#ccc" : "#1DB954"}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }

    // Half-screen comment sheet
    return (
      <Animated.View
        style={[
          styles.sheetContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.headerSection}>
          <View style={styles.dragHandle}>
            <View style={styles.handle} />
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Comments</Text>
          </View>
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.commentText}>{item.comment_text}</Text>
            </View>
          )}
          contentContainerStyle={styles.commentsListContent}
          style={styles.commentsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No comments yet. Be the first!
              </Text>
            </View>
          }
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#9e9e9e"
            value={commentText}
            onChangeText={setCommentText}
            multiline
            onFocus={() => setIsInputFocused(true)}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitComment}
            disabled={commentText.trim() === ""}
          >
            <Feather
              name="send"
              size={20}
              color={commentText.trim() === "" ? "#ccc" : "#1DB954"}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={() => {
        if (isInputFocused) {
          Keyboard.dismiss();
          setIsInputFocused(false);
        } else {
          onClose();
        }
      }}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => {
            if (isInputFocused) {
              Keyboard.dismiss();
              setIsInputFocused(false);
            } else {
              onClose();
            }
          }}
        />
        {renderModalContent()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetContainer: {
    height: screenHeight * 0.5,
    width: screenWidth,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  fullScreenContainer: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: "white",
  },
  headerSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  fullscreenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 5,
    marginLeft: 4,
    marginTop: 30,
  },
  dragHandle: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 5,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
  },
  headerContainer: {
    padding: 15,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    padding: 15,
  },
  commentContainer: {
    marginBottom: 15,
  },
  username: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "white",
    marginBottom: 40,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  submitButton: {
    marginLeft: 10,
    alignSelf: "flex-end",
    padding: 10,
  },
});

export default CommentSheet;
