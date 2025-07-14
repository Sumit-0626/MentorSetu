// Utility for mentor points tracking

// Action points mapping
export const ACTION_POINTS = {
  accept_request: 5,
  complete_session: 10,
  positive_feedback: 15,
  five_star_rating: 20,
  write_tip_blog: 10,
  participate_event: 25,
};

// Add a points entry for a mentor
export function addMentorPoints(mentorId, action, details = {}) {
  const points = ACTION_POINTS[action] || 0;
  const entry = {
    action,
    points,
    timestamp: new Date().toISOString(),
    details,
  };
  const allPoints = JSON.parse(localStorage.getItem('mentorPoints') || '{}');
  if (!allPoints[mentorId]) allPoints[mentorId] = [];
  allPoints[mentorId].push(entry);
  localStorage.setItem('mentorPoints', JSON.stringify(allPoints));
  // Update last active time
  const lastActive = JSON.parse(localStorage.getItem('mentorLastActive') || '{}');
  lastActive[mentorId] = new Date().toISOString();
  localStorage.setItem('mentorLastActive', JSON.stringify(lastActive));
}

// Get all points entries for a mentor
export function getMentorPoints(mentorId) {
  const allPoints = JSON.parse(localStorage.getItem('mentorPoints') || '{}');
  return allPoints[mentorId] || [];
}

// Get total points for a mentor
export function getMentorTotalPoints(mentorId) {
  return getMentorPoints(mentorId).reduce((sum, entry) => sum + entry.points, 0);
}

// Get recent actions for a mentor (limit N)
export function getMentorRecentActions(mentorId, limit = 5) {
  const points = getMentorPoints(mentorId);
  return points.slice(-limit).reverse();
} 