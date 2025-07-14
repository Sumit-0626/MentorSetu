// Mentor Badges Utility

export const BADGE_TYPES = [
  {
    key: 'top-mentor',
    label: 'Top Mentor',
    desc: 'Ranked #1 on the leaderboard',
    icon: '🥇',
  },
  {
    key: 'gold-mentor',
    label: 'Gold Mentor',
    desc: 'Top 10% by points',
    icon: '🏅',
  },
  {
    key: 'consistent-mentor',
    label: 'Consistent Mentor',
    desc: '10+ sessions in a month',
    icon: '🔥',
  },
  {
    key: 'five-star',
    label: '5-Star Mentor',
    desc: '10 mentees gave 5-star feedback',
    icon: '⭐',
  },
  {
    key: 'century',
    label: 'Century Points',
    desc: 'Earned 100+ points',
    icon: '💯',
  },
];

// Award badges based on stats
export function getMentorBadges(mentorId, stats = {}) {
  const badges = [];
  // Top Mentor (should be set externally if #1)
  if (stats.isTopMentor) badges.push('top-mentor');
  // Gold Mentor (top 10% by points)
  if (stats.isGoldMentor) badges.push('gold-mentor');
  // Consistent Mentor (10+ sessions in a month)
  if (stats.sessionsThisMonth >= 10) badges.push('consistent-mentor');
  // 5-Star Mentor (10 mentees gave 5-star)
  if ((stats.fiveStarCount || 0) >= 10) badges.push('five-star');
  // Century Points (100+ points)
  if ((stats.points || 0) >= 100) badges.push('century');
  return badges;
}

// Get badge details by key
export function getBadgeDetails(key) {
  return BADGE_TYPES.find(b => b.key === key);
} 