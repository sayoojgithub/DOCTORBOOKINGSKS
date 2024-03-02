import React, { useState } from 'react';

const BookingManagement = ({ bookings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 h-screen-full bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 md:grid-cols-4 gap-4 w-full pt-3">
        {/* Left side (1/3 width) */}
        <div className="col-span-1 flex flex-col justify-start bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 p-6 rounded-md shadow-md">
          <button className="w-full text-left font-bold py-3 px-14 bg-transparent text-black rounded-md mb-2 hover:bg-slate-500 focus:outline-none focus:ring focus:border-blue-700 transition duration-300 ease-in-out">
            Dashboard
          </button>
        </div>

        {/* Right side (2/3 width) */}
        <div className="col-span-3">
          <section className="container">
            <div className="relative mx-5 overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-slate-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Sl.No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Patient Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Doctor Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Booked By
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Slot
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fee
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Cancel Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings && currentBookings.length > 0 ? (
                    currentBookings.map((booking, index) => (
                      <tr className="bg-white border-b hover:bg-[#e8e8ff]" key={booking._id}>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">{booking.bookedFor}</td>
                        <td className="px-6 py-4">{booking.doctorId.name}</td>
                        <td className="px-6 py-4">{booking.patientId.name}</td>
                        <td className="px-6 py-4">{booking.slot}</td>
                        <td className="px-6 py-4">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{booking.fee}</td>
                        <td className="px-6 py-4">
                          {booking.cancelStatus ? 'Cancelled' : 'Not Cancelled'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white border-b hover:bg-gray-100">
                      <td colSpan={8} className="px-6 py-4 font-medium text-center text-gray-900">
                        No bookings Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center my-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 font-semibold text-white bg-blue-500 border border-blue-500 rounded-md mr-2 hover:bg-blue-700 hover:text-white hover:border-transparent"
              >
                Prev
              </button>
              <span className='text-lg font-semibold'>{currentPage}</span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastBooking >= bookings.length}
                className="px-4 py-2 font-semibold text-white bg-blue-500 border border-blue-500 rounded-md ml-2 hover:bg-blue-700 hover:text-white hover:border-transparent"
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
