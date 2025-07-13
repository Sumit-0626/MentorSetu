import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaLaptopCode,
  FaLanguage,
  FaConnectdevelop,
  FaChartLine,
  FaClock,
  FaStar,
  FaCalendarAlt,
  FaBookOpen,
  FaUsers,
} from "react-icons/fa";
import NotificationSystem from "../../components/NotificationSystem";
import AnalyticsChart from "../../components/AnalyticsChart";

const MenteeDashboard = () => {
  const navigate = useNavigate();
  const [menteeData, setMenteeData] = useState(null);
  const [learningProgress, setLearningProgress] = useState({
    completedSessions: 12,
    totalSessions: 20,
    currentStreak: 5,
    weeklyGoal: 3,
    weeklyCompleted: 2,
  });

  // Mock data for recent activities and recommendations
  const [recentActivities] = useState([
    { id: 1, type: "session", title: "React Hooks Deep Dive", mentor: "Sarah Chen", date: "2 hours ago", duration: "45 min" },
    { id: 2, type: "milestone", title: "Completed JavaScript Basics", date: "1 day ago", achievement: "Certificate earned" },
    { id: 3, type: "message", title: "New message from mentor", mentor: "Mike Johnson", date: "3 hours ago" },
  ]);

  const [recommendedMentors] = useState([
    { id: 1, name: "Dr. Emily Rodriguez", expertise: "Full Stack Development", rating: 4.9, sessions: 127, availability: "Available" },
    { id: 2, name: "Alex Thompson", expertise: "React & Node.js", rating: 4.8, sessions: 89, availability: "Available" },
    { id: 3, name: "Priya Sharma", expertise: "Machine Learning", rating: 4.7, sessions: 156, availability: "Available" },
  ]);

  useEffect(() => {
    const storedData = localStorage.getItem("menteeInfo");
    if (!storedData) {
      navigate("/mentee-onboarding");
    } else {
      setMenteeData(JSON.parse(storedData));
    }
  }, [navigate]);

  if (!menteeData) {
    return <div className="text-center mt-10 text-lg">Loading your dashboard...</div>;
  }

  const progressPercentage = (learningProgress.completedSessions / learningProgress.totalSessions) * 100;
  const weeklyProgressPercentage = (learningProgress.weeklyCompleted / learningProgress.weeklyGoal) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Welcome back, {menteeData.fullName}!</h1>
          <div className="flex gap-3 items-center">
            <NotificationSystem userType="mentee" />
            <Link to="/find-mentors">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                <FaUsers className="text-sm" />
                Find Mentors
              </button>
            </Link>
            <Link to="/mentee-edit-profile">
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                Edit Profile
              </button>
            </Link>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Learning Progress</h3>
              <FaChartLine className="text-indigo-500 text-xl" />
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {learningProgress.completedSessions} of {learningProgress.totalSessions} sessions completed
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Weekly Goal</h3>
              <FaCalendarAlt className="text-green-500 text-xl" />
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>This Week</span>
                <span>{Math.round(weeklyProgressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${weeklyProgressPercentage}%` }}></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {learningProgress.weeklyCompleted} of {learningProgress.weeklyGoal} sessions this week
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Current Streak</h3>
              <FaStar className="text-yellow-500 text-xl" />
            </div>
            <div className="text-3xl font-bold text-yellow-500 mb-2">{learningProgress.currentStreak}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">days of consistent learning</p>
          </div>
        </div>

        {/* Profile Info and Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Profile Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Your Profile</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaUserGraduate className="text-indigo-500 text-lg" />
                <p><strong>Name:</strong> {menteeData.fullName}</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaLaptopCode className="text-indigo-500 text-lg" />
                <p><strong>Learning Goal:</strong> {menteeData.learningGoal}</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaLanguage className="text-indigo-500 text-lg" />
                <p><strong>Preferred Language:</strong> {menteeData.languagePreference}</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaConnectdevelop className="text-indigo-500 text-lg" />
                <p><strong>Domain:</strong> {menteeData.domain}</p>
              </div>
              {menteeData.description && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm"><strong>About Your Problem:</strong></p>
                  <p className="text-sm italic text-gray-600 dark:text-gray-300">{menteeData.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Learning Analytics */}
          <div>
            <AnalyticsChart userType="mentee" />
          </div>
        </div>

        {/* Recommended Mentors */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Recommended Mentors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedMentors.map((mentor) => (
              <div key={mentor.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{mentor.name}</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{mentor.availability}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{mentor.expertise}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span>{mentor.rating}</span>
                  </div>
                  <span className="text-gray-500">{mentor.sessions} sessions</span>
                </div>
                <button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <FaClock className="text-gray-400 text-sm" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.mentor && `${activity.mentor} • `}{activity.date}
                    {activity.duration && ` • ${activity.duration}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard;
