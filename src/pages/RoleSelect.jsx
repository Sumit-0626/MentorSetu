import { useNavigate } from "react-router-dom";

const RoleSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    localStorage.setItem("role", role);
    if (role === "mentor") {
      navigate("/mentor-onboarding");
    } else {
      navigate("/mentee-onboarding");
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-md shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-indigo-600">Choose Your Role</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us who you are so we can guide you accordingly.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleSelect("mentee")}
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
          >
            I’m a Mentee
          </button>
          <button
            onClick={() => handleSelect("mentor")}
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
          >
            I’m a Mentor
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoleSelect;
