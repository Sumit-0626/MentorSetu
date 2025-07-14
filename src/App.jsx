import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import RoleSelect from "./pages/RoleSelect";
import MenteeOnboarding from "./pages/MenteeOnboarding";
import MentorOnboarding from "./pages/MentorOnboarding";
import MentorDashboard from "./pages/dashboards/MentorDashboard";
import MenteeDashboard from "./pages/dashboards/MenteeDashboard";
import ChatPage from "./pages/chat/ChatPage";
import MenteeEditProfile from "./pages/forms/MenteeEditProfile";
import FindMentors from "./pages/mentee/FindMentors";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";

// Main app component - handles all routing for the mentorship platform
function App() {
  const [avatar, setAvatar] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    setAvatar(localStorage.getItem("profileAvatar") || "");
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
      <AppWithRouter key={avatar} avatar={avatar} darkMode={darkMode} setDarkMode={setDarkMode} setAvatar={setAvatar} />
    </Router>
  );
}

function AppWithRouter({ avatar, darkMode, setDarkMode, setAvatar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");
  const isAuthPage = ["/", "/login", "/register", "/role-select"].includes(location.pathname);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (user && role) {
      if (role === "mentor") navigate("/mentor-dashboard");
      else navigate("/mentee-dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {!isAuthPage && (
        <header className="w-full bg-white dark:bg-gray-900 shadow flex items-center justify-between px-6 py-3 mb-2">
          <a href="#" onClick={handleLogoClick} className="text-xl font-bold text-indigo-600">MentorSetu</a>
          <nav className="flex items-center gap-4">
            <Link to="/leaderboard" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1 rounded font-semibold">Leaderboard</Link>
            <Link to="/about" className="text-indigo-600 hover:underline">About</Link>
            <Link to="/contact" className="text-indigo-600 hover:underline">Contact</Link>
            <Link to="/resources" className="text-indigo-600 hover:underline">Resources</Link>
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              aria-label="Toggle dark mode"
            >
              {darkMode ? "🌙 Dark" : "☀️ Light"}
            </button>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition"
            >
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover border-2 border-white shadow" />
              ) : (
                <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold border-2 border-white shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                  </svg>
                </span>
              )}
              Profile
            </Link>
          </nav>
        </header>
      )}
      <Routes>
        {/* Landing page - user authentication */}
        <Route path="/" element={<AuthPage />} />
        
        {/* User role selection after login */}
        <Route path="/role-select" element={<RoleSelect />} />
        
        {/* Onboarding flows for different user types */}
        <Route path="/mentor-onboarding" element={<MentorOnboarding />} />
        <Route path="/mentee-onboarding" element={<MenteeOnboarding />} />
        
        {/* Main dashboard pages */}
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/mentee-dashboard" element={<MenteeDashboard />} />
        
        {/* Profile management */}
        <Route path="/mentee-edit-profile" element={<MenteeEditProfile />} />
        
        {/* Profile page */}
        <Route path="/profile" element={<Profile onAvatarChange={setAvatar} />} />
        
        {/* Chat functionality with dynamic routing */}
        <Route path="/chat/:mentorId/:menteeId/:senderType" element={<ChatPage />} />
        
        {/* Mentor discovery for mentees */}
        <Route path="/find-mentors" element={<FindMentors />} />

        {/* Leaderboard page */}
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* Resources page */}
        <Route path="/resources" element={<Resources />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
