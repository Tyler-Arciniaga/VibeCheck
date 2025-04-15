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

export const updateAvatar = async (file: any, uid: string) => {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(uid + "/" + "avatar", file, {
        upsert: true,
        contentType: "image/jpeg",
      });
    if (error) {
      console.log("Error uploading avatar:", error);
      return { success: false, msg: "Could not upload avatar" };
    }
    const { data: publicUrl } = await supabase.storage
      .from("avatars")
      .getPublicUrl(`${uid}/avatar`);
    return { success: true, data: data, url: publicUrl }; //need more!!! TODO
  } catch (error) {
    console.log("Error uploading avatar:", error);
    return { success: false, msg: "Could not upload avatar" };
  }
};

export const fetchUserProf = async (username: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, avatar, username, bio, name")
      .like("username", `%${username}%`);

    if (error) {
      console.log("Error updating profile:", error);
      return { success: false, msg: "Could not find such profile by username" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Error updating profile:", error);
    return { success: false, msg: "Could not find such profile by username" };
  }
};
