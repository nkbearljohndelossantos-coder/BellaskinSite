import React, { useState, useEffect } from 'react';
import { supabase, resolveImageUrl, normalizeGalleryUrls } from '../lib/supabaseClient';
import { LogOut, Package, Megaphone, Plus, Edit, Trash2, X, Star, Settings, ShieldCheck, AlertCircle } from 'lucide-react';
import './AdminDashboard.css';

const parseGalleryUrls = (item) => normalizeGalleryUrls(item?.gallery_urls);

const slotsFromProductItem = (item) => {
  const gallery = parseGalleryUrls(item);
  const seen = new Set();
  const urls = [];
  const add = (u) => {
    if (!u || typeof u !== 'string') return;
    const t = u.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    urls.push(t);
  };
  add(item?.image_url);
  gallery.forEach(add);
  return urls.map((url, i) => ({ id: `saved-${i}-${url.slice(-24)}`, url }));
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [whatsNew, setWhatsNew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteConfigs, setSiteConfigs] = useState({ shopee_link: '', tiktok_link: '', admin_password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  /** @type {{ id: string, url?: string, file?: File, preview?: string }[]} */
  const [productMediaSlots, setProductMediaSlots] = useState([]);
  
  const [productForm, setProductForm] = useState({ 
    name: '', 
    category: 'skincare', 
    price: '', 
    is_best_seller: false, 
    is_new_arrival: false,
    image_url: '',
    description: '',
    ingredients: '',
    benefits: '',
    usage: '',
    caution: ''
  });
  const [newsForm, setNewsForm] = useState({ title: '', subtitle: '', content: '', link_url: '', image_url: '', is_active: true });

  const normalizeParagraph = (value = '') =>
    value
      .replace(/\s+/g, ' ')
      .trim();

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

  const normalizeCommaList = (value = '') =>
    value
      .replace(/\r\n/g, '\n')
      .split(/[\n,•]/)
      .map((item) => item.trim().replace(/\s+/g, ' '))
      .filter(Boolean)
      .join(', ');

  useEffect(() => {
    fetchDashboardData();
    if (activeTab === 'settings') {
      fetchSiteConfigs();
    }
  }, [activeTab]);

  const fetchSiteConfigs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_configs').select('*').eq('id', 'global').single();
    if (!error && data) {
      setSiteConfigs(data);
    }
    setLoading(false);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } else {
        const { data, error } = await supabase.from('whats_new').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setWhatsNew(data || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminRoot');
    window.location.href = '/admin';
  };

  // --- CRUD Operations ---

  const handleOpenForm = (item = null) => {
    setSelectedFile(null);
    productMediaSlots.forEach((s) => {
      if (s.preview) URL.revokeObjectURL(s.preview);
    });
    setProductMediaSlots([]);
    if (item) {
      setEditingId(item.id);
      if (activeTab === 'products') {
        setProductForm({
          name: item.name || '',
          category: item.category || 'skincare',
          price: item.price || '',
          is_best_seller: item.is_best_seller || false,
          is_new_arrival: item.is_new_arrival || false,
          image_url: item.image_url || '',
          description: item.description || '',
          ingredients: item.ingredients || '',
          benefits: item.benefits || '',
          usage: item.usage || '',
          caution: item.caution || ''
        });
        setProductMediaSlots(slotsFromProductItem(item));
        setPreviewUrl('');
      } else {
        setNewsForm(item);
        setPreviewUrl(resolveImageUrl(item.image_url) || '');
      }
    } else {
      setEditingId(null);
      setPreviewUrl('');
      if (activeTab === 'products') {
        setProductForm({ name: '', category: 'skincare', price: '', is_best_seller: false, is_new_arrival: false, image_url: '', description: '', ingredients: '', benefits: '', usage: '', caution: '' });
      } else {
        setNewsForm({ title: '', subtitle: '', content: '', link_url: '', image_url: '', is_active: true });
      }
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl('');
    productMediaSlots.forEach((s) => {
      if (s.preview) URL.revokeObjectURL(s.preview);
    });
    setProductMediaSlots([]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProductMediaFiles = (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    setProductMediaSlots((prev) => [
      ...prev,
      ...files.map((file) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
        return { id, file, preview: URL.createObjectURL(file) };
      })
    ]);
    e.target.value = '';
  };

  const removeProductMediaSlot = (id) => {
    setProductMediaSlots((prev) => {
      const slot = prev.find((s) => s.id === id);
      if (slot?.preview) URL.revokeObjectURL(slot.preview);
      return prev.filter((s) => s.id !== id);
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this item?')) return;
    
    const table = activeTab === 'products' ? 'products' : 'whats_new';
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) alert('Error deleting: ' + error.message);
    fetchDashboardData();
  };

  const handleToggleBestSeller = async (id, currentStatus) => {
    const { error } = await supabase
      .from('products')
      .update({ is_best_seller: !currentStatus })
      .eq('id', id);
    
    if (error) {
      alert('Error updating Best Seller status: ' + error.message);
    } else {
      fetchDashboardData();
    }
  };

  const handleToggleNewArrival = async (id, currentStatus) => {
    const { error } = await supabase
      .from('products')
      .update({ is_new_arrival: !currentStatus })
      .eq('id', id);
    
    if (error) {
      alert('Error updating New Arrival status: ' + error.message);
    } else {
      fetchDashboardData();
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    console.log('Attempting upload to storage/bella-skin...');
    const { error: uploadError } = await supabase.storage
      .from('bella-skin')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Storage Upload Error Detailed:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('bella-skin')
      .getPublicUrl(filePath);

    let finalUrl = data.publicUrl;
    
    // Safety check: ensure /public/ is in the URL to avoid 400 errors
    if (finalUrl && !finalUrl.includes('/public/')) {
        finalUrl = finalUrl.replace('/storage/v1/object/', '/storage/v1/object/public/');
    }

    return finalUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const table = activeTab === 'products' ? 'products' : 'whats_new';
      let payload = activeTab === 'products' ? { ...productForm } : { ...newsForm };

      if (activeTab === 'products') {
        payload = {
          ...payload,
          name: normalizeParagraph(payload.name),
          description: normalizeMultiline(payload.description),
          usage: normalizeMultiline(payload.usage),
          caution: normalizeMultiline(payload.caution),
          benefits: normalizeCommaList(payload.benefits),
          ingredients: normalizeCommaList(payload.ingredients)
        };
      } else {
        payload = {
          ...payload,
          title: normalizeParagraph(payload.title),
          subtitle: normalizeParagraph(payload.subtitle),
          content: normalizeMultiline(payload.content),
          link_url: payload.link_url.trim()
        };
      }
      
      // Remove price to avoid 400 errors in Catalog Mode
      if (activeTab === 'products') {
        delete payload.price;
      }

      if (activeTab === 'products') {
        const urls = [];
        for (const slot of productMediaSlots) {
          if (slot.file) {
            urls.push(await uploadImage(slot.file));
          } else if (slot.url) {
            urls.push(slot.url);
          }
        }
        payload.image_url = urls[0] || '';
        payload.gallery_urls = urls.slice(1);
      } else if (selectedFile) {
        const imageUrl = await uploadImage(selectedFile);
        payload.image_url = imageUrl;
      }

      console.log('Sending payload to Supabase:', payload);

      if (editingId) {
        const { error } = await supabase.from(table).update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert([payload]);
        if (error) throw error;
      }

      setShowForm(false);
      setSelectedFile(null);
      productMediaSlots.forEach((s) => {
        if (s.preview) URL.revokeObjectURL(s.preview);
      });
      setProductMediaSlots([]);
      fetchDashboardData();
    } catch (error) {
      console.error('Submit Error Detailed:', error);
      alert('Error updating website: ' + (error.message || 'Please check the console for details.'));
    } finally {
      setUploading(false);
    }
  };
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setUploading(true);
    // Smart Normalization: Ensure links are browser-ready
    let shopee = siteConfigs.shopee_link.trim();
    let tiktok = siteConfigs.tiktok_link.trim();

    // ⛔ Safety Check for App-only links (snssdk:// etc)
    if (tiktok.toLowerCase().startsWith('snssdk') || tiktok.toLowerCase().startsWith('tiktok://') || tiktok.includes('ec/store') || tiktok.includes('ec/showcase')) {
      if (confirm('❌ BROKEN LINK DETECTED!\n\nThis is a "Mobile App Code" and will NOT work on browsers.\n\nWould you like me to automatically fix it for you?')) {
        setSiteConfigs({ ...siteConfigs, tiktok_link: 'https://www.tiktok.com/@bellaskinmain/shop' });
        alert('Link fixed! Please click "Save All Global Links" to apply the change.');
      }
      setUploading(false);
      return;
    }

    // ⛔ Safety Check for short links (vt.tiktok.com)
    if (tiktok.includes('vt.tiktok.com')) {
      alert('⚠️ Short Link Detected!\n\nLinks starting with "vt.tiktok.com" often show a blank page on computers.\n\nRECOMMENDED FIX:\nUse your Web Shop link instead: https://www.tiktok.com/@bellaskinmain/shop\n\n(I will try to save it, but we recommend replacing it with the full link above for the best experience.)');
    }

    if (shopee && !shopee.startsWith('http')) shopee = 'https://' + shopee;
    if (tiktok && !tiktok.startsWith('http')) tiktok = 'https://' + tiktok;

    const { error } = await supabase.from('site_configs').update({ 
      shopee_link: shopee || 'https://shopee.ph/bellaskinph',
      tiktok_link: tiktok || 'https://www.tiktok.com/@bellaskinph'
    }).eq('id', 'global');
    
    if (error) {
      alert('Error updating settings: ' + error.message);
    } else {
      alert('Settings saved successfully. Changes are now live.');
      fetchSiteConfigs();
    }
    setUploading(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPasswordInput !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    setUploading(true);
    // 1. Verify current password
    const { data: config, error: fetchError } = await supabase.from('site_configs').select('admin_password').eq('id', 'global').single();
    if (fetchError || config.admin_password !== currentPasswordInput) {
      alert('Current password is incorrect.');
      setUploading(false);
      return;
    }

    // 2. Update to new password
    const { error } = await supabase.from('site_configs').update({ admin_password: newPasswordInput }).eq('id', 'global');
    if (error) {
      alert('Error changing password: ' + error.message);
    } else {
      alert('Password updated successfully! Please use your new password next time.');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPassword('');
      fetchSiteConfigs();
    }
    setUploading(false);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar glass">
        <div className="admin-brand">
          <img src="/Logo.png" alt="Bella Skin" style={{ height: '30px' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--gold-dark)', display: 'block', marginTop: '5px' }}>ADMIN PANEL</span>
        </div>
        
        <nav className="admin-nav">
          <button className={`admin-nav-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => {setActiveTab('products'); setShowForm(false);}}>
            <Package size={20} /> Products
          </button>
          <button className={`admin-nav-btn ${activeTab === 'whatsnew' ? 'active' : ''}`} onClick={() => {setActiveTab('whatsnew'); setShowForm(false);}}>
            <Megaphone size={20} /> What's New
          </button>
          <button className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => {setActiveTab('settings'); setShowForm(false);}}>
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div className="admin-logout">
          <button className="admin-nav-btn logout" onClick={handleLogout}>
             <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-topbar glass">
          <h2>
            {activeTab === 'products' ? 'Manage Products' : 
             activeTab === 'whatsnew' ? 'Manage What\'s New' : 
             'Professional Settings'}
          </h2>
          {activeTab !== 'settings' && (
            <button className="btn-primary" onClick={() => handleOpenForm(null)} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Plus size={18} /> Add New
            </button>
          )}
        </div>

        {/* Modal Form Overlay */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content glass">
              <div className="modal-header">
                <h3>{editingId ? 'Edit Item Details' : 'Add New Item'}</h3>
                <button onClick={handleCloseForm} className="close-btn"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    {/* Left Column: Media */}
                    <div className="form-column">
                        <div className="form-group">
                          {activeTab === 'products' ? (
                            <>
                              <label>Product images (multiple)</label>
                              <p className="admin-media-hint">Unang larawan = cover sa listahan; iba pa ay gallery sa product page.</p>
                              <div className="admin-product-media-grid">
                                {productMediaSlots.length === 0 ? (
                                  <div className="admin-product-media-empty">Walang larawan — mag-add sa ibaba.</div>
                                ) : (
                                  productMediaSlots.map((slot, idx) => (
                                    <div key={slot.id} className="admin-product-media-tile">
                                      <span className="admin-product-media-badge">{idx === 0 ? 'Cover' : idx + 1}</span>
                                      <img
                                        src={slot.preview ? slot.preview : resolveImageUrl(slot.url)}
                                        alt=""
                                        className="admin-product-media-thumb"
                                      />
                                      <button
                                        type="button"
                                        className="admin-product-media-remove"
                                        onClick={() => removeProductMediaSlot(slot.id)}
                                        aria-label="Alisin ang larawan"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  ))
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleProductMediaFiles}
                              />
                              <small>Pwede magpili ng maraming file nang sabay-sabay (Ctrl/Cmd + click).</small>
                            </>
                          ) : (
                            <>
                              <label>Media / Image Preview</label>
                              <div className="image-preview-container">
                                {previewUrl ? (
                                  <img src={resolveImageUrl(previewUrl) || previewUrl} alt="preview" className="form-image-preview" />
                                ) : (
                                  <div className="image-placeholder">No Image Selected</div>
                                )}
                              </div>
                              <input type="file" accept="image/*" onChange={handleFileChange} />
                              <small>Use a clear, high-quality image for best display results.</small>
                            </>
                          )}
                        </div>
                    </div>

                    {/* Right Column: Key Details */}
                    <div className="form-column">
                        {activeTab === 'products' ? (
                        <>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required placeholder="Bella Skin Facial Set..." />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select 
                                    value={productForm.category} 
                                    onChange={e => setProductForm({...productForm, category: e.target.value})} 
                                    required
                                >
                                    <option value="">-- Select Category --</option>
                                    <option value="new">New Arrivals</option>
                                    <option value="best">Best Sellers</option>
                                    <option value="skincare">Rejuvenating Set</option>
                                    <option value="sunscreen">Sunscreens</option>
                                    <option value="lotion">Lotion</option>
                                    <option value="serum">Serum</option>
                                    <option value="lipbalm">Lip Balm</option>
                                    <option value="deospray">Deo Spray</option>
                                    <option value="kojic">Kojic Soap</option>
                                    <option value="toner">Glow Toner</option>
                                    <option value="mask">Overnight Mask</option>
                                    <option value="facialwash">Facial Wash</option>
                                    <option value="shampoo">Shampoo</option>
                                    <option value="conditioner">Conditioner</option>
                                    <option value="bodyscrub">Body Scrub</option>
                                    <option value="hairserum">Hair Serum</option>
                                    <option value="bodymist">Body Mist</option>
                                    <option value="featured">Featured Collections</option>
                                </select>
                            </div>
                        </>
                        ) : (
                        <>
                            <div className="form-group">
                                <label>Banner Title</label>
                                <input type="text" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Subtitle</label>
                                <input type="text" value={newsForm.subtitle} onChange={e => setNewsForm({...newsForm, subtitle: e.target.value})} />
                            </div>
                        </>
                        )}
                    </div>
                </div>

                {/* Bottom Row: Descriptions & Full Control Fields */}
                <div className="form-full-width">
                     {activeTab === 'products' ? (
                        <>
                            <div className="form-group">
                                <label>Short Description</label>
                                <textarea 
                                    value={productForm.description} 
                                    onChange={e => setProductForm({...productForm, description: e.target.value})} 
                                    rows="3" 
                                    placeholder="Write a clear and concise product description..."
                                ></textarea>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                <label>Key Benefits (comma-separated)</label>
                                    <textarea 
                                        value={productForm.benefits} 
                                        onChange={e => setProductForm({...productForm, benefits: e.target.value})} 
                                        rows="3" 
                                    placeholder="Minimizes pores, brightens skin, hydrates deeply"
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Active Ingredients</label>
                                    <textarea 
                                        value={productForm.ingredients} 
                                        onChange={e => setProductForm({...productForm, ingredients: e.target.value})} 
                                        rows="3" 
                                        placeholder="Niacinamide, AHA, Jeju Aloe..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                <label>How to Use</label>
                                    <textarea 
                                        value={productForm.usage} 
                                        onChange={e => setProductForm({...productForm, usage: e.target.value})} 
                                        rows="4" 
                                    placeholder="Day: Apply after cleansing. Night: Use before moisturizer."
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                <label>Caution / Warnings</label>
                                    <textarea 
                                        value={productForm.caution} 
                                        onChange={e => setProductForm({...productForm, caution: e.target.value})} 
                                        rows="4" 
                                    placeholder="Patch-test before use. Discontinue if irritation occurs."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="form-group" style={{flexDirection: 'row', alignItems: 'center', gap: '20px'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <input type="checkbox" checked={productForm.is_best_seller} onChange={e => setProductForm({...productForm, is_best_seller: e.target.checked})} id="bestseller" />
                                    <label htmlFor="bestseller">Best Seller</label>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <input type="checkbox" checked={productForm.is_new_arrival} onChange={e => setProductForm({...productForm, is_new_arrival: e.target.checked})} id="newarrival" />
                                    <label htmlFor="newarrival">New Arrival</label>
                                </div>
                            </div>
                        </>
                     ) : (
                        <>
                            <div className="form-group">
                                <label>Announcement Content</label>
                                <textarea value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} rows="4"></textarea>
                            </div>
                            <div className="form-group">
                                <label>Action Link (e.g., /why or /product/rejuvenating-set)</label>
                                <input type="text" value={newsForm.link_url} onChange={e => setNewsForm({...newsForm, link_url: e.target.value})} />
                            </div>
                        </>
                     )}
                </div>

                <div className="form-actions">
                    <button type="button" onClick={handleCloseForm} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary" disabled={uploading}>
                        {uploading ? 'Saving update...' : (editingId ? 'Save Changes' : 'Publish to Website')}
                    </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="admin-content glass">
          {loading ? (
            <p className="text-center" style={{padding: '2rem'}}>Syncing with Database...</p>
          ) : activeTab === 'settings' ? (
            /* Settings View */
            <div className="settings-container" style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                
                {/* Site Configuration */}
                <div className="settings-card glass" style={{ padding: '25px', borderRadius: '15px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--gold-dark)' }}>
                    <Settings size={22} /> Site Configuration
                  </h3>
                  <form onSubmit={handleUpdateSettings}>
                    <div className="form-group">
                      <label>Global "Buy Now" Link (Shopee/Store)</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="url" 
                          value={siteConfigs.shopee_link} 
                          onChange={e => setSiteConfigs({...siteConfigs, shopee_link: e.target.value})} 
                          placeholder="https://shopee.ph/your-store" 
                          required 
                          style={{ flex: 1 }}
                        />
                        <a href={siteConfigs.shopee_link} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', backgroundColor: '#f0f0f0' }}>Test</a>
                      </div>
                      <small style={{ display: 'block', marginTop: '5px', color: 'var(--text-muted)' }}>
                        This link will be used for all "Buy on Shopee" buttons across the website.
                      </small>
                    </div>
                    <div className="form-group" style={{ marginTop: '15px' }}>
                      <label>TikTok Shop Link (Optional)</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          value={siteConfigs.tiktok_link} 
                          onChange={e => setSiteConfigs({...siteConfigs, tiktok_link: e.target.value})} 
                          placeholder="https://www.tiktok.com/@yourusername" 
                          style={{ flex: 1 }}
                        />
                        <a href={siteConfigs.tiktok_link} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', backgroundColor: '#f0f0f0' }}>Test</a>
                      </div>
                      
                      {/* TikTok Helper Box */}
                      <div style={{ marginTop: '15px', padding: '15px', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ccc' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--gold-dark)' }}>
                          🚀 TikTok Browser Link Helper
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                          If you only have a "phone link", the best way to make it work on browsers is to use your username:
                        </p>
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem' }}>tiktok.com/@</span>
                          <input 
                            type="text" 
                            placeholder="username" 
                            style={{ padding: '4px 8px', fontSize: '0.8rem', flex: 1 }}
                            onChange={(e) => {
                              const username = e.target.value.replace('@', '').trim();
                              if (username) {
                                setSiteConfigs({...siteConfigs, tiktok_link: `https://www.tiktok.com/@${username}/shop`});
                              }
                            }}
                          />
                        </div>
                        {/* Troubleshooting Box */}
                        <div style={{ marginTop: '20px', padding: '15px', background: '#fff5f5', borderRadius: '8px', border: '1px solid #feb2b2' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', color: '#c53030', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <AlertCircle size={16} /> TikTok Browser Troubleshooting
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#4a5568', lineHeight: '1.4' }}>
                            TikTok often blocks the "Shop" view on computer browsers to force users into the app. If your link shows a blank page or just your profile:
                          </p>
                          <ul style={{ fontSize: '0.75rem', color: '#4a5568', marginTop: '8px', paddingLeft: '20px' }}>
                            <li><b>Avoid "Short Links":</b> Do not use <code>vt.tiktok.com</code>.</li>
                            <li><b>Seller Center Link:</b> Go to your <b>TikTok Seller Center</b> (PC) &gt; Store Settings &gt; Copy your <b>Direct Store Link</b>.</li>
                            <li><b>Profile Link:</b> Use <code>https://www.tiktok.com/@yourusername</code> and ensure your Shop Tab is public.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '15px' }} disabled={uploading}>
                      {uploading ? 'Updating Links...' : 'Save All Global Links'}
                    </button>
                  </form>
                </div>

                {/* Account Security */}
                <div className="settings-card glass" style={{ padding: '25px', borderRadius: '15px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--gold-dark)' }}>
                    <ShieldCheck size={22} /> Account Security
                  </h3>
                  <form onSubmit={handleUpdatePassword}>
                    <div className="form-group">
                      <label>Current Password</label>
                      <input 
                        type="password" 
                        value={currentPasswordInput} 
                        onChange={e => setCurrentPasswordInput(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group" style={{ marginTop: '15px' }}>
                      <label>New Password</label>
                      <input 
                        type="password" 
                        value={newPasswordInput} 
                        onChange={e => setNewPasswordInput(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group" style={{ marginTop: '15px' }}>
                      <label>Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    <button type="submit" className="btn-dark" style={{ marginTop: '20px', width: '100%' }} disabled={uploading}>
                      {uploading ? 'Verifying...' : 'Change Admin Password'}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          ) : (
            /* Table Views (Products / Whats New) */
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  {activeTab === 'products' ? (
                    <tr>
                      <th>Image</th><th>Name</th><th>Category</th><th>Best Seller</th><th>New Arrival</th><th>Actions</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Image</th><th>Title</th><th>Subtitle</th><th>Active</th><th>Actions</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {activeTab === 'products' ? (
                    products.length > 0 ? products.map(p => (
                      <tr key={p.id}>
                        <td>{p.image_url && resolveImageUrl(p.image_url) ? <img src={resolveImageUrl(p.image_url)} alt="img" className="table-img" /> : <div className="table-img-placeholder">No Img</div>}</td>
                        <td style={{fontWeight: 'bold'}}>{p.name}</td>
                        <td>{p.category}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => handleToggleBestSeller(p.id, p.is_best_seller)} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                            title={p.is_best_seller ? 'Click to remove from Best Sellers' : 'Click to make Best Seller'}
                          >
                            <Star 
                              size={22} 
                              fill={p.is_best_seller ? "var(--gold)" : "none"} 
                              color={p.is_best_seller ? "var(--gold-dark)" : "#ccc"} 
                            />
                          </button>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => handleToggleNewArrival(p.id, p.is_new_arrival)} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                            title={p.is_new_arrival ? 'Click to remove from New Arrivals' : 'Click to make New Arrival'}
                          >
                            <Package 
                              size={22} 
                              fill={p.is_new_arrival ? "var(--gold)" : "none"} 
                              color={p.is_new_arrival ? "var(--gold-dark)" : "#ccc"} 
                            />
                          </button>
                        </td>
                        <td>
                          <button onClick={() => handleOpenForm(p)} className="action-btn edit" title="Edit"><Edit size={18}/></button>
                          <button onClick={() => handleDelete(p.id)} className="action-btn delete" title="Delete"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="7" className="text-center">No products found. Add one above!</td></tr>
                  ) : (
                    whatsNew.length > 0 ? whatsNew.map(w => (
                      <tr key={w.id}>
                        <td>{w.image_url && resolveImageUrl(w.image_url) ? <img src={resolveImageUrl(w.image_url)} alt="img" className="table-img" /> : <div className="table-img-placeholder">No Img</div>}</td>
                        <td style={{fontWeight: 'bold'}}>{w.title}</td>
                        <td>{w.subtitle || w.content}</td>
                        <td>{w.is_active ? 'Yes' : 'No'}</td>
                        <td>
                           <button onClick={() => handleOpenForm(w)} className="action-btn edit" title="Edit"><Edit size={18}/></button>
                           <button onClick={() => handleDelete(w.id)} className="action-btn delete" title="Delete"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="5" className="text-center">No announcements found. Add one above!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
