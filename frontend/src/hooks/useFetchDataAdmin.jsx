import { useState, useEffect } from 'react';

const useFetchDataAdmin = (url) => {
    const [data, setData] = useState([]);
    console.log(data)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(url);
                const result = await res.json();
                console.log(result)

                if (res.ok) {
                    setData(result.data);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        };

        fetchData();
    }, [url]); 

    return {
        data,
        loading,
        error
    };
};

export default useFetchDataAdmin;
