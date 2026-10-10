/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import FlightBooking from './pages/FlightBooking';
import HotelBooking from './pages/HotelBooking';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flight-booking" element={<FlightBooking />} />
          <Route path="/hotel-booking" element={<HotelBooking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}