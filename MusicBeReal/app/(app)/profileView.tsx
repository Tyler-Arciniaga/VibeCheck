import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { useAuth } from "@/contexts/AuthContext";
import {
  checkFollowStatus,
  followUser,
  unfollowUser,
} from "@/services/relationServices";

interface ProfileViewScreenProps {
  user: {
    name: string;
    username: string;
    avatar: string;
    bio: string;
  };
  recentSongs?: Array<{
    id: string;
    name: string;
    artist: string;
    date: string;
  }>;
}
interface recentPosts {
  id: string;
  name: string;
  artist: string;
}

interface ProfileRes {
  id: string;
  avatar: string;
  username: string;
  bio: string;
  name: string;
  song_posts: recentPosts[];
}

export default function ProfileViewScreen() {
  const { user } = useAuth();
  const [viewedProfile, setViewedProfile] = useState<ProfileRes>();
  const [isFollowing, setIsFollowing] = useState<boolean>();

  const router = useRouter();
  const { user: viewedUser } = useLocalSearchParams<{ user: string }>();

  const checkFollow = async (followerID: string, followingID: string) => {
    const { success, data, msg } = await checkFollowStatus(
      followerID,
      followingID
    );
    if (success) {
      if (data?.length === 0) {
        setIsFollowing(false);
      } else {
        setIsFollowing(true);
      }
    } else {
      Alert.alert(
        "Follow Status",
        "Could not successfully check current follow status, data may be inaccurate"
      );
    }
  };
  useEffect(() => {
    checkFollow(user.id, JSON.parse(viewedUser).id);
  }, []);

  useEffect(() => {
    setViewedProfile(JSON.parse(viewedUser));
  }, [viewedUser]);

  const toggleFollow = async () => {
    if (!isFollowing) {
      //follow logic
      const { success, data, msg } = await followUser(
        user.id,
        JSON.parse(viewedUser).id
      );
      if (!success) {
        Alert.alert(
          "Following User",
          "Could not follow user at this time please try again later"
        );
        return;
      }
    } else {
      //unfollow logic
      const response = await unfollowUser(user.id, JSON.parse(viewedUser).id);
      if (response.response.error) {
        Alert.alert(
          "Unfollowing user",
          "Could not successfully unfollow user at this time please try again later"
        );
        return;
      }
    }
    setIsFollowing((prev) => !prev);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#1DB954" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Image
          source={{
            uri: viewedProfile?.avatar,
          }}
          style={styles.profilePicture}
        />
        <Text style={styles.name}>{viewedProfile?.name}</Text>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>@ {viewedProfile?.username}</Text>
          <TouchableOpacity
            style={[
              styles.followButton,
              isFollowing ? styles.followingButton : styles.followButton,
            ]}
            onPress={toggleFollow}
          >
            <Text
              style={[
                styles.followButtonText,
                isFollowing
                  ? styles.followingButtonText
                  : styles.followButtonText,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bio Section */}
        <View style={styles.bioContainer}>
          <Text style={styles.bioTitle}>Bio</Text>
          <Text style={styles.bioText}>
            {viewedProfile?.bio
              ? viewedProfile?.bio
              : "This user hasn't added a bio yet."}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Songs of the Day</Text>
        {viewedProfile?.song_posts.map((song) => (
          <View key={song.id} style={styles.songItem}>
            <View style={styles.songInfo}>
              <Text style={styles.songName}>{song.name}</Text>
              <Text style={styles.artistName}>{song.artist}</Text>
            </View>
            {/*
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateText}>{song.date}</Text>
            </View>
*/}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background similar to Spotify
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  username: {
    fontSize: 15,
    color: "#b3b3b3",
    marginRight: 10,
  },
  followButton: {
    backgroundColor: "#9370DB", // Medium purple color
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 30,
    minWidth: 80,
    alignItems: "center",
  },
  followingButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#9370DB", // Matching border color
  },
  followButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  followingButtonText: {
    color: "#9370DB", // Text color matches the button color
  },
  bioContainer: {
    width: "80%",
    backgroundColor: "#282828",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: "#b3b3b3",
    lineHeight: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  songItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#282828",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  songInfo: {
    flex: 1,
  },
  songName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  artistName: {
    fontSize: 14,
    color: "#b3b3b3",
    marginTop: 5,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#b3b3b3",
    marginLeft: 5,
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
