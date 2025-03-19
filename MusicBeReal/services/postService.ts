import { supabase } from "@/lib/supabase";
//will probably eventually need to have other services for uploading album cover

interface Song {
  name: string;
  artist: string;
  uri: string;
  preview_url: string | null;
  cover: string;
}

export const createPost = async (song: Song) => {
  try {
    const { data, error } = await supabase
      .from("song_posts")
      .insert(song)
      .select()
      .single();
    if (error) {
      console.log("Error upserting post to Supabase:", error);
      return { success: false, msg: "Could not create post" };
    }
    return { sucess: true, data: data };
  } catch (error) {
    console.log("Error posting song:", error);
    return { success: false, msg: "Could not create post" };
  }
};
