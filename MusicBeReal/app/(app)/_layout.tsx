import { Redirect, Stack, router } from "expo-router";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

const _layout = () => {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
};

const AppLayout = () => {
  const { setAuth } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Session data:", session?.user);

      if (session) {
        setAuth(session?.user);
        //don't think you need to replace with tabs route as that is already the default
      } else {
        setAuth(null);
        router.replace("/(auth)");
      }
    });
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default _layout;
