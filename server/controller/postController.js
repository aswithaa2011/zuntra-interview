import Post from "../model/Post.js";
import User from "../model/User.js";

export const getPosts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (category && category !== "All") query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
    const skip = (page - 1) * limit;
    const posts = await Post.find(query)
      .populate("author", "username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await Post.countDocuments(query);
    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar bio")
      .populate("comments.user", "username avatar");
    if (!post) return res.status(404).json({ message: "Not found" });
    res.json(post);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, description, imageUrl, category, tags } = req.body;
    if (!title || !imageUrl) return res.status(400).json({ message: "Title and image required" });
    const post = await Post.create({
      title, description, imageUrl, category,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      author: req.userId,
    });
    const populated = await post.populate("author", "username avatar");
    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });
    if (post.author.toString() !== req.userId)
      return res.status(403).json({ message: "Forbidden" });
    await post.deleteOne();
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });
    const idx = post.likes.indexOf(req.userId);
    if (idx === -1) post.likes.push(req.userId);
    else post.likes.splice(idx, 1);
    await post.save();
    res.json({ likes: post.likes.length, liked: idx === -1 });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const postId = req.params.id;
    const idx = user.savedPosts.indexOf(postId);
    if (idx === -1) user.savedPosts.push(postId);
    else user.savedPosts.splice(idx, 1);
    await user.save();
    res.json({ saved: idx === -1, savedPosts: user.savedPosts });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text required" });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });
    post.comments.push({ user: req.userId, text });
    await post.save();
    const updated = await Post.findById(req.params.id)
      .populate("comments.user", "username avatar");
    res.json(updated.comments);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "savedPosts",
      populate: { path: "author", select: "username avatar" },
    });
    res.json(user.savedPosts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
