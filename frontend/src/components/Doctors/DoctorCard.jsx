import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import starIcon from '../../assets/images/Star.png';

const DoctorCard = ({ doctor }) => {
  console.log(doctor)
  const { name, photo, specialization, _id } = doctor;

  return (
    <div className='p-3 lg:p-5'>
      <div>
        <img src={photo} className='w-full h-[300px] object-cover' alt='' />
      </div>
      <h2 className='text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5'>
        {name}
      </h2>
      <div className='mt-2 lg:mt-4 flex items-center justify-between'>
        <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded'>
          {specialization}
        </span>
        <div className='flex items-center gap-[6px]'></div>
      </div>
      <div className='mt-[18px] lg:mt-5 flex items-center justify-between'>
        <div></div>
        <Link
          to={`/doctorDetails/${_id}`} // Assuming your route requires an 'id' parameter
          className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none'
        >
          <BsArrowRight className='group-hover:text-white w-6 h-5' />
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;