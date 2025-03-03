import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function MainScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is the main screen where users will view the songs their friends have posted for the day</Text>
      <Link href = "/profile">Click to go to Profile</Link>
    </View>
  );
}
