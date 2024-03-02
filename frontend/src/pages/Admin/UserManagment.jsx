import React, { useState } from 'react';
import { BASE_URL } from '../../config';
import usehandleBlock from '../../hooks/usehandleBlock';

const UserManagement = ({ users, userRefetch }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const handleBlock = async (userId) => {
    console.log('handleBlock');
    //const res =await fetch(`${BASE_URL}/admin/handleblock/${userId}`)
    const res = await fetch(`${BASE_URL}/admin/handleblock/${userId}`, {
      method: 'put',
    });

    userRefetch();
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log(users);
  return (
    <div className='flex flex-col items-center'>
      {/* Navbar Component */}
      {/* Assuming there's a component named Navbar */}

      <div className='grid grid-cols-1 h-screen-full bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 md:grid-cols-4 gap-4 w-full  pt-3'>
        {/* Left side (1/3 width) */}
        <div className='col-span-1 flex flex-col justify-start bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 p-6 rounded-md shadow-md '>
          <button className='w-full text-left font-bold py-3 px-14 bg-transparent text-black rounded-md mb-2 hover:bg-slate-500 focus:outline-none focus:ring focus:border-blue-700 transition duration-300 ease-in-out'>
            Dashboard
          </button>
        </div>

        {/* Right side (2/3 width) */}
        <div className='col-span-3 '>
          <section className='container'>
            <div className='relative mx-5 overflow-x-auto shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-slate-400'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      Sl.No
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Name
                    </th>

                    <th scope='col' className='px-6 py-3'>
                      Email
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Options
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers && currentUsers.length > 0 ? (
                    currentUsers.map((user, index) => (
                      <tr className='bg-white border-b hover:bg-[#e8e8ff]' key={user._id}>
                        <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                          {index + 1}
                        </th>
                        <td className='px-6 py-4'>{user.name}</td>

                        <td className='px-6 py-4'>{user.email}</td>
                        <td className='px-6 py-4'>
                          {user.isBlocked ? (
                            <button
                              onClick={() => handleBlock(user._id)}
                              className='px-4 py-2 font-semibold text-white bg-green-500 border border-yellow-500 rounded hover:bg-yellow-500 hover:text-white hover:border-transparent'
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(user._id)}
                              className='px-4 py-2 font-semibold text-white bg-red-500 border border-red-500 rounded hover:bg-red-800 hover:text-white hover:border-transparent'
                            >
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className='bg-white border-b hover:bg-gray-100'>
                      <td colSpan={5} className='px-6 py-4 font-medium text-center text-gray-900'>
                        No users Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className='flex justify-center my-4'>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-4 py-2 font-semibold text-white bg-blue-500 border border-blue-500 rounded-md mr-2 hover:bg-blue-700 hover:text-white hover:border-transparent'>
              
                Prev
              </button>
              <span className='text-lg font-semibold'>{currentPage}</span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastUser >= users.length}
                className='px-4 py-2 font-semibold text-white bg-blue-500 border border-blue-500 rounded-md ml-2 hover:bg-blue-700 hover:text-white hover:border-transparent'>
              
                Next
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
