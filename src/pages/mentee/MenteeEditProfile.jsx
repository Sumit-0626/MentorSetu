import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MenteeEditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    education: "",
    goal: "",
    domain: "",
    language: "",
    skills: [],
    description: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("menteeProfile");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData({
        ...parsed,
        skills: Array.isArray(parsed.skills) ? parsed.skills : parsed.skills?.split(",") || [],
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "skills") {
      const skillsArray = value.split(",").map((s) => s.trim());
      setFormData((prev) => ({ ...prev, skills: skillsArray }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("menteeProfile", JSON.stringify(formData));
    navigate("/mentee-dashboard");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Edit Mentee Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-200">Full Name</span>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 dark:text-gray-200">Education Level</span>
            <select
              name="education"
              required
              value={formData.education}
              onChange={handleChange}
              className="mt-1 w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Select --</option>
              <option value="College Student">College Student</option>
              <option value="Working Professional">Working Professional</option>
              <option value="School Student">School Student</option>
              <option value="Fresher / Job Seeker">Fresher / Job Seeker</option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-gray-700 dark:text-gray-200">Learning Goal</span>
            <input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="mt-1 w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
              placeholder="e.g. Become a frontend developer"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 dark:text-gray-200">Preferred Domain</span>
            <select
              name="domain"
              required
              value={formData.domain}
              onChange={handleChange}
              className="mt-1 w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Select Domain --</option>
              <option value="Web Development">Web Development</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Data Science">Data Science</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Mobile Development">Mobile Development</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 dark:text-gray-200">Preferred Language</span>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="mt-1 w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
              placeholder="e.g. Hindi, English"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-gray-700 dark:text-gray-200">Your Current Skills (comma-separated)</span>
            <input
              type="text"
              name="skills"
              value={formData.skills.join(", ")}
              onChange={handleChange}
              className="mt-1 w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-gray-700 dark:text-gray-200">Brief Description / Problem</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default MenteeEditProfile;
