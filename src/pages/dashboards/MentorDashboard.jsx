import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaChartBar,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaDollarSign,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaComments,
} from "react-icons/fa";
import NotificationSystem from "../../components/NotificationSystem";

const MentorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [connected, setConnected] = useState([]);
  const [mentorStats, setMentorStats] = useState({
    totalEarnings: 2840,
    thisMonthEarnings: 420,
    totalSessions: 47,
    averageRating: 4.8,
    totalMentees: 12,
    activeMentees: 8,
  });

  // Mock data for upcoming sessions and recent activities
  const [upcomingSessions] = useState([
    { id: 1, mentee: "Alex Johnson", topic: "React State Management", date: "Today", time: "2:00 PM", duration: "60 min" },
    { id: 2, mentee: "Sarah Chen", topic: "Node.js Backend", date: "Tomorrow", time: "10:00 AM", duration: "45 min" },
    { id: 3, mentee: "Mike Davis", topic: "Database Design", date: "Dec 15", time: "3:30 PM", duration: "90 min" },
  ]);

  const [recentActivities] = useState([
    { id: 1, type: "session", mentee: "Emma Wilson", topic: "JavaScript ES6", duration: "45 min", earnings: 45 },
    { id: 2, type: "review", mentee: "David Brown", rating: 5, comment: "Excellent explanation!" },
    { id: 3, type: "connection", mentee: "Lisa Garcia", action: "New mentee connected" },
  ]);

  const requestsRef = useRef(null);
  const statsRef = useRef(null);
  const sessionsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("menteeRequests")) || [];
    const storedConnected = JSON.parse(localStorage.getItem("connectedMentees")) || [];

    setRequests(storedRequests);
    setConnected(storedConnected);
  }, []);

  const handleAccept = (id) => {
    const updatedRequests = requests.filter((r) => r.id !== id);
    const accepted = requests.find((r) => r.id === id);
    const newConnected = [...connected, accepted];

    setRequests(updatedRequests);
    setConnected(newConnected);

    localStorage.setItem("menteeRequests", JSON.stringify(updatedRequests));
    localStorage.setItem("connectedMentees", JSON.stringify(newConnected));
  };

  const handleReject = (id) => {
    const updated = requests.filter((r) => r.id !== id);
    setRequests(updated);
    localStorage.setItem("menteeRequests", JSON.stringify(updated));
  };

  // Quick Action Handlers
  const handleScrollToRequests = () => {
    requestsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleScrollToStats = () => {
    statsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleScrollToSessions = () => {
    sessionsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleViewMessages = () => {
    navigate("/chat/1/1/mentor"); // Example chat route
  };
  const handleEditProfile = () => {
    navigate("/mentor-edit-profile"); // Placeholder route
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Mentor Dashboard</h1>
          <div className="flex gap-3 items-center">
            <NotificationSystem userType="mentor" />
            <button onClick={handleScrollToSessions} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <FaCalendarAlt className="text-sm" />
              Schedule Session
            </button>
            <button onClick={handleScrollToStats} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
              View Analytics
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Earnings</h3>
              <FaDollarSign className="text-green-500 text-xl" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">${mentorStats.totalEarnings}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">${mentorStats.thisMonthEarnings} this month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Sessions</h3>
              <FaChartBar className="text-blue-500 text-xl" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{mentorStats.totalSessions}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Sessions completed</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Average Rating</h3>
              <FaStar className="text-yellow-500 text-xl" />
            </div>
            <div className="text-3xl font-bold text-yellow-500 mb-2">{mentorStats.averageRating}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Out of 5 stars</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Active Mentees</h3>
              <FaUsers className="text-indigo-500 text-xl" />
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">{mentorStats.activeMentees}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Of {mentorStats.totalMentees} total</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upcoming Sessions */}
          <div ref={sessionsRef} className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Upcoming Sessions</h3>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{session.mentee}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{session.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{session.topic}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{session.time}</span>
                      <span className="text-gray-500">{session.duration}</span>
                    </div>
                    <button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm">
                      Join Session
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <FaClock className="text-gray-400 text-sm" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.mentee}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.type === 'session' && `${activity.topic} • ${activity.duration} • $${activity.earnings}`}
                        {activity.type === 'review' && `Rated ${activity.rating} stars • ${activity.comment}`}
                        {activity.type === 'connection' && activity.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={handleScrollToRequests} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <FaCheckCircle className="text-sm" />
                  Accept New Requests
                </button>
                <button onClick={handleViewMessages} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <FaComments className="text-sm" />
                  View Messages
                </button>
                <button onClick={handleScrollToStats} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <FaChartBar className="text-sm" />
                  View Analytics
                </button>
                <button onClick={handleEditProfile} className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <FaUserTie className="text-sm" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div ref={requestsRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Incoming Mentee Requests</h3>
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No new requests right now. Check back later!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.map((mentee) => (
                <div key={mentee.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{mentee.fullName}</h4>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">New Request</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Goal:</strong> {mentee.goal}</p>
                    <p><strong>Domain:</strong> {mentee.domain}</p>
                    <p><strong>Language:</strong> {mentee.language}</p>
                    <p><strong>Description:</strong> {mentee.description}</p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleAccept(mentee.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle className="text-sm" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(mentee.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded flex items-center justify-center gap-2"
                    >
                      <FaTimesCircle className="text-sm" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connected Mentees */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Connected Mentees</h3>
          {connected.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No mentees connected yet. Start accepting requests to build your network!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connected.map((mentee) => (
                <div key={mentee.id} className="border border-green-200 dark:border-green-600 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{mentee.fullName}</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Connected</span>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>Domain:</strong> {mentee.domain}</p>
                    <p><strong>Language:</strong> {mentee.language}</p>
                    <p><strong>Goal:</strong> {mentee.goal}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/chat" className="flex-1">
                      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm">
                        Start Chat
                      </button>
                    </Link>
                    <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded text-sm">
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
