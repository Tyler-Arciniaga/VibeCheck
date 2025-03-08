import { Text, View, Image, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={["#8A2BE2", "#4B0082", "#191414"]}
      style={styles.container}
    >
      {/* Music note decorations */}
      <View style={styles.musicNotesContainer}>
        <Text style={styles.musicNote}>♪</Text>
        <Text style={styles.musicNote}>♫</Text>
        <Text style={styles.musicNote}>♬</Text>
      </View>

      {/* App logo and cat mascot */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/kittyLogo.png")}
          style={styles.catMascot}
        />
        <Text style={styles.appName}>VibeCheck</Text>
      </View>

      {/* App description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.tagline}>Share Your Daily Soundtrack!</Text>
        <Text style={styles.description}>
          Get a notification once a day to share what you're listening to.
          Connect with friends through music in real-time!
        </Text>
      </View>

      {/* Vinyl record decoration */}
      <View style={styles.vinylContainer}>
        <View style={styles.vinylRecord}>
          <View style={styles.vinylCenter} />
        </View>
      </View>

      {/* Join button */}
      <Link href="./signup" asChild>
        <Pressable style={styles.joinButton}>
          <Text style={styles.joinButtonText}>JOIN TODAY</Text>
        </Pressable>
      </Link>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  musicNotesContainer: {
    position: "absolute",
    top: 40,
    right: 30,
  },
  musicNote: {
    fontSize: 32,
    color: "#1DB954",
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  catMascot: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#1DB954",
  },
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    textShadowColor: "#1DB954",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  descriptionContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tagline: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1DB954",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    lineHeight: 24,
  },
  vinylContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  vinylRecord: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#191414",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  vinylCenter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1DB954",
  },
  joinButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 40,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  joinButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
