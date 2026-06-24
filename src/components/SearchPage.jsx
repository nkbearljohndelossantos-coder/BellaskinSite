import React, { useState, useEffect } from 'react';
import { supabase, resolveImageUrl } from '../lib/supabaseClient';
import { Search, ShoppingBag, Calendar, ArrowRight } from 'lucide-react';
import './ProductSections.css';

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get search query from URL
  const queryParams = new URLSearchParams(window.location.search);
  const searchTerm = queryParams.get('q') || '';

  useEffect(() => {
    if (searchTerm) {
      performSearch();
    } else {
      setLoading(false);
    }
  }, [searchTerm]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // Search Products
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
      
      if (productError) throw productError;
      setProducts(productData || []);

      // Search Announcements (What's New)
      const { data: newsData, error: newsError } = await supabase
        .from('whats_new')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,subtitle.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      
      if (newsError) throw newsError;
      setNews(newsData || []);

    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-results-page bg-alt" style={{ minHeight: '80vh', paddingBottom: '4rem' }}>
      <section className="container section-padding">
        <div className="search-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 className="section-title" style={{ fontSize: '2.5rem' }}>Search Results</h1>
          <p className="section-subtitle">
            {searchTerm ? (
              <>Showing results for <span style={{ color: 'var(--gold-dark)', fontWeight: 'bold' }}>"{searchTerm}"</span></>
            ) : (
              "Type something in the search bar to find products and stories."
            )}
          </p>
        </div>

        {loading ? (
          <div className="text-center" style={{ padding: '4rem' }}>
            <div className="loading-spinner"></div>
            <p>Searching our collection...</p>
          </div>
        ) : (
          <div className="results-container">
            {/* Products Results */}
            <div className="results-section">
              <h2 style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--gold)', paddingLeft: '15px' }}>Products Found ({products.length})</h2>
              {products.length > 0 ? (
                <div className="product-grid">
                  {products.map(product => (
                    <div className="product-card" key={product.id} onClick={() => window.location.href = `/product/${product.id}`} style={{ cursor: 'pointer' }}>
                      <div className="product-img-wrapper">
                          <div className="product-badge-overlay">
                            {product.is_best_seller && <span className="preferred-badge">Best Seller</span>}
                            {product.is_new_arrival && <span className="mall-ribbon">New Arrival</span>}
                          </div>
                         <img src={resolveImageUrl(product.image_url) || resolveImageUrl(product.img)} alt={product.name} />
                         <button className="add-to-cart-btn">View Details</button>
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <div className="product-meta-row">
                          <span className="product-category-tag">{product.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results-box glass text-center" style={{ padding: '3rem', marginBottom: '3rem' }}>
                  <ShoppingBag size={40} color="var(--cream-dark)" />
                  <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No products match your search.</p>
                </div>
              )}
            </div>

            {/* News/Announcements Results */}
            <div className="results-section" style={{ marginTop: '4rem' }}>
              <h2 style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--gold)', paddingLeft: '15px' }}>Announcements Found ({news.length})</h2>
              {news.length > 0 ? (
                <div className="news-results-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {news.map(item => (
                    <a href={item.link_url || '#'} className="news-result-card glass" key={item.id} style={{ display: 'block', padding: '20px', transition: 'var(--transition)' }}>
                       <div className="news-result-meta" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '0.8rem', color: 'var(--gold-dark)' }}>
                         <Calendar size={14} /> <span>Announcement</span>
                       </div>
                       <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{item.title}</h3>
                       <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                         {item.subtitle || item.content}
                       </p>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--gold-accent)' }}>
                         Read More <ArrowRight size={16} />
                       </span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="no-results-box glass text-center" style={{ padding: '3rem' }}>
                  <Search size={40} color="var(--cream-dark)" />
                  <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No announcements found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && products.length === 0 && news.length === 0 && searchTerm && (
          <div className="global-no-results text-center" style={{ marginTop: '4rem' }}>
            <h2 style={{ color: 'var(--gold-dark)' }}>Oops! No results found.</h2>
            <p>Try searching for different keywords like "facial", "rejuvenating", or "gold".</p>
            <a href="/" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Home Page</a>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchPage;
