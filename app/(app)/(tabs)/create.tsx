import { Text, View } from "react-native";

export default function CreateScreen() {
    return(
        <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is the Create Screen where users will post their song of the day (integrated with some sort of music API like Spotify)</Text>
      
    </View>
    )
}