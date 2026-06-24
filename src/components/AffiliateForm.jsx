import React, { useState } from 'react';
import { AtSign, Building2 } from 'lucide-react';
import './AffiliateForm.css';

const promoMethods = [
  'Social media\nmarketing',
  'Blogging',
  'Email marketing',
  'Influencer\npartnerships',
  'Paid advertising\n(PPC)',
  'Podcasts',
  'YouTube / Video',
  'Community\nengagement',
  'Other'
];

const AffiliateForm = () => {
  const [selectedMethods, setSelectedMethods] = useState([]);

  const toggleMethod = (method) => {
    if (selectedMethods.includes(method)) {
      setSelectedMethods(selectedMethods.filter(m => m !== method));
    } else {
      if (selectedMethods.length < 3) {
        setSelectedMethods([...selectedMethods, method]);
      }
    }
  };

  return (
    <div className="affiliate-page">
      <div className="affiliate-container">
        <div className="affiliate-header">
          <img src="/Logo.png" alt="BellaSkin Logo" className="affiliate-logo" />
          <h2>Affiliate Signup</h2>
          <p>Join our affiliate program and start earning today.</p>
        </div>

        <form className="affiliate-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row two-cols">
            <input type="text" placeholder="First name" className="form-input" />
            <input type="text" placeholder="Last name" className="form-input" />
          </div>

          <div className="form-row input-with-icon">
            <input type="email" placeholder="email" className="form-input" />
            <AtSign className="input-icon" size={18} />
          </div>

          <div className="form-row input-with-icon">
            <input type="text" placeholder="Contact No" className="form-input" />
            <Building2 className="input-icon" size={18} />
          </div>

          <div className="form-row">
            <input type="url" placeholder="Facebook Link" className="form-input" />
          </div>

          <div className="form-row">
            <input type="url" placeholder="TikTok Link" className="form-input" />
          </div>

          <div className="form-row">
            <select className="form-input form-select">
              <option value="" disabled selected>Business location</option>
              <option value="ph">Philippines</option>
              <option value="intl">International</option>
            </select>
          </div>

          <div className="form-section">
            <label className="section-label">Promotion methods <span className="req">*</span></label>
            <p className="sub-label">Choose most common methods used (up to 3)</p>
            <div className="promo-grid">
              {promoMethods.map((method, idx) => (
                <div 
                  key={idx} 
                  className={`promo-box ${selectedMethods.includes(method) ? 'active' : ''}`}
                  onClick={() => toggleMethod(method)}
                >
                  {method.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="section-label">Previous Affiliate Experience</label>
            <div className="radio-group">
              <label className="radio-box">
                <input type="radio" name="experience" value="yes" />
                <span className="radio-text">Yes</span>
              </label>
              <label className="radio-box">
                <input type="radio" name="experience" value="no" />
                <span className="radio-text">No</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <label className="radio-box full-width">
              <input type="checkbox" required />
              <span className="radio-text">I agree to the terms and conditions</span>
            </label>
          </div>

          <div className="form-submit">
            <button type="submit" className="btn-dark">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AffiliateForm;
