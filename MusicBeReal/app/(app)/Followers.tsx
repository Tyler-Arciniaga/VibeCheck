import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { fetchUserProf } from "@/services/profileService";
import { FlatList } from "react-native";
import { Image } from "expo-image";
import { useAuth } from "@/contexts/AuthContext";
import { fetchFollowList, fetchFollower } from "@/services/relationServices";
import { BlurView } from "expo-blur";

const { width: screenWidth } = Dimensions.get("window");

interface ProfileRes {
  id: string;
  avatar: string;
  username: string;
  bio: string;
  name: string;
}

const FollowersPage = () => {
  const { user } = useAuth();
  const [searchVal, setSearchVal] = useState("");
  const [followList, setFollowList] = useState<ProfileRes[]>([]);
  const [followListLength, setFollowListLength] = useState<Number>(0);
  const [searchResults, setSearchResults] = useState<ProfileRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchBarPosition = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const { initialFollowerCount } = useLocalSearchParams();

  // Animation values for list items
  const [itemAnimations, setItemAnimations] = useState<{
    [key: string]: Animated.Value;
  }>({});

  // Keep the existing fetchFollowList functionality
  const loadFollowingData = async () => {
    setIsLoading(true);
    const { success, data } = await fetchFollowList(user.id);
    if (success && data) {
      setFollowList(data);

      // Create animation values for each item
      const animations: { [key: string]: Animated.Value } = {};
      data.forEach((item) => {
        animations[item.id] = new Animated.Value(0);
      });
      setItemAnimations(animations);

      // Start animations in sequence
      setTimeout(() => {
        Object.keys(animations).forEach((id, index) => {
          Animated.timing(animations[id], {
            toValue: 1,
            duration: 400,
            delay: index * 50,
            useNativeDriver: true,
          }).start();
        });
      }, 100);
    } else {
      Alert.alert(
        "Followers List",
        "Error loading followers list please try again later"
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const parsedCount = Array.isArray(initialFollowerCount)
      ? parseInt(initialFollowerCount[0], 10)
      : parseInt(initialFollowerCount || "0", 10);
    setFollowListLength(parsedCount);
    loadFollowingData();
  }, []);

  // Update animations when search results change
  useEffect(() => {
    if (searchVal.length > 0 && searchResults.length > 0) {
      const animations: { [key: string]: Animated.Value } = {};
      searchResults.forEach((item) => {
        animations[item.id] = new Animated.Value(0);
      });
      setItemAnimations(animations);

      // Start animations in sequence
      setTimeout(() => {
        Object.keys(animations).forEach((id, index) => {
          Animated.timing(animations[id], {
            toValue: 1,
            duration: 400,
            delay: index * 50,
            useNativeDriver: true,
          }).start();
        });
      }, 100);
    }
  }, [searchResults]);

  const searchUsers = async (searchResult: string) => {
    setSearchVal(searchResult);
    if (searchResult === "") {
      setSearchResults([]);
      // Animate search bar back to original position
      Animated.timing(searchBarPosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      return;
    }

    // Animate search bar to slightly higher position when typing
    Animated.timing(searchBarPosition, {
      toValue: -20,
      duration: 300,
      useNativeDriver: false,
    }).start();

    const { success, data } = await fetchFollower(user.id, searchResult);
    if (success && data) {
      setSearchResults(data);
    }
  };

  const handleSelectProfile = (searchedUser: ProfileRes) => {
    if (searchedUser.id === user.id) {
      router.replace("/(app)/(tabs)/profile");
    } else {
      router.push({
        pathname: "/(app)/profileView",
        params: { user: JSON.stringify(searchedUser) },
      });
    }
  };

  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Fixed renderProfileItem function without hooks inside
  const renderProfileItem = ({ item }: { item: ProfileRes; index: number }) => {
    // Get the animation value for this item
    const itemAnimation = itemAnimations[item.id] || new Animated.Value(1);

    return (
      <Animated.View
        style={{
          opacity: itemAnimation,
          transform: [
            {
              translateY: itemAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => handleSelectProfile(item)}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: item.avatar || "https://picsum.photos/200" }}
            style={styles.avatar}
            transition={300}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{item.username}</Text>
            {item.bio && (
              <View style={styles.bioContainer}>
                <Feather name="music" size={14} color="#FF3E85" />
                <Text style={styles.bioText} numberOfLines={1}>
                  {item.bio}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderTitle}>
        {searchVal.length > 0 ? "Search Results" : "Your Followers"}
      </Text>
      <Text style={styles.listHeaderCount}>
        {searchVal.length > 0
          ? `${searchResults.length} ${
              searchResults.length === 1 ? "person" : "people"
            }`
          : `${followListLength} ${
              followListLength === 1 ? "person" : "people"
            }`}
      </Text>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Feather name="users" size={40} color="#FF3E85" />
      </View>
      <Text style={styles.emptyTitle}>
        {searchVal.length > 0 ? "No results found" : "No followers yet"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchVal.length > 0
          ? "Try a different search term"
          : "Share your profile to get more followers"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated header background */}
      <Animated.View
        style={[styles.headerBackground, { opacity: headerOpacity }]}
      >
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Followers</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadFollowingData}
        >
          <Feather name="refresh-cw" size={20} color="#FF3E85" />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <Animated.View
        style={[
          styles.searchContainer,
          { transform: [{ translateY: searchBarPosition }] },
        ]}
      >
        <View style={styles.searchInputContainer}>
          <Feather
            name="search"
            size={18}
            color="#FF3E85"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Find a follower..."
            placeholderTextColor="#777777"
            value={searchVal}
            onChangeText={searchUsers}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchVal.length > 0 && (
            <TouchableOpacity onPress={() => searchUsers("")}>
              <View style={styles.clearButton}>
                <Feather name="x" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Followers list */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading followers...</Text>
        </View>
      ) : (
        <Animated.FlatList
          data={searchVal.length > 0 ? searchResults : followList}
          renderItem={renderProfileItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyState}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121214",
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "rgba(18, 18, 20, 0.9)",
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 62, 133, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 2,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E24",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    height: "100%",
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  listHeader: {
    marginBottom: 20,
    paddingTop: 10,
  },
  listHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  listHeaderCount: {
    fontSize: 14,
    color: "#999999",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E24",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#2A2A30",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  bioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bioText: {
    fontSize: 14,
    color: "#AAAAAA",
    marginLeft: 6,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 62, 133, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#AAAAAA",
  },
});

export default FollowersPage;
