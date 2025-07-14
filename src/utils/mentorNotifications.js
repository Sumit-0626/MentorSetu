// Mentor Notifications Utility

export function addNotification(mentorId, notification) {
  const all = JSON.parse(localStorage.getItem('mentorNotifications') || '{}');
  if (!all[mentorId]) all[mentorId] = [];
  all[mentorId].unshift({ ...notification, id: Date.now(), read: false });
  localStorage.setItem('mentorNotifications', JSON.stringify(all));
}

export function getNotifications(mentorId) {
  const all = JSON.parse(localStorage.getItem('mentorNotifications') || '{}');
  return all[mentorId] || [];
}

export function markNotificationAsRead(mentorId, notificationId) {
  const all = JSON.parse(localStorage.getItem('mentorNotifications') || '{}');
  if (!all[mentorId]) return;
  all[mentorId] = all[mentorId].map(n => n.id === notificationId ? { ...n, read: true } : n);
  localStorage.setItem('mentorNotifications', JSON.stringify(all));
} 