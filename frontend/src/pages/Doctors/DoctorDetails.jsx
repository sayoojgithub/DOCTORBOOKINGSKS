import React, { useState, useEffect } from "react";
import DoctorAbout from "./DoctorAbout";
import Feedback from "./Feedback";
import SidePanel from "./SidePanel";
import { useParams } from "react-router-dom";
import { BASE_URL, token } from "../../config";
import { useNavigate } from "react-router-dom";
console.log(token);

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate()
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  console.log(doctorDetails);
  console.log(userDetails);

  const [tab, setTab] = useState("about");

  useEffect(() => {
    const fetchCurrentUserDetails = async () => {
      try {
        const userString = localStorage.getItem("user");
        if (userString) {
          const userObject = JSON.parse(userString);
          const userEmail = userObject.email;

          const currentUserRes = await fetch(
            `${BASE_URL}/users/current/${userEmail}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (currentUserRes.ok) {
            const currentUserData = await currentUserRes.json();
            setUserDetails(currentUserData.data);
          } else {
            console.error("Failed to fetch current user details");
          }
        } else {
          console.error("User object not found in local storage");
        }
      } catch (error) {
        console.error("Error fetching current user details:", error);
      }
    };
    const fetchDoctorDetails = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/users/IndividualPage/${doctorId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setDoctorDetails(data.data);
        } else {
          console.error("Failed to fetch doctor details");
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchCurrentUserDetails();
    fetchDoctorDetails();
  }, []);

  const handleMessage = async () => {
    try {
      const response = await fetch(`${BASE_URL}/chat/createChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: userDetails._id,
          receiverId: doctorDetails._id,
        }),
      });
      if (response.ok) {
       navigate('/chat')
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };
  const handleVideoCall = () => {
  
  if (userDetails && userDetails._id) {
    
    navigate(`/videocall/${userDetails._id}`);
  } else {
    console.error("User details not available");
    
  }
};

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid md:grid-cols-3 gap-[50px]">
          <div className="md:col-span-2">
            <div className="flex items-center gap-5">
              <figure className="max-w-[200px] max-h-[200px]">
                <img
                  src={doctorDetails ? doctorDetails.photo : ""}
                  alt=""
                  className="w-full h-full object-cover rounded"
                />
              </figure>
              <div className="flex flex-col">
                <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold">
                  {doctorDetails ? doctorDetails.name : ""}
                </h3>
                <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded">
                  {doctorDetails ? doctorDetails.specialization : ""}
                </span>
                <button
                  onClick={handleMessage}
                  className="bg-blue-500 text-white py-2 px-4 rounded mt-3"
                >
                  Message
                </button>
                <button
                  onClick={handleVideoCall}
                  className="bg-green-500 text-white py-2 px-4 rounded mt-3"
                >
                  Video Call
                </button>
              </div>
            </div>

            <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
              <button
                onClick={() => setTab("about")}
                className={`${
                  tab === "about" && "border-b border-solid border-primaryColor"
                }py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                About
              </button>
            </div>
            <div className="mt-[50px]">
              {tab === "about" && <DoctorAbout doctorDetails={doctorDetails} />}
              {tab === "feedback" && <Feedback />}
            </div>
          </div>
          <div>
            {doctorDetails && userDetails && (
              <SidePanel
                doctorDetails={doctorDetails}
                userDetails={userDetails}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetails;
