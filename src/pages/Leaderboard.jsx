import { useEffect, useState } from "react";
import { FaStar, FaMedal, FaUserGraduate, FaUserTie } from "react-icons/fa";
import { getMentorTotalPoints } from "../utils/mentorPoints";

const Leaderboard = () => {
  const [topMentors, setTopMentors] = useState([]);
  const [topMentees, setTopMentees] = useState([]);

  useEffect(() => {
    // Get mentors and feedbacks
    const mentors = [JSON.parse(localStorage.getItem("mentorProfile") || "{}")];
    const feedbacks = JSON.parse(localStorage.getItem("mentorFeedbacks") || "[]");
    const bookings = JSON.parse(localStorage.getItem("sessionBookings") || "[]");
    const lastActiveMap = JSON.parse(localStorage.getItem("mentorLastActive") || "{}") || {};
    // Mentor stats
    const mentorStats = mentors.map((m) => {
      const myFeedbacks = feedbacks.filter(f => f.mentorId === m.id);
      const avgRating = myFeedbacks.length > 0 ? (myFeedbacks.reduce((sum, f) => sum + f.rating, 0) / myFeedbacks.length) : 0;
      const sessionCount = bookings.filter(b => b.mentorId === m.id).length;
      const points = m.id ? getMentorTotalPoints(m.id) : 0;
      const lastActive = lastActiveMap[m.id] ? new Date(lastActiveMap[m.id]) : null;
      const isActiveToday = lastActive ? (new Date().toDateString() === lastActive.toDateString()) : false;
      // Advanced rank score
      let rankScore = points * 0.5;
      if (myFeedbacks.length >= 3) rankScore += avgRating * 10;
      if (isActiveToday) rankScore += 10;
      return { ...m, avgRating, sessionCount, points, lastActive, isActiveToday, rankScore };
    });
    mentorStats.sort((a, b) => b.rankScore - a.rankScore);
    setTopMentors(mentorStats.slice(0, 5));
    // Mentee stats
    const mentees = [JSON.parse(localStorage.getItem("menteeInfo") || "{}")];
    const menteeStats = mentees.map((m) => {
      const sessionCount = bookings.filter(b => b.menteeId === m.id).length;
      return { ...m, sessionCount };
    });
    menteeStats.sort((a, b) => b.sessionCount - a.sessionCount);
    setTopMentees(menteeStats.slice(0, 5));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">🏆 Leaderboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Mentors */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2"><FaUserTie /> Top Mentors</h2>
            {topMentors.length === 0 ? <p className="text-gray-500">No mentors yet.</p> : (
              <ol className="space-y-4">
                {topMentors.map((m, i) => (
                  <li key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <span className="text-2xl font-bold text-yellow-500">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{m.name || m.fullName || "Mentor"}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-indigo-600">{m.points} pts</span>
                        <span className="text-gray-400">|</span>
                        <FaStar className="text-yellow-400" />
                        <span>{m.avgRating.toFixed(1)}</span>
                        <span className="text-gray-400">|</span>
                        <span>{m.sessionCount} sessions</span>
                        <span className="text-gray-400">|</span>
                        <span className="font-bold text-green-600">Score: {m.rankScore.toFixed(1)}</span>
                        <span className="text-gray-400">|</span>
                        <span className={m.isActiveToday ? "text-green-500" : "text-gray-400"}>{m.isActiveToday ? "Active Today" : (m.lastActive ? `Last active: ${m.lastActive.toLocaleDateString()}` : "No activity")}</span>
                      </div>
                    </div>
                    {i === 0 && <FaMedal className="text-3xl text-yellow-400" title="Top Mentor" />}
                  </li>
                ))}
              </ol>
            )}
          </div>
          {/* Top Mentees */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2"><FaUserGraduate /> Top Mentees</h2>
            {topMentees.length === 0 ? <p className="text-gray-500">No mentees yet.</p> : (
              <ol className="space-y-4">
                {topMentees.map((m, i) => (
                  <li key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <span className="text-2xl font-bold text-yellow-500">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{m.fullName || m.name || "Mentee"}</div>
                      <div className="text-sm text-gray-500">{m.sessionCount} sessions</div>
                    </div>
                    {i === 0 && <FaMedal className="text-3xl text-yellow-400" title="Top Mentee" />}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 