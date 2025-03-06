import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { debounce } from "lodash";
import { Audio } from "expo-av";
import axios from "axios";

const queriedSongResults: Song[] = [];

interface Song {
  id: string;
  name: string;
  artist: string;
  uri: string;
  track_id: string;
  preview_url: string | null;
}

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_CLIENT_SECRET;

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedSong, setSearchedSong] = useState(""); //this is used for my version
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [songPreviewURL, setSongPreviewURL] = useState("hi");

  const getSongPreview = async (trackID: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/get-song-preview?trackID=${trackID}`
      );

      if (response.data.success) {
        console.log(response.data.results[0].previewUrls);
        return response.data.results[0].previewUrls;
      } else {
        console.error(response.data.error || "Unknown error");
      }
    } catch (err) {
      console.error(
        err || "An error message occured while fetching the preview"
      );
    }
  };

  const searchedSongRef = useRef(searchedSong); //used to create a ref to keep track of most up to date search query
  useEffect(() => {
    searchedSongRef.current = searchedSong; //update whenver state of searchedSong is updated
  }, [searchedSong]);

  const accessTokenRef = useRef(accessToken);
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  const previewURLRef = useRef(songPreviewURL);
  useEffect(() => {
    previewURLRef.current = songPreviewURL;
  }, [songPreviewURL]);

  useEffect(() => {
    //API Access Token
    let authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch(discovery.tokenEndpoint, authParameters)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  async function searchSong() {
    const queriedSong = searchedSongRef.current;
    console.log("====================================");
    console.log(queriedSong);
    console.log(accessTokenRef.current);
    console.log("====================================");

    let trackParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessTokenRef.current,
      },
    };

    let songRequest = await fetch(
      "https://api.spotify.com/v1/search?q=" +
        queriedSong +
        "&type=track&market=ES",
      trackParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsLoading(true);
        for (let i: number = 0; i < 20; i++) {
          if (
            queriedSongResults.some(
              (item) =>
                item.name === data.tracks.items[i].name &&
                item.artist === data.tracks.items[i].artists[0].name
            )
          ) {
            continue;
          }
          const newSong: Song = {
            id: String(i),
            name: data.tracks.items[i].name,
            artist: data.tracks.items[i].artists[0].name,
            uri: data.tracks.items[i].uri,
            track_id: data.tracks.items[i].id,
            preview_url: null,
          };

          queriedSongResults.push(newSong);
        }
        setSearchResults(queriedSongResults);
        setIsLoading(false);
      });
  }

  const handler = useCallback(debounce(searchSong, 2000), []); //for debouncing to limit number of API calls

  /*
  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const filteredSongs = mockSongs.filter(
          (song) =>
            song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredSongs);
        setIsLoading(false);
      }, 300);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  */

  const handleSelectSong = (song: any) => {
    // In a real app, this would navigate back to the create screen with the selected song
    console.log("Selected song:", song);
  };

  const onPlayBackStatusUpdate = (status: any) => {
    console.log(status);
  };
  const playCurrentSong = async (song: any) => {
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: song.preview_url,
      },
      { shouldPlay: true },
      onPlayBackStatusUpdate
    );
  };
  const handlePreviewSong = async (song: any) => {
    console.log("Play preview for:", song.name);

    const URLArray = await getSongPreview(song.track_id); //waits for this to update previewURL before running below
    const currPrevURL = URLArray[0];
    //const currPrevURL = previewURLRef.current;
    console.log(currPrevURL);
    song.preview_url = currPrevURL;
    playCurrentSong(song);
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => handleSelectSong(item)}
    >
      <TouchableOpacity
        style={styles.playerIcon}
        onPress={() => handlePreviewSong(item)}
      >
        <Ionicons name="play-circle-outline" size={24} color="#1DB954" />
      </TouchableOpacity>
      <View style={styles.songInfo}>
        <Text style={styles.songName}>{item.name}</Text>
        <Text style={styles.artistName}>{item.artist}</Text>
      </View>
      <Ionicons name="checkmark-circle-outline" size={24} color="#1DB954" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <Ionicons
          name="search"
          size={24}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="search for a song..."
          value={searchedSong}
          onChangeText={(e) => {
            setSearchedSong(e);
            handler();
          }}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No results found"
                : "Start typing to search for songs"}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  songInfo: {
    flex: 1,
  },
  songName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  artistName: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  playerIcon: {
    marginRight: 10,
  },
});

export default SearchScreen;
