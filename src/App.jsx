import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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

// Main app component - handles all routing for the mentorship platform
function App() {
  const [avatar, setAvatar] = useState("");
  useEffect(() => {
    setAvatar(localStorage.getItem("profileAvatar") || "");
    // Listen for changes to localStorage (e.g., after profile update)
    window.addEventListener("storage", () => {
      setAvatar(localStorage.getItem("profileAvatar") || "");
    });
    return () => window.removeEventListener("storage", () => {});
  }, []);

  return (
    <Router>
      {/* Simple global header */}
      <header className="w-full bg-white dark:bg-gray-900 shadow flex items-center justify-between px-6 py-3 mb-2">
        <Link to="/" className="text-xl font-bold text-indigo-600">MentorSetu</Link>
        <nav>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            {/* Avatar */}
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
        <Route path="/profile" element={<Profile />} />
        
        {/* Chat functionality with dynamic routing */}
        <Route path="/chat/:mentorId/:menteeId/:senderType" element={<ChatPage />} />
        
        {/* Mentor discovery for mentees */}
        <Route path="/find-mentors" element={<FindMentors />} />
      </Routes>
    </Router>
  );
}

export default App;
