import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-gray-800 text-white w-80 p-5 rounded-md shadow-md">
        <div className="text-lg font-semibold mb-2">{message}</div>
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};


const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const servicesPerPage = 3;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/getServices`);
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleAddService = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/addService/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceName: newServiceName,
          serviceDescription: newServiceDescription,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add service");
      }

      setServices([...services, responseData]);
      setNewServiceName("");
      setNewServiceDescription("");
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error(error.message || "Failed to add service");
    }
  };

  const handleToggleListed = (id, isListed) => {
    setSelectedServiceId(id);
    setIsConfirmationOpen(true);
  };

  const confirmToggleListed = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/updateService/${selectedServiceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isListed: !services.find(service => service._id === selectedServiceId).isListed }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle service listing");
      }

      const updatedServices = services.map((service) =>
        service._id === selectedServiceId ? { ...service, isListed: !service.isListed } : service
      );

      setServices(updatedServices);
    } catch (error) {
      console.error("Error toggling service listing:", error);
    } finally {
      setSelectedServiceId(null);
      setIsConfirmationOpen(false);
    }
  };

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 h-screen bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 md:grid-cols-4 gap-4 w-full pt-3">
        <div className="col-span-1 flex flex-col justify-start bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 p-6 rounded-md shadow-md">
          <button className="w-full text-left font-bold py-3 px-14 bg-transparent text-black rounded-md mb-2 hover:bg-slate-500 focus:outline-none focus:ring focus:border-blue-700 transition duration-300 ease-in-out">
            Dashboard
          </button>
        </div>
        <div className="col-span-3">
          <section className="container">
            <div className="relative mx-5 mb-5">
              <input
                type="text"
                placeholder="Service Name"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
              <textarea
                placeholder="Service Description"
                value={newServiceDescription}
                onChange={(e) => setNewServiceDescription(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
              <button
                onClick={handleAddService}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-700 transition duration-300 ease-in-out"
              >
                Add Service
              </button>
            </div>
            <div className="relative mx-5 overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-slate-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Service Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentServices.map((service) => (
                    <tr
                      className={`bg-white border-b hover:bg-[#e8e8ff] ${
                        !service.isListed && "opacity-50"
                      }`}
                      key={service._id}
                    >
                      <td className="px-6 py-4">{service.serviceName}</td>
                      <td className="px-6 py-4">
                        {service.serviceDescription}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleToggleListed(
                              service._id,
                              service.isListed
                            )
                          }
                          className={`px-3 py-1 ${
                            service.isListed
                              ? "bg-red-500"
                              : "bg-green-500"
                          } text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:border-red-700 transition duration-300 ease-in-out`}
                        >
                          {service.isListed ? "Unlist" : "List"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
              >
                Prev
              </button>
              <span className="text-gray-700">{currentPage}</span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastService >= services.length}
                className="bg-blue-500 text-white px-3 py-1 rounded-md ml-2"
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmToggleListed}
        message={`Are you sure you want to ${
          services.find((service) => service._id === selectedServiceId)?.isListed
            ? "unlist"
            : "list"
        } this service?`}
      />
    </div>
  );
};

export default ServiceManagement;
