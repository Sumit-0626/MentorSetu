import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState({});
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole);
    let data = {};
    if (savedRole === "mentor") {
      data = JSON.parse(localStorage.getItem("mentorProfile")) || {};
    } else {
      data = JSON.parse(localStorage.getItem("menteeInfo")) || {};
    }
    setProfile(data);
    setAvatar(data.avatar || localStorage.getItem("profileAvatar") || "");
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target.result);
        setProfile((prev) => ({ ...prev, avatar: ev.target.result }));
        // Save to localStorage
        if (role === "mentor") {
          localStorage.setItem("mentorProfile", JSON.stringify({ ...profile, avatar: ev.target.result }));
        } else {
          localStorage.setItem("menteeInfo", JSON.stringify({ ...profile, avatar: ev.target.result }));
        }
        localStorage.setItem("profileAvatar", ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    if (role === "mentor") {
      navigate("/mentor-onboarding");
    } else {
      navigate("/mentee-edit-profile");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-lg flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-indigo-500 shadow">
            {avatar ? (
              <img src={avatar} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <span className="text-5xl text-gray-400">+</span>
            )}
          </div>
          <button
            className="absolute bottom-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs hover:bg-indigo-700 shadow"
            onClick={() => fileInputRef.current.click()}
          >
            Change
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">{profile.fullName || profile.name || "User"}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-1">Role: <span className="font-medium text-indigo-600">{role ? role.charAt(0).toUpperCase() + role.slice(1) : "-"}</span></p>
        {profile.email && <p className="text-gray-600 dark:text-gray-300 mb-1">Email: {profile.email}</p>}
        {profile.education && <p className="text-gray-600 dark:text-gray-300 mb-1">Education: {profile.education}</p>}
        {profile.domain && <p className="text-gray-600 dark:text-gray-300 mb-1">Domain: {profile.domain}</p>}
        {profile.language && <p className="text-gray-600 dark:text-gray-300 mb-1">Language: {profile.language}</p>}
        {profile.goal && <p className="text-gray-600 dark:text-gray-300 mb-1">Goal: {profile.goal}</p>}
        {profile.skills && profile.skills.length > 0 && (
          <p className="text-gray-600 dark:text-gray-300 mb-1">Skills: {Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills}</p>
        )}
        {profile.description && <p className="text-gray-600 dark:text-gray-300 mb-1">About: {profile.description}</p>}
        <button
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold shadow"
          onClick={handleEdit}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile; 