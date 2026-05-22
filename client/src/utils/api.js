import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const updateProfile = (data) => api.put("/auth/profile", data);

export const getPosts = (params) => api.get("/posts", { params });
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post("/posts", data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const likePost = (id) => api.post(`/posts/${id}/like`);
export const savePost = (id) => api.post(`/posts/${id}/save`);
export const addComment = (id, text) => api.post(`/posts/${id}/comment`, { text });
export const getUserPosts = (userId) => api.get(`/posts/user/${userId}`);
export const getSavedPosts = () => api.get("/posts/saved");

export default api;
