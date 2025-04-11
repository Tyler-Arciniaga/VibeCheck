import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { fetchUserProf } from "@/services/profileService";
import { FlatList } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface ProfileRes {
  id: string;
  avatar: string;
  username: string;
}

const FindPeopleScreen = () => {
  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState<ProfileRes[]>([]);
  const router = useRouter();

  const searchUsers = async (searchResult: string) => {
    if (searchResult == "") {
      setSearchResults([]);
      return;
    }
    const { success, data, msg } = await fetchUserProf(searchResult);
    if (success && data) {
      setSearchResults(data);
    }
  };

  const handleSelectProfile = (id: string) => {
    console.log(id);
  };

  const renderProfileItem = ({ item }: { item: ProfileRes }) => (
    <TouchableOpacity onPress={() => handleSelectProfile(item.id)}>
      <View>
        <Text>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#1DB954" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Find your people</Text>

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
            onChangeText={(e) => searchUsers(e)}
            autoCorrect={false}
          />
        </View>

        {searchResults?.length == 0 ? (
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
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    marginTop: -60,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#1DB954",
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
    marginBottom: 40,
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
  emptyStateContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  emptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(29, 185, 84, 0.1)", // Light green background
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
  },
});

export default FindPeopleScreen;
