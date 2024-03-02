import React, { useState, useEffect } from 'react';
import { BASE_URL, token } from '../../config';
import {toast} from 'react-toastify'

const ExperienceAdd = ({ doctor, doctorRefetch }) => {
  const [experience, setExperience] = useState({ fromDate: '', toDate: '', hospitalName: '' });
  const [experiences, setExperiences] = useState(doctor.experiences || []);
  const [showModal, setShowModal] = useState(false);
  const [modalKey, setModalKey] = useState(0); // New state for modal key

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExperience({ ...experience, [name]: value });
  };

  const handleAddExperience = () => {
    const newExperiences = [...experiences];
    newExperiences.push(experience);
    setExperiences(newExperiences);
    setExperience({ fromDate: '', toDate: '', hospitalName: '' });
    setModalKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/doctors/${doctor._id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message);
        }

        const updatedDoctor = await response.json();
        setExperiences(updatedDoctor.experiences || []);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, [doctor._id]);

  const handleRemoveExperience = async (index) => {
    const removedExperience = experiences[index];

    try {
      const res = await fetch(`${BASE_URL}/doctors/experiencesDelete/${doctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ removedExperience }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }

      await res.json();

      const updatedExperiences = [...experiences];
      updatedExperiences.splice(index, 1);
      setExperiences(updatedExperiences);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSaveExperiences = async () => {
    try {
      const res = await fetch(`${BASE_URL}/doctors/experiencesAdd/${doctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ experiences }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }

      const { message } = await res.json();
      toast.success(message)
      console.log(message);
      if (typeof doctorRefetch === 'function') {
        doctorRefetch();
      }
      setShowModal(false);
      
    } catch (error) {
      console.error(error.message);
      toast.error(error.message)
    }
  };

  const handleOpenModal = async () => {
  try {
    // Fetch the latest doctor data, including experiences
    const response = await fetch(`${BASE_URL}/doctors/${doctor._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message);
    }

    const updatedDoctor = await response.json();
    console.log(updatedDoctor,'update doctor')

    // Update the local state with the latest experiences
    setExperiences(updatedDoctor.data.experiences || []);

    // Reset the experience input fields
    setExperience({ fromDate: '', toDate: '', hospitalName: '' });

    // Show the modal
    setShowModal(true);
  } catch (error) {
    console.error(error.message);
  }
};

  useEffect(() => {
    // Log experiences after the modal is shown
    console.log(experiences)
  }, [showModal, experiences]);

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
        onClick={() => {
          setExperience({ fromDate: '', toDate: '', hospitalName: '' });
          handleOpenModal();
        }}
      >
        Add Experience
      </button>
      {showModal && (
        <div key={modalKey} className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <div className="mb-4">
            {experiences.length > 0 && (
                <div className="overflow-y-auto max-h-20 mb-4">
                  <ul>
                    {experiences.map((exp, index) => (
                      <li key={index} className="mb-2">
                        {new Date(exp.fromDate).toLocaleDateString()} to {new Date(exp.toDate).toLocaleDateString()} - {exp.hospitalName}
                        <button
                          className="ml-2 bg-red-500 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline-red"
                          onClick={() => handleRemoveExperience(index)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <label className="block text-sm font-semibold text-gray-700">From Date:</label>
              <input
                className="border border-gray-300 rounded w-full py-2 px-3"
                type="date"
                name="fromDate"
                value={experience.fromDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">To Date:</label>
              <input
                className="border border-gray-300 rounded w-full py-2 px-3"
                type="date"
                name="toDate"
                value={experience.toDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Hospital Name:</label>
              <input
                className="border border-gray-300 rounded w-full py-2 px-3"
                type="text"
                name="hospitalName"
                value={experience.hospitalName}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline-green"
              onClick={handleAddExperience}
            >
              Add
            </button>
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline-blue"
                onClick={handleSaveExperiences}
              >
                Save Experiences
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceAdd;
