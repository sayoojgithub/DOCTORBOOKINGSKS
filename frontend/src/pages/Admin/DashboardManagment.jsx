import React from 'react'
import { BASE_URL } from '../../config';
import useFetchDataAdmin from '../../hooks/useFetchDataAdmin';
import BookingChart from './Charts/BookingChart'
import BookingPerSpecialization from './Charts/BookingPerSpecialization';
import BookingNumbersAndRevenue from './Charts/BookingNumbersAndRevenue';
import DoctorsPerSpecialization from './Charts/DoctorsPerSpecialization';
import Card from './Card/Card';

const DashboardManagment = () => {
  const { data: dataPerDate } = useFetchDataAdmin(
    `${BASE_URL}/admin/NumberOfBookingPerDay`
  );
   const { data: userscount } = useFetchDataAdmin(
    `${BASE_URL}/admin/NumberOfUsers`
  );
  const { data: doctorcount } = useFetchDataAdmin(
    `${BASE_URL}/admin/NumberOfDoctors`
  );
  const { data: servicecount } = useFetchDataAdmin(
    `${BASE_URL}/admin/NumberOfServices`
  );
  const { data: revenue } = useFetchDataAdmin(
    `${BASE_URL}/admin/revenue`
  );
  const { data: bookingsPerSpecialization } = useFetchDataAdmin(
    `${BASE_URL}/admin/bookingPerSpecialization`
  );
  const {data:doctorsPerSpecialization}=useFetchDataAdmin(
    `${BASE_URL}/admin/doctorsPerSpecialization`

  );
  console.log(doctorsPerSpecialization)
  
  const details1={
    title:'total number of users',
    count:userscount
  }
  const details2={
    title:'total number of doctors',
    count:doctorcount
  }
  const details3={
    title:'total number of services',
    count:servicecount
  }
  const details4={
    title:'total revenue generated',
    count:revenue
  }
  
  
  
  
  return (
    <div className='flex flex-wrap items-center'>
    
    <div className="w-full md:w-1/2 xl:w-2/3 p-4">
        <div className="bg-white p-4 shadow-md rounded-md">
          <h1 className="flex justify-center font-bold text-2xl text-gray-700">
            Booking per Day
          </h1>
          <BookingChart data={dataPerDate} />
        </div>
      </div>
      <div className="w-full md:w-1/2 xl:w-1/3 p-4">
        <div className="flex flex-wrap -m-4">
          <Card data={details1} />
          <Card data={details2} />
          <Card data={details3} />
          <Card data={details4} />


          
        </div>
      </div>
      <div className="w-1/2 p-4 flex items-center justify-center">
        <div className="bg-white p-4 shadow-md rounded-md">
          <h1 className="flex justify-center font-bold text-2xl text-gray-700">
            Booking per Specialization
          </h1>
          <BookingPerSpecialization data={bookingsPerSpecialization} />
        </div>
      </div>
      <div className="w-1/2 p-4 flex items-center justify-center">
        <div className="bg-white p-4 shadow-md rounded-md">
          <h1 className="flex justify-center font-bold text-2xl text-gray-700">
            Booking Numbers and Revenue per Specialisation
          </h1>
          <BookingNumbersAndRevenue data={bookingsPerSpecialization} />
        </div>
      </div>
      <div className="w-full md:w-1/2 p-4 flex items-center justify-center" style={{ marginLeft: "350px" }}>
  <div className="bg-white p-4 shadow-md rounded-md">
    <h1 className="flex justify-center font-bold text-2xl text-gray-700">
      Number of Doctors Per Specialization
    </h1>
    <DoctorsPerSpecialization data={doctorsPerSpecialization} />
  </div>
</div>

      

    </div>
    
    
  )
}

export default DashboardManagment