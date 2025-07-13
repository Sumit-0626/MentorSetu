import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  // Track whether user is logging in or registering
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  // Switch between login and register modes
  const switchAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    // Clear form when switching modes
    setUserCredentials({ email: "", password: "" });
  };

  // Handle input changes
  const updateFormField = (e) => {
    const { name, value } = e.target;
    setUserCredentials((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const processAuthForm = (e) => {
    e.preventDefault();

    // For demo purposes - store user data locally
    // In real app, this would be an API call
    localStorage.setItem("currentUser", JSON.stringify(userCredentials));
    navigate("/role-select");
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left branding panel */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-500 text-white p-12 relative">
        <div className="z-10">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-lg">MentorSetu</h1>
          <p className="text-lg font-medium mb-8 max-w-xs">Connect. Learn. Grow. <br/> Find your perfect mentor or guide a new generation of learners.</p>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li>✔️  1:1 Mentorship</li>
            <li>✔️  Real-time Chat</li>
            <li>✔️  Progress Tracking</li>
            <li>✔️  Personalized Dashboard</li>
          </ul>
        </div>
        <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-indigo-200 opacity-70">&copy; {new Date().getFullYear()} MentorSetu</div>
        <div className="absolute top-0 left-0 w-full h-full bg-indigo-900 opacity-30 z-0" />
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl space-y-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-center text-indigo-600">
            {isLoginMode ? "Login to MentorSetu" : "Create your MentorSetu account"}
          </h2>

          <form onSubmit={processAuthForm} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input
                type="email"
                name="email"
                value={userCredentials.email}
                onChange={updateFormField}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Password</label>
              <input
                type="password"
                name="password"
                value={userCredentials.password}
                onChange={updateFormField}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-semibold shadow"
            >
              {isLoginMode ? "Login" : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"} {" "}
            <button
              onClick={switchAuthMode}
              className="text-indigo-600 font-medium hover:underline"
            >
              {isLoginMode ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
