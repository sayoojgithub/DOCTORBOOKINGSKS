import React, { useState, useEffect } from 'react';
import { BASE_URL, token } from '../../config';
import { toast } from 'react-toastify';

const defaultTimeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
];

const AvailabilityAdd = ({ doctor }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [existingSlots, setExistingSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    // Fetch existing slots for the selected date
    const fetchExistingSlots = async () => {
      try {
        const res = await fetch(`${BASE_URL}/doctors/getAvailability/${doctor._id}/${selectedDate}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const { data } = await res.json();
          data ? setExistingSlots(data) : setExistingSlots([]);
        } else {
          const { message } = await res.json();
          throw new Error(message);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (selectedDate) {
      fetchExistingSlots();
    }
  }, [doctor._id, selectedDate]);

  const handleDateChange = (e) => {
    const selected = e.target.value;
    const today = new Date();
    const nextThreeDays = new Date();
    nextThreeDays.setDate(today.getDate() + 3);
  
    if (new Date(selected) < today || new Date(selected) > nextThreeDays) {
      setDateError('You can only book for the next 3 days.');
    } else {
      setDateError('');
      setExistingSlots([]);
    }
  
    // Reset selectedSlots when a new date is selected
    setSelectedSlots([]);
    setSelectedDate(selected);
  };

  const handleSlotToggle = (slot) => {
    if (existingSlots.includes(slot)) {
      // Slot is already booked, vibrate and do not select
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      return;
    }

    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((selectedSlot) => selectedSlot !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSaveAvailability = async () => {
    if (dateError) {
      toast.error(dateError);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/doctors/saveAvailability/${doctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedDate,
          selectedSlots,
        }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      const { message } = await res.json();
      toast.success(message);

      setSelectedDate('');
      setSelectedSlots([]);
      setShowModal(false);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const handleOpenModal = () => {
    setSelectedDate('');
    setSelectedSlots([]);
    setShowModal(true);
    setDateError('');
    setExistingSlots([]);
  };

  return (
    <div className="p-4 relative">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-green"
        onClick={handleOpenModal}
      >
        Add Availability
      </button>
      {showModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Select Date:</label>
              <input
                className="border border-gray-300 rounded w-full py-2 px-3"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Select Time Slots:</label>
              <div className="grid grid-cols-3 gap-4">
                {defaultTimeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-md cursor-pointer ${
                      selectedSlots.includes(slot) ? 'bg-blue-500 text-white' : existingSlots.includes(slot) ? 'bg-red-500 text-white' : 'bg-transparent'
                    }`}
                    onClick={() => handleSlotToggle(slot)}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline-blue"
                onClick={handleSaveAvailability}
              >
                Save Availability
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
            {dateError && (
              <p className="text-red-500 text-sm mt-2">
                <strong>Error:</strong> {dateError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityAdd;
