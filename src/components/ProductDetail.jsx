import React, { useMemo, useState, useEffect } from 'react';
import { supabase, resolveImageUrl, normalizeGalleryUrls } from '../lib/supabaseClient';
import { Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, UserPlus, ArrowLeft, Clock, X } from 'lucide-react';
import './RejuvenatingSet.css';
import './ProductDetail.css';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
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

  // Simple dynamic routing: get ID from URL /product/:id
  const pathParts = window.location.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];

  // Hooks that must run on every render (avoid calling hooks after early returns)
  const benefitsList = useMemo(() => parseList(product?.benefits || ''), [product]);
  const ingredientsList = useMemo(() => parseList(product?.ingredients || ''), [product]);

  const images = useMemo(() => {
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

  const sizes = useMemo(() => {
    const raw = product?.sizes || product?.size_options || product?.variants;
    const asArray = Array.isArray(raw)
      ? raw
      : typeof raw === 'string'
        ? raw.split(/[\n,]/).map((v) => v.trim()).filter(Boolean)
        : [];
    const normalized = asArray
      .map((v) => (typeof v === 'string' ? v : v?.label || v?.name || v?.size))
      .filter(Boolean);
    return normalized.length ? normalized : ['50ml', '100ml'];
  }, [product]);

  const colors = useMemo(() => {
    const raw = product?.colors || product?.color_options;
    const asArray = Array.isArray(raw)
      ? raw
      : typeof raw === 'string'
        ? raw.split(/[\n,]/).map((v) => v.trim()).filter(Boolean)
        : [];
    const normalized = asArray
      .map((v) => (typeof v === 'string' ? v : v?.label || v?.name || v?.color))
      .filter(Boolean);
    return normalized;
  }, [product]);

  useEffect(() => {
    setActiveImageIdx(0);
    setSelectedSize((prev) => (prev ? prev : sizes[0] || ''));
  }, [productId, sizes]);

  const brand = useMemo(
    () => normalizeParagraph(product?.brand || product?.vendor || product?.maker || 'Bella Skin PH'),
    [product]
  );
  const inStock = useMemo(() => {
    const raw = product?.in_stock ?? product?.is_in_stock ?? product?.stock ?? product?.inventory;
    if (typeof raw === 'boolean') return raw;
    if (typeof raw === 'number') return raw > 0;
    if (typeof raw === 'string') return raw.trim().toLowerCase() !== 'out of stock';
    return true;
  }, [product]);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxSrc(null);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxSrc]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (fetchError) throw fetchError;
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="product-detail-page pd-state">
         <div className="loading-spinner"></div>
         <p>Loading product details…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page pd-state">
        <div className="pd-error-card">
         <h2>Product not found</h2>
         <p>We couldn’t find the product you’re looking for. It may have been removed or the link is incorrect.</p>
         <a href="/" className="btn-primary">Back to home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page fade-in">
      <div className="container pd-breadcrumb">
        <a href="/" className="pd-back-link">
          <ArrowLeft size={18} aria-hidden /> Back to collection
        </a>
      </div>

      <section className="pd-hero container section-padding">
        <div className="pd-hero-grid pd-hero-grid--minimal">
          <div className="pd-gallery pd-gallery--minimal">
            <div className="pd-gallery-layout">
              <div className="pd-gallery-rail" aria-label="Product images">
                {images.map((src, idx) => (
                  <button
                    type="button"
                    key={`${src}-${idx}`}
                    className={`pd-gallery-thumb ${idx === activeImageIdx ? 'is-active' : ''}`}
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>

              {images.length > 0 ? (
                <div
                  className="pd-gallery-frame pd-gallery-frame--minimal pd-gallery-frame--openable"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    const src = images[activeImageIdx] || images[0];
                    if (src) setLightboxSrc(src);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const src = images[activeImageIdx] || images[0];
                      if (src) setLightboxSrc(src);
                    }
                  }}
                  aria-label="View full-size image"
                >
                  <img src={images[activeImageIdx] || images[0]} alt={product.name} />
                </div>
              ) : (
                <div className="pd-gallery-frame pd-gallery-frame--minimal pd-gallery-frame--empty" aria-hidden>
                  <span className="pd-gallery-empty-label">No image yet</span>
                </div>
              )}
            </div>
          </div>

          <div className="pd-info pd-info--minimal">
            <div className="pd-topline">
              {inStock && <span className="pd-stock">In stock</span>}
              {!inStock && <span className="pd-stock pd-stock--out">Out of stock</span>}
            </div>

            <div className="pd-brand pd-brand--minimal">{brand}</div>
            <h1 className="product-title pd-title pd-title--minimal">{normalizeParagraph(product.name || '')}</h1>

            <div className="pd-option-block">
              <div className="pd-size-label">Size</div>
              <div className="pd-chip-row" role="group" aria-label="Size">
                {sizes.map((sz) => (
                  <button
                    type="button"
                    key={sz}
                    className={`pd-chip ${sz === selectedSize ? 'is-selected' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {colors.length > 0 && (
              <div className="pd-option-block">
                <div className="pd-size-label">Color</div>
                <div className="pd-color-row" aria-label="Color options">
                  {colors.slice(0, 6).map((c) => (
                    <span key={c} className="pd-color-dot" title={c} aria-label={c}></span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {lightboxSrc && (
        <div
          className="pd-image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged product image"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            className="pd-image-lightbox-close"
            onClick={() => setLightboxSrc(null)}
            aria-label="Close"
          >
            <X size={28} aria-hidden />
          </button>
          <img src={lightboxSrc} alt={product.name} onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <section className="container pd-description-block section-padding" aria-labelledby="pd-description-heading">
        <h2 id="pd-description-heading" className="pd-description-heading">
          Description
        </h2>
        <div className="pd-description-body">
          <p className="pd-tab-text">
            {normalizeMultiline(product.detail || product.details || product.long_description || product.description || '') ||
              'No description available yet for this product.'}
          </p>
          {benefitsList.length > 0 && (
            <div className="pd-highlights pd-highlights--minimal" aria-label="Highlights">
              {benefitsList.slice(0, 3).map((benefit, idx) => (
                <div className="pd-highlight" key={idx}>
                  <Sparkles size={18} aria-hidden />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {benefitsList.length > 0 && (
        <section className="benefits-section pd-benefits-section bg-alt section-padding">
            <div className="container">
            <div className="pd-section-head">
                <span className="pd-section-eyebrow">Benefits</span>
                <h2 className="section-title">Why you&apos;ll love it</h2>
                <p className="section-subtitle">Thoughtfully formulated for visible results you can feel good about.</p>
            </div>
            
            <div className="pd-benefit-grid">
                {benefitsList.map((benefit, idx) => (
                    <div className="benefit-card glass text-center pd-benefit-card" key={idx}>
                        <ShieldCheck size={36} color="var(--gold-dark)" className="benefit-icon" />
                        <h3>{benefit}</h3>
                        <p>Part of the {product.name} experience—crafted for radiant, healthy-looking skin.</p>
                    </div>
                ))}
            </div>
            </div>
        </section>
      )}

      <section className="details-section container section-padding">
        <div className="pd-details-grid">
           <div className="pd-card fade-in">
              <h3 className="pd-card-title">Active ingredients</h3>
              <ul className="custom-list pd-ingredient-list">
                 {ingredientsList.length > 0 ? ingredientsList.map((ing, idx) => (
                    <li key={idx}>
                        <div className="pd-ingredient-row">
                            <CheckCircle2 size={18} color="var(--gold-dark)" aria-hidden />
                            <span>{ing}</span>
                        </div>
                    </li>
                 )) : <li>Full ingredient list available upon request.</li>}
              </ul>
           </div>

           <div className="detail-column">
              {product.usage && (
                <div className="pd-card mb-4">
                    <h3 className="pd-card-title">
                        <Clock size={22} color="var(--gold-dark)" aria-hidden /> How to use
                    </h3>
                    <p className="pd-card-body">
                        {normalizeMultiline(product.usage)}
                    </p>
                </div>
              )}

              {product.caution && (
                <div className="pd-card pd-card--caution mb-4">
                    <h3 className="pd-card-title">
                        <AlertTriangle size={22} aria-hidden /> Precautions
                    </h3>
                    <p className="pd-card-body pd-card-body--muted">
                        {normalizeMultiline(product.caution)}
                    </p>
                </div>
              )}
              
              <div className="pd-card pd-affiliate">
                <UserPlus size={36} color="var(--gold-dark)" aria-hidden />
                <h3>Bella affiliate</h3>
                <p>Share the glow—earn when others shop Bella Skin through our affiliate program.</p>
                <a href="/affiliate" className="btn-primary">Learn more</a>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
