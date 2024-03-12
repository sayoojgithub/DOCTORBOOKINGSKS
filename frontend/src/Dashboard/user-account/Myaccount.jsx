import {useContext,useState,useEffect} from 'react'
import {authContext} from './../../context/AuthContext'
import MyBooking from './MyBooking'
import Profile from './Profile'
import AddFriendsForm from './AddFriendsForm.jsx'
import WalletHistory from './WalletHistory.jsx'
import useGetProfile from '../../hooks/useFetchData'
import { BASE_URL } from '../../config'
import Loading from '../../components/Loader/Loading.jsx'
import Error from '../../components/Error/Error.jsx'

const Myaccount = () => {
    const {dispatch}=useContext(authContext)
    const [tab,setTab]=useState('settings')
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const userId = user._id;
    console.log(userId)
    const {data:userData,loading,error}=useGetProfile(`${BASE_URL}/users/profile/me/${userId}`)
    console.log(userData._id)
    
    
    




    const handleLogout=()=>{
        dispatch({type:'LOGOUT'})
        
       
        
        
    }
  return <div className='max-w-[1170px] px-5 mx-auto'>
  {loading && !error && <Loading/>}

  {error && !loading && <Error errMessage={error}/>}
    {!loading && !error && (
        <div className='grid md:grid-cols-3 gap-10'>
    <div className='pb-[50px] px-[30px] rounded-md'>
        <div className='flex items-center justify-center mt-[130px]'>
            <figure className='w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor'>
                <img src={userData.photo} alt='' className='w-full h-full rounded-full'></img>
            </figure>
        </div>
        <div className='text-center mt-4'>
            <h3 className='text-[30px] leading-[30px] text-headingColor font-bold'>{userData.name}</h3>
            <p className='text-textColor text-[15px] leading-6 font-medium'>{userData.email}</p>
            <p className='text-textColor text-[20px] leading-6 font-medium'>Blood Type:<span className='ml-2 text-headingColor text-[22px] leading-8'>{userData.bloodType}</span></p>

        </div>
        <div className='mt-[50px] md:mt-[20px]' >
        <button onClick={handleLogout} className='w-full bg-[#181A1E] p-5 text-[16px] leading-7 rounded-md text-white'>Logout</button>
        {/* <button className='w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white'>Delete Account</button> */}


        </div>
    </div>
    <div className='md:col-span-2 md:px-[30px]'>
    <div className="flex flex-col md:flex-row md:space-x-4">
        <button onClick={() => setTab('bookings')} className={`mb-2 md:mb-0 ${tab === 'bookings' && 'bg-primaryColor text-white font-normal'} p-2 md:mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}>My Booking</button>
        <button onClick={() => setTab('settings')} className={`mb-2 md:mb-0 ${tab === 'settings' && 'bg-primaryColor text-white font-normal'} mb-2 md:mb-0 py-2 md:px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}>Profile Settings</button>
        <button onClick={() => setTab('addFriends')} className={`mb-2 md:mb-0 ${tab === 'addFriends' && 'bg-primaryColor text-white font-normal'} mb-2 md:mb-0 py-2 md:px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}>Add Friends/Relatives</button>
        <button onClick={() => setTab('wallethistory')} className={`mb-2 md:mb-0 ${tab === 'wallethistory' && 'bg-primaryColor text-white font-normal'} mb-2 md:mb-0 py-2 md:px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}>Wallet History</button>

    </div>
    <div className="mt-4 md:mt-0">
        {tab === 'bookings' && <MyBooking />}
        {tab === 'settings' && <Profile user={userData} />}
        {tab === 'addFriends' && <AddFriendsForm user={userData} />}
        {tab === 'wallethistory' && <WalletHistory userId={userData._id} />}
    </div>
</div>

  </div>)
  }

  </div>
   
}

export default Myaccount