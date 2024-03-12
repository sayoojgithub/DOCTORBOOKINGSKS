import React, { useState,useContext } from 'react';
import UserManagment from './UserManagment';
import DoctorManagment from './DoctorManagment';
import BookingManagement from './BookingManagment';
import ServiceManagment from './ServiceManagment';
import { BASE_URL,token } from '../../config.js';
import useGetAllUsers from '../../hooks/useFetchAllUsersData.jsx';
import useGetAllDoctors from '../../hooks/useFetchAllDoctorsData.jsx';
import useGetAllBookings from '../../hooks/useFetchAllBookingData.jsx';
import DashboardManagment from './DashboardManagment.jsx';
import { authContext } from '../../context/AuthContext.jsx';


const AdminDashboard = () => {
  const {dispatch}=useContext(authContext)
  const [activeTab, setActiveTab] = useState('users');
  const { userData: usersData, refetch: userRefetch } = useGetAllUsers(`${BASE_URL}/admin/allUsers`,token);
  const { doctorData: doctorsData, refetch: doctorRefetch } = useGetAllDoctors(`${BASE_URL}/admin/allDoctors`,token);
  const { bookingData: bookingData } = useGetAllBookings(`${BASE_URL}/admin/allBookings`,token);



  const handleLogout=()=>{
    dispatch({type:'LOGOUT'})
    
}

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <div className="space-x-4 flex items-center">
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users' ? 'bg-gray-500 text-white' : ''
            } px-4 py-2 rounded-md text-lg font-semibold border border-solid border-gray-500 focus:outline-none flex items-center`}
          >
            <span role="img" aria-label="Users" className="mr-2">
              👥
            </span>
            Users
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`${
              activeTab === 'doctors' ? 'bg-gray-500 text-white' : ''
            } px-4 py-2 rounded-md text-lg font-semibold border border-solid border-gray-500 focus:outline-none flex items-center`}
          >
            <span role="img" aria-label="Doctors" className="mr-2">
              👨‍⚕️
            </span>
            Doctors
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`${
              activeTab === 'bookings' ? 'bg-gray-500 text-white' : ''
            } px-4 py-2 rounded-md text-lg font-semibold border border-solid border-gray-500 focus:outline-none flex items-center`}
          >
            <span role="img" aria-label="Bookings" className="mr-2">
              📅
            </span>
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`${
              activeTab === 'services' ? 'bg-gray-500 text-white' : ''
            } px-4 py-2 rounded-md text-lg font-semibold border border-solid border-gray-500 focus:outline-none flex items-center`}
          >
            <span role="img" aria-label="Services" className="mr-2">
              🩺
            </span>
            Services
          </button>
          <button
          onClick={() => setActiveTab('analytics')}
          className={`${
          activeTab === 'analytics' ? 'bg-gray-500 text-white' : ''
          } px-4 py-2 rounded-md text-lg font-semibold border border-solid border-gray-500 focus:outline-none flex items-center`}
            >
           <span role="img" aria-label="Analytics" className="mr-2">
           📊
            </span>
          Analytics
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md text-lg font-semibold border border-solid border-gray-500 focus:outline-none flex items-center bg-red-500 text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="border-t">
        {activeTab === 'users' && <UserManagment users={usersData} userRefetch={userRefetch} />}
        {activeTab === 'doctors' && <DoctorManagment doctors={doctorsData} doctorRefetch={doctorRefetch} />}
        {activeTab === 'bookings' && <BookingManagement bookings={bookingData} />}
        {activeTab === 'services' && <ServiceManagment />}
        {activeTab === 'analytics' && <DashboardManagment />}


      </div>
    </div>
  );
};

export default AdminDashboard;
