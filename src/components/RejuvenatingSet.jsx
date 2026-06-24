import React from 'react';
import { Sparkles, ShieldCheck, Sun, Droplets, CheckCircle2, AlertTriangle, UserPlus } from 'lucide-react';
import './RejuvenatingSet.css';

const RejuvenatingSet = () => {
  return (
    <div className="product-detail-page">
      {/* Product Hero Section */}
      <section className="product-hero container section-padding">
        <div className="product-hero-grid">
          <div className="product-gallery">
            <div className="glass gallery-main">
              {/* Note: I'm using placeholder paths. Please put your provided images in the public folder and name them rejuv-set-1.png and rejuv-set-2.png */}
              <img src="/rejuv-set-1.png" alt="Bella Skin Rejuvenating Set" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop" }} />
            </div>
            <div className="gallery-thumbnails">
               <div className="glass thumbnail active">
                  <img src="/rejuv-set-1.png" alt="Rejuvenating Set View 1" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop" }} />
               </div>
               <div className="glass thumbnail">
                  <img src="/rejuv-set-2.png" alt="Rejuvenating Set View 2" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=300&auto=format&fit=crop" }} />
               </div>
            </div>
          </div>
          
          <div className="product-info-main">
            <div className="badge">Best Seller</div>
            <h1 className="product-title">Bella Skin Facial Set</h1>
            <p className="product-price">₱399.00</p>
            
            <p className="product-description">
              Experience a complete skin transformation with the Bella Skin Premium Rejuvenating Set. 
              Expertly formulated to exfoliate, brighten, and renew your complexion for that ultimate glass-skin glow.
            </p>
            
            <button className="btn-primary add-cart-large">Add to Cart</button>
            
            <div className="quick-benefits">
               <div className="qb-item"><Sparkles size={20} color="var(--gold)" /> <span>Brightens Skin</span></div>
               <div className="qb-item"><ShieldCheck size={20} color="var(--gold)" /> <span>Reduces Wrinkles</span></div>
               <div className="qb-item"><Droplets size={20} color="var(--gold)" /> <span>Evens Skin Tone</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="benefits-section bg-alt section-padding">
        <div className="container">
          <div className="text-center" style={{marginBottom: '3rem'}}>
            <h2 className="section-title">Key Benefits</h2>
            <p className="section-subtitle">Achieve your best skin yet with our carefully balanced formula.</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card glass text-center">
              <Sparkles size={40} color="var(--gold-dark)" className="benefit-icon" />
              <h3>Exfoliates & Brightens</h3>
              <p>AHA gently removes dead skin cells, revealing smoother and brighter skin.</p>
            </div>
            <div className="benefit-card glass text-center">
               <ShieldCheck size={40} color="var(--gold-dark)" className="benefit-icon" />
               <h3>Reduces Fine Lines</h3>
               <p>Retinol promotes cell turnover, minimizing the appearance of fine lines and wrinkles.</p>
            </div>
            <div className="benefit-card glass text-center">
               <Sun size={40} color="var(--gold-dark)" className="benefit-icon" />
               <h3>Improves Skin Tone</h3>
               <p>Niacinamide helps to even out skin tone and reduce hyperpigmentation.</p>
            </div>
            <div className="benefit-card glass text-center">
               <Droplets size={40} color="var(--gold-dark)" className="benefit-icon" />
               <h3>Soothes & Calms</h3>
               <p>Iris Florentina Extract provides antioxidant and anti-inflammatory benefits, calming the skin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Ingredients & Usage */}
      <section className="details-section container section-padding">
        <div className="details-grid">
           {/* Ingredients */}
           <div className="detail-block glass">
              <h3 className="block-title">Active Ingredients</h3>
              <ul className="custom-list">
                 <li>
                    <strong>Niacinamide (5%):</strong> A powerful antioxidant that improves skin elasticity, reduces inflammation, and enhances skin brightness.
                 </li>
                 <li>
                    <strong>AHA (Alpha Hydroxy Acid):</strong> Gently exfoliates the skin, removing dead skin cells and promoting cell turnover.
                 </li>
                 <li>
                    <strong>Iris Florentina Extract:</strong> Provides antioxidant and anti-inflammatory benefits, soothing and calming the skin.
                 </li>
                 <li>
                    <strong>Retinol:</strong> Stimulates collagen production, reduces fine lines and wrinkles, and improves skin texture.
                 </li>
              </ul>
           </div>

           {/* Directions & Suitability */}
           <div className="detail-column">
              <div className="detail-block glass mb-4">
                 <h3 className="block-title">Directions for Use</h3>
                 <ol className="custom-list numbered">
                    <li>After cleansing, sweep the toner across the face and neck with a cotton pad.</li>
                    <li>Use morning and night, before applying other skincare products.</li>
                 </ol>
              </div>

              <div className="detail-block glass mb-4">
                 <h3 className="block-title"><AlertTriangle size={20} color="var(--gold)" style={{marginRight: '8px', verticalAlign: 'middle'}}/>Precautions</h3>
                 <ul className="custom-list">
                    <li><strong>Sun Sensitivity:</strong> AHA and Retinol can increase sun sensitivity. Use a broad-spectrum sunscreen with at least SPF 30 daily.</li>
                    <li><strong>Patch Test:</strong> Perform a patch test before using the product, especially if you have sensitive skin.</li>
                 </ul>
              </div>

              <div className="detail-block glass">
                 <h3 className="block-title"><UserPlus size={20} color="var(--gold)" style={{marginRight: '8px', verticalAlign: 'middle'}}/>Suitable For</h3>
                 <ul className="custom-list">
                    <li><strong>Normal to Combination Skin:</strong> Helps to balance skin tone and texture.</li>
                    <li><strong>Dull Skin:</strong> Exfoliates and brightens the skin.</li>
                    <li><strong>Aging Skin:</strong> Reduces fine lines and wrinkles.</li>
                 </ul>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default RejuvenatingSet;
