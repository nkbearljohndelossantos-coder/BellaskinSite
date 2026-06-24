import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Footer.css';

const Footer = () => {
  const [shopeeLink, setShopeeLink] = useState('https://shopee.ph/bellaskinph');
  const [tiktokLink, setTiktokLink] = useState('https://www.tiktok.com/@bellaskinph');

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const { data, error } = await supabase.from('site_configs').select('shopee_link, tiktok_link').eq('id', 'global').single();
        if (!error && data) {
          if (data.shopee_link && data.shopee_link.trim() !== '') setShopeeLink(data.shopee_link);
          if (data.tiktok_link && data.tiktok_link.trim() !== '') setTiktokLink(data.tiktok_link);
        }
      } catch (err) {
        console.warn('Footer link sync failed, using defaults.');
      }
    };
    fetchLink();
  }, []);


  const handleTikTokClick = (e) => {
    e.preventDefault();
    window.alert('Our TikTok Shop is accessible exclusively through the TikTok app.');
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        {/* Column 1 */}
        <div className="footer-col brand-col">
          <img src="/Logo.png" alt="BellaSkin Logo" className="footer-logo" />
          <p>Your journey to beautiful, healthy skin starts with premium ingredients and expert formulations.</p>
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h4>EXPLORE</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Collection</a></li>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Testimonials</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h4>SUPPORT</h4>
          <ul>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Returns & Exchanges</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h4>SHOP PLATFORMS</h4>
          <ul>
            <li><a href={shopeeLink} target="_blank" rel="noopener noreferrer">Official Shopee Store</a></li>
            <li><a href={tiktokLink} onClick={handleTikTokClick} style={{ cursor: 'pointer' }}>TikTok Shop</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bella Skin. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
