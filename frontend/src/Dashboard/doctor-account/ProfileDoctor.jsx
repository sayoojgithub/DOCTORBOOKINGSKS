import React, { useEffect,useContext } from 'react'
import { authContext } from '../../context/AuthContext'
import  { useState } from 'react'
import {json,useNavigate} from 'react-router-dom'
import uploadImageToCloudinary from '../../Utils/uploadCloudinary'
import { BASE_URL,token } from '../../config'
import {toast} from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader'












const ProfileDoctor = ({doctor,doctorRefetch}) => {
  console.log(doctor)





    const [selectedFile,setSelectedFile]=useState(null)
    const [previewURL,setPreviewURL]=useState('')
    const [loading,setLoading]=useState(false)
    const [validationError,setValidationError]=useState('')
    const [progress, setProgress] = useState(0);
    const [services, setServices] = useState([]);
    console.log(services)

    
  
    const [formData,setFormData]=useState({
      name:'',
      email:'',
      password:'',
      qualification:'',
      fee:'',
      hospital:'',
      specialization:'',
     
      gender:'',

      photo:null,
      certificatephoto:null,
      

      
    
      
      
  
    })
    const {dispatch}=useContext(authContext)
    const handleLogout=()=>{
    dispatch({type:'LOGOUT'})
    
    }
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
    useEffect(()=>{
      setFormData({name:doctor.name, email:doctor.email,password:doctor.password,photo:doctor.photo,gender:doctor.gender,qualification:doctor.qualification,fee:doctor.fee,hospital:doctor.hospital,certificatephoto:doctor.certificatephoto,specialization:doctor.specialization})
  
    },[doctor])
    const navigate=useNavigate()
    const handleInputChange=e=>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleFileInputChange = async (event) => {
      const file = event.target.files[0];
    
      try {
        setLoading(true);
    
        await uploadImageToCloudinary(file, (progress) => {
          setProgress(progress);  
        }).then((data) => {
          
          setFormData({ ...formData, photo: data.url }); 
        });
    
        setLoading(false);
        setProgress(0); 
      } catch (error) {
        console.error(error);
        setLoading(false);
        setProgress(0); 
       
      }
    };
    const handleFileInputChange1=async (event)=>{

      const file = event.target.files[0];
    
      try {
        setLoading(true);
    
        await uploadImageToCloudinary(file, (progress) => {
          setProgress(progress);  
        }).then((data) => {
          
          setFormData({ ...formData, certificatephoto: data.url }); 
        });
    
        setLoading(false);
        setProgress(0); 
      } catch (error) {
        console.error(error);
        setLoading(false);
        setProgress(0); 
       
      }
  
      
  
    }
    const validateForm = () => {
      const { name, email, qualification,fee,hospital,specialization,photo, gender, certificatephoto } = formData;
      console.log(formData)
    
      if (!name || !email || !qualification || !fee || !hospital|| !specialization|| !photo || !gender || !certificatephoto) {
        setValidationError("Please fill in all the fields for successful updation");
        return false;
      }
    
      // Validate name
      if (!/^[a-zA-Z\s]{1,25}$/.test(name)) {
        setValidationError("Name must not contain any number and have a maximum of 25 characters");
        return false;
      }
    
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setValidationError("Invalid email address");
        return false;
      }
    
      
    
      // Validate password
      // if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/.test(password)) {
      //   setValidationError("Password must contain one uppercase letter, one lowercase letter, one number, and one special character, with a minimum length of 8");
      //   return false;
      // }
       // Validate fee 
       if (!/^\d+(\.\d{1,2})?$/.test(fee) || parseFloat(fee) <= 0) {
        setValidationError("Invalid fee amount. Please enter a valid positive number.");
        return false;
  }
    
      setValidationError(""); // Reset validation error if all validations pass
      return true; // All validations passed
    };




    const submitHandler=async event=>{
        console.log(formData)
        
        event.preventDefault()
        if(!validateForm()){
          return
        }
        
    
        setLoading(true)
        try {
          const res=await fetch(`${BASE_URL}/doctors/${doctor._id}`,{
            method:'put',
            headers:{
              'Content-Type':'application/json',
              Authorization:`Bearer ${token}`
    
            },
            body:JSON.stringify(formData)
          })
          const {message}=await res.json()
          if (!res.ok) {
            if (res.status === 403) {
              // User is blocked, perform logout
              handleLogout();
            } else {
              throw new Error(message);
            }
          }
          setLoading(false)
          toast.success(message) 
          navigate('/doctors/profile/me')
    
          
        } catch (error) {
          console.log(error)
          toast.error(error.message)
          setLoading(false)
          
        }
        doctorRefetch()

      }
  return (
    <div>
        <form onSubmit={submitHandler}>
        <div className='mb-3'>
      <input type='text' placeholder='Full Name' name='name' value={formData.name} onChange={handleInputChange} className='w-full pr-4  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
       focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer'
        
       />
    </div>
    <div className='mb-3'>
      <input type='email' placeholder='Enter your email' name='email' value={formData.email} onChange={handleInputChange}  className='w-full pr-4  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
       focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer'
        
       />
    </div>
    {/* <div className='mb-3'>
      <input type='password' placeholder='Password' name='password' value={formData.password} onChange={handleInputChange}  className='w-full pr-4  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
       focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer'
        
       />
    </div> */}
    <div className='mb-3'>
      <input type='text' placeholder='Qualification' name='qualification' value={formData.qualification} onChange={handleInputChange} className='w-full pr-4  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
       focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer'
        
       />
    </div>
    <div className='mb-3 flex items-center gap-3'>
  {formData.certificatephoto && (
    <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center'>
      <img src={formData.certificatephoto} alt='' className='w-full rounded-full' />
    </figure>
  )}
  <div className='relative w-[130px] h-[50px]'>
    <input
      type='file'
      name='certificatephoto'
      id='customFileCertificate'
      onChange={handleFileInputChange1}
      accept='.jpg,.png'
      className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
    />
    <label
      htmlFor='customFileCertificate'
      className='absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer'
    >
      add Certificate
    </label>
  </div>
  {loading && (
    <div className='flex items-center'>
      <HashLoader size={20} color='#007bff' />
      <span className='ml-2'>Uploading... {progress.toFixed(2)}%</span>
    </div>
  )}
</div>
    <div className='mb-5'>
      <input type='number' placeholder='Consultation Fee' name='fee' value={formData.fee} onChange={handleInputChange} className='w-full pr-4  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
       focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer'
        
       />
    </div>
    <div className='mb-5'>
      <input type='text' placeholder='Hospital Name' name='hospital' value={formData.hospital} onChange={handleInputChange} className='w-full pr-4  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
       focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer'
        
       />
    </div>
    
    <div className='mb-5 flex items-center justify-between'> 
      <label htmlFor='' className='text-headingColor font-bold text-[16px] leading-7'>
      specialization:
      <select
       name="specialization"
       value={formData.specialization}
       onChange={handleInputChange}
       className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
>
       <option value="">Select</option>
       {services.map(service => (
       <option key={service._id} value={service.serviceName}>
       {service.serviceName}
      </option>
      ))}
      </select>
      </label>
      <label  className='text-headingColor font-bold text-[16px] leading-7'>
        Gender:
        <select name='gender' value={formData.gender} onChange={handleInputChange} className='text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none'>
          <option value=''>Select</option>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
          <option value='other'>Other</option>


        </select>
      </label>
    </div>


    <div className="mb-5 flex items-center gap-3">
  {formData.photo && (
    <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
      <img src={formData.photo} alt="" className="w-full rounded-full" />
    </figure>
  )}
  <div className="relative w-[130px] h-[50px]">
    <input
      type="file"
      name="photo"
      id="customFile"
      onChange={handleFileInputChange}
      accept=".jpg,.png"
      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
    />
    <label
      htmlFor="customFile"
      className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
    >
      Upload Photo
    </label>
  </div>
  {loading && (
    <div className="flex items-center">
      <HashLoader size={20} color="#007bff" />
      <span className="ml-2">Uploading... {progress.toFixed(2)}%</span>
    </div>
  )}
</div>
    <div className='mt-5'>
    <button disabled={loading && true} type='submit' className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 '>{ loading ? (<HashLoader size={35} color='#ffffff'/>) :( 'Update')}</button>

    </div>
    


    {validationError && 
        <p className="text-red-500 font-bold mt-4 text-center ">{validationError}</p>}
   </form>
    </div>
  )
}

export default ProfileDoctor