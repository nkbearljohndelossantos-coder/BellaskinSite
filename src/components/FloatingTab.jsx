import React, { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './FloatingTab.css';

const FloatingTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shopeeLink, setShopeeLink] = useState('https://shopee.ph/bellaskinph');
  const [tiktokLink, setTiktokLink] = useState('https://www.tiktok.com/@bellaskinph');

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        console.log('FloatingTab: Fetching global shop links...');
        const { data, error } = await supabase.from('site_configs').select('shopee_link, tiktok_link').eq('id', 'global').single();
        if (!error && data) {
          console.log('FloatingTab: Links loaded:', data);
          if (data.shopee_link && data.shopee_link.trim() !== '') setShopeeLink(data.shopee_link);
          if (data.tiktok_link && data.tiktok_link.trim() !== '') setTiktokLink(data.tiktok_link);
        }
      } catch (err) {
        console.warn('FloatingTab link sync failed, using defaults.');
      }
    };
    fetchLinks();
  }, []);

  const openTikTokPhoneMode = (e) => {
    e.preventDefault();
    window.alert('Our TikTok Shop is accessible exclusively through the TikTok app.');
  };

  return (
    <div className={`floating-tab ${isOpen ? 'open' : ''}`}>
      <button 
        className="tab-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Buy Now options"
      >
        {isOpen ? <X size={24} /> : <ShoppingCart size={24} />}
        {!isOpen && <span className="tab-text">Buy Now</span>}
      </button>

      <div className="tab-content">
        <h4>Shop on</h4>
        <div className="platform-links">
          <a href={shopeeLink} className="platform-btn shopee" target="_blank" rel="noreferrer">
            <span>Shopee</span>
          </a>
          <a 
            href={tiktokLink} 
            className="platform-btn tiktok" 
            onClick={openTikTokPhoneMode}
            style={{ cursor: 'pointer' }}
          >
            <span>TikTok Shop</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FloatingTab;
