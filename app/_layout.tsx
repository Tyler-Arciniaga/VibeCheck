import { Stack } from "expo-router";


export default function RootLayout() {
  const isLoggedIn: boolean = true;
  {/**Will involve useSupabase later on but for right now just testing general restrictions based on user sign in status */}
  return (
    <Stack>
      <Stack.Screen name="(app)"/>
    </Stack>
  );
}
