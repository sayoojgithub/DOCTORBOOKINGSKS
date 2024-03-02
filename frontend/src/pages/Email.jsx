import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../config.js'
import {toast} from 'react-toastify'

const Email = () => {
    const [email,setEmail]=useState()
    const [validationError,setValidationError]=useState('')
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()
   
    const validateForm=()=>{
      if(!email){
        setValidationError('Enter your email first')
        return false
      }
      setValidationError('')
      return true
    }
    const submitHandler=async event=>{
        event.preventDefault()
        if(!validateForm()){
          return
        }

        
    
        setLoading(true)
        try {
          console.log(email)
          const response=await fetch(`${BASE_URL}/auth/fp/otp/${email}`)
          
          
          if (!response.ok) {
            const { message } = await response.json();
            throw new Error(message);
          }
      
          console.log(response)
           const otpData= await response.json()
           const otp=otpData.data
          
          console.log(otp);
          localStorage.setItem('otp',otp)
          email ? localStorage.setItem('email', email) : '';
          setLoading(false)
          
          navigate('/forgotpassword/otp')
          
    
          
        } catch (error) {
          console.log(error)
          toast.error(error.message)
          setLoading(false)
          
        }
      }

  return (
    <div className='bg-[url("./assets/images/istockphoto-1390650720-612x612.jpg")] bg-no-repeat bg-cover bg-blur'>
       
    <div className='flex justify-center min-h-screen items-center'>
    <form onSubmit={submitHandler} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h1>

    <div className="mb-6">
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            EMAIL
        </label>
        <input
            type="text"
            id="otp"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder="Enter Email"
        />
    </div>

    <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
        Submit
    </button>
    {validationError && 
        <p className="text-red-500 font-bold mt-4 text-center ">{validationError}</p>}


   
</form>
    </div>
    
  </div>
  )
}

export default Email