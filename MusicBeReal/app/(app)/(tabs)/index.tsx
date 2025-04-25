import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  type ViewToken,
  Alert,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import PostCard from "../../../components/postCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchPosts, fetchMorePosts } from "@/services/postService";
import { Audio } from "expo-av";
import { useFocusEffect, useRouter } from "expo-router";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";

//TODO: (medium) implement the song preview to loop after finishing if user still on
//the same song

//TODO: (med) possibly add a play pause button on each song post screen
//still like the fact that song begins to play on first arrival though so keep that

//TODO: (low) create an anchor to automatically scroll a little bit more when user
//reaches the end of the screen so that it is more seamless

//TODO: (low) start playback of current song item back up when user returns
//back to index tab after previously leaving (causing unfocused state)

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface PostType {
  id: string;
  username: string;
  name: string;
  artist: string;
  cover: string;
  caption: string; //might not need
  likes: number; //might not need
  uri: string;
  postComments: Comment[];
  postLikes: PostLikes[];
  avatar: string;
}

interface PostLikes {
  post_id: string;
  user_id: string;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  comment_text: string;
}

const HomeScreen = () => {
  const { user } = useAuth();
  const flatListRef = useRef<FlatList<PostType>>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newSound, setNewSound] = useState<Audio.Sound | null>(null);
  const [currentlyPlayingSong, setCurrentlyPlayingSong] = useState<
    string | null
  >(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastSongID, setLastSongID] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { refresh } = useLocalSearchParams();

  const router = useRouter();

  useEffect(() => {
    getPosts();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      //will only run when user unfocuses from index page
      return async () => {
        if (newSoundRef.current) {
          await newSoundRef.current.unloadAsync();
          setCurrentlyPlayingSong(null);
        }
      };
    }, [])
  );

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const newSoundRef = useRef(newSound);
  useEffect(() => {
    newSoundRef.current = newSound;
  }, [newSound]);

  const enableAudio = async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: false,
    });
  };

  const getPosts = async () => {
    const { success, data, msg } = await fetchPosts(user.id);
    if (success === false) {
      Alert.alert("Error fetching posts", msg);
    }
    if (data) {
      setPosts(data);
    }
  };

  useEffect(() => {
    enableAudio();
    getPosts();
  }, [user]);

  const onPlayBackStatusUpdate = (status: any) => {
    //console.log(status);
    if (status.didJustFinish) {
      setCurrentlyPlayingSong(null);
      setIsPlaying(false);
    }
  };

  const playCurrentSong = async (preview_url: string, songName: string) => {
    if (newSoundRef.current) {
      await newSoundRef.current.unloadAsync();
      setCurrentlyPlayingSong(null);
    }
    if (isPlayingRef.current) {
      await newSoundRef.current?.unloadAsync();
      setCurrentlyPlayingSong(null);
      setIsPlaying(false);
    }
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: preview_url,
      },
      { shouldPlay: true },
      onPlayBackStatusUpdate
    );

    setCurrentlyPlayingSong(songName);
    setIsPlaying(true);
    setNewSound(sound);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const currSongPost = viewableItems[0].item;
        console.log("Current visible item:", currSongPost.name);
        playCurrentSong(currSongPost.preview_url, currSongPost.name);
        setLastSongID(currSongPost.id);
      }
    }
  );

  // Function to handle when user reaches the bottom of the screen
  const handleLoadMore = async () => {
    if (isLoadingMore) return; // Prevent multiple simultaneous calls

    setIsLoadingMore(true);

    try {
      const { success, data, msg } = await fetchMorePosts(user.id, lastSongID);
      if (success === false) {
        console.log(msg);
        Alert.alert("Error fetching more posts", msg);
      }

      if (data) {
        setPosts((prevPosts) => [...prevPosts, ...data]);
      }
      console.log("Loaded more posts successfully");
    } catch (error) {
      console.error("Error loading more posts:", error);
      Alert.alert("Error", "Failed to load more posts");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Function to handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      getPosts();
    } catch (error) {
      console.error("Error refreshing:", error);
      Alert.alert("Error", "Failed to refresh content");
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => {
          router.push("/(app)/searchFriend");
        }}
      >
        <Feather name="search" size={24} color="#1DB954" />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={screenHeight}
        decelerationRate="fast"
        disableIntervalMomentum={true}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1} // Trigger when user is within 10% of the bottom
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1DB954"
            colors={["#1DB954"]}
            progressViewOffset={100} // This moves the spinner down by 100 units
          />
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.loadingFooter}>
              <Text>Loading more posts...</Text>
            </View>
          ) : null
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          router.replace("/(app)/(tabs)/create");
        }}
      >
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
  searchButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
  loadingFooter: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
