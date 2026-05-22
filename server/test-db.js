import mongoose from "mongoose";
import User from "./model/User.js";
import Post from "./model/Post.js";

async function test() {
  await mongoose.connect("mongodb+srv://aswithaavijay_db_user:C389pUUgHy7uSVks@cluster0.8hhxoku.mongodb.net/pinterestweb");
  console.log("Connected");
  
  const user = await User.findOne();
  if(!user) {
    console.log("no user");
    return process.exit(0);
  }
  
  const post = await Post.findOne();
  if(!post) {
      console.log("no post");
      return process.exit(0);
  }

  console.log("Adding comment...");
  try {
    post.comments.push({ user: user._id, text: "Test comment" });
    await post.save();
    console.log("Comment saved!");
  } catch(e) {
    console.error("Comment save error:", e);
  }
  
  console.log("Saving post...");
  try {
    user.savedPosts.push(post._id);
    await user.save();
    console.log("Post saved in user!");
  } catch(e) {
    console.error("User save error:", e);
  }
  
  process.exit(0);
}
test();
