import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import useAuthStore from './store/authStore';
import PrivateRoute from './components/PrivateRoute';

// Public pages
import Landing from './pages/public/Landing';
import EventsList from './pages/public/EventsList';
import EventSite from './pages/public/EventSite';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Client pages
import ClientDashboard from './pages/client/ClientDashboard';

// Organizer pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';

// Participant pages
import MyTickets from './pages/participant/MyTickets';
import TicketPrint from './pages/participant/TicketPrint';

// 404
import NotFound from './pages/NotFound';

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
          success: { iconTheme: { primary: '#00D4AA', secondary: 'white' } },
          error: { iconTheme: { primary: '#FF5757', secondary: 'white' } },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:slug" element={<EventSite />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin/*" element={
            <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
          } />

          {/* Client */}
          <Route path="/client/*" element={
            <PrivateRoute role="client"><ClientDashboard /></PrivateRoute>
          } />

          {/* Organizer */}
          <Route path="/organizer/*" element={
            <PrivateRoute role="organizer"><OrganizerDashboard /></PrivateRoute>
          } />

          {/* Participant */}
          <Route path="/my-tickets" element={
            <PrivateRoute role="participant"><MyTickets /></PrivateRoute>
          } />
          <Route path="/tickets/:id/print" element={
            <PrivateRoute role="participant"><TicketPrint /></PrivateRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
