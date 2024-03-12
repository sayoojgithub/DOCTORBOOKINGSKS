import React, { useState,useContext } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { BASE_URL } from '../config'
import {toast} from 'react-toastify'
import {authContext} from '../context/AuthContext.jsx'
import HashLoader from 'react-spinners/HashLoader'

const Login = () => {
  const [formData,setFormData]=useState({
    email:'',
    password:''
  })
  const [loading,setLoading]=useState(false)
  const [validationError,setValidationError]=useState('')

  const navigate=useNavigate()
  const{dispatch}=useContext(authContext)



  const handleInputChange=e=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const validateForm=()=>{
    const {email,password}=formData
    if(!email || !password){
      setValidationError('You have to enter both email and password')
      return false
    }
    setValidationError('')
    return true

  }
  const submitHandler=async event=>{
    console.log(formData)
    
    event.preventDefault()
    if(!validateForm()){
      return
    }
    setLoading(true)
    try {
      const res=await fetch(`${BASE_URL}/auth/login`,{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })
      const result=await res.json()
      if(!res.ok){
        throw new Error(result.message)
      }
      dispatch({
        type:'LOGIN_SUCCESS',
        payload:{
          user:result.data,
          token:result.token,
          role:result.data.role
        },
      });
      
      console.log(result.data,'login data')
      console.log(result.token,'login token')
      console.log(result.data.role,'login role')
      setLoading(false)
      toast.success(result.message) 
      
      navigate('/home')
     
      

      
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
      
    }
  }




  return <section className='px-5 lg:px-0'>
  <div className='w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10'>
  <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10'>Hello! <span
  className='text-primaryColor'>Welcome</span> Back</h3>
  <form className='py-4 md:py-0'onSubmit={submitHandler}>
    <div className='mb-5'>
      <input type='email' placeholder='Enter Your Email' name='email' value={formData.email} onChange={handleInputChange} className='w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
       focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer'
        
       />
    </div>
    <div className='mb-5'>
      <input type='password' placeholder='Password' name='password' value={formData.password} onChange={handleInputChange} className='w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
       focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer'
        
       />
    </div>
    <div className='mt-7'>
    <button type='submit' className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 '>{loading ?<HashLoader size={25} color='#fff'/> : 'Login'}</button>

    </div>
    <p className='mt-5 text-textColor text-center'>Dont have an account?<Link to='/register' className='text-primaryColor font-medium ml-1'>Register</Link></p>
    <p className='mt-5 text-textColor text-center'>Dont you remember password?<Link to='/forgotPassword/email' className='text-primaryColor font-medium ml-1'>Forgot Password</Link></p>
    {validationError && 
        <p className="text-red-500 font-bold mt-4 text-center ">{validationError}</p>}
  </form>

  </div>

  </section>
}

export default Login