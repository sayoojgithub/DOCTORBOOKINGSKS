import { useRef, useState, useEffect } from "react";
import Conversation from "../../components/Conversation/Conversation";
import "./Chat.css";
import { io } from "socket.io-client";
import ChatBox from "../../components/Chatbox/Chatbox";
import { BASE_URL } from "../../config";

const Chat = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const socket = useRef();
  const socketEmit=io("https://medicare.sayoojks.shop")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('role');
    if (role === 'patient') {
      setUserInfo(user);
    }
    if (role === 'doctor') {
      setDoctorInfo(user);
    }
  }, []);

  useEffect(() => {
    const getChats = async () => {
      try {
        const userId = userInfo?._id || doctorInfo?._id;
        if (userId) {
          const response = await fetch(`${BASE_URL}/Chat/${userId}`);
          const data = await response.json();
          const sortedChats = data
            .map((chat) => ({ ...chat, updatedAt: new Date(chat.updatedAt) }))
            .sort((a, b) => b.updatedAt - a.updatedAt);
          setChats(sortedChats);
          if (sortedChats.length > 0) {
            setCurrentChat(sortedChats[0]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getChats();
  }, [userInfo, doctorInfo]);

  useEffect(() => {
    socket.current = io("wss://medicare.sayoojks.shop");

    const userId = userInfo?._id || doctorInfo?._id;

    if (userId) {
      socket.current.emit("new-user-add", userId);
    }

    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    socket.current.on("receive-message", (data) => {
      setReceivedMessage(data);
    });
    socket.current.on('disconnect',()=>{
      const lastSeenTime = new Date()
      socketEmit.emit('lastSeen',lastSeenTime,userId)

      console.log('userId:',userId,lastSeenTime)
      const updateLastSeen = async()=>{
         await fetch(`${BASE_URL}/chat/updateLastSeen`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId,lastSeenTime }) 
        });
      }
      updateLastSeen()
    })

    return () => {
      socket.current.disconnect();
    };
  }, [userInfo?._id, doctorInfo?._id]);

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  const checkOnlineStatus = (chat) => {
    const userId = userInfo?._id || doctorInfo?._id;

    if (userId) {
      const chatMember = chat.members.find((member) => member !== userId);
      const online = onlineUsers.find((user) => user.userId === chatMember);
      return online ? true : false;
    }

    return false; 
  };

  return (
    <div className="grid grid-cols-1  sm:grid-cols-5 mr-2 gap-2">
      <div className="sm:col-span-1  m-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col bg-gray-100 rounded p-4 overflow-auto h-auto min-h-[95vh]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Chats</h2>
            <div className="flex flex-col gap-4">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setCurrentChat(chat);
                  }}
                  className="hover:bg-gray-200 cursor-pointer rounded p-2 transition-colors duration-300 ease-in-out"
                >
                  <Conversation
                    data={chat}
                    currentUser={userInfo?._id || doctorInfo?._id}
                    online={checkOnlineStatus(chat)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sm:col-span-4 flex flex-col gap-4">
        <div className="self-end">{/* NavIcons */}</div>
        <ChatBox
          chat={currentChat}
          currentUser={userInfo?._id || doctorInfo?._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
