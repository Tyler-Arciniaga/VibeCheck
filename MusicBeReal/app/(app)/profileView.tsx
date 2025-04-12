import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

// Mock data for the last three songs - you can replace this with props
const lastThreeSongs = [
  { id: "1", name: "Blinding Lights", artist: "The Weeknd", date: "Yesterday" },
  { id: "2", name: "Shape of You", artist: "Ed Sheeran", date: "2 days ago" },
  { id: "3", name: "Dance Monkey", artist: "Tones and I", date: "3 days ago" },
];

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

interface ProfileRes {
  id: string;
  avatar: string;
  username: string;
  bio: string;
  name: string;
}

export default function ProfileViewScreen() {
  const [viewedProfile, setViewedProfile] = useState<ProfileRes>();

  const router = useRouter();
  const { user } = useLocalSearchParams<{ user: string }>();
  useEffect(() => {
    setViewedProfile(JSON.parse(user));
  }, [user]);
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#1DB954" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://picsum.photos/200",
          }}
          style={styles.profilePicture}
        />
        <Text style={styles.name}>{viewedProfile?.name}</Text>
        <Text style={styles.username}>@ {viewedProfile?.username}</Text>

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
        {lastThreeSongs.map((song) => (
          <View key={song.id} style={styles.songItem}>
            <View style={styles.songInfo}>
              <Text style={styles.songName}>{song.name}</Text>
              <Text style={styles.artistName}>{song.artist}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateText}>{song.date}</Text>
            </View>
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
  username: {
    fontSize: 15,
    color: "#b3b3b3",
    marginBottom: 12,
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
