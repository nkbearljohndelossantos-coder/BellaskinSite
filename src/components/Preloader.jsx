import React from 'react';
import './Preloader.css';

const Preloader = ({ fadeOut }) => {
  return (
    <div className={`preloader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-container">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <img src="/Logo.png" alt="Bella Skin" className="loader-logo" />
      </div>
    </div>
  );
};

export default Preloader;
