import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employee from './pages/Employee';
import Feedback from './pages/Feedback';
import Notifications from './pages/Notifications';
import NotificationCreate from './pages/NotificationCreate';
import Station from './pages/Station';
import Nozzle from './pages/Nozzle';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';


function AppRoutes() {
  const location = useLocation();
  // Hide Navbar on login
  const hideNavbar = location.pathname === '/';
  return (
    <>

      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/employee" element={<PrivateRoute><Employee /></PrivateRoute>} />
        <Route path="/admin/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
        <Route path="/admin/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/admin/notifications/create" element={<PrivateRoute><NotificationCreate /></PrivateRoute>} />
        <Route path="/admin/station" element={<PrivateRoute><Station /></PrivateRoute>} />
        <Route path="/admin/nozzle" element={<PrivateRoute><Nozzle /></PrivateRoute>} />
        <Route path="/admin/booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
        <Route path="/admin/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
