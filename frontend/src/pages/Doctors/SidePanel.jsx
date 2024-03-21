import React, { useState,useEffect } from 'react';
import { BASE_URL,token } from '../../config';
import { useNavigate } from "react-router-dom";

const SidePanel = ({ doctorDetails, userDetails }) => {
  console.log(doctorDetails)
  console.log(userDetails)
  const navigate = useNavigate()
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [totalWalletAmount, setTotalWalletAmount] = useState(null);
  console.log(totalWalletAmount)
  console.log(totalWalletAmount)
  let userId=userDetails._id
  console.log(userId)
  
  
  useEffect(() => {
    const fetchTotalWalletAmount = async () => {
      console.log('hellooo')
      try {
        const response = await fetch(`${BASE_URL}/users/totalAmount/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch total wallet amount');
        }

        const data = await response.json();
        console.log(data)
        setTotalWalletAmount(data.data.currentWalletAmount);
      } catch (error) {
        console.error('Error fetching total wallet amount:', error);
      }
    };

    fetchTotalWalletAmount();
  }, []);

  const isSlotAvailable = (date, slot) => {
    const selectedDateSlot = doctorDetails.selectedDatesAndSlots.find(
      (dateSlot) => dateSlot.date === date
    );
    return selectedDateSlot && selectedDateSlot.slots.includes(slot);
  };
  
  
  
  

  const handleSlotSelect = (date, slot) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
    // You can add further logic or state management for slot selection if needed
  };

  const handleUserNameSelect = (userName) => {
    setSelectedUserName(userName);
  };

  const currentDate = new Date();
  const filteredDatesAndSlots = doctorDetails.selectedDatesAndSlots.filter(
    (dateSlot) => new Date(dateSlot.date) >= currentDate
  );
  const saveBookingDetails = async () => {
    console.log('savebooking starting')
    try {
      const bookingRes = await fetch(`${BASE_URL}/booking/createBooking`, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId:userDetails._id,
          doctorId:doctorDetails._id,
          date: selectedDate,
          slot: selectedSlot,
          bookedFor: selectedUserName,
          fee: doctorDetails.fee,
        }),
      });
  
      if (bookingRes.ok) {
        const bookingData = await bookingRes.json();
        console.log("Booking details saved:", bookingData);
        
        // You can perform additional actions if needed
      } else {
        console.log("Failed to save booking details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    console.log('savebooking end')
  };
  const saveBookingDetailsWithWallet = async () => {
    console.log('savebooking starting')
    try {
      const bookingRes = await fetch(`${BASE_URL}/booking/createBookingwithWallet`, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId:userDetails._id,
          doctorId:doctorDetails._id,
          date: selectedDate,
          slot: selectedSlot,
          bookedFor: selectedUserName,
          fee: doctorDetails.fee,
        }),
      });
  
      if (bookingRes.ok) {
        const bookingData = await bookingRes.json();
        navigate('/success')

        console.log("Booking details saved:", bookingData);
        // You can perform additional actions if needed
      } else {
        console.log("Failed to save booking details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    console.log('savebooking end')
  };
  
  const handlePayment = async (selectedDate,selectedSlot,selectedUserName,fee) => {
    console.log('starting of handlepayment')
    console.log(selectedDate,selectedSlot,selectedUserName,fee)
    try {
    
      const res = await fetch(`${BASE_URL}/users/payment`, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedDate: selectedDate,
          selectedSlot: selectedSlot,
          selectedUserName: selectedUserName,
          fee: fee,
        }),
      });

      if (res.ok) {
        console.log('haiiii')
        saveBookingDetails()
        const data = await res.json();
        console.log(data)
        console.log(data.url)
        if (data.url) {
          
          window.location.href = data.url;
          
        } else {
          console.log("error.message");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const isWalletButtonDisabled = totalWalletAmount == null || totalWalletAmount < doctorDetails.fee;


  return (
    <div className='bg-white shadow-panelShadow p-4 lg:p-6 rounded-md'>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-gray-800 font-semibold text-lg'>Consultation Fee</p>
        <span className='text-primaryColor font-bold text-xl'>
          {doctorDetails ? `${doctorDetails.fee} RS` : '0 RS'}
        </span>
      </div>
      <div className='mb-4'>
        <p className='text-gray-800 font-semibold'>Available Time Slots</p>
        <ul className='mt-2 space-y-2'>
          {filteredDatesAndSlots.map((dateSlot) => (
            <li
              key={dateSlot._id}
              className={`p-3 bg-${selectedDate === dateSlot.date ? 'green-100' : 'white'} rounded-md transition-all duration-300 cursor-pointer`}
              onClick={() => setSelectedDate(dateSlot.date)}
            >
              <p className='text-primaryColor font-semibold'>
                {new Date(dateSlot.date).toLocaleDateString()}
              </p>
              {selectedDate === dateSlot.date && (
                <ul className='mt-2 space-y-2 overflow-y-auto max-h-20'>
                  {dateSlot.slots.map((slot) => (
                    <li
                      key={slot}
                      className={`flex items-center justify-between p-2 rounded-md transition-all duration-300 ${
                        isSlotAvailable(dateSlot.date, slot)
                          ? selectedSlot === slot
                            ? 'text-green-500 bg-green-200' // Highlight the selected slot
                            : 'text-green-500 bg-green-50'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => isSlotAvailable(dateSlot.date, slot) && handleSlotSelect(dateSlot.date, slot)}
                    >
                      <span className='text-lg font-semibold'>{slot}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className='mb-4'>
        <p className='text-gray-800 font-semibold'>Booking For</p>
        <select
          className='mt-2 p-2 w-full border rounded-md'
          value={selectedUserName}
          onChange={(e) => handleUserNameSelect(e.target.value)}
        >
          <option value='' disabled>Select a person</option>
          <option value={userDetails ? userDetails.name : ''}>
            {userDetails ? userDetails.name : ''}
          </option>
          {/* Add options for friends' names if applicable */}
          {userDetails && userDetails.friends && userDetails.friends.map((friend) => (
            <option key={friend.id} value={friend.name}>
              {friend.name}
            </option>
          ))}
        </select>
      </div>
      <button
        className={`bg-primaryColor text-white px-4 py-2 w-full rounded-md transition-all duration-300 ${
          !(selectedDate && selectedSlot && selectedUserName) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!(selectedDate && selectedSlot && selectedUserName)}
        onClick={()=>handlePayment(selectedDate,selectedSlot,selectedUserName,doctorDetails.fee)}
      >
        Book Appointment for {selectedUserName || 'User'}
      </button>
      <div className='mt-4'>
      <button
      className={`bg-gray-200 text-gray-700 px-4 py-2 w-full rounded-md ${
       isWalletButtonDisabled || !selectedDate || !selectedSlot || !selectedUserName ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isWalletButtonDisabled || !selectedDate || !selectedSlot || !selectedUserName}
        onClick={saveBookingDetailsWithWallet}
        >
      Wallet: {totalWalletAmount !== null ? totalWalletAmount : '0'}
      </button>
      </div>
    </div>
  );
};

export default SidePanel;
