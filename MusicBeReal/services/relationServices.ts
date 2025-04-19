import { supabase } from "@/lib/supabase";

export const followUser = async (followerID: string, followingID: string) => {
  try {
    const { data, error } = await supabase
      .from("follows")
      .insert({ follower_id: followerID, following_id: followingID })
      .select()
      .single();
    if (error) {
      console.log("Error inserting follow entry to Supabase:", error);
      return { success: false, msg: "Could not successfully follow" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Could not create follow entry in Supabase" };
  }
};

export const unfollowUser = async (followerID: string, followingID: string) => {
  const response = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerID)
    .eq("following_id", followingID);
  return { response: response };
};

export const checkFollowStatus = async (
  followerID: string,
  followingID: string
) => {
  try {
    const { data, error } = await supabase
      .from("follows")
      .select()
      .eq("follower_id", followerID)
      .eq("following_id", followingID);

    if (error) {
      console.log("Error checking relationship in Supabase:", error);
      return {
        success: false,
        msg: "Could not check current relationship in Supabase",
      };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      msg: "Could not check current relationship in Supabase",
    };
  }
};
