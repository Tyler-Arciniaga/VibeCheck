import { supabase } from "@/lib/supabase";

export const followUser = async (
  followerID: string,
  followerUsername: string,
  followingID: string,
  followingUsername: string
) => {
  try {
    const { data, error } = await supabase
      .from("follows")
      .insert({
        follower_id: followerID,
        follower_username: followerUsername,
        following_id: followingID,
        following_username: followingUsername,
      })
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

export const fetchFollowList = async (userID: string) => {
  try {
    const { data, error } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("following_id", userID)
      .limit(40); //TODO: used for pagination will need to be able to load more eventually
    let followerIDArray: string[] = [];
    data?.map((item) => followerIDArray.push(item.follower_id));

    if (error) {
      console.log("Error fetching followers list:", error);
      return { success: false, msg: error };
    }

    const { data: fetchedProfiles, error: fetchedProfilesErr } = await supabase
      .from("users")
      .select(
        "id, avatar, username, bio, name, song_posts!song_posts_user_id_fkey(id, name, artist)"
      )
      .in("id", followerIDArray)
      .order("created_at", {
        referencedTable: "song_posts",
        ascending: false,
      })
      .limit(3, { referencedTable: "song_posts" });

    if (fetchedProfilesErr) {
      console.log("Error fetching followers list:", fetchedProfilesErr);
      return { success: false, msg: fetchedProfilesErr };
    }

    return { success: true, data: fetchedProfiles };
  } catch (error) {
    console.log("Error fetching followers list:", error);
    return { success: false, msg: error };
  }
};

export const fetchFollowingList = async (userID: string) => {
  try {
    const { data, error } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", userID)
      .limit(70); //TODO: used for pagination will need to be able to load more eventually
    let followingIDArray: string[] = [];
    data?.map((item) => followingIDArray.push(item.following_id));

    if (error) {
      console.log("Error fetching followers list:", error);
      return { success: false, msg: error };
    }

    const { data: fetchedProfiles, error: fetchedProfilesErr } = await supabase
      .from("users")
      .select(
        "id, avatar, username, bio, name, song_posts!song_posts_user_id_fkey(id, name, artist)"
      )
      .in("id", followingIDArray)
      .order("created_at", {
        referencedTable: "song_posts",
        ascending: false,
      })
      .limit(3, { referencedTable: "song_posts" });

    if (fetchedProfilesErr) {
      console.log("Error fetching followers list:", fetchedProfilesErr);
      return { success: false, msg: fetchedProfilesErr };
    }

    return { success: true, data: fetchedProfiles };
  } catch (error) {
    console.log("Error fetching followers list:", error);
    return { success: false, msg: error };
  }
};

//TODO: (med) clean this up this is quite overcomplicated i believe...
export const fetchFollower = async (userID: string, username: string) => {
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("following_id", userID)
    .ilike("follower_username", `%${username}%`);

  if (error) {
    console.log(error);
    return { success: false, msg: error };
  }
  let followerIDArray: string[] = [];
  data?.map((item) => followerIDArray.push(item.follower_id));

  if (error) {
    console.log("Error fetching followers list:", error);
    return { success: false, msg: error };
  }

  const { data: fetchedProfiles, error: fetchedProfilesErr } = await supabase
    .from("users")
    .select(
      "id, avatar, username, bio, name, song_posts!song_posts_user_id_fkey(id, name, artist)"
    )
    .in("id", followerIDArray)
    .order("created_at", {
      referencedTable: "song_posts",
      ascending: false,
    })
    .limit(10)
    .limit(3, { referencedTable: "song_posts" });

  if (fetchedProfilesErr) {
    console.log("Error fetching followers list:", fetchedProfilesErr);
    return { success: false, msg: fetchedProfilesErr };
  }

  return { success: true, data: fetchedProfiles };
};

export const fetchFollowing = async (userID: string, username: string) => {
  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userID)
    .ilike("following_username", `%${username}%`);

  if (error) {
    console.log(error);
    return { success: false, msg: error };
  }
  let followingIDArray: string[] = [];
  data?.map((item) => followingIDArray.push(item.following_id));

  if (error) {
    console.log("Error fetching followers list:", error);
    return { success: false, msg: error };
  }

  const { data: fetchedProfiles, error: fetchedProfilesErr } = await supabase
    .from("users")
    .select(
      "id, avatar, username, bio, name, song_posts!song_posts_user_id_fkey(id, name, artist)"
    )
    .in("id", followingIDArray)
    .order("created_at", {
      referencedTable: "song_posts",
      ascending: false,
    })
    .limit(10)
    .limit(3, { referencedTable: "song_posts" });

  if (fetchedProfilesErr) {
    console.log("Error fetching followers list:", fetchedProfilesErr);
    return { success: false, msg: fetchedProfilesErr };
  }

  return { success: true, data: fetchedProfiles };
};
