import React, { useState, useEffect } from 'react';
import { X, Smartphone, ShoppingBag, ExternalLink, ShieldCheck, ArrowLeft, RotateCcw, Share, Lock, MoreVertical, Search, Wifi, Battery, SignalHigh, Monitor, Apple } from 'lucide-react';
import { supabase, resolveImageUrl } from '../lib/supabaseClient';
import './TikTokEmulator.css';

const TikTokEmulator = ({ isOpen, onClose, tiktokLink }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [displayUrl, setDisplayUrl] = useState('tiktok.com');
  const [view, setView] = useState('booting'); // 'booting', 'shop', 'native'
  const [frameType, setFrameType] = useState('android'); // 'android', 'ios'
  const [bootLogs, setBootLogs] = useState([]);
  const [iframeKey, setIframeKey] = useState(0);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Professional Cloud Bridge URL (TikTok Creative Center Mobile Preview)
  const getCloudLink = (url) => {
    const encodedUrl = encodeURIComponent(url || 'https://www.tiktok.com/@bellaskinmain/shop');
    return `https://ads.tiktok.com/business/creativecenter/mobile/en?url=${encodedUrl}`;
  };

  useEffect(() => {
    if (isOpen) {
      setLoadingProgress(0);
      setView('booting');
      setBootLogs(['Initializing Cloud Instance...', 'Connecting to Virtual Bridge...', 'Resolving TikTok Shop Protocol...']);
      
      let logs = frameType === 'android' ? [
        'Starting Android Virtual Desktop...',
        'Booting kernel v5.10...',
        'Launching TikTok App...',
        'Deep Linking to Showcase...'
      ] : [
        'Initializing iOS Sandbox...',
        'Loading Darwin Kernel...',
        'Verifying App Bundle...',
        'Establishing Secure Connection...'
      ];
      
      let currentLog = 0;
      const logInterval = setInterval(() => {
        if (currentLog < logs.length) {
          setBootLogs(prev => [...prev, logs[currentLog]]);
          currentLog++;
        }
      }, 400);

      const progressInterval = setInterval(() => {
         setLoadingProgress(prev => {
            if (prev >= 100) {
               clearInterval(progressInterval);
               clearInterval(logInterval);
               setTimeout(() => setView('shop'), 500);
               return 100;
            }
            return prev + (Math.random() * 25);
         });
      }, 300);

      setDisplayUrl(tiktokLink?.includes('@') ? `tiktok.com/${tiktokLink.split('.com/')[1].split('/')[0]}` : 'tiktok.com/shop');

      return () => {
        clearInterval(progressInterval);
        clearInterval(logInterval);
      };
    }
  }, [isOpen, tiktokLink, frameType]);

  const [showPopup, setShowPopup] = useState(false);

  // Fetch products for the "Native Shop" mode (moved inside)
  useEffect(() => {
    if (isOpen) {
      const fetchShopProducts = async () => {
        setLoadingProducts(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('is_best_seller', { ascending: false });
        
        if (!error) setProducts(data);
        setLoadingProducts(false);
      };
      fetchShopProducts();
    }
  }, [isOpen]);

  // Effect to auto-hide popup
  useEffect(() => {
    if (showPopup) {
       const timer = setTimeout(() => setShowPopup(false), 3000);
       return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const resolvedTiktokUrl = tiktokLink?.includes('vt.tiktok.com') 
    ? `https://www.tiktok.com/@bellaskinmain/shop` 
    : tiktokLink;

  if (!isOpen) return null;

  const isInvalidLink = !tiktokLink || tiktokLink.toLowerCase().startsWith('snssdk') || tiktokLink.toLowerCase().startsWith('tiktok://') || tiktokLink.includes('ec/store');

  const triggerPopup = (e) => {
    if (e) e.stopPropagation();
    setShowPopup(true);
  };

  const renderNativeShop = () => (
    <div className="native-shop-container fade-in">
       <div className="native-shop-header">
          <div className="shop-info">
             <div className="shop-avatar">
                <img src="/Logo.png" alt="Bella Skin" />
             </div>
             <div className="shop-meta">
                <h4>Bella Skin Professional</h4>
                <p>128.5K Followers • 4.9 ★</p>
             </div>
             <button className="shop-follow-btn" onClick={triggerPopup}>Follow</button>
          </div>
          <div className="shop-tabs">
             <div className="shop-tab active">Products</div>
             <div className="shop-tab">Reviews</div>
             <div className="shop-tab">About</div>
          </div>
       </div>
       <div className="native-product-grid">
          {products.map(product => (
             <div className="native-product-card" key={product.id} onClick={triggerPopup}>
                <div className="product-image">
                   <img src={resolveImageUrl(product.image_url)} alt={product.name} />
                   {product.is_best_seller && <span className="hot-tag">HOT</span>}
                </div>
                <div className="product-details">
                   <h3>{product.name}</h3>
                   <div className="price-row">
                      <span className="price">₱{product.price || '85.00'}</span>
                      <button className="buy-btn" onClick={triggerPopup}>Add</button>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="emulator-overlay" onClick={onClose}>
      {/* Real-time Popup / Pump */}
      {showPopup && (
        <div className="tiktok-popup-pump fade-in">
           <div className="popup-content">
              <Apple size={24} className="popup-icon" />
              <p>Currently available exclusively on the TikTok app.</p>
           </div>
        </div>
      )}

      {/* Frame Switcher Control */}
      <div className="frame-switcher glass fade-in">
         <button 
           className={frameType === 'android' ? 'active' : ''} 
           onClick={(e) => { e.stopPropagation(); setFrameType('android'); }}
           title="Android Mode"
         >
           <Smartphone size={18} />
         </button>
         <button 
           className={frameType === 'ios' ? 'active' : ''} 
           onClick={(e) => { e.stopPropagation(); setFrameType('ios'); }}
           title="iPhone Mode"
         >
           <Apple size={18} />
         </button>
      </div>

      <div className="emulator-container fade-in" onClick={e => e.stopPropagation()}>
        <button className="emulator-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Device Frame */}
        <div className={frameType === 'android' ? 'android-frame' : 'iphone-frame'}>
          {frameType === 'android' ? <div className="android-camera"></div> : <div className="dynamic-island"></div>}
          
          <div className={frameType === 'android' ? 'android-screen' : 'iphone-screen'}>
            {/* Status Bar */}
            <div className={frameType === 'android' ? 'android-status-bar' : 'iphone-status-bar'}>
               <div className="status-left">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
               <div className="status-right">
                  <Wifi size={frameType === 'android' ? 14 : 16} />
                  <SignalHigh size={frameType === 'android' ? 14 : 16} />
                  <Battery size={frameType === 'android' ? 14 : 16} />
               </div>
            </div>

            {/* Address Bar */}
            <div className={frameType === 'android' ? 'android-browser-header' : 'iphone-browser-header'}>
               <div className="address-area">
                  <Lock size={12} fill="currentColor" />
                  <span>{displayUrl}</span>
               </div>
               {frameType === 'android' && <RotateCcw size={16} />}
               {frameType === 'android' && <MoreVertical size={16} />}
            </div>

            {/* Loading Bar */}
            <div className="android-progress-container">
               <div 
                 className="android-progress-fill" 
                 style={{ 
                   width: `${loadingProgress}%`, 
                   opacity: loadingProgress >= 100 ? 0 : 1,
                   backgroundColor: frameType === 'android' ? '#4285f4' : '#007aff'
                 }}
               ></div>
            </div>

            {/* Main Content Area */}
            <div className="emulator-content">
                {isInvalidLink && view !== 'booting' ? (
                   renderNativeShop()
                ) : view === 'booting' ? (
                  <div className="android-boot-screen text-center p-6" style={{ background: '#000', color: frameType === 'android' ? '#4285f4' : '#fff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                     <RotateCcw size={48} className="animate-spin mb-4" />
                     <h3>{frameType === 'android' ? 'MAT Cloud Instance' : 'iOS Cloud Bridge'}</h3>
                     <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '20px' }}>Establishing Secure Link...</p>
                     <div className="boot-logs text-left" style={{ fontSize: '0.65rem', fontFamily: 'monospace', opacity: 0.7, width: '80%' }}>
                        {bootLogs.map((log, i) => <div key={i} className="fade-in">&gt; {log}</div>)}
                     </div>
                  </div>
                ) : (
                   <div className="emulator-shop-browser fade-in" style={{ height: '100%', overflow: 'hidden' }}>
                      <div className="real-app-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
                         <iframe 
                           key={iframeKey}
                           src={getCloudLink(resolvedTiktokUrl)}
                           title="MAT Cloud Emulator"
                           style={{ 
                             width: '100%', 
                             height: '100%',
                             border: 'none',
                             background: '#fff'
                           }}
                           onLoad={() => setLoadingProgress(100)}
                           onError={() => setView('native')}
                         />
                         
                         <div className="cloud-status-indicator">
                            <span className="live-pill">LIVE CLOUD</span>
                         </div>

                         {/* Fallback Trigger */}
                         <button className="fallback-trigger" onClick={() => setView('native')}>
                            <ShoppingBag size={14} /> Native View
                         </button>
                      </div>
                   </div>
                )}
                {view === 'native' && renderNativeShop()}
            </div>

            {/* Navigation Bar */}
            {frameType === 'android' ? (
              <div className="android-nav-bar">
                 <div className="nav-icon triangle" title="Reset" onClick={() => { setIframeKey(prev => prev + 1); setLoadingProgress(0); setView('booting'); }}></div>
                 <div className="nav-icon circle" title="Home" onClick={() => setView('booting')}></div>
                 <div className="nav-icon square" title="Recent"></div>
              </div>
            ) : (
              <div className="iphone-nav-bar">
                 <div className="home-indicator" onClick={() => setView('booting')}></div>
              </div>
            )}
          </div>
        </div>

        {/* Security / Pro Message */}
        <div className="emulator-sidebar-msg desktop-only">
           <div className="glossy-card">
              <ShieldCheck size={24} color="var(--gold-dark)" />
              <h4>Safe & Verified</h4>
              <p>You are browsing the official Bella Skin shop via TikTok's secure platform.</p>
              <div className="tech-specs">
                 <p>Cloud Instance: Active</p>
                 <p>Latency: 12ms</p>
                 <p>Frame: {frameType.toUpperCase()}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokEmulator;
