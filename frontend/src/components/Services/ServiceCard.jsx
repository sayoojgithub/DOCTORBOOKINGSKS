import React from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const ServiceCard = ({ item, index }) => {
  const {  serviceName, serviceDescription } = item;

  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      <h2 className='text-xl font-semibold text-gray-800'>{serviceName}</h2>
      <p className='text-gray-600 mt-2'>{serviceDescription}</p>
      <div className='flex items-center justify-between mt-4'>
        <Link
          to={`/doctors?specialization=${serviceName}`} 
          className='flex items-center justify-center bg-primaryColor text-white rounded-full w-12 h-12 hover:bg-primaryColorLight transition duration-300'
        >
          <BsArrowRight className='w-6 h-6' />
        </Link>
        <span className='bg-gray-200 text-gray-800 rounded-full w-12 h-12 flex items-center justify-center'>
          {index + 1}
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;
