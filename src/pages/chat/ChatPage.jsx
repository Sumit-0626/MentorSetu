import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const ChatPage = () => {
  const { mentorId, menteeId, senderType } = useParams();
  const chatKey = `chat-mentor${mentorId}-mentee${menteeId}`;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);
  const [mentor, setMentor] = useState({ name: "Mentor", avatar: "" });
  const [mentee, setMentee] = useState({ name: "Mentee", avatar: "" });

  useEffect(() => {
    // Get mentor and mentee info from localStorage
    const mentorProfile = JSON.parse(localStorage.getItem("mentorProfile"));
    const menteeProfile = JSON.parse(localStorage.getItem("menteeInfo"));
    setMentor({
      name: mentorProfile?.name || "Mentor",
      avatar: mentorProfile?.avatar || "",
    });
    setMentee({
      name: menteeProfile?.fullName || "Mentee",
      avatar: menteeProfile?.avatar || "",
    });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(chatKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, [chatKey]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageObj = {
      sender: senderType,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...messages, messageObj];
    setMessages(updated);
    localStorage.setItem(chatKey, JSON.stringify(updated));
    setNewMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Determine chat partner
  const isMentor = senderType === "mentor";
  const self = isMentor ? mentor : mentee;
  const partner = isMentor ? mentee : mentor;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      {/* Chat header with avatars and names */}
      <div className="max-w-3xl mx-auto flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-xl font-bold text-indigo-700">
            {getInitials(self.name)}
          </div>
          <span className="font-semibold text-indigo-700">{self.name} (You)</span>
        </div>
        <span className="mx-2 text-gray-400">vs</span>
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-xl font-bold text-green-700">
            {getInitials(partner.name)}
          </div>
          <span className="font-semibold text-green-700">{partner.name}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-[70vh] overflow-y-auto">
        {messages.map((msg, i) => {
          const isSelf = msg.sender === senderType;
          const avatarName = isSelf ? self.name : partner.name;
          const avatarColor = isSelf ? "bg-indigo-200 text-indigo-700" : "bg-green-200 text-green-700";
          return (
            <div key={i} className={`flex mb-2 ${isSelf ? "justify-end" : "justify-start"}`}>
              {!isSelf && (
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold mr-2 ${avatarColor}`}>
                  {getInitials(avatarName)}
                </div>
              )}
              <div
                className={`p-2 rounded max-w-[75%] flex flex-col ${
                  isSelf
                    ? "bg-blue-500 text-white text-right ml-auto"
                    : "bg-gray-300 text-black text-left"
                }`}
              >
                <div>{msg.text}</div>
                <div className="text-xs opacity-70 mt-1">{msg.time}</div>
              </div>
              {isSelf && (
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ml-2 ${avatarColor}`}>
                  {getInitials(avatarName)}
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef}></div>
      </div>

      <div className="mt-4 max-w-3xl mx-auto flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow px-4 py-2 rounded border focus:outline-none dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
