import React, { useState } from 'react';
import { BASE_URL, token } from '../../config';
import { toast } from 'react-toastify';

const AddFriendsPopup = ({ onSaveFriends, user }) => {
  const [friend, setFriend] = useState({ name: '', age: '', gender: '' });
  const [isOpen, setIsOpen] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFriend({ ...friend, [name]: value });
  };

  const handleSaveFriends = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/addFriend/${user._id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(friend),
      });
      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      // Notify about success using toast
      toast.success(message);

      // Close the popup after saving friends
      handleClose();
    } catch (error) {
      // Notify about errors using toast
      toast.error(error.message);
      handleClose();
      console.error(error);
    }
  };

  const handleClose = () => {
    setFriend({ name: '', age: '', gender: '' });
    setIsOpen(false);
  };

  return isOpen ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          width: '300px',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px' }}>Add Friends</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', color: '#333' }}>Name:</label>
          <input
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' }}
            type="text"
            name="name"
            value={friend.name}
            onChange={handleInputChange}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', color: '#333' }}>Age:</label>
          <input
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' }}
            type="text"
            name="age"
            value={friend.age}
            onChange={handleInputChange}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', color: '#333' }}>Gender:</label>
          <select
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' }}
            name="gender"
            value={friend.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            style={{
              cursor: 'pointer',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              marginLeft: '8px',
              backgroundColor: '#007bff',
              color: '#fff',
            }}
            onClick={handleSaveFriends}
          >
            Save Friends
          </button>
          <button
            style={{
              cursor: 'pointer',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              marginLeft: '8px',
              backgroundColor: '#6c757d',
              color: '#fff',
            }}
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddFriendsPopup;
