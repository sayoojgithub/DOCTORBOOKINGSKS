import { useState, useEffect } from 'react';

const usehandleBlock = (url) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }
        setMessage(result.message);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };

    fetchData();
  }, [url]);

  return {
    message,
    loading,
    error,
  };
};

export default usehandleBlock;