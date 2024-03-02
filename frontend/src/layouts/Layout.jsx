import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Routers from '../routes/Routers';

const Layout = () => {
  const location = useLocation();

  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div>
      {isAdminRoute ? null : <Header />}
      <main>
        <Routers />
      </main>
      {isAdminRoute ? null : <Footer />}
    </div>
  );
};

export default Layout;