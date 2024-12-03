
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './logo.svg'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
       {/* <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
          <path d="M12 0l3.89 7.894 8.611 1.107-6.355 5.893 1.81 8.395-7.956-4.064-7.956 4.064 1.81-8.395-6.355-5.893 8.611-1.107z"/>
        </svg> */}
        <img src={Logo} alt="Company Logo" width="50" height="50" />
      <a className="navbar-brand" href="/">TravelDesk</a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/admin-dashboard">Admin Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/employee-dashboard">Employee Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/manager-dashboard">Manager Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/travel-admin-dashboard">Travel Admin Dashboard</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
