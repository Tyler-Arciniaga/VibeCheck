import { supabase, supabaseService } from "@/lib/supabase";
import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js";

interface ProfileData {
  name: string;
  username: string;
  bio: string;
}

export const UpdateProfile = async (
  newProfile: ProfileData,
  userID: string,
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
    return { success: true, data: data, url: cacheBustedURL };
  } catch (error) {
    console.log("Error uploading avatar:", error);
    return { success: false, msg: "Could not upload avatar" };
  }
};

export const fetchUserProf = async (username: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, avatar, username, bio, name, song_posts!song_posts_user_id_fkey(id, name, artist)",
      )
      .ilike("username", `%${username}%`)
      .order("created_at", {
        referencedTable: "song_posts",
        ascending: false,
      })
      .limit(10)
      .limit(3, { referencedTable: "song_posts" });

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

export const deleteAccount = async (userID: string) => {
  try {
    const { data: sessionData, error: sessionErr } = await supabase.auth
      .getSession();
    if (!sessionData.session || sessionErr) {
      console.log("No session found:", sessionErr);
      return { success: false, msg: sessionErr };
    }
    console.log(sessionData.session?.access_token);

    const { data, error } = await supabase.functions.invoke("deleteUser", {
      body: { reason: "user wishes requests for deletion of account" },
    });
    if (error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      console.log("Function returned an error", errorMessage);
    } else if (error instanceof FunctionsRelayError) {
      console.log("Relay error:", error.message);
    } else if (error instanceof FunctionsFetchError) {
      console.log("Fetch error:", error.message);
    }

    if (error) {
      console.log("Error deleting account", error);
      return { success: false, msg: "Could not delete user account" };
    }

    const response = await supabase
      .from("users")
      .delete()
      .eq("id", userID);

    return { success: true, data: { authTable: data, usersTable: response } };
  } catch (error) {
    console.log("Error updating profile:", error);
    return { success: false, msg: "Could not delete user account" };
  }
};

/*
export const deleteAccount = async (userID: string) => {
  try {
    const { error: signOutErr } = await supabase.auth.signOut();
    if (signOutErr) {
      console.log(
        "Error signing out user before deleting account:",
        signOutErr
      );
      return { success: false, msg: signOutErr };
    }
    const { data, error } = await supabaseService.auth.admin.deleteUser(userID);
    if (error) {
      console.log("Error deleting profile:", error);
      return { success: false, msg: "Could not delete profile" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Error deleting profile:", error);
    return { success: false, msg: "Could not delete profile" };
  }
};
*/
