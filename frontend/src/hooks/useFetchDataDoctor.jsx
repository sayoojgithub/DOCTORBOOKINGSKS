import {useState,useEffect,useContext} from 'react'
import { authContext } from '../context/AuthContext'
import { token } from '../config'
console.log(token)


const useFetchDataDoctor = (url) => {
    const [data,setData]=useState([])
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [refetchvalue,setRefetchValue]=useState(false)
    const {dispatch}=useContext(authContext)
    const handleLogout=()=>{
    dispatch({type:'LOGOUT'})
    
    }

    useEffect(()=>{
        const fetchData=async()=>{
            setLoading(true)
          try {
            const res=await fetch(url,{
                headers:{Authorization:`Bearer ${token}`}
            })
            const result=await res.json()

            if (!res.ok) {
              console.log('okkk')
              if (res.status === 403) {
                console.log('status403')
                // User is blocked, perform logout
                handleLogout();
              } else {
                throw new Error(result.message);
              }
            }
            setData(result.data)
            setLoading(false)
            
          } catch (error) {
            setLoading(false)
            setError(error.message)
            
          }
        }
        fetchData()
    },[token,url,refetchvalue])
    const refetch=()=>{
      setRefetchValue(!refetchvalue)
    }
  return {
    data,loading,error,refetch
  }
  
}


export default useFetchDataDoctor