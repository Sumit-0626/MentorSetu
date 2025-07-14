import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.email === form.email && user.password === form.password) {
      localStorage.setItem("role", user.role);
      if (user.role === "mentor") navigate("/mentor-dashboard");
      else navigate("/mentee-dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">Login</h2>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Login</button>
        <div className="text-sm text-center mt-2">
          Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 