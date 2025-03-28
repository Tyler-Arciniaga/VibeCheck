import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons"; // Added AntDesign for heart icons
import { createPostLike, removePostLike } from "@/services/postService";
import { useAuth } from "@/contexts/AuthContext";
import CommentSheet from "./CommentSheet";

//TODO: (low) The styling is like so ever slightly off,
//try to align the left side just a little bit better and space things
//a little bit better

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface PostType {
  id: string;
  username: string;
  name: string;
  artist: string;
  cover: string;
  caption: string;
  uri: string;
  likes: number;
  comments: number;
  postLikes: PostLikes[];
}

interface PostLikes {
  post_id: string;
  user_id: string;
}

// Mock comments data - in a real app this would come from props or an API
const mockComments = [
  {
    id: "1",
    username: "user1",
    text: "Great song choice! 🎵",
    timestamp: "2023-04-15T12:30:00Z",
  },
  {
    id: "2",
    username: "musiclover",
    text: "I love this artist so much! Have you heard their new album?",
    timestamp: "2023-04-15T13:45:00Z",
  },
];

const PostCard = ({ post }: { post: PostType }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState<PostLikes[]>([]);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setLikes(post.postLikes);
  }, []);

  const openSpotify = () => {
    if (post.uri) {
      // Try to open the Spotify app with the URI
      Linking.canOpenURL(post.uri)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(post.uri);
          } else {
            // Fallback to web version if app isn't installed
            return Linking.openURL(
              `https://open.spotify.com/track/${post.uri.split(":").pop()}`
            );
          }
        })
        .catch((err) => console.error("An error occurred", err));
    }
  };

  const handlePostLike = async () => {
    if (liked) {
      const updatedLikes = likes.filter((like) => like.user_id !== user?.id);
      setLikes([...updatedLikes]);
      const res = await removePostLike(post.id, user?.id);
      console.log(res);
    } else {
      const like = {
        user_id: user?.id,
        post_id: post.id,
      };
      setLikes([...likes, like]);
      console.log(like);
      const res = await createPostLike(like);
      console.log(res);
    }
  };

  const handleComment = () => {
    console.log("Comment button pressed");
    setShowComments(true);
  };

  const closeComments = () => {
    setShowComments(false);
  };

  const liked = likes.filter((like) => like.user_id === user?.id)[0]
    ? true
    : false;

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{post.username}</Text>
      </View>
      <Image source={{ uri: post.cover }} style={styles.albumCover} />
      <View style={styles.songInfo}>
        <Text style={styles.songName}>{post.name}</Text>
        <Text style={styles.artistName}>{post.artist}</Text>

        {/* Spotify button */}
        {post.uri && (
          <TouchableOpacity style={styles.spotifyButton} onPress={openSpotify}>
            <Feather name="music" size={16} color="white" />
            <Text style={styles.spotifyButtonText}>Listen on Spotify</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.caption}>{post.caption}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handlePostLike}>
          <AntDesign
            name={liked ? "heart" : "hearto"}
            size={24}
            color={liked ? "#e74c3c" : "black"}
          />
          <Text style={styles.actionText}>{likes?.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Feather name="message-circle" size={24} color="black" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}></TouchableOpacity>
      </View>

      {/* Comment Sheet */}
      <CommentSheet
        isVisible={showComments}
        onClose={closeComments}
        postId={post.id}
        comments={mockComments}
      />
    </View>
  );
};

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
    marginBottom: 10,
  },
  spotifyButton: {
    backgroundColor: "#1DB954", // Spotify green
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  spotifyButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 12,
  },
  caption: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 10,
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

export default PostCard;
