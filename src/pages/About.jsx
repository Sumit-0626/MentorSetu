const About = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl w-full">
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">About MentorSetu</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">MentorSetu is an AI-powered mentorship platform connecting students, professionals, and innovators with experienced mentors. Our mission is to make quality mentorship accessible, engaging, and rewarding for everyone.</p>
      <ul className="mb-4 list-disc pl-6 text-gray-700 dark:text-gray-300">
        <li>1:1 mentorship sessions</li>
        <li>Real-time chat and resource sharing</li>
        <li>Gamified experience with points, badges, and leaderboards</li>
        <li>Personalized dashboards for mentors and mentees</li>
        <li>Community events and knowledge sharing</li>
      </ul>
      <h2 className="text-xl font-semibold text-indigo-500 mt-6 mb-2">Our Team</h2>
      <p className="text-gray-700 dark:text-gray-300">Built with ❤️ by passionate developers and mentors for the hackathon community.</p>
    </div>
  </div>
);

export default About; 