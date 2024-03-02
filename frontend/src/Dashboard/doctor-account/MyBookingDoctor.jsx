import React, { useState, useEffect } from 'react';
import { BASE_URL, token } from '../../config';

const MyBookingDoctor = () => {
  const [bookings, setBookings] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5); // Number of bookings to display per page
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const fetchDoctorBookings = async () => {
      try {
        const userDataString = localStorage.getItem('user');
        const userData = JSON.parse(userDataString);
        const { _id: doctor_id } = userData;

        const response = await fetch(`${BASE_URL}/booking/doctorBooking?doctor_id=${doctor_id}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctor bookings');
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching doctor bookings:', error);
      }
    };

    const fetchUserRole = () => {
      const role = localStorage.getItem('role');
      setUserRole(role);
    };

    fetchDoctorBookings();
    fetchUserRole();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const userRole = localStorage.getItem('role');

      const response = await fetch(`${BASE_URL}/booking/cancelBooking/${bookingId}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cancelledBy: userRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, cancelStatus: true }
            : booking
        )
      );

      console.log(`Booking with ID ${bookingId} has been canceled successfully by ${userRole}`);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  // Filter bookings based on the search date
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.date.includes(searchDate)
  );

  // Logic for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchDate(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  if (bookings.length === 0) {
    return <div><h3>NO BOOKINGS YET</h3></div>;
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  return (
    <div>
      <h3>Your Bookings</h3>
      <input
        type="date"
        value={searchDate}
        onChange={handleSearch}
        style={styles.searchInput}
      />
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>Patient's Name</th>
            <th style={styles.th}>Booking Date</th>
            <th style={styles.th}>Booking Slot</th>
            <th style={styles.th}>Booked By</th>
            <th style={styles.th}>Payment Status</th>
            <th style={styles.th}>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.map((booking) => (
            <tr key={booking._id} style={styles.tr}>
              <td style={styles.td}>{booking.bookedFor}</td>
              <td style={styles.td}>{new Date(booking.date).toLocaleDateString()}</td>
              <td style={styles.td}>{booking.slot}</td>
              <td style={styles.td}>{booking.patientName}</td>
              <td style={styles.td}>{booking.paymentStatus ? 'Paid' : 'Pending'}</td>
              <td style={styles.td}>
                {booking.cancelStatus && `cancelled by ${booking.cancelledBy || userRole}`}
                {!booking.cancelStatus && (
                  <button style={styles.cancelButton} onClick={() => handleCancelBooking(booking._id)}>
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={styles.paginationButton}
        >
          Prev
        </button>
        <span style={styles.pageNumber}>{currentPage}</span> / {totalPages}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastBooking >= filteredBookings.length}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const styles = {
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    marginTop: '20px',
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
  cancelButton: {
    backgroundColor: '#ff6666',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  searchInput: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '10px',
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
    margin: '0 5px',
    fontWeight: 'bold',
  },
};

export default MyBookingDoctor;
