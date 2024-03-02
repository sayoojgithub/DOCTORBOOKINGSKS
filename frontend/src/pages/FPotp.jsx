import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../config';

const FPotp = () => {
    const [otp, setOtp] = useState('');
    const [validationError, setValidationError] = useState('');
    const [timer, setTimer] = useState(20);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!otp) {
            setValidationError('Enter the OTP first');
            return false;
        }
        setValidationError('');
        return true;
    };

    const submitHandler = async event => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }
        const storedOtp = localStorage.getItem('otp');

        if (otp === storedOtp) {
            navigate('/forgotpassword/password');
        } else {
            toast.error('Invalid OTP. Please try again.');
        }
    };

    const resendOtpHandler = async () => {
        const formData = JSON.parse(localStorage.getItem('registerform'));

        // Extract the email from the formData
        const email = formData.email;

        try {
            // Make a fetch request to resend OTP
            const res = await fetch(`${BASE_URL}/auth/otp:${email}`);
            const otpData = await res.json();
            const newOtp = otpData.data;

            localStorage.setItem('otp', newOtp);

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            toast.success('OTP resent successfully');
            
            // Reset timer
            setTimer(20);
        } catch (error) {
            toast.error(error.message || 'An error occurred while resending OTP');
        }
    };

    useEffect(() => {
        let interval;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timer]);

    return (
        <div className='bg-[url("./assets/images/istockphoto-1390650720-612x612.jpg")] bg-no-repeat bg-cover bg-blur'>
            <div className='flex justify-center min-h-screen items-center'>
                <form onSubmit={submitHandler} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h1>

                    <div className="mb-6">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                            OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter OTP"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Submit
                    </button>

                    <div className='mt-4 text-center'>
                        {timer > 0 ? (
                            <p className={`text-${timer === 1 ? 'red' : 'black'}`}>Enter OTP in {timer} seconds</p>
                        ) : (
                            <span onClick={resendOtpHandler} className='text-blue-500 cursor-pointer hover:underline'>
                                Resend OTP
                            </span>
                        )}
                    </div>

                    {validationError && 
                        <p className="text-red-500 font-bold mt-4 text-center ">{validationError}</p>}
                </form>
            </div>
        </div>
    );
};

export default FPotp;
