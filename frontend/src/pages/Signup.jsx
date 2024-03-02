import  { useState } from 'react'
import signupImg from '../assets/images/signup.gif'
import {Link,json,useNavigate} from 'react-router-dom'
import uploadImageToCloudinary from '../Utils/uploadCloudinary.js'
import { BASE_URL } from '../config.js'
import {toast} from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader'
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


const Signup = () => {
  const [selectedFile,setSelectedFile]=useState(null)
 
  const [previewURL,setPreviewURL]=useState('')
  const [loading,setLoading]=useState(false)
  const [validationError,setValidationError]=useState('')
  const [progress, setProgress] = useState(0);

  const [formData,setFormData]=useState({
    name:'',
    email:'',
    password:'',
    photo:'',
    gender:'',
    role:'patient'


  })
  const navigate=useNavigate()
  const handleInputChange=e=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
  
    try {
      setLoading(true);
  
      await uploadImageToCloudinary(file, (progress) => {
        setProgress(progress);  // Update the progress state
      }).then((data) => {
        setPreviewURL(data.url);
        setSelectedFile(data.url);
        setFormData({ ...formData, photo: data.url });
      });
  
      setLoading(false);
      setProgress(0); // Reset progress after successful upload
    } catch (error) {
      console.error(error);
      setLoading(false);
      setProgress(0); // Reset progress on error
      // Handle any errors that occur during the upload process
    }
  };
  
  
  const validateForm = () => {
    const { name, email, password,photo,gender,role } = formData;
    console.log(photo)
  
    if (!name || !email  || !password || !photo || !gender || !role) {
      setValidationError("please fill all the fields for successfull registration");
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
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/.test(password)) {
      setValidationError("Password must contain one uppercase letter, one lowercase letter, one number, and one special character, with a minimum length of 6");
      return false;
    }
  
    setValidationError(""); // Reset validation error if all validations pass
    return true; // All validations passed
  };



  const submitHandler=async event=>{
    console.log(formData)
    
    
    event.preventDefault()
    if (!validateForm()) {
      return;
    }

    setLoading(true)
    try {
      localStorage.setItem('registerform',JSON.stringify(formData))
      console.log(formData.email)
      const response=await fetch(`${BASE_URL}/auth/otp:${formData.email}`)
      console.log(response)
       const otpData= await response.json()
       const otp=otpData.data
      
      console.log(otp);
      localStorage.setItem('otp',otp)
      navigate('/otp')
      // const res=await fetch(`${BASE_URL}/auth/register`,{
      //   method:'post',
      //   headers:{
      //     'Content-Type':'application/json'
      //   },
      //   body:JSON.stringify(formData)
      // })
      // const {message}=await res.json()
      // if(!res.ok){
      //   throw new Error(message)
      // }
      // setLoading(false)
      // toast.success(message) 
      // navigate('/login')

      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      setLoading(false)
      
    }
  }



  return <section className='px-5 xl:px-0'>
  <div className='max-w-[1170px] mx-auto'>
    <div className='grid grid-cols-1 lg:grid-cols-2'>
      {/*img box*/}
      <div className='hidden lg:block bg-primaryColor rounded-l-lg'>
        <figire classNamerounded-l-lg>
          <img src={signupImg} alt='' className='w-full rounded-l-lg'/>
        </figire>
      </div>
      {/*signup form*/}
      <div className='rounded-l-lg lg:pl-16 py-10'>
        <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10'>Create an <span className='text-primaryColor'>account</span></h3>

     <form onSubmit={submitHandler}>
        <div className='mb-5'>
      <input type='text' placeholder='Full Name' name='name' value={formData.name} onChange={handleInputChange} className='w-full pr-4  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
       focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer'
        
       />
    </div>
    <div className='mb-5'>
      <input type='email' placeholder='Enter your email' name='email' value={formData.email} onChange={handleInputChange}  className='w-full pr-4  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
       focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer'
        
       />
    </div>
    <div className='mb-5'>
      <input type='password' placeholder='Password' name='password' value={formData.password} onChange={handleInputChange}  className='w-full pr-4  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
       focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer'
        
       />
    </div>
    <div className='mb-5 flex items-center justify-between'> 
      <label htmlFor='' className='text-headingColor font-bold text-[16px] leading-7'>
        Are you a:
        <select name='role' value={formData.role} onChange={handleInputChange} className='text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none'>
          <option value='patient'>Patient</option>
          <option value='doctor'>Doctor</option>
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
        {selectedFile && (
          <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
            <img src={previewURL} alt="" className="w-full rounded-full" />
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
    <div className='mt-7'>
    <button disabled={loading && true} type='submit' className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 '>{ loading ? (<HashLoader size={35} color='#ffffff'/>) :( 'Sign Up')}</button>

    </div>
{/* <div className="max-w-md mx-auto mt-4 p-2 bg-white rounded-md shadow-md">
  <GoogleOAuthProvider clientId="506934061043-c6ibkaemfa612nr67qn8gk98gq5i5d04.apps.googleusercontent.com">
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        console.log(decoded);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  </GoogleOAuthProvider>
</div> */}
    <p className='mt-5 text-textColor text-center'>Already have an account?<Link to='/login' className='text-primaryColor font-medium ml-1'>Login</Link></p>
    {validationError && 
        <p className="text-red-500 font-bold mt-4 text-center ">{validationError}</p>}


          
   </form>

      </div>
    </div>
  </div>

  </section>
   
}

export default Signup