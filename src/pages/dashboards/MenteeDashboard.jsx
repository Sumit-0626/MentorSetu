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
  FaComments,
} from "react-icons/fa";
import NotificationSystem from "../../components/NotificationSystem";
import AnalyticsChart from "../../components/AnalyticsChart";
import { addMentorPoints } from "../../utils/mentorPoints";

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

  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, session: null });
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  // Track sent requests
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("menteeInfo");
    if (!storedData) {
      navigate("/mentee-onboarding");
    } else {
      setMenteeData(JSON.parse(storedData));
    }
    // Fetch upcoming sessions for this mentee
    const allBookings = JSON.parse(localStorage.getItem("sessionBookings")) || [];
    if (storedData) {
      const mentee = JSON.parse(storedData);
      const myBookings = allBookings.filter(b => b.menteeId === mentee.id);
      setUpcomingSessions(myBookings);
    }
    // Load sent requests from localStorage
    const menteeData = JSON.parse(localStorage.getItem("menteeInfo"));
    if (menteeData) {
      const requests = JSON.parse(localStorage.getItem("menteeRequests")) || [];
      const myRequests = requests.filter(r => r.id === menteeData.id).map(r => r.mentorId);
      setSentRequests(myRequests);
    }
  }, [navigate]);

  if (!menteeData) {
    return <div className="text-center mt-10 text-lg">Loading your dashboard...</div>;
  }

  const progressPercentage = (learningProgress.completedSessions / learningProgress.totalSessions) * 100;
  const weeklyProgressPercentage = (learningProgress.weeklyCompleted / learningProgress.weeklyGoal) * 100;

  // Helper: check if session is past
  const isSessionPast = (dateTime) => new Date(dateTime) < new Date();

  // Submit feedback
  const handleSubmitFeedback = () => {
    if (!feedbackModal.session) return;
    const feedbacks = JSON.parse(localStorage.getItem("mentorFeedbacks") || "[]");
    feedbacks.push({
      mentorId: feedbackModal.session.mentorId,
      mentorName: feedbackModal.session.mentorName,
      menteeId: menteeData.id,
      menteeName: menteeData.fullName,
      rating,
      review,
      date: new Date().toISOString(),
    });
    localStorage.setItem("mentorFeedbacks", JSON.stringify(feedbacks));

    // Award points for session completion (if not already awarded)
    const mentorId = feedbackModal.session.mentorId;
    const sessionKey = `${feedbackModal.session.menteeId}-${feedbackModal.session.mentorId}-${feedbackModal.session.dateTime}`;
    const completedSessions = JSON.parse(localStorage.getItem("completedSessions") || "[]");
    if (!completedSessions.includes(sessionKey)) {
      addMentorPoints(mentorId, "complete_session", { menteeId: feedbackModal.session.menteeId, session: sessionKey });
      completedSessions.push(sessionKey);
      localStorage.setItem("completedSessions", JSON.stringify(completedSessions));
    }
    // Award points for positive feedback
    addMentorPoints(mentorId, "positive_feedback", { menteeId: feedbackModal.session.menteeId, rating, review });
    // Award extra points for 5-star rating
    if (rating === 5) {
      addMentorPoints(mentorId, "five_star_rating", { menteeId: feedbackModal.session.menteeId, review });
    }

    setFeedbackModal({ open: false, session: null });
    setRating(0);
    setReview("");
    alert("Thank you for your feedback!");
  };

  const handleConnect = (mentor) => {
    if (!menteeData) return;
    const existingRequests = JSON.parse(localStorage.getItem("menteeRequests")) || [];
    // Prevent duplicate requests
    if (existingRequests.some(r => r.id === menteeData.id && r.mentorId === mentor.id)) return;
    const newRequest = {
      ...menteeData,
      mentorId: mentor.id,
      mentorName: mentor.name,
    };
    localStorage.setItem("menteeRequests", JSON.stringify([...existingRequests, newRequest]));
    setSentRequests(prev => [...prev, mentor.id]);
    // Add notification for mentor
    const mentorNotificationsKey = `mentorNotifications_${mentor.id}`;
    const mentorNotifications = JSON.parse(localStorage.getItem(mentorNotificationsKey) || "[]");
    mentorNotifications.unshift({
      id: Date.now(),
      type: "request",
      title: "New Mentee Request",
      message: `${menteeData.fullName} has sent you a connection request!`,
      time: new Date().toLocaleString(),
      read: false,
    });
    localStorage.setItem(mentorNotificationsKey, JSON.stringify(mentorNotifications));
  };

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

        {/* Upcoming Booked Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Upcoming Booked Sessions</h3>
          {upcomingSessions.length === 0 ? (
            <p className="text-gray-500">No upcoming sessions booked yet.</p>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((session, idx) => {
                const past = isSessionPast(session.dateTime);
                // Check if feedback already given
                const feedbacks = JSON.parse(localStorage.getItem("mentorFeedbacks") || "[]");
                const alreadyRated = feedbacks.some(f => f.mentorId === session.mentorId && f.menteeId === menteeData.id && f.date && new Date(f.date) > new Date(session.dateTime));
                return (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <p className="font-medium">Mentor: <span className="text-indigo-600">{session.mentorName}</span></p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Date & Time: {new Date(session.dateTime).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-indigo-500 text-2xl" />
                      {past && !alreadyRated && (
                        <button
                          className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          onClick={() => setFeedbackModal({ open: true, session })}
                        >
                          Rate Mentor
                        </button>
                      )}
                      {past && alreadyRated && (
                        <span className="ml-2 text-green-600 text-xs font-semibold">Feedback Submitted</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Feedback Modal */}
        {feedbackModal.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setFeedbackModal({ open: false, session: null })}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-indigo-600">Rate {feedbackModal.session?.mentorName}</h2>
              <div className="mb-4 flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <FaStar
                    key={star}
                    className={star <= rating ? "text-yellow-400 text-2xl cursor-pointer" : "text-gray-300 text-2xl cursor-pointer"}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Write your review (optional)"
                value={review}
                onChange={e => setReview(e.target.value)}
              />
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold"
                disabled={rating === 0}
                onClick={handleSubmitFeedback}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}

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

        {/* Chat with Mentors Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <FaComments className="text-indigo-500" /> Chat with Mentors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedMentors.map((mentor) => (
              <div key={mentor.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{mentor.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{mentor.expertise}</p>
                <button
                  className="w-full sm:w-auto bg-neutral-700 hover:bg-neutral-800 text-white py-2 rounded text-sm transition-colors mt-2"
                  onClick={() => navigate(`/chat/${mentor.id}/${menteeData.id}/mentee`)}
                >
                  Chat
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Mentors */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Recommended Mentors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedMentors.map((mentor) => (
              <div key={mentor.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{mentor.name}</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{mentor.availability}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{mentor.expertise}</p>
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span>{mentor.rating}</span>
                  </div>
                  <span className="text-gray-500">{mentor.sessions} sessions</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-auto w-full">
                  <button
                    className={`w-full sm:w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm transition-colors ${sentRequests.includes(mentor.id) ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={sentRequests.includes(mentor.id)}
                    onClick={() => handleConnect(mentor)}
                  >
                    {sentRequests.includes(mentor.id) ? 'Request Sent' : 'Connect'}
                  </button>
                </div>
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
