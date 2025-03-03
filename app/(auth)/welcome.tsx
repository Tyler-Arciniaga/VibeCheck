import { Text, View, Button, Pressable } from "react-native";
import { Redirect, Link } from "expo-router";

export default function WelcomeScreen() {

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <Text>This is the Welcome Screen that users first see when joining the app</Text>
            <Link href="./signup" asChild>
                <Pressable>
                    <Text>Welcome (Press Me)</Text>
                </Pressable>
            </Link>
            


            
            

        </View>
    );
}