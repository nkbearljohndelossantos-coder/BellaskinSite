import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import './ContactForm.css';

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form data:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="contact-success container section-padding text-center">
        <div className="success-card glass">
          <CheckCircle size={64} color="var(--gold)" />
          <h2>Message Sent!</h2>
          <p>Thank you for reaching out to Bella Skin. We'll get back to you within 24-48 hours.</p>
          <button className="btn-primary" onClick={() => setSubmitted(false)}>Send Another Message</button>
        </div>
      </div>
    );
  }

  return (
    <section className="contact-section container section-padding">
      <div className="contact-header text-center">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle">We'd love to hear from you. Have a question about our products or your order?</p>
      </div>

      <div className="contact-grid">
        {/* Contact Info */}
        <div className="contact-info">
          <h3>Get In Touch</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Our dedicated support team is ready to assist you with any inquiries, product questions, or feedback.
          </p>
          
          <div className="info-items">
            <div className="info-item">
              <div className="icon-box">
                <Mail size={24} />
              </div>
              <div>
                <h4>Email</h4>
                <p>support@bellaskin.ph</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon-box">
                <Phone size={24} />
              </div>
              <div>
                <h4>Phone</h4>
                <p>+63 912 345 6789</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon-box">
                <MapPin size={24} />
              </div>
              <div>
                <h4>Headquarters</h4>
                <p>Manila, Philippines</p>
              </div>
            </div>
          </div>
          
          <div className="global-support-badge" style={{ marginTop: '2.5rem', padding: '1.5rem', borderRadius: '15px', background: 'var(--gold-light)', border: '1px dashed var(--gold)' }}>
             <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gold-dark)', fontWeight: '600', textAlign: 'center' }}>
               ✨ 24/7 Global Support Available for Authorized Resellers
             </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-wrapper">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Juan Dela Cruz" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="juan@example.com" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                placeholder="Product Inquiry" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="How can we help you today?" 
                rows="5" 
                required 
              ></textarea>
            </div>
            
            <button type="submit" className="btn-primary submit-btn">
              <span>Send Message</span>
              <Send size={20} style={{ marginLeft: '10px' }} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
