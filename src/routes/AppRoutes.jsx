import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
const Home = lazy(() => import('../pages/Home'));
const BookAppointment = lazy(() => import('../pages/BookAppointment'));
const Services = lazy(() => import('../pages/Services'));
const ServiceDetail = lazy(() => import('../pages/ServiceDetail'));
const Products = lazy(() => import('../pages/Products'));
const AnimalInsurance = lazy(() => import('../pages/AnimalInsurance'));
const Collaborations = lazy(() => import('../pages/Collaborations'));
const OurTeam = lazy(() => import('../pages/OurTeam'));
const ContactUs = lazy(() => import('../pages/ContactUs'));

// Admin Pages & Guards
const AdminLogin = lazy(() => import('../admin/pages/AdminLogin'));
const AdminLayout = lazy(() => import('../admin/AdminLayout'));
import AdminAuthGuard from '../admin/AdminAuthGuard';
const AdminOverview = lazy(() => import('../admin/pages/AdminOverview'));
const AdminContentHome = lazy(() => import('../admin/pages/AdminContentHome'));
const AdminServices = lazy(() => import('../admin/pages/AdminServices'));
const AdminProducts = lazy(() => import('../admin/pages/AdminProducts'));
const AdminProductSales = lazy(() => import('../admin/pages/AdminProductSales'));
const AdminInsurance = lazy(() => import('../admin/pages/AdminInsurance'));
const AdminInsurancePolicies = lazy(() => import('../admin/pages/AdminInsurancePolicies'));
const AdminSubscribedAnimals = lazy(() => import('../admin/pages/AdminSubscribedAnimals'));
const AdminHubs = lazy(() => import('../admin/pages/AdminHubs'));
const AdminVetDashboard = lazy(() => import('../admin/pages/AdminVetDashboard'));
const AdminCollaborations = lazy(() => import('../admin/pages/AdminCollaborations'));
const AdminTeam = lazy(() => import('../admin/pages/AdminTeam'));
const AdminFAQs = lazy(() => import('../admin/pages/AdminFAQs'));
const AdminAppointments = lazy(() => import('../admin/pages/AdminAppointments'));
const AdminMedia = lazy(() => import('../admin/pages/AdminMedia'));
const AdminSettings = lazy(() => import('../admin/pages/AdminSettings'));
const AdminUsers = lazy(() => import('../admin/pages/AdminUsers'));
const AdminAuditLogs = lazy(() => import('../admin/pages/AdminAuditLogs'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh] py-12">
    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Client Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/clinical-services" element={<Services />} />
        <Route path="/products" element={<Products />} />
        <Route path="/animal-insurance" element={<AnimalInsurance />} />
        <Route path="/insurance" element={<AnimalInsurance />} />
        <Route path="/collaborations" element={<Collaborations />} />
        <Route path="/partnerships" element={<Collaborations />} />
        <Route path="/appointment-booking" element={<BookAppointment />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/team" element={<OurTeam />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Admin Authentication Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <AdminAuthGuard>
              <AdminLayout />
            </AdminAuthGuard>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="content/home" element={<AdminContentHome />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/sales" element={<AdminProductSales />} />
          <Route path="sales" element={<AdminProductSales />} />
          <Route path="insurance" element={<AdminInsurance />} />
          <Route path="pricing" element={<AdminInsurance />} />
          <Route path="insurance/policies" element={<AdminInsurancePolicies />} />
          <Route path="animals" element={<AdminSubscribedAnimals />} />
          <Route path="hubs" element={<AdminHubs />} />
          <Route path="locations" element={<AdminHubs />} />
          <Route path="vet/dashboard" element={<AdminVetDashboard />} />
          <Route path="vet" element={<AdminVetDashboard />} />
          <Route path="collaborations" element={<AdminCollaborations />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="faqs" element={<AdminFAQs />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}
