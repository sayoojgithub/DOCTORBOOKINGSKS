import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { BASE_URL } from '../config.js'
import {useNavigate} from 'react-router-dom'

const FPpassword = () => {
    const [password,setPassword]=useState()
    const [confirmPassword,setConfirmPassword]=useState()
    const [validationError,setValidationError]=useState('')
   
    const navigate=useNavigate()
    const validateForm=()=>{
        if(!password || !confirmPassword){
            setValidationError('Enter the password and confirm it')
            return false
        }
        setValidationError('')
        return true
    }

    const submitHandler=async event=>{
    try {
        event.preventDefault()
        if(!validateForm()){
            return
        }
        const formData = {
            email: localStorage.getItem('email'), 
            password: password,
          };
        if(password==confirmPassword){
            const res=await fetch(`${BASE_URL}/auth/changepassword`,{
                  method:'post',
                  headers:{
                    'Content-Type':'application/json'
                  },
                  body:JSON.stringify(formData)
                })
                const {message}=await res.json()
           if(!res.ok){
            throw new Error(message)
           }
           toast.success(message) 
           navigate('/login')


        }else{
            toast.error('Password and confirm password are not match');

        }
    }catch(err){
        toast.error(err.message)


    }
}



  return (
    <div >
       
    <div className='flex justify-center min-h-screen items-center'>
    <form onSubmit={submitHandler} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h1>

    <div className="mb-6">
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            PASSWORD
        </label>
        <input
            type="password"
            id="otp"
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder="Enter password"
        />
    </div>
    <div className="mb-6">
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            CONFIRM PASSWORD
        </label>
        <input
            type="password"
            id="otp"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder="Confirm Password"
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

export default FPpassword