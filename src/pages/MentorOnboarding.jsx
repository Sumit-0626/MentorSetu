import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MentorOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    skills: [],
    language: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const updated = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updated };
    });
  };

  const handleSubmit = () => {
    localStorage.setItem("mentorProfile", JSON.stringify(formData));
    navigate("/mentor-dashboard");
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 transition-all">
      {step === 1 && (
        <div className="max-w-lg w-full space-y-6 text-center">
          <h2 className="text-3xl font-bold text-indigo-600">Welcome, Mentor!</h2>
          <p className="text-gray-600 dark:text-gray-300">What’s your full name?</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleNext}
            disabled={!formData.name}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl w-full space-y-6 text-center">
          <h2 className="text-3xl font-semibold text-indigo-600">Your Mentoring Domain</h2>
          <p className="text-gray-600 dark:text-gray-300">Pick your main area of guidance.</p>
          <div className="grid gap-3">
            {[
              "Web Development",
              "Machine Learning",
              "DSA & Problem Solving",
              "Career Guidance",
              "UI/UX Design",
              "Open Source",
            ].map((domain) => (
              <button
                key={domain}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, domain }));
                  setStep(3);
                }}
                className={`w-full px-4 py-3 border rounded-md text-left transition hover:border-indigo-500 ${
                  formData.domain === domain
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-xl w-full space-y-6">
          <h2 className="text-3xl font-semibold text-indigo-600 text-center">Your Skills / Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              "React",
              "Node.js",
              "Python",
              "Java",
              "C++",
              "Figma",
              "GitHub",
              "MongoDB",
              "SQL",
              "Firebase",
            ].map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-2 border rounded-md transition ${
                  formData.skills.includes(skill)
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(4)}
            disabled={formData.skills.length === 0}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="max-w-lg w-full space-y-6">
          <h2 className="text-3xl font-semibold text-indigo-600 text-center">Final Details</h2>

          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select preferred language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Marathi">Marathi</option>
            <option value="Bengali">Bengali</option>
          </select>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a short intro about yourself..."
            className="w-full p-2 h-32 border border-gray-300 rounded-md resize-none"
          />

          <button
            onClick={() => setStep(5)}
            disabled={!formData.language || !formData.description}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="max-w-xl w-full space-y-6">
          <h2 className="text-3xl font-semibold text-indigo-600 text-center">Review Your Profile</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-left space-y-2">
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Domain:</strong> {formData.domain}</p>
            <p><strong>Skills:</strong> {formData.skills.join(", ")}</p>
            <p><strong>Language:</strong> {formData.language}</p>
            <p><strong>Intro:</strong> {formData.description}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-300 px-6 py-2 rounded-md"
            >
              Edit
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Submit & Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MentorOnboarding;
