import { View, Text, StyleSheet, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

{/**<View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is the Create Screen where users will post their song of the day (integrated with some sort of music API like Spotify)</Text>
      
    </View> */}
export default function CreateScreen() {
    return (
      <SafeAreaView style={styles.container}>
        {/* Timer in top right */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>2:00</Text>
        </View>
  
        <View style={styles.contentContainer}>
          {/* User Profile Circle */}
          <View style={styles.profileContainer}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitial}>J</Text>
            </View>
            <Text style={styles.username}>@username</Text>
          </View>
  
          {/* Song Input Area */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>TODAY'S SONG</Text>
            <View style={styles.songInput}>
              <Text style={styles.placeholderText}>Enter song name</Text>
            </View>
            <View style={styles.inputIconContainer}>
              <Ionicons name="musical-notes" size={20} color="#666" />
            </View>
          </View>
  
          {/* Caption Input Area */}
          <View style={styles.captionContainer}>
            <View style={styles.captionInput}>
              <Text style={styles.placeholderText}>Add a short caption...</Text>
            </View>
            <Text style={styles.captionCounter}>0/50</Text>
          </View>
  
          {/* Post Button */}
          <View style={styles.postButton}>
            <Text style={styles.postButtonText}>Post Song of the Day</Text>
          </View>
        </View>
      </SafeAreaView>
    )
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
      fontSize: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    placeholderText: {
      color: "#999",
      textAlign: "center",
    },
    inputIconContainer: {
      position: "absolute",
      right: 15,
      top: 30,
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
})

