import React from 'react';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import ProductSections from './components/ProductSections';
import FloatingTab from './components/FloatingTab';
import Footer from './components/Footer';
import AffiliateForm from './components/AffiliateForm';
import ContactForm from './components/ContactForm';
import WhyBellaSkin from './components/WhyBellaSkin';
import RejuvenatingSet from './components/RejuvenatingSet';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import CategoryPage from './components/CategoryPage';
import SearchPage from './components/SearchPage';
import ProductDetail from './components/ProductDetail';
import TikTokEmulator from './components/TikTokEmulator';
import { supabase } from './lib/supabaseClient';
import './index.css';

function App() {
  const path = window.location.pathname;
  const [emulator, setEmulator] = React.useState({ isOpen: false, link: '' });

  React.useEffect(() => {
    // Global listener for the Virtual Phone Emulator
    const handleOpenEmulator = (e) => {
      setEmulator({ isOpen: true, link: e.detail.link });
    };

    window.addEventListener('open-tiktok-emulator', handleOpenEmulator);
    return () => window.removeEventListener('open-tiktok-emulator', handleOpenEmulator);
  }, []);

  // Admin Routes (Bypasses Public Layout)
  if (path.startsWith('/admin')) {
    return (
      <div className="admin-app">
        {(path === '/admin' || path === '/admin/') && <AdminLogin />}
        {path === '/admin/dashboard' && (
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        )}
      </div>
    );
  }

  // Public Routes

  return (
    <div className="app">
      <Header />
      <main>
        {(path === '/' || path === '') && (
          <>
            <HeroCarousel />
            <ProductSections />
          </>
        )}
        {path === '/affiliate' && <AffiliateForm />}
        {path === '/contact' && <ContactForm />}
        {path === '/why' && <WhyBellaSkin />}
        {path.startsWith('/category/') && <CategoryPage />}
        {path === '/search' && <SearchPage />}
        {path.startsWith('/product/') && <ProductDetail />}
      </main>
      <FloatingTab />
      <Footer />
      
      {/* Global Virtual Phone Emulator */}
      <TikTokEmulator 
        isOpen={emulator.isOpen} 
        onClose={() => setEmulator({ ...emulator, isOpen: false })} 
        tiktokLink={emulator.link} 
      />
    </div>
  );
}

export default App;
