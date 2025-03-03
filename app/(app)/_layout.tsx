import { Redirect, Stack } from "expo-router";


export default function AppLayout() {
  const isLoggedIn: boolean = true;
  {/**Will involve useSupabase later on but for right now just testing general restrictions based on user sign in status */}
  
  if (!isLoggedIn) {
    return <Redirect href="../(auth)"/>
  }

  return <Stack />
}
