import { useState, useEffect } from 'react';

const useFetchAllDoctorsData = (url) => {
  const [doctorData, setDoctorData] = useState([]);
  //console.log(doctorData)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchValue,setRefetchValue] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        console.log(res)
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }
        setDoctorData(result.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };

    fetchData();
  }, [url,refetchValue]);
  const refetch = ()=>{
    setRefetchValue(!refetchValue)
  }

  return {
    doctorData,
    loading,
    error,
    refetch
  };
};

export default useFetchAllDoctorsData;