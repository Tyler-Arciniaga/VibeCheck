import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

//TODO: (low): rethink color scheme of profile page,
//not sure if it goes with the rest of the app

interface User {
  avatar: string | null;
  bio: string | null;
  id: string;
  name: string;
  username: string;
}

interface recentPosts {
  id: string;
  name: string;
  artist: string;
}

export default function ProfileScreen() {
  const { setAuth, user } = useAuth();
  const [recentPosts, setRecentPosts] = useState<recentPosts[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    setRecentPosts(user.song_posts);
    setFollowerCount(user.followerCount[0].count);
    setFollowingCount(user.followingCount[0].count);
  }, []);

  const handleSignOut = async () => {
    console.log("sign out");

    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign Out", error.message);
    } else {
      router.replace("/(auth)");
      setAuth(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.profilePicture} />
        <Text style={styles.name}>{user ? user.name : "Loading..."}</Text>
        <Text style={styles.username}>
          {user ? "@" + user.username : "Loading..."}
        </Text>
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push("../Followers")}
          >
            <Text style={styles.statCount}>{followerCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push("../followingPage")}
          >
            <Text style={styles.statCount}>{followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>
            {user?.bio ? user?.bio : "No bio yet."}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            router.push({
              pathname: "../editProfile",
            });
          }}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color="#ff6b6b" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Songs of the Day</Text>
        {recentPosts.map((song) => (
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
    backgroundColor: "#121212",
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 2,
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
  username: {
    fontSize: 15,
    color: "#b3b3b3",
    marginBottom: 6, // Reduced from 12
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffffff",
    marginBottom: 10,
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  // Sign Out Button Styles
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ff6b6b",
    marginTop: 5,
  },
  signOutButtonText: {
    color: "#ff6b6b",
    fontSize: 16,
    marginLeft: 8,
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
  bioContainer: {
    width: "80%",
    marginTop: 0, // Reduced top margin
    marginBottom: 15, // Keep bottom margin
    paddingHorizontal: 5,
  },
  bioText: {
    fontSize: 14,
    color: "#b3b3b3",
    lineHeight: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: "60%",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 15,
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 14,
    color: "#b3b3b3",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#333333",
    marginHorizontal: 10,
  },
});
