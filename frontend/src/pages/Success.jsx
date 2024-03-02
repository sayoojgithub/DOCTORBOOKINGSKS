import React from 'react';
import { BASE_URL,token } from '../config';
const Success = () => {
    const handleOkClick = async () => {
        try {
          // Retrieve user data from local storage
          const userDataString = localStorage.getItem('user');
          const userData = JSON.parse(userDataString);
         
      
          // Check if user data and user_id exist
          if (!userData || !userData._id) {
            throw new Error('User data or user_id not found in local storage');
          }
      
          const { _id: user_id } = userData;
      
          const response = await fetch(`${BASE_URL}/booking/paymentSuccess`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id }), 
          });
      
          if (!response.ok) {
            throw new Error('Failed to make backend call');
          }
      
          console.log('Backend call successful');
          window.location.href = '/home';
        } catch (error) {
          console.error('Error making backend call:', error);
        }
      };
      

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Booking Successful!</h2>
      <p style={styles.text}>Your booking has been confirmed.</p>
      <button style={styles.button} onClick={handleOkClick}>
        OK
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '50px',
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '10px',
  },
  text: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Success;
