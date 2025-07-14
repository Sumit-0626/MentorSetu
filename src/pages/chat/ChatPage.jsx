import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";

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
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");

  // Mentor call availability
  const [mentorCallAvailable, setMentorCallAvailable] = useState(false);
  useEffect(() => {
    if (mentorId) {
      const status = localStorage.getItem(`mentorCallAvailable_${mentorId}`);
      setMentorCallAvailable(status === 'true');
    }
  }, [mentorId]);

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
      type: "text",
    };

    const updated = [...messages, messageObj];
    setMessages(updated);
    localStorage.setItem(chatKey, JSON.stringify(updated));
    setNewMessage("");
  };

  const handleSendFile = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const messageObj = {
        sender: senderType,
        fileName: file.name,
        fileUrl: e.target.result,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "file",
      };
      const updated = [...messages, messageObj];
      setMessages(updated);
      localStorage.setItem(chatKey, JSON.stringify(updated));
      setFile(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSendLink = () => {
    if (!link.trim()) return;
    const messageObj = {
      sender: senderType,
      link,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "link",
    };
    const updated = [...messages, messageObj];
    setMessages(updated);
    localStorage.setItem(chatKey, JSON.stringify(updated));
    setLink("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Determine chat partner
  const isMentor = senderType === "mentor";
  const self = isMentor ? mentor : mentee;
  const partner = isMentor ? mentee : mentor;

  // Call modal state
  const [callType, setCallType] = useState(null); // 'audio' or 'video'
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [peer, setPeer] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [signalData, setSignalData] = useState("");
  const [offer, setOffer] = useState("");
  const [answer, setAnswer] = useState("");

  // Start call (open modal and get user media)
  const handleStartCall = async (type) => {
    setCallType(type);
    setCallModalOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });
      setLocalStream(stream);
      // Create peer
      const initiator = true;
      const p = new SimplePeer({ initiator, trickle: false, stream });
      setPeer(p);
      p.on("signal", (data) => {
        setSignalData(JSON.stringify(data));
      });
      p.on("stream", (stream) => {
        setRemoteStream(stream);
      });
    } catch (err) {
      alert("Could not access media devices: " + err.message);
      setCallModalOpen(false);
    }
  };

  // Join call (paste offer, create peer)
  const handleJoinCall = async (type) => {
    setCallType(type);
    setCallModalOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });
      setLocalStream(stream);
      const p = new SimplePeer({ initiator: false, trickle: false, stream });
      setPeer(p);
      p.on("signal", (data) => {
        setSignalData(JSON.stringify(data));
      });
      p.on("stream", (stream) => {
        setRemoteStream(stream);
      });
      if (offer) {
        p.signal(JSON.parse(offer));
      }
    } catch (err) {
      alert("Could not access media devices: " + err.message);
      setCallModalOpen(false);
    }
  };

  // Handle answer (paste answer)
  useEffect(() => {
    if (peer && answer) {
      peer.signal(JSON.parse(answer));
    }
  }, [peer, answer]);

  // Clean up on modal close
  const handleEndCall = () => {
    setCallModalOpen(false);
    setCallType(null);
    setSignalData("");
    setOffer("");
    setAnswer("");
    if (peer) peer.destroy();
    setPeer(null);
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
  };

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
        {/* Call Buttons or Availability Message */}
        <div className="ml-auto flex flex-col gap-2">
          {mentorCallAvailable ? (
            <>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold" onClick={() => handleStartCall('audio')}>Voice Call</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold" onClick={() => handleStartCall('video')}>Video Call</button>
            </>
          ) : (
            <span className="text-xs text-gray-500 italic">Mentor is not available for calls right now.</span>
          )}
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
                {/* Message content types */}
                {msg.type === "text" && <div>{msg.text}</div>}
                {msg.type === "file" && (
                  <div>
                    <a
                      href={msg.fileUrl}
                      download={msg.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-200 dark:text-blue-400"
                    >
                      {msg.fileName}
                    </a>
                  </div>
                )}
                {msg.type === "link" && (
                  <div>
                    <a
                      href={msg.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-200 dark:text-blue-400"
                    >
                      {msg.link}
                    </a>
                  </div>
                )}
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

      <div className="mt-4 max-w-3xl mx-auto flex flex-col gap-2">
        <div className="flex gap-2">
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
        <div className="flex gap-2 items-center">
          <input
            type="file"
            onChange={e => setFile(e.target.files[0])}
            className="block"
          />
          <button
            onClick={handleSendFile}
            disabled={!file}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Send File
          </button>
          <input
            type="text"
            placeholder="Paste a link to share..."
            value={link}
            onChange={e => setLink(e.target.value)}
            className="flex-grow px-4 py-2 rounded border focus:outline-none dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSendLink}
            disabled={!link.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Send Link
          </button>
        </div>
      </div>

      {/* Call Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button onClick={handleEndCall} className="absolute top-2 right-2 text-gray-500 hover:text-red-600 font-bold text-xl">&times;</button>
            <h2 className="text-xl font-bold mb-4 text-indigo-600">{callType === 'video' ? 'Video Call' : 'Voice Call'}</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 flex flex-col items-center">
                <span className="font-semibold mb-2">Your Stream</span>
                {localStream && (
                  callType === 'video' ? (
                    <video autoPlay muted playsInline ref={el => el && localStream && (el.srcObject = localStream)} className="w-32 h-32 bg-black rounded" />
                  ) : (
                    <audio autoPlay muted ref={el => el && localStream && (el.srcObject = localStream)} />
                  )
                )}
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="font-semibold mb-2">Remote Stream</span>
                {remoteStream ? (
                  callType === 'video' ? (
                    <video autoPlay playsInline ref={el => el && remoteStream && (el.srcObject = remoteStream)} className="w-32 h-32 bg-black rounded" />
                  ) : (
                    <audio autoPlay ref={el => el && remoteStream && (el.srcObject = remoteStream)} />
                  )
                ) : (
                  <span className="text-xs text-gray-400">Waiting for connection...</span>
                )}
              </div>
            </div>
            {/* Signaling UI */}
            {!peer?.destroyed && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">Your Offer/Answer Code:</label>
                  <textarea className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-xs" value={signalData} readOnly rows={3} onFocus={e => e.target.select()} />
                </div>
                {!peer.initiator && (
                  <div>
                    <label className="block text-xs font-semibold mb-1">Paste Offer Code:</label>
                    <textarea className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-xs" value={offer} onChange={e => setOffer(e.target.value)} rows={3} />
                    <button className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded" onClick={() => handleJoinCall(callType)}>Join Call</button>
                  </div>
                )}
                {peer.initiator && (
                  <div>
                    <label className="block text-xs font-semibold mb-1">Paste Answer Code:</label>
                    <textarea className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-xs" value={answer} onChange={e => setAnswer(e.target.value)} rows={3} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
