import { useEffect, useState, useRef } from "react";
import "./Chatbox.css";
import { BASE_URL } from "../../config";
import {format} from 'timeago.js'
import {io} from 'socket.io-client'

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping,setIsTyping] =  useState(false)
  const [user,setUser] = useState('')


  const socket = io('http://localhost:5000')
  

  const handleChange = (event) => {
    const newMessage = event.target.value;
    setNewMessage(newMessage);
  };

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    setUser(userId)
    const getUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/chat/findUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId }) // Send userId in the request body
          });
          const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = () => {
      if (!chat) return; // Exit early if chat is null
      fetch(`${BASE_URL}/message/getMessages/${chat._id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setMessages(data);
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });
    };
  
    fetchMessages();
  }, [chat]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({...message, receiverId});
    
    try {
      const response = await fetch(`${BASE_URL}/message/addMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...message,
          receiverId
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      const data = await response.json();
  
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);
  useEffect(() => {
    let typingTimeout;
  
    socket.on('typingSend', (id) => {
      const checkId = id.id.user;
      console.log('checkkkkk', checkId);
      console.log('test', user);
  
      if (checkId !== user) {
        console.log('entering');
        setIsTyping(true);
        clearTimeout(typingTimeout);
        // Start a new timeout to reset isTyping after a certain duration of inactivity
        typingTimeout = setTimeout(() => {
          setIsTyping(false);
        }, 1000);
      }
    });
  
    return () => {
      // Clean up the timeout when the component unmounts or when the user changes
      clearTimeout(typingTimeout);
    };
  }, [user]);

  const scroll = useRef();
  const imageRef = useRef();
  const typingHandler = ()=>{
    socket.emit('typing',{user})
  }
  
  return (
    <>
      <div className="grid  grid-rows-[14vh,68vh,13vh] rounded-md overflow-hidden">
        {chat ? (
          <>
            <div className="flex flex-col p-4 bg-white">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={userData?.doctorDetails?.photo || userData?.userDetails?.photo}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="text-sm">
                  <span className="font-bold text-gray-800">
                    {userData?.doctorDetails?.name || userData?.userDetails?.name }
                  </span>
                  {
                    isTyping &&(
                      <div><span className="text-black">typing...</span></div>
                    )
                  }
                </div>
              </div>
              <hr className="w-11/12 border-t border-gray-300 mt-4" />
            </div>
            <div className="flex flex-col gap-2 p-6 overflow-auto bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  ref={scroll}
                  className={
                    message.senderId === currentUser
                      ? "message own bg-blue-500 text-white"
                      : "message bg-gray-200 text-gray-800"
                  }
                >
                  <span>{message.text}</span>{" "}
                  <span className="text-xs text-gray-500 self-end">
                  {format(message.createdAt)}
                  
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap- items-center bg-white rounded p-2">
              <input
                value={newMessage}
                onChange={handleChange}
                placeholder="Type your message..."
                className="flex-1 h-10 bg-gray-100 rounded px-4 outline-none focus:ring-2 focus:ring-blue-500"
                onInput={typingHandler}
              />
              <button
                className="button bg-blue-500 text-white py-2 px-4 rounded ml-2"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <span className="chatbox-empty-message text-center text-gray-500">
            Tap on a chat to start a conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
