import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.tagline}>
              Get Back to sharing with friends!
            </Text>
          </View>

          {/* Music note decorations */}
          <View style={styles.musicNotesContainer}>
            <Text style={styles.musicNote}>♪</Text>
            <Text style={styles.musicNote}>♫</Text>
            <Text style={styles.musicNote}>♬</Text>
          </View>

          {/* Sign in form */}
          <View style={styles.formContainer}>
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

            <View style={styles.forgotPasswordContainer}>
              <Pressable>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>
            </View>

            <Pressable style={styles.signinButton}>
              <Text style={styles.signinButtonText}>SIGN IN</Text>
            </Pressable>
          </View>

          {/* Create account link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Link href="./signup" asChild>
              <Pressable>
                <Text style={styles.signupLink}>Sign Up</Text>
              </Pressable>
            </Link>
          </View>

          {/* Decorative vinyl elements */}
          <View style={styles.vinylDecorationLeft}>
            <View style={styles.vinylRing} />
          </View>
          <View style={styles.vinylDecorationRight}>
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
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    color: "#1DB954",
    fontWeight: "500",
  },
  musicNotesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  musicNote: {
    fontSize: 28,
    color: "#1DB954",
    marginHorizontal: 10,
  },
  formContainer: {
    width: "100%",
    marginBottom: 60,
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#1DB954",
    fontSize: 14,
  },
  signinButton: {
    backgroundColor: "#1DB954",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  signinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "white",
    fontSize: 14,
  },
  signupLink: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "bold",
  },
  vinylDecorationLeft: {
    position: "absolute",
    bottom: 20,
    left: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 10,
    borderColor: "rgba(29, 185, 84, 0.2)",
    zIndex: -1,
  },
  vinylDecorationRight: {
    position: "absolute",
    top: 40,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 12,
    borderColor: "rgba(29, 185, 84, 0.2)",
    zIndex: -1,
  },
  vinylRing: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "40%",
    height: "40%",
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "rgba(29, 185, 84, 0.3)",
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
});
