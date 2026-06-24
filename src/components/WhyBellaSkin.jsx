import React from 'react';
import { Star, Leaf, Award, Heart } from 'lucide-react';
import './ProductSections.css'; // Reuse container and section styles

const WhyBellaSkin = () => {
  return (
    <div className="why-bella-skin">
      {/* Our Story Header */}
      <section className="banner-section" style={{height: '400px'}}>
        <div className="banner-content">
          <h1 className="section-title" style={{color: 'var(--white)'}}>Our Story</h1>
          <p style={{maxWidth: '800px', margin: '0 auto'}}>
            Born from a passion for natural beauty and scientific innovation, Bella Skin was founded to provide 
            premium, effective skincare solutions that celebrate your natural glow.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container section-padding">
        <div className="text-center" style={{marginBottom: '4rem'}}>
          <h2 className="section-title">The Bella Skin Philosophy</h2>
          <p className="section-subtitle">We believe that skincare should be an act of self-care and a celebration of your unique beauty.</p>
        </div>

        <div className="product-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
          <div className="philosophy-item glass text-center" style={{padding: '3rem 2rem'}}>
            <Leaf size={48} color="var(--gold-dark)" style={{marginBottom: '1.5rem'}} />
            <h3>Natural Ingredients</h3>
            <p>We source the finest botanical extracts and natural oils to ensure your skin receives gentle yet powerful nourishment.</p>
          </div>
          
          <div className="philosophy-item glass text-center" style={{padding: '3rem 2rem'}}>
            <Award size={48} color="var(--gold-dark)" style={{marginBottom: '1.5rem'}} />
            <h3>Proven Efficacy</h3>
            <p>Our formulas are dermatologically tested and scientifically proven to deliver visible results for all skin types.</p>
          </div>
          
          <div className="philosophy-item glass text-center" style={{padding: '3rem 2rem'}}>
            <Heart size={48} color="var(--gold-dark)" style={{marginBottom: '1.5rem'}} />
            <h3>Cruelty Free</h3>
            <p>We are committed to ethical beauty. None of our products or ingredients are ever tested on animals.</p>
          </div>
        </div>
      </section>

      {/* Ingredient Spotlight */}
      <section className="container section-padding bg-alt">
        <div className="ingredient-spotlight" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center'}}>
          <div className="ingredient-img-wrapper glass" style={{padding: '1rem', borderRadius: '16px'}}>
            <img 
              src="https://images.unsplash.com/photo-1596751303335-ca42b3ca50c1?q=80&w=800&auto=format&fit=crop" 
              alt="Natural Rose Ingredients" 
              style={{width: '100%', borderRadius: '12px', display: 'block'}}
            />
          </div>
          <div className="ingredient-content">
            <h2 className="section-title" style={{textAlign: 'left'}}>Nature's Purest Glow</h2>
            <p style={{marginBottom: '2rem'}}>
              At the heart of our Signature Collection is our proprietary Bulgarian Rose extract, 
              known for its incredible hydrating and anti-aging properties. We combine this with 
              24K Gold particles to stimulate collagen production and leave your skin with an 
              irresistible luminosity.
            </p>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li style={{display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center'}}>
                <div style={{width: '8px', height: '8px', backgroundColor: 'var(--gold)', borderRadius: '50%'}}></div>
                <span>Sustainably Sourced Red Roses</span>
              </li>
              <li style={{display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center'}}>
                <div style={{width: '8px', height: '8px', backgroundColor: 'var(--gold)', borderRadius: '50%'}}></div>
                <span>Cold-Pressed Essential Oils</span>
              </li>
              <li style={{display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center'}}>
                <div style={{width: '8px', height: '8px', backgroundColor: 'var(--gold)', borderRadius: '50%'}}></div>
                <span>Pharmaceutical Grade 24K Gold</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Customer Reviews / Rating Board */}
      <section className="container section-padding">
        <div className="text-center" style={{marginBottom: '4rem'}}>
          <h2 className="section-title">Loved by Thousands</h2>
          <div style={{display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '1rem'}}>
             {[1,2,3,4,5].map(i => <Star key={i} size={24} fill="var(--gold)" color="var(--gold)" />)}
          </div>
          <p>4.9/5 based on 10,000+ happy customers</p>
        </div>

        <div className="product-grid">
          {[
            { name: "Maria Clara", review: "The Rose Gold Elixir is a game changer! My skin has never looked more radiant.", role: "Verified Buyer" },
            { name: "Ana Santos", review: "I love how gentle yet effective the Kojic Soap is. It cleared my dark spots in weeks.", role: "Beauty Influencer" },
            { name: "Bea Reyes", review: "Bella Skin is the only brand I trust for my sensitive skin. Highly recommended!", role: "Skin Enthusiast" }
          ].map((r, i) => (
            <div key={i} className="review-card glass" style={{padding: '2rem'}}>
              <div style={{display: 'flex', gap: '0.25rem', marginBottom: '1rem'}}>
                 {[1,2,3,4,5].map(j => <Star key={j} size={16} fill="var(--gold)" color="var(--gold)" />)}
              </div>
              <p style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>{r.review}</p>
              <div>
                <h4 style={{marginBottom: '0.25rem'}}>{r.name}</h4>
                <p style={{fontSize: '0.9rem', color: 'var(--gold-dark)'}}>{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WhyBellaSkin;
