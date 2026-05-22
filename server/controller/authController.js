import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { _id: user._id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio, savedPosts: [] },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("savedPosts", "_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio, savedPosts: user.savedPosts },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("savedPosts", "_id").select("-password");
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { bio, avatar },
      { new: true }
    ).populate("savedPosts", "_id").select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
