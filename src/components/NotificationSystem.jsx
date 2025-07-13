import { useState, useEffect } from "react";
import { FaBell, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

const NotificationSystem = ({ userType }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications based on user type
  useEffect(() => {
    const mockNotifications = userType === 'mentor' ? [
      {
        id: 1,
        type: 'request',
        title: 'New mentee request',
        message: 'Alex Johnson wants to connect with you',
        time: '2 minutes ago',
        read: false,
        action: 'accept'
      },
      {
        id: 2,
        type: 'session',
        title: 'Session reminder',
        message: 'Your session with Sarah Chen starts in 30 minutes',
        time: '15 minutes ago',
        read: false,
        action: 'join'
      },
      {
        id: 3,
        type: 'review',
        title: 'New review received',
        message: 'Emma Wilson left you a 5-star review',
        time: '1 hour ago',
        read: true,
        action: 'view'
      }
    ] : [
      {
        id: 1,
        type: 'connection',
        title: 'Mentor connected',
        message: 'Dr. Emily Rodriguez accepted your request',
        time: '5 minutes ago',
        read: false,
        action: 'chat'
      },
      {
        id: 2,
        type: 'session',
        title: 'Session scheduled',
        message: 'Your session with Alex Thompson is tomorrow at 2 PM',
        time: '1 hour ago',
        read: false,
        action: 'view'
      },
      {
        id: 3,
        type: 'milestone',
        title: 'Achievement unlocked',
        message: 'You completed 10 sessions!',
        time: '2 hours ago',
        read: true,
        action: 'celebrate'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, [userType]);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'request':
      case 'connection':
        return <FaCheckCircle className="text-green-500" />;
      case 'session':
        return <FaInfoCircle className="text-blue-500" />;
      case 'review':
      case 'milestone':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'request':
      case 'connection':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'session':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'review':
      case 'milestone':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              <div className="p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border-l-4 mb-2 cursor-pointer transition-colors ${
                      notification.read ? 'opacity-75' : ''
                    } ${getNotificationColor(notification.type)}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </span>
                          <button className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium">
                            {notification.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem; 