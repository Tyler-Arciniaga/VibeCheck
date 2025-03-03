import { Text, View } from "react-native";

export default function ProfileScreen() {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <Text>This will be the Profile screen where users will see their profile such as avatar, bio, username etc</Text>
            <Text>Users will also be able to view their old music posts (later addition though)</Text>

        </View>
    );
}