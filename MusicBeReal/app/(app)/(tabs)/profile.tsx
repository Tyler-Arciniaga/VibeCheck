import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "../../../contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

//TODO: need to add functionality for the edit profile button.

//TODO: rethink color scheme of profile page,
//not sure if it goes with the rest of the app

// Mock data for the last three songs
const lastThreeSongs = [
  { id: "1", name: "Blinding Lights", artist: "The Weeknd", date: "Yesterday" },
  { id: "2", name: "Shape of You", artist: "Ed Sheeran", date: "2 days ago" },
  { id: "3", name: "Dance Monkey", artist: "Tones and I", date: "3 days ago" },
];

interface User {
  avatar: string | null;
  bio: string | null;
  id: string;
  name: string;
  username: string;
}

export default function ProfileScreen() {
  const { setAuth, user } = useAuth();

  const handleSignOut = async () => {
    console.log("sign out");
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign Out", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://picsum.photos/200" }} // Replace with actual profile picture
          style={styles.profilePicture}
        />
        <Text style={styles.name}>{user ? user.name : "Loading..."}</Text>
        <Text style={styles.username}>
          {user ? "@" + user.username : "Loading..."}
        </Text>
        <TouchableOpacity style={styles.editButton}>
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
});
