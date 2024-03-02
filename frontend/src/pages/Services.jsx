import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';
import ServiceCard from '../components/Services/ServiceCard';

const Service = () => {
  const [services, setServices] = useState([]);
  console.log(services);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Make a GET request to fetch services from the backend
        const response = await fetch(`${BASE_URL}/admin/getServices`);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        // Parse the JSON response
        const data = await response.json();
       
        
        // Set the fetched services to the state
        setServices(data.services);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]'>
      {services.map((item, index) => (
        <ServiceCard item={item} index={index} key={index} />
      ))}
    </div>
  );
};

export default Service;
