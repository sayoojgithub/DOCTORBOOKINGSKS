import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { authContext } from '../../context/AuthContext';
import DoctorCard from '../../components/Doctors/DoctorCard';
import { BASE_URL, token } from '../../config';
import { toast } from 'react-toastify';

const Doctors = () => {
  const { dispatch } = useContext(authContext);
  const [doctorsList, setDoctorsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const doctorsPerPage = 4;
  const location = useLocation();
  const specialization = new URLSearchParams(location.search).get('specialization'); 

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/doctors/?search=${searchTerm}${specialization ? `&specialization=${specialization}` : ''}`, // Append the specialization parameter if it exists
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 403) {
            handleLogout();
          } else {
            throw new Error('Failed to fetch data');
          }
        }

        const result = await response.json();
        setDoctorsList(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data');
      }
    };

    fetchData();
  }, [searchTerm, specialization]); 

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(doctorsList.length / doctorsPerPage))
    );
  };

  const filteredDoctors = doctorsList.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const slicedDoctors = filteredDoctors.slice(
    (currentPage - 1) * doctorsPerPage,
    currentPage * doctorsPerPage
  );

  return (
    <>
      <section className='bg-[#fff9ea]'>
        <div className='container text-center'>
          <h2 className='heading'>Find a Doctor</h2>
          <div className='max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between'>
            <input
              type='search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor'
              placeholder='Search Doctor'
            />
            <button className='btn mt-0 rounded-[0px] rounded-r-md'>Search</button>
          </div>
        </div>
      </section>
      <section>
        <div className='container'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 '>
            {slicedDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          {/* Pagination controls */}
          <div className='flex justify-center mt-4'>
            <div>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className='btn mr-2'
              >
                Prev
              </button>
              <span>{currentPage}/{Math.ceil(filteredDoctors.length / doctorsPerPage)}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === Math.ceil(filteredDoctors.length / doctorsPerPage)}
                className='btn ml-2'
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Doctors;
