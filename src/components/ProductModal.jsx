import React, { useMemo, useState, useEffect } from 'react';
import { X, Star, ShieldCheck, Truck, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { resolveImageUrl, normalizeGalleryUrls } from '../lib/supabaseClient';
import './ProductModal.css';

const ProductModal = ({ product, onClose }) => {
  const normalizeParagraph = (value = '') => value.replace(/\s+/g, ' ').trim();
  const normalizeMultiline = (value = '') =>
    value
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.trim().replace(/\s+/g, ' '))
      .reduce((acc, line) => {
        const isBlank = line === '';
        const isBullet = /^[-*•]\s*/.test(line);
        const isHeading = /:\s*$/.test(line);
        const prev = acc.length ? acc[acc.length - 1] : '';
        const prevIsBlank = prev === '';
        const prevIsBullet = /^[-*•]\s*/.test(prev);
        const prevIsHeading = /:\s*$/.test(prev);

        if (isBlank) {
          if (!prevIsBlank && acc.length) acc.push('');
          return acc;
        }

        if (!acc.length || prevIsBlank || isBullet || isHeading || prevIsBullet || prevIsHeading) {
          acc.push(line);
          return acc;
        }

        acc[acc.length - 1] = `${prev} ${line}`.trim();
        return acc;
      }, [])
      .join('\n')
      .trim();
  const parseList = (value = '') =>
    value
      .split(/[\n,•]/)
      .map((item) => normalizeParagraph(item))
      .filter(Boolean);

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const galleryImages = useMemo(() => {
    const fromGallery = normalizeGalleryUrls(
      product?.gallery_urls ?? product?.gallery ?? product?.images ?? product?.image_urls
    );
    const main = resolveImageUrl(product?.image_url) || resolveImageUrl(product?.img);
    const merged = [main, ...fromGallery].filter(Boolean);
    const uniq = [];
    for (const url of merged) {
      const fixed = resolveImageUrl(url) || url;
      if (!fixed) continue;
      if (!uniq.includes(fixed)) uniq.push(fixed);
    }
    return uniq.length ? uniq : [main].filter(Boolean);
  }, [product]);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [product?.id]);

  if (!product) return null;

  // Split benefits and ingredients if they are comma-separated strings
  const benefitsList = parseList(product.benefits || '');
  const ingredientsList = parseList(product.ingredients || '');

  const mainSrc = galleryImages[activeImageIdx] || galleryImages[0];

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-container glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close-icon" onClick={onClose}>
          <X size={28} />
        </div>

        <div className="product-modal-body">
          {/* Left: Image */}
          <div className="modal-image-section">
            {galleryImages.length > 1 && (
              <div className="modal-gallery-thumbs" role="tablist" aria-label="Product images">
                {galleryImages.map((src, idx) => (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    role="tab"
                    className={`modal-gallery-thumb ${idx === activeImageIdx ? 'is-active' : ''}`}
                    onClick={() => setActiveImageIdx(idx)}
                    aria-selected={idx === activeImageIdx}
                    aria-label={`Image ${idx + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
            <div className="main-image-display">
              <img src={mainSrc} alt={product.name} />
            </div>
            
            {/* Professional Badges */}
            <div className="highlight-list">
                <div className="highlight-item">
                    <ShieldCheck className="highlight-check" size={18} />
                    <span>100% Authentic Product</span>
                </div>
                <div className="highlight-item">
                    <RefreshCw className="highlight-check" size={18} />
                    <span>15 Days Return Policy</span>
                </div>
                <div className="highlight-item">
                    <Truck className="highlight-check" size={18} />
                    <span>Free Shipping (P500 min)</span>
                </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="modal-content-section">
            <div className="product-badge-row">
              <span className="mall-badge">Bella Mall</span>
              <span style={{color: 'var(--shopee-orange)', fontSize: '0.8rem', fontWeight: 'bold'}}>Preferred</span>
            </div>

            <h2 className="product-modal-title">{normalizeParagraph(product.name || '')}</h2>

            <div className="product-stats-row">
              <div className="rating-stars">
                <span style={{color: 'var(--text-main)', fontWeight: 'bold', marginRight: '4px'}}>5.0</span>
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <div className="sales-count" style={{borderRight: '1px solid var(--border-light)', paddingRight: '15px'}}>
                <span style={{color: 'var(--text-main)', fontWeight: 'bold'}}>1.2k</span> Ratings
              </div>
              <div className="sales-count">
                <span style={{color: 'var(--text-main)', fontWeight: 'bold'}}>2.8k</span> Sold
              </div>
            </div>

            <div className="price-banner" style={{ display: 'none' }}>
              <div className="current-price">{product.price || '0.00'}</div>
            </div>

            <div className="product-specifications">
               <div className="specs-row">
                  <span className="spec-label">Category</span>
                  <span className="spec-value" style={{textTransform: 'capitalize'}}>{product.category}</span>
               </div>
               <div className="specs-row">
                  <span className="spec-label">Brand</span>
                  <span className="spec-value">Bella Skin PH</span>
               </div>
               <div className="specs-row">
                  <span className="spec-label">Stock</span>
                  <span className="spec-value">Available</span>
               </div>
               {ingredientsList.length > 0 && (
                  <div className="specs-row">
                      <span className="spec-label">Ingredients</span>
                      <span className="spec-value">
                        {ingredientsList.slice(0, 3).join(', ') + (ingredientsList.length > 3 ? '...' : '')}
                      </span>
                  </div>
               )}
            </div>

          </div>
        </div>

        {/* Detailed Info Bottom Section */}
        <div className="product-details-container">
          {(benefitsList.length > 0 || product.category) && (
            <>
              <div className="details-section-title">Product Specifications</div>
              <div className="specs-table" style={{marginBottom: '30px'}}>
                 <div className="specs-row">
                      <span className="spec-label">Category</span>
                      <span className="spec-value" style={{textTransform: 'capitalize'}}>{product.category || 'Beauty'}</span>
                 </div>
                 {benefitsList.length > 0 && (
                    <div className="specs-row">
                        <span className="spec-label">Key Benefits</span>
                        <span className="spec-value">{benefitsList.join(' • ')}</span>
                    </div>
                 )}
                 <div className="specs-row">
                      <span className="spec-label">Ships From</span>
                      <span className="spec-value">Metro Manila, Philippines</span>
                 </div>
              </div>
            </>
          )}

          {product.description && (
            <>
              <div className="details-section-title">Product Description</div>
              <p className="description-text" style={{ whiteSpace: 'pre-wrap' }}>
                {normalizeMultiline(product.description)}
              </p>
            </>
          )}

          {product.usage && (
            <>
              <div className="details-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} /> How to Use
              </div>
              <p className="description-text" style={{ whiteSpace: 'pre-wrap' }}>
                {normalizeMultiline(product.usage)}
              </p>
            </>
          )}

          {product.caution && (
            <>
              <div className="details-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d0011b' }}>
                <AlertCircle size={18} /> Caution / Warning
              </div>
              <div style={{ background: '#fff8f8', padding: '15px', borderRadius: '4px', borderLeft: '4px solid #d0011b', marginBottom: '30px' }}>
                <p className="description-text" style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                    {normalizeMultiline(product.caution)}
                </p>
              </div>
            </>
          )}

          {ingredientsList.length > 0 && (
            <>
               <div className="details-section-title">Ingredients List</div>
               <p className="description-text" style={{ fontSize: '0.85rem' }}>
                 {ingredientsList.join(', ')}
               </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
