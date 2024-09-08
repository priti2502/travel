
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import TravelAdminDashboard from './components/TravelAdminDashboard';
import TravelRequestForm from './components/TravelRequestForm';
import UserForm from './components/UserForm';

import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import './App.css';
 
function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
 
  let userName = '';
  let userRole = '';
  if (isLoggedIn) {
    try {
      const decodedToken = jwtDecode(token);
      userName = decodedToken.firstname || '';
      userRole = decodedToken.roleId || '';
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
 
  const isDashboardRoute = location.pathname.includes('/dashboard');
 
  const getWelcomeMessage = () => {
    return userName ? `Welcome, ${userName}` : 'Welcome';
  };
 
  if (location.pathname === '/') return null; 
 
  return (
    <nav className="navbar">
      <div className="navbar-center">
        <span className="navbar-title">TravelDesk</span>
      </div>
      <div className="navbar-right">
        {isLoggedIn && isDashboardRoute && (
          <span className="navbar-welcome">{getWelcomeMessage()}</span>
        )}
        {isLoggedIn ? (
          <Link name="Logout" className="nav-link" to="/login" onClick={() => {
           
          }}>Logout</Link>
        ) : (
          <Link className="nav-link" to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
 
function ErrorPage() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link className="error-link" to="/">Go to Home</Link>
    </div>
  );
}
 
function App() {
  return (
    <Router>
      <React.Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <>
              {/* <Navbar /> */}
              <Login />
            </>
          } />
          <Route path="/dashboard/employee" element={
            <>
              <Navbar />
              <EmployeeDashboard />
            </>
          } />
         
            <Route path="/new-travel-request" element={<><Navbar /><TravelRequestForm /></>} />
          
          <Route path="/edit-travel-request/:requestId" element={<><Navbar /><TravelRequestForm /></>} /> 
          <Route path="/dashboard/manager" element={
            <>
              <Navbar />
              <ManagerDashboard />
            </>
          } />
          <Route path="/dashboard/travel-admin" element={
            <>
              <Navbar />
              <TravelAdminDashboard />
            </>
          } />
          <Route path="/dashboard/admin" element={
            <>
              <Navbar />
              <AdminDashboard />
            </>
          } />
        <Route path="/user-form/:userId?" element={ <>
              <Navbar />
              
             <UserForm /> </>} />
         
          
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}
 
export default App;