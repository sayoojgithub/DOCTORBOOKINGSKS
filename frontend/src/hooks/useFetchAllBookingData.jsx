import { useState, useEffect } from 'react';

const useFetchAllBookingData = (url,token) => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchValue, setRefetchValue] = useState(false);
  console.log(bookingData)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }
        setBookingData(result.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };

    fetchData();
  }, [url, refetchValue]);

  const refetch = () => {
    setRefetchValue(!refetchValue);
  };

  return {
    bookingData,
    loading,
    error,
    refetch,
  };
};

export default useFetchAllBookingData;
