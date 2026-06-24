import React, { useState, useEffect } from 'react';
import { supabase, resolveImageUrl } from '../lib/supabaseClient';
import './ProductSections.css';

const ProductCard = ({ product, onClick }) => (
  <div className="product-card" onClick={onClick}>
    <div className="product-img-wrapper">
      <div className="product-badge-overlay">
        <span className="preferred-badge">Preferred</span>
        {product.is_best_seller && <span className="mall-ribbon">Mall</span>}
      </div>
      <img src={resolveImageUrl(product.image_url) || resolveImageUrl(product.img)} alt={product.name} />
      <button className="add-to-cart-btn">View Details</button>
    </div>
    <div className="product-info">
      <h3>{product.name}</h3>
      <div className="product-meta-row">
        <span className="product-sold-count">
          {Math.floor(Math.random() * 500) + 100} sold
        </span>
      </div>
    </div>
  </div>
);

const CollectionFeaturedCard = ({ product, onClick }) => (
  <div className="featured-card-wrapper" onClick={onClick}>
    <div className="featured-card">
      <img src={resolveImageUrl(product.image_url) || resolveImageUrl(product.img)} alt={product.name} />
      <div className="featured-card__content">
        <p className="featured-card__title">{product.name}</p>
        <p className="featured-card__description">{product.description || 'Experience the premium quality of Bella Skin.'}</p>
        <button className="featured-card__btn">Shop Now</button>
      </div>
    </div>
  </div>
);

const ProductSections = () => {
  const [products, setProducts] = useState([]);
  const [whatsNew, setWhatsNew] = useState(null);

  const navigateToProduct = (id) => {
    window.location.href = `/product/${id}`;
  };

  useEffect(() => {
    async function fetchData() {
      // Fetch Products
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*');
      
      if (!productError && productData && productData.length > 0) {
        setProducts(productData);
      } else {
        setProducts([]);
      }

      // Fetch What's New Banner
      const { data: newsData, error: newsError } = await supabase
        .from('whats_new')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!newsError && newsData && newsData.length > 0) {
        setWhatsNew(newsData[0]);
      }
    }

    fetchData();
  }, []);
  return (
    <div className="product-sections">
      {/* New Arrivals */}
      <section className="container section-padding">
        <h2 className="section-title">New Arrivals</h2>
        <div className="product-grid">
          {products.filter(p => p.is_new_arrival).map(product => (
            <ProductCard key={product.id} product={product} onClick={() => navigateToProduct(product.id)} />
          ))}
        </div>
      </section>

      {/* Break / Banner */}
      {whatsNew ? (
        <section className="banner-section" style={whatsNew.image_url ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${resolveImageUrl(whatsNew.image_url)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          <div className="banner-content">
            <h2>{whatsNew.title}</h2>
            <p>{whatsNew.content}</p>
            <a href={whatsNew.link_url || '#'} className="btn-primary" style={{backgroundColor: 'var(--white)', color: 'var(--gold-dark)'}}>Our Story</a>
          </div>
        </section>
      ) : null}

      {/* Best Sellers */}
      <section className="container section-padding">
        <h2 className="section-title">Best Sellers</h2>
        <div className="product-grid">
          {products.filter(p => p.is_best_seller).map(product => (
            <ProductCard key={product.id} product={product} onClick={() => navigateToProduct(product.id)} />
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="container section-padding bg-alt">
        <h2 className="section-title">Featured Collections</h2>
        <div className="product-grid">
          {products.filter(p => p.category === 'featured' || p.category === 'skincare').slice(0, 4).map(product => (
            <CollectionFeaturedCard key={product.id} product={product} onClick={() => navigateToProduct(product.id)} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductSections;
