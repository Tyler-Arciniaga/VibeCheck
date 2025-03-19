import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

interface Song {
  id: string;
  name: string;
  artist: string;
  uri: string;
  track_id: string;
  preview_url: string | null;
  cover: string;
}

export default function CreateScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [songName, onChangeSongName] = React.useState("");
  const [caption, onChangeCaption] = React.useState("");
  const [selectedSong, setSelectedSong] = React.useState<Song | null>(null);

  const { serializedSong } = useLocalSearchParams<{ serializedSong: string }>();

  const handleChosenSong = (song: Song) => {
    console.log("====================================");
    console.log("Song recieved from search screen:", song);
    console.log("====================================");
    setSelectedSong(song);
  };

  useEffect(() => {
    if (serializedSong) {
      console.log("serialized song recieved from search screen");
      handleChosenSong(JSON.parse(serializedSong));
    }
  }, [serializedSong]);

  const handleSongSelection = () => {
    console.log("====================================");
    console.log("song Selection Button Triggered");
    console.log("====================================");
    router.push({
      pathname: "../search",
      params: { serializedSong: null },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Timer in top right */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>2:00</Text>
      </View>

      <View style={styles.contentContainer}>
        {/* User Profile Circle */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://picsum.photos/200" }} // Replace with actual profile picture
            style={styles.profilePicture}
          />
          <Text style={styles.username}>
            {user ? user.username : "Loading"}
          </Text>
        </View>

        {/* Song Input Area */}
        {selectedSong ? (
          <View style={styles.selectedSongContainer}>
            <Image
              source={{
                uri: selectedSong.cover,
              }}
              style={styles.albumArt}
            />
            <View style={styles.songDetails}>
              <Text style={styles.songName}>{selectedSong.name}</Text>
              <Text style={styles.songArtist}>{selectedSong.artist}</Text>
            </View>
            {/*<TouchableOpacity onPress={() => handleSongPreview(selectedSong.previewUrl)}>
                <Ionicons name="play-circle" size={28} color="#1db954" />
          </TouchableOpacity>*/}
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>TODAY'S SONG</Text>
            <TouchableOpacity
              style={styles.songInput}
              onPress={handleSongSelection}
            >
              <Text
                style={[
                  styles.placeholderText,
                  songName ? styles.songNameText : null,
                ]}
              >
                {songName || "Enter song name"}
              </Text>
              <View style={styles.inputIconContainer}>
                <Ionicons name="musical-notes" size={20} color="#666" />
              </View>
            </TouchableOpacity>
          </View>
        )}
        {/* Caption Input Area */}
        <View style={styles.captionContainer}>
          <View style={styles.captionInput}>
            <TextInput
              style={styles.placeholderText}
              onChangeText={onChangeCaption}
              value={caption}
              placeholder="Add a short caption..."
              placeholderTextColor={"#666"}
            />
          </View>
          <Text style={styles.captionCounter}>0/50</Text>
        </View>

        {/* Post Button */}
        <View style={styles.postButton}>
          <Text style={styles.postButtonText}>Post Song of the Day</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  timerContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff4136",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
  },
  username: {
    fontSize: 16,
    color: "#666",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
    position: "relative",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 5,
    textAlign: "center",
  },
  songInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  placeholderText: {
    flex: 1,
    color: "#999",
    fontSize: 16,
    textAlign: "center",
  },
  songNameText: {
    color: "#333",
  },
  inputIconContainer: {
    position: "absolute",
    right: 15,
  },
  captionContainer: {
    width: "100%",
    marginBottom: 40,
  },
  captionInput: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    fontSize: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  captionCounter: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 5,
  },
  postButton: {
    backgroundColor: "#1db954",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 30,
  },
  postButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  // New styles for selected song
  selectedSongContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: "100%",
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  songDetails: {
    marginLeft: 15,
    flex: 1,
  },
  songName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  songArtist: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});
