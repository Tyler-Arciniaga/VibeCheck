import { supabase } from "@/lib/supabase";

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  avatar: string;
}

export const UpdateProfile = async (
  newProfile: ProfileData,
  userID: string
) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        name: newProfile.name,
        username: newProfile.username,
        avatar: newProfile.avatar,
        bio: newProfile.bio,
      })
      .eq("id", userID)
      .select();
    if (error) {
      console.log("Error updating profile:", error);
      return { success: false, msg: "Could not update profile" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Error updating profile:", error);
    return { success: false, msg: "Could not update profile" };
  }
};
