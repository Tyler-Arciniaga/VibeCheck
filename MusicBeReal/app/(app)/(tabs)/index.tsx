import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  type ViewToken,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import PostCard from "../../../components/postCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchPosts } from "@/services/postService";
import { Audio } from "expo-av";

// Get the screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface PostType {
  id: string;
  username: string;
  name: string;
  artist: string;
  cover: string;
  caption: string;
  likes: number;
  comments: number;
  uri: string;
}

const HomeScreen = () => {
  const { user, setAuth } = useAuth();
  const flatListRef = useRef<FlatList<PostType>>(null);
  const [posts, setPosts] = useState<PostType[]>();
  const [newSound, setNewSound] = useState<Audio.Sound | null>(null);
  const [currentlyPlayingSong, setCurrentlyPlayingSong] = useState<
    string | null
  >(null);

  const newSoundRef = useRef(newSound); //used to create a ref to keep track of most up to date search query
  useEffect(() => {
    newSoundRef.current = newSound; //update whenver state of searchedSong is updated
  }, [newSound]);

  const enableAudio = async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: false,
    });
  };

  const getPosts = async () => {
    console.log("Fetching posts...");
    let { success, data, msg } = await fetchPosts();
    if (success === false) {
      Alert.alert("Error fetching posts", msg);
    }
    setPosts(data);
  };

  useEffect(() => {
    enableAudio();
    getPosts();
  }, []);

  const onPlayBackStatusUpdate = (status: any) => {
    //console.log(status);
    if (status.didJustFinish) {
      setCurrentlyPlayingSong(null);
    }
  };

  const playCurrentSong = async (preview_url: string, songName: string) => {
    console.log("new sound:", newSoundRef);
    if (newSoundRef.current) {
      await newSoundRef.current.unloadAsync();
      setCurrentlyPlayingSong(null);
    }
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: preview_url,
      },
      { shouldPlay: true },
      onPlayBackStatusUpdate
    );

    setCurrentlyPlayingSong(songName);
    setNewSound(sound);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const currSongPost = viewableItems[0].item;
        console.log("Current visible item:", currSongPost.name);
        playCurrentSong(currSongPost.preview_url, currSongPost.name);
      }
    }
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={screenHeight}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
      <TouchableOpacity style={styles.addButton}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
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

export default HomeScreen;
