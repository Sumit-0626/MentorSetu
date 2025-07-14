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
  FaBell,
} from "react-icons/fa";
import NotificationSystem from "../../components/NotificationSystem";
import { addMentorPoints, getMentorTotalPoints, getMentorRecentActions } from "../../utils/mentorPoints";
import { getMentorBadges, getBadgeDetails } from "../../utils/mentorBadges";
import { addNotification, getNotifications, markNotificationAsRead } from "../../utils/mentorNotifications";

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

  const [mentorId, setMentorId] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [recentActions, setRecentActions] = useState([]);

  // Resource Center State
  const [resources, setResources] = useState([]);
  const [resourceForm, setResourceForm] = useState({ title: '', url: '', description: '' });

  // Calculate stats for badges
  const [badges, setBadges] = useState([]);
  useEffect(() => {
    if (!mentorId) return;
    // Calculate stats
    const points = getMentorTotalPoints(mentorId);
    // Sessions this month
    const bookings = JSON.parse(localStorage.getItem("sessionBookings") || "[]");
    const now = new Date();
    const sessionsThisMonth = bookings.filter(b => b.mentorId === mentorId && new Date(b.dateTime).getMonth() === now.getMonth() && new Date(b.dateTime).getFullYear() === now.getFullYear()).length;
    // 5-star feedback count
    const feedbacks = JSON.parse(localStorage.getItem("mentorFeedbacks") || "[]");
    const fiveStarCount = feedbacks.filter(f => f.mentorId === mentorId && f.rating === 5).length;
    // Top mentor (rank 1)
    let isTopMentor = false, isGoldMentor = false;
    const mentors = [JSON.parse(localStorage.getItem("mentorProfile") || "{}")];
    const allPoints = mentors.map(m => m.id ? getMentorTotalPoints(m.id) : 0);
    if (allPoints.length > 0 && points === Math.max(...allPoints)) isTopMentor = true;
    if (allPoints.length > 0 && points >= (Math.max(...allPoints) * 0.9)) isGoldMentor = true;
    const stats = { points, sessionsThisMonth, fiveStarCount, isTopMentor, isGoldMentor };
    setBadges(getMentorBadges(mentorId, stats));
  }, [mentorId, totalPoints]);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  useEffect(() => {
    if (mentorId) {
      setNotifications(getNotifications(mentorId));
    }
  }, [mentorId]);
  const unreadCount = notifications.filter(n => !n.read).length;
  const handleNotifClick = () => setShowNotif((s) => !s);
  const handleMarkAsRead = (id) => {
    markNotificationAsRead(mentorId, id);
    setNotifications(getNotifications(mentorId));
  };

  // Call Availability State
  const [callAvailable, setCallAvailable] = useState(false);
  useEffect(() => {
    if (mentorId) {
      const status = localStorage.getItem(`mentorCallAvailable_${mentorId}`);
      setCallAvailable(status === 'true');
    }
  }, [mentorId]);
  const handleToggleCall = () => {
    const newStatus = !callAvailable;
    setCallAvailable(newStatus);
    if (mentorId) {
      localStorage.setItem(`mentorCallAvailable_${mentorId}`, newStatus);
    }
  };

  const requestsRef = useRef(null);
  const statsRef = useRef(null);
  const sessionsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("menteeRequests")) || [];
    const storedConnected = JSON.parse(localStorage.getItem("connectedMentees")) || [];
    setRequests(storedRequests);
    setConnected(storedConnected);

    // Get mentor id from profile
    const mentorProfile = JSON.parse(localStorage.getItem("mentorProfile"));
    if (mentorProfile && mentorProfile.id) {
      setMentorId(mentorProfile.id);
      setTotalPoints(getMentorTotalPoints(mentorProfile.id));
      setRecentActions(getMentorRecentActions(mentorProfile.id, 5));
    }
  }, []);

  // Update points and actions after accepting a request
  useEffect(() => {
    if (mentorId) {
      setTotalPoints(getMentorTotalPoints(mentorId));
      setRecentActions(getMentorRecentActions(mentorId, 5));
    }
  }, [requests, mentorId]);

  // Load mentor resources
  useEffect(() => {
    if (mentorId) {
      const allResources = JSON.parse(localStorage.getItem('mentorResources') || '{}');
      setResources(allResources[mentorId] || []);
    }
  }, [mentorId]);

  // Add notification when a new mentee request is accepted
  const handleAccept = (id) => {
    const updatedRequests = requests.filter((r) => r.id !== id);
    const accepted = requests.find((r) => r.id === id);
    const newConnected = [...connected, accepted];

    setRequests(updatedRequests);
    setConnected(newConnected);

    localStorage.setItem("menteeRequests", JSON.stringify(updatedRequests));
    localStorage.setItem("connectedMentees", JSON.stringify(newConnected));

    // Award points for accepting a mentee request
    const mentorProfile = JSON.parse(localStorage.getItem("mentorProfile"));
    if (mentorProfile && mentorProfile.id) {
      addMentorPoints(mentorProfile.id, "accept_request", { menteeId: accepted.id, menteeName: accepted.fullName });
      // Add notification for new mentee connection
      addNotification(mentorProfile.id, {
        type: "request",
        title: "New Mentee Connected",
        message: `${accepted.fullName} is now connected with you!`,
        time: new Date().toLocaleString(),
      });
      setNotifications(getNotifications(mentorProfile.id));
    }
  };

  // Add notification when new feedback is received (listen for changes in feedbacks)
  useEffect(() => {
    if (!mentorId) return;
    const feedbacks = JSON.parse(localStorage.getItem("mentorFeedbacks") || "[]");
    const mentorFeedbacks = feedbacks.filter(f => f.mentorId === mentorId);
    const notifIds = notifications.map(n => n.details?.feedbackId);
    mentorFeedbacks.forEach(fb => {
      if (!notifIds.includes(fb.date)) {
        addNotification(mentorId, {
          type: "feedback",
          title: "New Feedback Received",
          message: `You received feedback from ${fb.menteeName}: ${fb.rating}★${fb.review ? ' - ' + fb.review : ''}`,
          time: new Date(fb.date).toLocaleString(),
          details: { feedbackId: fb.date },
        });
      }
    });
    setNotifications(getNotifications(mentorId));
  }, [mentorId]);

  const handleReject = (id) => {
    const updated = requests.filter((r) => r.id !== id);
    setRequests(updated);
    localStorage.setItem("menteeRequests", JSON.stringify(updated));
  };

  const handleResourceChange = (e) => {
    setResourceForm({ ...resourceForm, [e.target.name]: e.target.value });
  };

  const handleResourceUpload = (e) => {
    e.preventDefault();
    if (!resourceForm.title || !resourceForm.url) return;
    const allResources = JSON.parse(localStorage.getItem('mentorResources') || '{}');
    const mentorResources = allResources[mentorId] || [];
    const mentorProfile = JSON.parse(localStorage.getItem('mentorProfile')) || {};
    const newResource = { ...resourceForm, date: new Date().toISOString(), mentorName: mentorProfile.name || mentorProfile.fullName || 'Mentor' };
    const updated = [newResource, ...mentorResources];
    allResources[mentorId] = updated;
    localStorage.setItem('mentorResources', JSON.stringify(allResources));
    setResources(updated);
    setResourceForm({ title: '', url: '', description: '' });
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

  function getSafeUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
      return 'https://' + url.replace(/^\/*/, '');
    }
    return url;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header with Notification Bell */}
        <div className="flex justify-between items-center mb-8 relative">
          <h1 className="text-3xl font-bold text-indigo-600">Mentor Dashboard</h1>
          <div className="flex gap-3 items-center relative">
            <NotificationSystem userType="mentor" />
            <button onClick={handleNotifClick} className="relative focus:outline-none">
              <FaBell className="text-2xl text-gray-700 dark:text-gray-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">{unreadCount}</span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-10 w-80 bg-white dark:bg-gray-800 rounded shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-200">Notifications</div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">No notifications yet.</div>
                ) : (
                  <ul className="max-h-80 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map(n => (
                      <li key={n.id} className={`p-3 ${n.read ? '' : 'bg-indigo-50 dark:bg-gray-900'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{n.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-300">{n.message}</div>
                            <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                          </div>
                          {!n.read && (
                            <button onClick={() => handleMarkAsRead(n.id)} className="ml-2 text-xs text-blue-600 hover:underline">Mark as read</button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
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

      {/* Welcome and Total Points */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">Welcome back, Mentor!</h2>
          <p className="text-gray-600 dark:text-gray-300">Here's your current progress and stats.</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-extrabold text-yellow-500">{totalPoints}</span>
          <span className="text-gray-700 dark:text-gray-200 font-semibold">Total Points</span>
        </div>
      </div>
      {/* Recent Point Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Recent Point-Earning Actions</h3>
        {recentActions.length === 0 ? (
          <p className="text-gray-500">No recent actions yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentActions.map((action, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <span className="font-bold text-indigo-600">+{action.points}</span>
                <span className="capitalize">{action.action.replace(/_/g, ' ')}</span>
                <span className="text-xs text-gray-400">{new Date(action.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Mentor Badges */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Badges & Achievements</h3>
        {badges.length === 0 ? (
          <p className="text-gray-500">No badges earned yet.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {badges.map((key) => {
              const badge = getBadgeDetails(key);
              return (
                <div key={key} className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 rounded p-3 shadow min-w-[90px]">
                  <span className="text-3xl mb-1">{badge.icon}</span>
                  <span className="font-medium text-sm">{badge.label}</span>
                  <span className="text-xs text-gray-500 text-center">{badge.desc}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Mentor Resource Center */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Mentor Resource Center</h3>
        <form onSubmit={handleResourceUpload} className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            name="title"
            value={resourceForm.title}
            onChange={handleResourceChange}
            placeholder="Resource Title"
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            name="url"
            value={resourceForm.url}
            onChange={handleResourceChange}
            placeholder="Resource Link (URL)"
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            name="description"
            value={resourceForm.description}
            onChange={handleResourceChange}
            placeholder="Short Description (optional)"
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">Upload</button>
        </form>
        {resources.length === 0 ? (
          <p className="text-gray-500">No resources uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {resources.map((res, idx) => (
              <li key={idx} className="bg-gray-100 dark:bg-gray-700 rounded p-3 flex flex-col md:flex-row md:items-center md:gap-4">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-300 mb-1 font-semibold">By {res.mentorName}</div>
                  <a href={getSafeUrl(res.url)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline text-lg">{res.title}</a>
                  {res.description && <div className="text-xs text-gray-500 dark:text-gray-300">{res.description}</div>}
                </div>
                <span className="text-xs text-gray-400">{new Date(res.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Mentor Call Availability Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 flex items-center gap-4">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Call Availability:</span>
        <button
          onClick={handleToggleCall}
          className={`px-4 py-2 rounded font-bold transition-colors ${callAvailable ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          {callAvailable ? 'Available for Calls' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

export default MentorDashboard;
