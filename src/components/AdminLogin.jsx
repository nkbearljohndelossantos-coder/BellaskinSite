import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Fetch the master config from the database
      const { data: config, error: fetchError } = await supabase
        .from('site_configs')
        .select('admin_password')
        .eq('id', 'global')
        .single();

      if (fetchError) throw fetchError;

      if (password === config.admin_password) {
        sessionStorage.setItem('isAdminRoot', 'true');
        window.location.href = '/admin/dashboard';
      } else {
        setError('Incorrect Password. Access Denied.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('System Error: Could not connect to authentication server.');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
      <div className="glass" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center', borderRadius: '16px' }}>
        <div style={{ display: 'inline-flex', backgroundColor: 'var(--gold-light)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
           <Lock size={32} color="var(--gold-dark)" />
        </div>
        <h2 style={{ marginBottom: '0.5rem', fontFamily: 'Playfair Display' }}>Admin Access</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Restricted area. Please enter the master password.</p>
        
        {error && <div style={{ backgroundColor: '#ffeaea', color: '#d32f2f', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid var(--cream-dark)',
              outline: 'none',
              fontSize: '1rem'
            }}
            autoFocus
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
