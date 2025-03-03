import { Text, View, Button } from "react-native";

export default function WelcomeScreen() {
    function handleWelcomeButton(): void {
        console.log('====================================');
        console.log("Welcome Button Clicked");
        console.log('====================================');
    }
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <Text>This is the Welcome Screen that users first see when joining the app</Text>
            
            <Button
                onPress={handleWelcomeButton}
                title="Welcome Button"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />



            
            

        </View>
    );
}