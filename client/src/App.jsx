import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PinDetailPage from "./pages/PinDetailPage";
import CreatePinPage from "./pages/CreatePinPage";
import ProfilePage from "./pages/ProfilePage";
import SavedPage from "./pages/SavedPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pin/:id" element={<PinDetailPage />} />
        <Route path="/create" element={<ProtectedRoute><CreatePinPage /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}
