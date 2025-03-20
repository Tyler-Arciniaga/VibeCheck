import { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  type ViewToken,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface PostType {
  id: string;
  username: string;
  songName: string;
  artist: string;
  cover: string;
  caption: string;
  likes: number;
  comments: number;
}

const Post = ({ post }: { post: PostType }) => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <Image
        source={{ uri: "https://example.com/user-avatar.jpg" }}
        style={styles.avatar}
      />
      <Text style={styles.username}>{post.username}</Text>
    </View>
    <Image source={{ uri: post.cover }} style={styles.albumCover} />
    <View style={styles.songInfo}>
      <Text style={styles.songName}>{post.songName}</Text>
      <Text style={styles.artistName}>{post.artist}</Text>
    </View>
    <Text style={styles.caption}>{post.caption}</Text>
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton}>
        <Feather name="heart" size={24} color="black" />
        <Text style={styles.actionText}>{post.likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Feather name="message-circle" size={24} color="black" />
        <Text style={styles.actionText}>{post.comments}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Feather name="share" size={24} color="black" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  postContainer: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: "white",
    padding: 15,
    justifyContent: "center",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  albumCover: {
    width: "100%",
    height: screenHeight * 0.4,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  songInfo: {
    marginBottom: 5,
  },
  songName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  artistName: {
    fontSize: 16,
    color: "#666",
  },
  caption: {
    fontSize: 14,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#1DB954", // Spotify green
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default Post;
