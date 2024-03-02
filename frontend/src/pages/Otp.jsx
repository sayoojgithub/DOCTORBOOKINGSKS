import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../config.js';

const Otp = () => {
    const [otp, setOtp] = useState('');
    const [validationError, setValidationError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(20);

    const validateForm = () => {
        if (!otp) {
            setValidationError('Enter the otp first');
            return false;
        }
        setValidationError('');
        return true;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const otp1 = localStorage.getItem('otp');
        console.log(otp1);
        console.log(otp);
        if (otp1 !== otp) {
            toast.error('invalid otp');
            return;
        }
        const formdata1 = localStorage.getItem('registerform');
        const formData = JSON.parse(formdata1);
        console.log(formData);
        try {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const { message } = await res.json();

            if (!res.ok) {
                throw new Error(message);
            }

            setLoading(false);
            toast.success(message);
            navigate('/login');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const resendOtpHandler = async () => {
        const formData = JSON.parse(localStorage.getItem('registerform'));

        // Get the email from the formData
        const email = formData.email;

        try {
            // Example: Make a fetch request to resend OTP
            const res = await fetch(`${BASE_URL}/auth/otp:${email}`);
            const otpData = await res.json();
            const otp = otpData.data;

            console.log(otp);
            localStorage.setItem('otp', otp);

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
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timer]);

    return (
        <div className='bg-[url("./assets/images/istockphoto-1390650720-612x612.jpg")] bg-no-repeat bg-cover bg-blur'>
            <div className='flex justify-center min-h-screen items-center'>
                <form onSubmit={submitHandler} className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
                    <h1 className='text-2xl font-bold mb-6 text-center text-gray-800'>OTP Verification</h1>

                    <div className='mb-6'>
                        <label htmlFor='otp' className='block text-sm font-medium text-gray-700'>
                            OTP
                        </label>
                        <input
                            type='text'
                            id='otp'
                            onChange={(e) => setOtp(e.target.value)}
                            className='mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none'
                            placeholder='Enter OTP'
                        />
                    </div>

                    <button
                        type='submit'
                        className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300'
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

                    {validationError && (
                        <p className='text-red-500 font-bold mt-4 text-center '>{validationError}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Otp;
