import React, { useState } from 'react';
import { BASE_URL, token } from '../../config';

const DoctorManagement = ({ doctors, doctorRefetch }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(10);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const handleBlock = async (doctorId) => {
    setSelectedDoctorId(doctorId);
    setShowConfirmation(true);
  };

  const handleApproval = async (doctorId) => {
    const res = await fetch(`${BASE_URL}/admin/handleApproval/${doctorId}`, {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    doctorRefetch();
  };

  const confirmBlock = async () => {
    const res = await fetch(`${BASE_URL}/admin/handleblockDoctor/${selectedDoctorId}`, {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    doctorRefetch();
    setShowConfirmation(false);
  };

  const cancelBlock = () => {
    setShowConfirmation(false);
  };

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelect = async (doctorId) => {
    // Check if the doctor is already approved
    const doctor = doctors.find((doc) => doc._id === doctorId);
    if (doctor && !doctor.certificateApprove) {
      await handleApproval(doctorId);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      {/* Navbar Component */}
      {/* Assuming there's a component named Navbar */}

      <div className='grid grid-cols-1 h-screen-full bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 md:grid-cols-4 gap-4 w-full pt-3'>
        {/* Left side (1/3 width) */}
        <div className='col-span-1 flex flex-col justify-start bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 p-6 rounded-md shadow-md '>
          <button className='w-full text-left font-bold py-3 px-14 bg-transparent text-black rounded-md mb-2 hover:bg-slate-500 focus:outline-none focus:ring focus:border-blue-700 transition duration-300 ease-in-out'>
            Dashboard
          </button>
        </div>

        {/* Right side (2/3 width) */}
        <div className='col-span-3 '>
          <section className='container'>
            <div className='relative mx-5 overflow-x-auto shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-slate-400'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      Sl.No
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Name
                    </th>

                    <th scope='col' className='px-6 py-3'>
                      Email
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Certificate
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Approving options
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Options
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentDoctors && currentDoctors.length > 0 ? (
                    currentDoctors.map((doctor, index) => (
                      <tr className='bg-white border-b hover:bg-[#e8e8ff]' key={doctor._id}>
                        <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                          {index + 1}
                        </th>
                        <td className='px-6 py-4'>{doctor.name}</td>

                        <td className='px-6 py-4'>{doctor.email}</td>
                        <td className='px-6 py-4'>
                          {/* Profile Image */}
                          {doctor.certificatephoto && (
                            <img
                              src={doctor.certificatephoto}
                              alt='Certificate'
                              className='h-12 w-12 rounded-full object-cover transition-transform transform hover:scale-110'
                            />
                          )}
                        </td>
                        <td className='px-6 py-4'>
                          {doctor.certificateApprove ? (
                            <span className='text-green-500 font-semibold bg-green-100 px-2 py-1 rounded'>Selected</span>
                          ) : (
                            <button
                              onClick={() => handleSelect(doctor._id)}
                              className='px-4 py-2 font-semibold text-white bg-green-500 border border-yellow-500 rounded hover:bg-yellow-500 hover:text-white hover:border-transparent'
                              disabled={doctor.certificateApprove}>
                              Select
                            </button>
                          )}
                        </td>
                        <td className='px-6 py-4'>
                          {doctor.isBlocked ? (
                            <button
                              onClick={() => handleBlock(doctor._id)}
                              className='px-4 py-2 font-semibold text-white bg-green-500 border border-yellow-500 rounded hover:bg-yellow-500 hover:text-white hover:border-transparent'>
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(doctor._id)}
                              className='px-4 py-2 font-semibold text-white bg-red-500 border border-red-500 rounded hover:bg-red-800 hover:text-white hover:border-transparent'>
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className='bg-white border-b hover:bg-gray-100'>
                      <td colSpan={5} className='px-6 py-4 font-medium text-center text-gray-900'>
                        No users Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination */}
              <div className='flex justify-center items-center mt-4'>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='px-4 py-2 font-semibold text-white bg-blue-500 border border-blue-500 rounded-md mr-2 hover:bg-blue-700 hover:text-white hover:border-transparent'>
                  Prev
                </button>
                <span className='text-lg font-semibold'>{currentPage}</span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastDoctor >= doctors.length}
                  className='px-4 py-2 font-semibold text-white bg-blue-500 border border-blue-500 rounded-md ml-2 hover:bg-blue-700 hover:text-white hover:border-transparent'>
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-5 rounded-md shadow-md">
            <p className='text-white'>Are you sure you want to proceed?</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={confirmBlock}
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
              >
                Confirm
              </button>
              <button
                onClick={cancelBlock}
                className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
