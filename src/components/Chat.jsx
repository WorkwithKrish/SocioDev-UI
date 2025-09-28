import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import createSocketConnection from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = useSelector((store) => store.user);

  const socket = createSocketConnection();
  const userId = user?._id;

  useEffect(() => {
    if (!userId || !targetUserId) return;
    console.log("Connecting to socket with userId:", userId);
    console.log("Connecting to socket with targetUserID:", targetUserId);
    socket.emit("join", { targetUserId, userId: userId });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const onSendMessage = () => {
    if (!newMessage) return;

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      text: newMessage,
      to: targetUserId,
      from: user._id,
    });

    setMessages((prev) => [
      ...prev,
      { firstName: user.firstName, lastName: user.lastName, text: newMessage },
    ]);

    setNewMessage("");
  };
  socket.on("receiveMessage", ({ firstName, lastName, text, to, from }) => {
    console.log("Received message:", text);
    setMessages((prev) => [...prev, { firstName, lastName, text }]);
  });

  return (
    <div>
      <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
        <h1 className="p-5 border-b border-gray-600">Chat</h1>
        <div className="flex-1 overflow-scroll p-5">
          {messages &&
            messages.map((msg, index) => {
              return (
                <div
                  key={index}
                  className={
                    "chat " +
                    (user.firstName === msg.firstName
                      ? "chat-end"
                      : "chat-start")
                  }
                >
                  <div className="chat-header">
                    {`${msg.firstName}  ${msg.lastName}`}
                    <time className="text-xs opacity-50"> 2 hours ago</time>
                  </div>
                  <div className="chat-bubble">{msg.text}</div>
                  <div className="chat-footer opacity-50">Seen</div>
                </div>
              );
            })}
        </div>
        <div className="p-5 border-t border-gray-600 flex items-center gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-500 text-black rounded p-2"
          ></input>
          <button className="btn btn-secondary" onClick={onSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
