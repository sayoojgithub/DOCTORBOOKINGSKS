import React, { useState, useEffect } from 'react';
import { BASE_URL, token } from '../../config';
import { toast } from 'react-toastify';

const WalletHistory = ({ userId }) => {
  const [walletHistory, setWalletHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [walletHistoryPerPage] = useState(5); // Number of wallet history items to display per page
  const [showRechargePopup, setShowRechargePopup] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  console.log(rechargeAmount)

  useEffect(() => {
    const fetchWalletHistory = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/wallet/history/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch wallet history');
        }

        const data = await response.json();
        setWalletHistory(data);
      } catch (error) {
        console.error('Error fetching wallet history:', error);
      }
    };

    fetchWalletHistory();
  }, [userId]);

  // Logic for pagination
  const indexOfLastHistoryItem = currentPage * walletHistoryPerPage;
  const indexOfFirstHistoryItem = indexOfLastHistoryItem - walletHistoryPerPage;
  const currentWalletHistory = walletHistory.slice(indexOfFirstHistoryItem, indexOfLastHistoryItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRechargeClick = () => {
    setShowRechargePopup(true);
  };

  const handleRechargeCancel = () => {
    setShowRechargePopup(false);
  };
  const saveWalletDetails = async () => {
    console.log('savebooking starting')
    try {
      const walletRes = await fetch(`${BASE_URL}/booking/createwallet`, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId:userId,
          rechargeAmount:rechargeAmount,
        }),
      });
  
      if (walletRes.ok) {
        
        console.log("wallet recharged successfully");
        // You can perform additional actions if needed
      } else {
        console.log("Failed to recharge");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
  };

  const handleRechargeConfirm = async (rechargeAmount) => {
    if (rechargeAmount <= 0) {
      toast.error('Please enter a valid amount');
      setShowRechargePopup(false);
      return;
    }

    setShowRechargePopup(false);

    try {
    
      const res = await fetch(`${BASE_URL}/users/recharge`, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rechargeAmount:rechargeAmount
        }),
      });

      if (res.ok) {
        console.log('haiiii')
        saveWalletDetails()
        
        const data = await res.json();
        console.log(data)
        console.log(data.url)
        if (data.url) {
          
          window.location.href = data.url;
          
        } else {
          console.log("error.message");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Wallet History</h3>
      <button style={styles.rechargeButton} onClick={handleRechargeClick}>Recharge Wallet</button>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>Transaction Type</th>
            <th style={styles.th}>Transaction Status</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Total Wallet Amount</th>
            <th style={styles.th}>Transaction Time</th>
          </tr>
        </thead>
        <tbody>
          {currentWalletHistory.map((historyItem) => (
            <tr key={historyItem._id} style={styles.tr}>
              <td style={styles.td}>{historyItem.transactionType}</td>
              <td style={styles.td}>
              {(!historyItem.cancelledBy && historyItem.transactionType === 'credit') ? 'Recharged' :
                (!historyItem.cancelledBy && historyItem.transactionType === 'debit') ? 'Booked' :
                `Cancelled by ${historyItem.cancelledBy}`}
               </td>
              <td style={styles.td}>{historyItem.amount}</td>
              <td style={styles.td}>{historyItem.currentWalletAmount}</td>
              <td style={styles.td}>{new Date(historyItem.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={styles.paginationButton}
        >
          Prev
        </button>
        <span style={styles.pageNumber}>
          {currentPage} / {Math.ceil(walletHistory.length / walletHistoryPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastHistoryItem >= walletHistory.length}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>
      {/* Recharge Wallet Popup */}
      {showRechargePopup && (
        <div style={styles.popup}>
          <h4 style={styles.popupTitle}>Recharge Wallet</h4>
          <input
            type="number"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(parseFloat(e.target.value))}
            placeholder="Enter amount"
            style={styles.inputField}
          />
          <button style={styles.popupButton} onClick={()=>handleRechargeConfirm(rechargeAmount)}>OK</button>
          <button style={{ ...styles.popupButton, ...styles.popupButtonCancel }} onClick={handleRechargeCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    margin: '20px auto',
    maxWidth: '800px',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
  },
  thead: {
    backgroundColor: '#f2f2f2',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  tr: {
    backgroundColor: '#f9f9f9',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  pagination: {
    marginTop: '20px',
    textAlign: 'center',
  },
  paginationButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '5px',
    marginRight: '5px',
  },
  pageNumber: {
    margin: '0 10px',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  popup: {
    position: 'fixed',
    top: '50%',
    left: '58%', // Adjusted left position to move it slightly right
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#333', // Changed background color to dark grey
    padding: '30px',
    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.2)',
    zIndex: '999',
    borderRadius: '8px',
    width: '300px',
    textAlign: 'center',
  },
  popupTitle: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#fff', // Changed color to white
  },
  inputField: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  popupButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
    transition: 'background-color 0.3s ease',
  },
  popupButtonCancel: {
    backgroundColor: '#ccc',
    transition: 'background-color 0.3s ease',
  },
  rechargeButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s ease',
  },
};

export default WalletHistory;
