import { useState } from "react";
import { FaChartLine, FaCalendarAlt, FaClock, FaStar } from "react-icons/fa";

const AnalyticsChart = ({ userType, data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock data for different time periods
  const chartData = {
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      sessions: [2, 3, 1, 4, 2, 3, 1],
      progress: [20, 35, 45, 60, 75, 85, 95],
    },
    month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      sessions: [8, 12, 10, 15],
      progress: [25, 50, 75, 100],
    },
  };

  const currentData = chartData[selectedPeriod];

  const maxSessions = Math.max(...currentData.sessions);
  const maxProgress = Math.max(...currentData.progress);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          {userType === 'mentor' ? 'Session Analytics' : 'Learning Progress'}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod("week")}
            className={`px-3 py-1 rounded text-sm ${
              selectedPeriod === "week"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-3 py-1 rounded text-sm ${
              selectedPeriod === "month"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <FaChartLine className="text-indigo-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {userType === 'mentor' ? 'Sessions' : 'Progress (%)'}
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-end justify-between h-32 gap-2">
            {currentData.labels.map((label, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t">
                  <div
                    className="bg-indigo-600 rounded-t transition-all duration-300"
                    style={{
                      height: `${(currentData[userType === 'mentor' ? 'sessions' : 'progress'][index] / (userType === 'mentor' ? maxSessions : maxProgress)) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {userType === 'mentor' 
                ? currentData.sessions.reduce((a, b) => a + b, 0)
                : `${Math.round(currentData.progress[currentData.progress.length - 1])}%`
              }
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {userType === 'mentor' ? 'Total Sessions' : 'Current Progress'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {userType === 'mentor' 
                ? Math.round(currentData.sessions.reduce((a, b) => a + b, 0) / currentData.sessions.length)
                : `${Math.round((currentData.progress[currentData.progress.length - 1] - currentData.progress[0]) / currentData.progress.length)}%`
              }
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {userType === 'mentor' ? 'Avg per Period' : 'Weekly Growth'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart; 