/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FlightBooking from './pages/FlightBooking';
import HotelBooking from './pages/HotelBooking';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/flight-booking" element={<FlightBooking />} />
      <Route path="/hotel-booking" element={<HotelBooking />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}