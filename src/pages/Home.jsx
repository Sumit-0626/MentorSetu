import { useState } from 'react';

export default function Home() {
  const [role, setRole] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">Welcome to MentorSetu</h1>
      <p className="text-center text-gray-700 max-w-md mb-8">
        An AI-powered mentorship platform for students, professionals, and innovators. Please choose your role to begin.
      </p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setRole('mentee')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all"
        >
          I'm a Mentee
        </button>
        <button
          onClick={() => setRole('mentor')}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all"
        >
          I'm a Mentor
        </button>
      </div>

      {role && (
        <div className="mt-4 text-center text-lg text-gray-800">
          You selected: <strong>{role.toUpperCase()}</strong>
        </div>
      )}
    </div>
  );
}
