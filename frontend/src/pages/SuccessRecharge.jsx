import React from 'react';
import { Link } from 'react-router-dom';

const SuccessMessage = ({ onClose }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Recharge Successful</h1>
      <p style={styles.text}>Your recharge was successful!</p>
      <Link to="/" style={styles.button} onClick={onClose}>OK</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.2)',
    maxWidth: '400px', // Limiting the width of the card
    margin: '0 auto', // Centering the card horizontally
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333333',
  },
  text: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#666666',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '4px',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
    display: 'inline-block',
  },
};

export default SuccessMessage;
