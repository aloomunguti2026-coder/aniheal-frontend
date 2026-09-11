import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import BookAppointment from '../pages/BookAppointment';
import Services from '../pages/Services';
import OurTeam from '../pages/OurTeam';
import ContactUs from '../pages/ContactUs';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/clinical-services" element={<Services />} />
      <Route path="/appointment-booking" element={<BookAppointment />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/our-team" element={<OurTeam />} />
      <Route path="/team" element={<OurTeam />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
