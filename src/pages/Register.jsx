import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "mentee" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    // Save user (for demo, just localStorage)
    localStorage.setItem("user", JSON.stringify(form));
    localStorage.setItem("role", form.role);
    if (form.role === "mentor") navigate("/mentor-onboarding");
    else navigate("/mentee-onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">Register</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Confirm Password" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
        </select>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Register</button>
      </form>
    </div>
  );
};

export default Register; 