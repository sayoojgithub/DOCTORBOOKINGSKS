import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { BASE_URL } from "../../config";
import { io } from "socket.io-client";
import { format } from "timeago.js";
const socket=io("https://medicare.sayoojks.shop")


const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);
  const [userLastSeen,setUserLastSeen]=useState();
  const [doctorLastSeen,setDoctorLastSeen]=useState()
  
  console.log(userData,'userDataaaa')

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userId = data.members.find((id) => id !== currentUser);
  
        const response = await fetch(`${BASE_URL}/chat/findUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId }) 
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
  
        
        const userData = await response.json();
        console.log(userData);

        setUserData(userData);
        if(userData.userDetails){
          setUserLastSeen(userData.userDetails.lastSeen)
        }
        if(userData.doctorDetails){
          setDoctorLastSeen(userData.doctorDetails.lastSeen)
        }
       
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    getUserData();
  }, [data.members, currentUser]);
  useEffect(() => {
    const handleSentLastSeen = ({ lastSeen, userid }) => {
      if (userData.userDetails && userData.userDetails._id === userid) {
        setUserLastSeen(lastSeen);
      }
      if (userData.doctorDetails && userData.doctorDetails._id === userid) {
        setDoctorLastSeen(lastSeen);
      }
    };
  
    socket.on("sentLastSeen", handleSentLastSeen);
  
    return () => {
      socket.off("sentLastSeen", handleSentLastSeen);
    };
  }, [socket, userData]);
  
  


  console.log(userData, "userDATA");
  return (
    <>
      <div className="flex items-center gap-4 hover:bg-gray-100 cursor-pointer rounded p-2 md:p-4">
        {online && (
          <div className="bg-green-500 rounded-full w-4 h-4 md:w-2 md:h-2"></div>
        )}
        <img
          src={
            userData?.doctorDetails?.photo ||
            userData?.userDetails?.photo
          }
          alt="Profile"
          className="followerImage w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
        />
        <div className="text-sm">
          <span className="font-semibold text-gray-800">
            {userData?.doctorDetails?.name ||
              userData?.userDetails?.name}
          </span>
          <br />
          {userData ? userData.doctorDetails ? (
  <span className={online ? "text-green-500" : "text-gray-500"}>
    {online
      ? "Online"
      : userData.doctorDetails.lastSeen
      ? `${format(doctorLastSeen)} `
      : "Offline"}
  </span>
) : (
  <span className={online ? "text-green-500" : "text-gray-500"}>
    {online
      ? "Online"
      : userData.userDetails.lastSeen
      ? `${format(userLastSeen)} `
      : "Offline"}
  </span>
): (
  <span className={online ? "text-green-500" : "text-gray-500"}>
    {online ? "Online" : "Offline"}
  </span>
)}
        </div>
      </div>
      <hr className="w-5/6 md:w-11/12 mx-auto border-t border-gray-300 my-4" />
    </>
  );
};

Conversation.propTypes = {
  data: PropTypes.object.isRequired, 
  currentUser: PropTypes.string.isRequired,
  online: PropTypes.bool.isRequired,
};


export default Conversation;