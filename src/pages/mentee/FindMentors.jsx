import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Fake mentors list (replace with real data later)
const mentors = [
  { id: 1, fullName: "Aarav Sharma", domain: "Web Development", language: "Hindi" },
  { id: 2, fullName: "Neha Patel", domain: "AI & ML", language: "English" },
  { id: 3, fullName: "Rohan Mehta", domain: "Cybersecurity", language: "Gujarati" },
];

const FindMentors = () => {
  const [menteeData, setMenteeData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("menteeInfo"));
    if (!data) {
      navigate("/mentee-onboarding");
    } else {
      setMenteeData(data);
    }
  }, [navigate]);

  const handleSendRequest = (mentorId) => {
    const existingRequests = JSON.parse(localStorage.getItem("menteeRequests")) || [];

    const alreadyRequested = existingRequests.some(
      (r) => r.id === menteeData.id && r.mentorId === mentorId
    );
    if (alreadyRequested) {
      alert("You've already sent a request to this mentor.");
      return;
    }

    const newRequest = {
      ...menteeData,
      mentorId,
    };

    localStorage.setItem("menteeRequests", JSON.stringify([...existingRequests, newRequest]));
    alert("Request sent successfully!");
    navigate("/mentee-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">Find Mentors</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold">{mentor.fullName}</h3>
            <p><strong>Domain:</strong> {mentor.domain}</p>
            <p><strong>Language:</strong> {mentor.language}</p>

            <button
              onClick={() => handleSendRequest(mentor.id)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindMentors;
