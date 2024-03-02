import {useContext,useState,useEffect} from 'react'
import {authContext} from './../../context/AuthContext'
import MyBookingDoctor from './MyBookingDoctor.jsx'
import ProfileDoctor from './ProfileDoctor.jsx'
import useGetProfile from '../../hooks/useFetchDataDoctor.jsx'
import { BASE_URL } from '../../config.js'
import Loading from '../../components/Loader/Loading.jsx'
import Error from '../../components/Error/Error.jsx'
import ExperienceAdd from './ExperienceAdd.jsx'
import AvailabilityAdd from './AvailabilityAdd.jsx'


const Dashboard = () => {
    const {dispatch}=useContext(authContext)
    const [tab,setTab]=useState('settings')
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const userId = user._id;
    console.log(userId)

    const {data:doctorData,loading,error,refetch:doctorRefetch}=useGetProfile(`${BASE_URL}/doctors/profile/me/${userId}`)
    
   
   



    const handleLogout=()=>{
        dispatch({type:'LOGOUT'})
        

        
    }
  return <div className='max-w-[1170px] px-5 mx-auto'>
  {loading && !error && <Loading/>}

  {error && !loading && <Error errMessage={error}/>}
    {!loading && !error && (
        <div className='grid md:grid-cols-3 gap-10'>
    <div className='pb-[50px] px-[30px] rounded-md'>
        <div className='flex items-center justify-center'>
            <figure className='w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor'>
                <img src={doctorData.photo} alt='' className='w-full h-full rounded-full'></img>
            </figure>
        </div>
        <div className='text-center mt-4'>
            <h3 className='text-[18px] leading-[30px] text-headingColor font-bold'>{doctorData.name}</h3>
            <p className='text-textColor text-[15px] leading-6 font-medium'>{doctorData.email}</p>
            {/* <p className='text-textColor text-[15px] leading-6 font-medium'>Blood Type:<span className='ml-2 text-headingColor text-[22px] leading-8'>{doctorData.bloodType}</span></p> */}

        </div>
        <div className='mt-[50px] md:mt-[100px]'>
        <button onClick={handleLogout} className='w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white'>Logout</button>
        <button className='w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white'>Delete Account</button>


        </div>
    </div>
    <div className='md:col-span-2 md:px-4'>
  <div className='mb-8 md:mb-10 flex flex-col md:flex-row items-center justify-between'>
    <button
      onClick={() => setTab('bookings')}
      className={`${
        tab === 'bookings' && 'bg-primaryColor text-white font-normal'
      } mb-4 md:mb-0 md:mr-4 px-3 md:px-4 py-2 md:py-2.5 rounded-md text-headingColor font-semibold text-base md:text-lg leading-6 border border-solid border-primaryColor`}
    >
      My Booking
    </button>
    <button
      onClick={() => setTab('settings')}
      className={`${
        tab === 'settings' && 'bg-primaryColor text-white font-normal'
      } mb-4 md:mb-0 md:mx-4 px-3 md:px-4 py-2 md:py-2.5 rounded-md text-headingColor font-semibold text-base md:text-lg leading-6 border border-solid border-primaryColor`}
    >
      Profile Settings
    </button>
    <button
      onClick={() => setTab('experiences')}
      className={`${
        tab === 'experiences' && 'bg-primaryColor text-white font-normal'
      } mb-4 md:mb-0 md:mr-4 px-3 md:px-4 py-2 md:py-2.5 rounded-md text-headingColor font-semibold text-base md:text-lg leading-6 border border-solid border-primaryColor`}
    >
      Experience Settings
    </button>
    <button
      onClick={() => setTab('slots')}
      className={`${
        tab === 'slots' && 'bg-primaryColor text-white font-normal'
      } px-3 md:px-4 py-2 md:py-2.5 rounded-md text-headingColor font-semibold text-base md:text-lg leading-6 border border-solid border-primaryColor md:ml-4`}
    >
      Slot Settings
    </button>
  </div>
  {tab === 'bookings' && <MyBookingDoctor />}
  {tab === 'settings' && <ProfileDoctor doctor={doctorData} doctorRefetch={doctorRefetch} />}
  {tab === 'experiences' && <ExperienceAdd doctor={doctorData} />}
  {tab === 'slots' && <AvailabilityAdd doctor={doctorData} doctorRefetch={doctorRefetch} />}
</div>
  </div>)
  }

  </div>
   
}

export default Dashboard