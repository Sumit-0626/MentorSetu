import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MenteeEditProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: Date.now(), // fallback
    fullName: "",
    goal: "",
    domain: "",
    language: "",
    description: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("menteeProfile");
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("menteeProfile", JSON.stringify(form));
    navigate("/mentee-dashboard");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6 text-gray-900 dark:text-white">
      <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Edit Your Mentee Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            name="goal"
            value={form.goal}
            onChange={handleChange}
            placeholder="What is your learning goal?"
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            name="domain"
            value={form.domain}
            onChange={handleChange}
            placeholder="Preferred Domain (e.g., Web Dev, AI, etc.)"
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            name="language"
            value={form.language}
            onChange={handleChange}
            placeholder="Preferred Language (e.g., Hindi, English)"
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Briefly describe what help you're looking for"
            rows="4"
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          ></textarea>

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default MenteeEditProfile;
