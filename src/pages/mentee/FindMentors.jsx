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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [mentorStatus, setMentorStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("menteeInfo"));
    if (!data) {
      navigate("/mentee-onboarding");
    } else {
      setMenteeData(data);
    }
    // Randomly assign online status for demo
    const status = {};
    mentors.forEach(m => {
      status[m.id] = Math.random() > 0.5 ? "online" : "offline";
    });
    setMentorStatus(status);
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

  const handleBookSession = () => {
    if (!selectedMentor || !selectedDateTime || !menteeData) return;
    const bookings = JSON.parse(localStorage.getItem("sessionBookings")) || [];
    const newBooking = {
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.fullName,
      menteeId: menteeData.id,
      menteeName: menteeData.fullName,
      dateTime: selectedDateTime,
    };
    localStorage.setItem("sessionBookings", JSON.stringify([...bookings, newBooking]));
    alert("Session booked successfully!");
    setModalOpen(false);
    setSelectedMentor(null);
    setSelectedDateTime("");
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
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span>{mentor.fullName}</span>
              <span
                className={`inline-block w-3 h-3 rounded-full ${mentorStatus[mentor.id] === "online" ? "bg-green-500" : "bg-gray-400"}`}
                title={mentorStatus[mentor.id] === "online" ? "Online" : "Offline"}
              ></span>
              <span className={`text-xs ml-1 ${mentorStatus[mentor.id] === "online" ? "text-green-600" : "text-gray-500"}`}>
                {mentorStatus[mentor.id] === "online" ? "Online" : "Offline"}
              </span>
            </h3>
            <p><strong>Domain:</strong> {mentor.domain}</p>
            <p><strong>Language:</strong> {mentor.language}</p>

            <button
              onClick={() => {
                setSelectedMentor(mentor);
                setModalOpen(true);
              }}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Book Session
            </button>
          </div>
        ))}
      </div>

      {/* Calendar/Date-Time Picker Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">Book Session with {selectedMentor?.fullName}</h2>
            <label className="block mb-2 font-medium">Select Date & Time:</label>
            <input
              type="datetime-local"
              value={selectedDateTime}
              onChange={e => setSelectedDateTime(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
              disabled={!selectedDateTime}
              onClick={handleBookSession}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindMentors;
