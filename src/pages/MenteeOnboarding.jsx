import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MenteeOnboarding = () => {
  const [form, setForm] = useState({
    id: Date.now(),
    fullName: "",
    age: "",
    gender: "",
    location: "",
    learningGoal: "",
    languagePreference: "",
    education: "",
    description: "",
  });
  const navigate = useNavigate();
  const [showCustomEducation, setShowCustomEducation] = useState(false);
  const [showCustomLanguage, setShowCustomLanguage] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("menteeInfo", JSON.stringify(form));
    navigate("/mentee-dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">Mentee Onboarding</h2>
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <input name="age" value={form.age} onChange={handleChange} placeholder="Age" type="number" min="10" max="100" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <select name="gender" value={form.gender} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location (City, Country)" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <input name="learningGoal" value={form.learningGoal} onChange={handleChange} placeholder="Learning Goal (e.g. Become a frontend dev)" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <select name="education" value={form.education} onChange={e => {
          setForm({ ...form, education: e.target.value });
          setShowCustomEducation(e.target.value === "Other");
        }} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
          <option value="">Education Background</option>
          <option value="School Student">School Student</option>
          <option value="College Student">College Student</option>
          <option value="Working Professional">Working Professional</option>
          <option value="Fresher / Job Seeker">Fresher / Job Seeker</option>
          <option value="Other">Other</option>
        </select>
        {showCustomEducation && (
          <input name="customEducation" value={form.customEducation || ""} onChange={e => setForm({ ...form, customEducation: e.target.value, education: e.target.value })} placeholder="Enter your education" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        )}
        <select name="languagePreference" value={form.languagePreference} onChange={e => {
          setForm({ ...form, languagePreference: e.target.value });
          setShowCustomLanguage(e.target.value === "Other");
        }} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
          <option value="">Preferred Language</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Gujarati">Gujarati</option>
          <option value="Marathi">Marathi</option>
          <option value="Bengali">Bengali</option>
          <option value="Other">Other</option>
        </select>
        {showCustomLanguage && (
          <input name="customLanguage" value={form.customLanguage || ""} onChange={e => setForm({ ...form, customLanguage: e.target.value, languagePreference: e.target.value })} placeholder="Enter your language" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        )}
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your problem or what you want to learn" rows={3} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Continue</button>
      </form>
    </div>
  );
};

export default MenteeOnboarding;
