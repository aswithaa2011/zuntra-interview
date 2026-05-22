import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text:    { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  imageUrl:    { type: String, required: true },
  category:    { type: String, default: "General", enum: ["General","Nature","Architecture","Travel","Food","Fashion","Art","Technology","Interiors","Fitness"] },
  tags:        [{ type: String }],
  author:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments:    [commentSchema],
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
