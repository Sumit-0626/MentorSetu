import { useRef, useState, useEffect } from "react";

const HeroSection = () => {
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("profileAvatar");
    if (saved) setAvatar(saved);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target.result);
        localStorage.setItem("profileAvatar", ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-gray-900">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to <span className="text-indigo-600">MentorSetu</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
        An AI-powered mentorship platform for students, professionals, and innovators. Please choose your role to begin.
      </p>
      {/* Profile Picture Upload */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden mb-2 border-4 border-indigo-500 shadow">
          {avatar ? (
            <img src={avatar} alt="Profile" className="object-cover w-full h-full" />
          ) : (
            <span className="text-4xl text-gray-400">+</span>
          )}
        </div>
        <button
          className="text-indigo-600 hover:underline text-sm font-medium"
          onClick={() => fileInputRef.current.click()}
        >
          {avatar ? "Change Profile Picture" : "Add Profile Picture"}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <a href="/mentee/onboarding">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition">
            I'm a Mentee
          </button>
        </a>
        <a href="/mentor/onboarding">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition">
            I'm a Mentor
          </button>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
