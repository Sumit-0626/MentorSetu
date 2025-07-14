import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaMedal, FaFire, FaStar } from "react-icons/fa";

const Profile = (props = {}) => {
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState({});
  const [avatar, setAvatar] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [showSaveAvatar, setShowSaveAvatar] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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

  // Badge logic
  const [badges, setBadges] = useState([]);
  useEffect(() => {
    let earned = [];
    const role = localStorage.getItem("role");
    if (role === "mentee") {
      const mentee = JSON.parse(localStorage.getItem("menteeInfo")) || {};
      const bookings = JSON.parse(localStorage.getItem("sessionBookings")) || [];
      const mySessions = bookings.filter(b => b.menteeId === mentee.id);
      if (mySessions.length > 0) {
        earned.push({
          key: "first-session",
          icon: <FaMedal className="text-yellow-500 text-2xl" />,
          label: "First Session",
          desc: "Booked your first session!"
        });
      }
      if (mySessions.length >= 3) {
        earned.push({
          key: "streak",
          icon: <FaFire className="text-red-500 text-2xl" />,
          label: "Streak Achiever",
          desc: "Booked 3+ sessions!"
        });
      }
    } else if (role === "mentor") {
      const mentor = JSON.parse(localStorage.getItem("mentorProfile")) || {};
      const bookings = JSON.parse(localStorage.getItem("sessionBookings")) || [];
      const mySessions = bookings.filter(b => b.mentorId === mentor.id);
      if (mySessions.length > 0) {
        earned.push({
          key: "first-session",
          icon: <FaMedal className="text-yellow-500 text-2xl" />,
          label: "First Session",
          desc: "Conducted your first session!"
        });
      }
      // Streak: 3+ unique mentees
      const uniqueMentees = new Set(mySessions.map(s => s.menteeId));
      if (uniqueMentees.size >= 3) {
        earned.push({
          key: "streak",
          icon: <FaFire className="text-red-500 text-2xl" />,
          label: "Streak Achiever",
          desc: "Mentored 3+ unique mentees!"
        });
      }
    }
    setBadges(earned);
  }, []);

  // Mentor feedback logic
  const [feedbackStats, setFeedbackStats] = useState({ avg: null, reviews: [] });
  useEffect(() => {
    if (role === "mentor") {
      const mentor = JSON.parse(localStorage.getItem("mentorProfile")) || {};
      const feedbacks = JSON.parse(localStorage.getItem("mentorFeedbacks") || "[]");
      const myFeedbacks = feedbacks.filter(f => f.mentorId === mentor.id);
      if (myFeedbacks.length > 0) {
        const avg = (myFeedbacks.reduce((sum, f) => sum + f.rating, 0) / myFeedbacks.length).toFixed(1);
        setFeedbackStats({ avg, reviews: myFeedbacks });
      }
    }
  }, [role]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPendingAvatar(ev.target.result);
        setShowSaveAvatar(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    setAvatar(pendingAvatar);
    setProfile((prev) => ({ ...prev, avatar: pendingAvatar }));
    if (role === "mentor") {
      localStorage.setItem("mentorProfile", JSON.stringify({ ...profile, avatar: pendingAvatar }));
    } else {
      localStorage.setItem("menteeInfo", JSON.stringify({ ...profile, avatar: pendingAvatar }));
    }
    localStorage.setItem("profileAvatar", pendingAvatar);
    setShowSaveAvatar(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    if (props?.onAvatarChange) props.onAvatarChange(pendingAvatar);
  };

  const handleEdit = () => {
    if (role === "mentor") {
      navigate("/mentor-onboarding");
    } else {
      navigate("/mentee-edit-profile");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-lg flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-indigo-500 shadow">
            {pendingAvatar ? (
              <img src={pendingAvatar} alt="Profile" className="object-cover w-full h-full" />
            ) : avatar ? (
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
          {showSaveAvatar && (
            <button
              className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs hover:bg-green-700 shadow"
              onClick={handleSaveAvatar}
            >
              Save
            </button>
          )}
        </div>
        {showSuccess && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded shadow text-sm font-semibold z-10">
            Profile picture updated!
          </div>
        )}
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">{profile.fullName || profile.name || "User"}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-1">Role: <span className="font-medium text-indigo-600">{role ? role.charAt(0).toUpperCase() + role.slice(1) : "-"}</span></p>

        {/* Badges Section */}
        <div className="w-full my-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Badges</h3>
          {badges.length === 0 ? (
            <p className="text-gray-400 text-sm">No badges earned yet.</p>
          ) : (
            <div className="flex gap-4 flex-wrap">
              {badges.map(badge => (
                <div key={badge.key} className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 rounded p-3 shadow">
                  {badge.icon}
                  <span className="font-medium mt-1">{badge.label}</span>
                  <span className="text-xs text-gray-500 text-center">{badge.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mentor Ratings & Reviews */}
        {role === "mentor" && feedbackStats.reviews.length > 0 && (
          <div className="w-full my-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Ratings & Reviews</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-yellow-500">{feedbackStats.avg}</span>
              {[1,2,3,4,5].map(star => (
                <FaStar key={star} className={star <= Math.round(feedbackStats.avg) ? "text-yellow-400" : "text-gray-300"} />
              ))}
              <span className="text-gray-500 text-sm">({feedbackStats.reviews.length} reviews)</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {feedbackStats.reviews.map((f, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    {[1,2,3,4,5].map(star => (
                      <FaStar key={star} className={star <= f.rating ? "text-yellow-400 text-xs" : "text-gray-300 text-xs"} />
                    ))}
                    <span className="text-xs text-gray-600 dark:text-gray-300">by {f.menteeName}</span>
                  </div>
                  {f.review && <div className="text-sm text-gray-700 dark:text-gray-200 italic">{f.review}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
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
        <button
          className="mt-3 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold shadow"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile; 