import { Text, View, Button } from "react-native";
import { Link } from "expo-router"

export default function SignUpScreen() {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <Text>This is the sign up screen where users make an account</Text>
            <Text>Allow them to sign in instead if they already have an account</Text>

            <Link href = "./signin">Already Have an Account? (Press Me)</Link>



            
            

        </View>
    );
}