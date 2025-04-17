import { supabase } from "@/lib/supabase";

interface ProfileData {
  name: string;
  username: string;
  bio: string;
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
    //create unique filename with timestamp
    //const timestamp = Date.now();
    //const filepath = `${uid}/avatar_${timestamp}`
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(uid + "/" + "avatar", file, {
        upsert: true,
        contentType: "image/jpeg",
      });
    if (error) {
      console.log("Error uploading avatar:", error);
      return {
        success: false,
        msg: "Error uploading avatar to storage bucket",
      };
    }
    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(`${uid}/avatar`, {
        transform: { width: 400, height: 400 },
      });

    const cacheBustedURL = `${publicUrl.publicUrl}&t=${Date.now()}`;
    const { error: tblUpdErr } = await supabase
      .from("users")
      .update({ avatar: cacheBustedURL })
      .eq("id", uid);
    if (tblUpdErr) {
      console.log("Error uploading new avatar to users table:", tblUpdErr);
      return { success: false, msg: tblUpdErr };
    }
    return { success: true, data: data, url: cacheBustedURL }; //need more!!! TODO
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
