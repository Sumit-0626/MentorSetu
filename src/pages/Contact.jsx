import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">Contact Us</h1>
        {sent ? (
          <div className="text-green-600 font-semibold">Thank you for reaching out! We'll get back to you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your Email" required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" required rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Send</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact; 