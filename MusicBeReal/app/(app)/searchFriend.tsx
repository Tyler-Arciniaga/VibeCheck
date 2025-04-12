import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { fetchUserProf } from "@/services/profileService";
import { FlatList } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface ProfileRes {
  id: string;
  avatar: string;
  username: string;
  bio: string;
  name: string;
}

const FindPeopleScreen = () => {
  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState<ProfileRes[]>([]);
  const router = useRouter();
  const searchBarPosition = useRef(new Animated.Value(0)).current;

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
    // This is a smaller value than before to keep it lower on the screen
    Animated.timing(searchBarPosition, {
      toValue: -20, // Reduced from -60 to -20 to keep it lower
      duration: 300,
      useNativeDriver: false,
    }).start();

    const { success, data, msg } = await fetchUserProf(searchResult);
    if (success && data) {
      setSearchResults(data);
    }
  };

  const handleSelectProfile = (user: ProfileRes) => {
    router.push({
      pathname: "/(app)/profileView",
      params: { user: JSON.stringify(user) },
    });
    // Navigate to profile or whatever action you want
  };

  const renderProfileItem = ({ item }: { item: ProfileRes }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={() => handleSelectProfile(item)}
    >
      <View style={styles.profileContent}>
        <Image
          source={{ uri: item.avatar || "https://picsum.photos/200" }}
          style={styles.avatar}
        />
        <View style={styles.userInfoContainer}>
          <Text style={styles.username}>{item.username}</Text>
          {item.bio && (
            <View style={styles.musicIndicator}>
              <Feather
                name="music"
                size={14}
                color="#1DB954"
                style={styles.musicIcon}
              />
              <Text style={styles.mutualText}>{item.bio}</Text>
            </View>
          )}
        </View>
        <Feather name="chevron-right" size={20} color="#AAAAAA" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#1DB954" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Find your people</Text>
      </View>

      <Animated.View
        style={[
          styles.searchSectionContainer,
          { transform: [{ translateY: searchBarPosition }] },
        ]}
      >
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={20}
            color="#1DB954"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by username"
            placeholderTextColor="#AAAAAA"
            value={searchVal}
            onChangeText={(e) => searchUsers(e)}
            autoCorrect={false}
          />
          {searchVal.length > 0 && (
            <TouchableOpacity onPress={() => searchUsers("")}>
              <Feather name="x" size={20} color="#AAAAAA" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <View style={styles.resultsContainer}>
        {searchResults?.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyCircle}>
              <Feather name="users" size={40} color="#1DB954" />
            </View>
            <Text style={styles.emptyText}>Start typing to find people</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderProfileItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  headerContainer: {
    paddingTop: 100,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#1DB954",
  },
  searchSectionContainer: {
    paddingHorizontal: 30,
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 28,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333333",
  },
  resultsContainer: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 450, // To center it a bit higher visually
  },
  emptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(29, 185, 84, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
  },
  resultsList: {
    width: screenWidth,
    paddingHorizontal: 20,
  },
  profileItem: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfoContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  musicIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  musicIcon: {
    marginRight: 4,
  },
  mutualText: {
    fontSize: 14,
    color: "#666666",
  },
});

export default FindPeopleScreen;
