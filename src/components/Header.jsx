import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Menu, Search } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bestSellers, setBestSellers] = useState([]);
  const path = window.location.pathname;

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name')
      .eq('is_best_seller', true)
      .limit(5);
    
    if (!error && data) {
      setBestSellers(data);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        {/* Mobile menu icon */}
        <div className="mobile-menu">
          <Menu size={24} />
        </div>

        {/* Logo */}
        <div className="logo">
          <a href="/"><img src="/Logo.png" alt="Bella Skin" className="logo-img" /></a>
        </div>

        {/* Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            <li className={path === '/' ? 'active' : ''}><a href="/">What's New?</a></li>
            <li className="dropdown">
              <a href="#">Product</a>
              <div className="dropdown-menu">
                <div className="dropdown-column">
                  <h4>Skincare</h4>
                  <a href="/category/skincare">Rejuvenating Set</a>
                  <a href="/category/sunscreen">Sunscreens</a>
                  <a href="/category/lotion">Lotion</a>
                  <a href="/category/serum">Serum</a>
                  <a href="/category/lipbalm">Lip Balm</a>
                  <a href="/category/deospray">Deo Spray</a>
                  <a href="/category/kojic">Kojic Soap</a>
                  <a href="/category/toner">Glow Toner</a>
                  <a href="/category/mask">Overnight Mask</a>
                  <a href="/category/facialwash">Facial Wash</a>
                </div>
                <div className="dropdown-column">
                  <h4>Body & Hair</h4>
                  <a href="/category/shampoo">Shampoo</a>
                  <a href="/category/conditioner">Conditioner</a>
                  <a href="/category/bodyscrub">Body Scrub</a>
                  <a href="/category/hairserum">Hair Serum</a>
                  <a href="/category/bodymist">Body Mist</a>
                </div>
                <div className="dropdown-column">
                  <h4>Best Sellers</h4>
                  {bestSellers.length > 0 ? (
                    bestSellers.map(p => (
                      <a key={p.id} href={`/product/${p.id}`}>{p.name}</a>
                    ))
                  ) : (
                    <span className="no-data" style={{fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', padding: '10px 0'}}>Coming soon!</span>
                  )}
                  <a href="/category/best" style={{marginTop: '10px', fontWeight: 'bold', borderTop: '1px solid var(--cream-dark)', paddingTop: '10px'}}>View All Best Sellers</a>
                </div>
              </div>
            </li>
            <li className={`dropdown ${path === '/why' ? 'active' : ''}`}>
              <a href="/why">Why Bella Skin?</a>
              <div className="dropdown-menu dropdown-narrow">
                <div className="dropdown-column">
                  <a href="/why">Our Story</a>
                  <a href="/why">Product Review</a>
                  <a href="/why">Rating Board</a>
                </div>
              </div>
            </li>
            <li className={path === '/affiliate' ? 'active' : ''}><a href="/affiliate">Be an Affiliate</a></li>
            <li className={path === '/contact' ? 'active' : ''}><a href="/contact">Contact Us</a></li>
          </ul>
        </nav>

        {/* Search Bar */}
        <div className="header-search">
          <input 
            type="text" 
            placeholder="Search products, arrivals..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className="search-btn" aria-label="Search" onClick={handleSearch}>
            <Search size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
