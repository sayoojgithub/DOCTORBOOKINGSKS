import React, { useState, useEffect } from "react";
import { BASE_URL, token } from "../../config";

const MyBookingDoctor = () => {
  const [bookings, setBookings] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5); // Number of bookings to display per page
  const [searchDate, setSearchDate] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState("");

  // Define closeModal function to handle modal closing
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchDoctorBookings = async () => {
      try {
        const userDataString = localStorage.getItem("user");
        const userData = JSON.parse(userDataString);
        const { _id: doctor_id } = userData;

        const response = await fetch(
          `${BASE_URL}/booking/doctorBooking?doctor_id=${doctor_id}`,
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctor bookings");
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching doctor bookings:", error);
      }
    };

    const fetchUserRole = () => {
      const role = localStorage.getItem("role");
      setUserRole(role);
    };

    fetchDoctorBookings();
    fetchUserRole();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const userRole = localStorage.getItem("role");

      const response = await fetch(
        `${BASE_URL}/booking/cancelBooking/${bookingId}`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cancelledBy: userRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, cancelStatus: true }
            : booking
        )
      );

      console.log(
        `Booking with ID ${bookingId} has been canceled successfully by ${userRole}`
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleRescheduleBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/booking/rescheduleBooking/${bookingId}`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reschedule booking");
      }

      const data = await response.json();
      setAvailableSlots(data.slotsNotBooked);
      setSelectedBookingId(bookingId);
      setShowModal(true);
    } catch (error) {
      console.error("Error rescheduling booking:", error);
    }
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const handleOk = async () => {
    try {
      if (!selectedSlot) {
        setShowModal(false); 
        return; 
      }
      const response = await fetch(
        `${BASE_URL}/booking/saveRescheduledSlot/${selectedBookingId}`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rescheduledSlot: selectedSlot }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save rescheduled slot");
      }

      console.log(`Rescheduled slot ${selectedSlot} saved successfully`);

      // Update the bookings array to reflect the rescheduled slot
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === selectedBookingId
            ? {
                ...booking,
                rescheduleStatus: true,
                rescheduleSlot: selectedSlot,
              }
            : booking
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error("Error saving rescheduled slot:", error);
    }
  };

  // Filter bookings based on the search date
  const filteredBookings = bookings.filter((booking) =>
    booking.date.includes(searchDate)
  );

  // Logic for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchDate(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  if (bookings.length === 0) {
    return (
      <div>
        <h3>NO BOOKINGS YET</h3>
      </div>
    );
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
            <th style={styles.th}>Reschedule</th>{" "}
            {/* New column for Reschedule */}
          </tr>
        </thead>
        <tbody>
          {currentBookings.map((booking) => (
            <tr key={booking._id} style={styles.tr}>
              <td style={styles.td}>{booking.bookedFor}</td>
              <td style={styles.td}>
                {new Date(booking.date).toLocaleDateString()}
              </td>
              <td style={styles.td}>{booking.slot}</td>
              <td style={styles.td}>{booking.patientName}</td>
              <td style={styles.td}>
                {booking.paymentStatus ? "Paid" : "Pending"}
              </td>
              <td style={styles.td}>
                {booking.cancelStatus &&
                  `cancelled by ${booking.cancelledBy || userRole}`}
                {!booking.cancelStatus && (
                  <button
                    style={styles.cancelButton}
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel
                  </button>
                )}
              </td>
              <td style={styles.td}>
                {booking.cancelStatus ? (
                  <button style={styles.rescheduleButton} disabled>
                    Reschedule
                  </button>
                ) : booking.rescheduleStatus ? (
                  <span style={styles.rescheduledText}>
                    Rescheduled to {booking.rescheduleSlot}
                  </span>
                ) : (
                  <button
                    style={styles.rescheduleButton}
                    onClick={() => handleRescheduleBooking(booking._id)}
                  >
                    Reschedule
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
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

      {/* Modal for selecting reschedule slot */}
      {showModal && (
        <div className="modal" style={styles.modal}>
          <div className="modal-content" style={styles.modalContent}>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2
              style={{
                textAlign: "center",
                color: "#333",
                marginBottom: "20px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Select Reschedule Slot
            </h2>
            <ul
              style={{
                ...styles.slotList,
                maxHeight: "200px",
                overflowY: "auto",
                padding: "0 20px",
                margin: "0",
              }}
            >
              {availableSlots.map((slot, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSlot(slot)}
                  style={{
                    ...styles.slotItem,
                    cursor: "pointer",
                    backgroundColor: selectedSlot === slot ? "darkgreen" : null,
                  }}
                >
                  {slot}
                </li>
              ))}
            </ul>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={handleOk}
                style={{
                  ...styles.okButton,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease",
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  table: {
    borderCollapse: "collapse",
    width: "100%",
    marginTop: "20px",
  },
  thead: {
    backgroundColor: "#f2f2f2",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  tr: {
    backgroundColor: "#f9f9f9",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
  cancelButton: {
    backgroundColor: "#ff6666",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  rescheduleButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  searchInput: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  paginationButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "5px",
    marginRight: "5px",
  },
  pageNumber: {
    margin: "0 5px",
    fontWeight: "bold",
  },
  modal: {
    display: "block",
    position: "fixed",
    zIndex: "1",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    overflow: "auto",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fefefe",
    margin: "15% auto",
    padding: "20px",
    border: "1px solid #888",
    width: "30%",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  slotList: {
    listStyleType: "none",
    padding: 0,
  },
  slotItem: {
    cursor: "pointer",
    padding: "8px",
    border: "2px solid #90EE90",
    marginBottom: "8px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
    backgroundColor: "darkgreen",
  },
  okButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 24px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap", // Add this property
  },
};

export default MyBookingDoctor;
