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
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

interface CommentSheetProps {
  isVisible: boolean;
  onClose: () => void;
  postId: string;
  comments: Comment[];
}

const CommentSheet = ({
  isVisible,
  onClose,
  postId,
  comments: initialComments = [],
}: CommentSheetProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
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
    }
  }, [isVisible, slideAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
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

  const handleSubmitComment = () => {
    if (commentText.trim() === "") return;

    // This is just UI mockup - actual functionality will be handled by the user
    const newComment: Comment = {
      id: Date.now().toString(),
      username: "currentUser", // This would be replaced with actual username
      text: commentText,
      timestamp: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setCommentText("");
    Keyboard.dismiss();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.sheetContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Apply panResponder to the entire header section */}
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
                <Text style={styles.commentText}>{item.text}</Text>
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
  headerSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginBottom: 30,
  },
  submitButton: {
    marginLeft: 10,
    alignSelf: "flex-end",
    padding: 10,
    marginBottom: 30,
  },
});

export default CommentSheet;
