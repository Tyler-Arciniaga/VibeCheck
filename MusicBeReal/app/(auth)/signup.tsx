import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert("Sign Up", "Make Sure all fields are filled.");
      return;
    }
    const safeName = name.trim();
    const safeEmail = email.trim();
    const safePassword = password.trim();
    const safeUserName = userName.trim();

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: safeEmail,
      password: safePassword,
      options: {
        data: {
          name: safeName,
          username: safeUserName,
        },
      },
    });
    if (error) {
      Alert.alert(error.message);
    }
    console.log("Session:", session);

    //now need to router.push to main home page with authenticated user
  };

  return (
    <LinearGradient
      colors={["#8A2BE2", "#4B0082", "#191414"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header with logo */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/kittyLogo.png")}
              style={styles.catLogo}
            />
            <Text style={styles.title}>Join VibeCheck</Text>
            <Text style={styles.subtitle}>
              Share your music vibes with friends!
            </Text>
          </View>

          {/* Music note decorations */}
          <View style={styles.musicNotesLeft}>
            <Text style={styles.musicNote}>♪</Text>
            <Text style={styles.musicNote}>♫</Text>
          </View>
          <View style={styles.musicNotesRight}>
            <Text style={styles.musicNote}>♬</Text>
            <Text style={styles.musicNote}>♩</Text>
          </View>

          {/* Sign up form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Feather
                name="user"
                size={20}
                color="#1DB954"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather
                name="headphones"
                size={20}
                color="#1DB954"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="User Name"
                placeholderTextColor="#999"
                autoCapitalize="none"
                value={userName}
                onChangeText={setUserName}
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather
                name="mail"
                size={20}
                color="#1DB954"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather
                name="lock"
                size={20}
                color="#1DB954"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCorrect={false}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#999"
                />
              </Pressable>
            </View>

            <Pressable style={styles.signupButton} onPress={handleSubmit}>
              <Text style={styles.signupButtonText}>CREATE ACCOUNT</Text>
            </Pressable>

            <Text style={styles.termsText}>
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </View>

          {/* Already have account link */}
          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <Link href="./signin" asChild>
              <Pressable>
                <Text style={styles.signinLink}>Sign In</Text>
              </Pressable>
            </Link>
          </View>

          {/* Decorative vinyl element */}
          <View style={styles.vinylDecoration}>
            <View style={styles.vinylRing} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  catLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#1DB954",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 8,
  },
  musicNotesLeft: {
    position: "absolute",
    top: 100,
    left: 20,
  },
  musicNotesRight: {
    position: "absolute",
    top: 120,
    right: 20,
  },
  musicNote: {
    fontSize: 24,
    color: "#1DB954",
    marginBottom: 8,
  },
  formContainer: {
    width: "100%",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    height: "100%",
  },
  eyeIcon: {
    padding: 8,
  },
  signupButton: {
    backgroundColor: "#1DB954",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  signupButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  termsText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
  },
  signinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signinText: {
    color: "white",
    fontSize: 14,
  },
  signinLink: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "bold",
  },
  vinylDecoration: {
    position: "absolute",
    bottom: -40,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 12,
    borderColor: "rgba(29, 185, 84, 0.3)",
    zIndex: -1,
  },
  vinylRing: {
    position: "absolute",
    top: 25,
    left: 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: "rgba(29, 185, 84, 0.2)",
  },
});
