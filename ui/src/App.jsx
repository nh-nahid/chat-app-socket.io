import { useState } from "react";
import ChatRoom from "./components/Chatroom";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      setJoined(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#020617] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.25)] p-8 text-slate-100 animate-[fadeIn_0.6s_ease-out]">
        {!joined ? (
          <>
            <h2 className="text-3xl font-semibold text-center mb-8 text-slate-200 animate-[slideDown_0.4s_ease-out]">
              Join Chat Room
            </h2>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 text-slate-100 placeholder-slate-400 border border-white/10 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/30 transition"
            />

            <input
              type="text"
              placeholder="Room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full mb-6 px-4 py-3 rounded-xl bg-black/40 text-slate-100 placeholder-slate-400 border border-white/10 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/30 transition"
            />

            <button
              onClick={joinRoom}
              className="w-full py-3 rounded-xl font-medium text-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-[1.02] active:scale-100 transition"
            >
              Join Room
            </button>
          </>
        ) : (
          <div className="text-center text-xl font-medium animate-[popIn_0.4s_ease-out]">
            <ChatRoom username={username} room={room}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;