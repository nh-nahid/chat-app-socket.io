import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

const ChatRoom = ({ username, room }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingMessage, setTypingMessage] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", room);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_typing", (user) => {
      if (user !== username) {
        setTypingMessage(`${user} is typing...`);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          setTypingMessage("");
        }, 2000);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
    };
  }, [room, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      room,
      author: username,
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      id: crypto.randomUUID(),
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setMessage("");
    setTypingMessage("");
  };

  const handleTyping = () => {
    socket.emit("typing", { username, room });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#020617] px-4">
      <div className="w-full max-w-2xl h-[80vh] flex flex-col rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.25)] text-slate-100">

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-slate-200">
            Room: <span className="text-cyan-400">{room}</span>
            <span className="ml-2 text-slate-400">({username})</span>
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg) => {
            const isOwn = msg.author === username;

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-xl px-4 py-2 text-sm shadow
                    ${
                      isOwn
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : "bg-black/40 border border-white/10 text-slate-200"
                    }`}
                >
                  {!isOwn && (
                    <div className="text-xs text-slate-400 mb-1">
                      {msg.author}
                    </div>
                  )}
                  <div>{msg.message}</div>
                  <div className="text-[10px] text-slate-300 mt-1 text-right">
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Typing indicator */}
        {typingMessage && (
          <div className="px-6 pb-1 text-xs text-slate-400 italic flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
            <span>{typingMessage.replace(" is typing...", "")}</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            </span>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex gap-3">
          <input
            type="text"
            value={message}
            placeholder="Type a message..."
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-3 rounded-xl bg-black/40 text-slate-100 placeholder-slate-400 border border-white/10 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition"
          />

          <button
            onClick={sendMessage}
            className="px-6 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-blue-600 shadow hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-[1.02] active:scale-100 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

ChatRoom.propTypes = {
  username: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
};

export default ChatRoom;