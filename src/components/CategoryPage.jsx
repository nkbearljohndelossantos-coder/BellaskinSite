import React, { useState, useEffect } from 'react';
import { supabase, resolveImageUrl } from '../lib/supabaseClient';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import './ProductSections.css'; // Reuse product grid styles

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get category from URL
  const path = window.location.pathname;
  const categorySlug = path.split('/').pop();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (categorySlug === 'best') {
          query = query.eq('is_best_seller', true);
        } else if (categorySlug === 'new') {
          query = query.eq('is_new_arrival', true);
        } else {
          query = query.eq('category', categorySlug);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categorySlug]);

  const categoryMapping = {
    'skincare': 'Rejuvenating Sets',
    'sunscreen': 'Sunscreens',
    'lotion': 'Lotion',
    'serum': 'Serum',
    'lipbalm': 'Lip Balms',
    'deospray': 'Deo Sprays',
    'kojic': 'Kojic Soaps',
    'toner': 'Glow Toners',
    'mask': 'Overnight Masks',
    'facialwash': 'Facial Wash',
    'shampoo': 'Shampoo',
    'conditioner': 'Conditioner',
    'bodyscrub': 'Body Scrub',
    'hairserum': 'Hair Serum',
    'bodymist': 'Body Mist',
    'best': 'Best Sellers Collection',
    'new': 'New Arrivals'
  };

  const categoryTitle = categoryMapping[categorySlug] || (categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 'Products');

  return (
    <div className="category-page bg-alt" style={{ minHeight: '80vh', paddingBottom: '4rem' }}>
      {/* Breadcrumbs */}
      <div className="container" style={{ padding: '20px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <a href="/" style={{ color: 'inherit' }}>Home</a> 
        <ChevronRight size={14} style={{ margin: '0 8px', verticalAlign: 'middle' }} /> 
        <span style={{ color: 'var(--gold-dark)', fontWeight: 'bold' }}>{categoryTitle}</span>
      </div>

      <section className="container">
        <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 className="section-title">{categoryTitle}</h2>
          <p className="section-subtitle">Discover our premium collection of {categoryTitle} for that healthy glow.</p>
        </div>

        {loading ? (
          <div className="text-center" style={{ padding: '4rem' }}>
             <p>Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map(product => (
              <div className="product-card" key={product.id} onClick={() => window.location.href = `/product/${product.id}`}>
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
            ))}
          </div>
        ) : (
          <div className="text-center glass" style={{ padding: '4rem', margin: '2rem 0' }}>
            <ShoppingBag size={48} color="var(--cream-dark)" style={{ marginBottom: '1rem' }} />
            <h3>No Products Found</h3>
            <p>We are currently updating our {categoryTitle} collection. Check back soon!</p>
            <a href="/" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Back to Home</a>
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
