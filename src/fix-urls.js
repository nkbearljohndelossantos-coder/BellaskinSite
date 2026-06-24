import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing environment variables in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixUrls() {
  console.log('Starting URL cleanup...');

  // 1. Fix Products Table
  console.log('Checking "products" table...');
  const { data: products, error: pError } = await supabase.from('products').select('id, image_url');
  
  if (pError) {
    console.error('Error fetching products:', pError.message);
  } else {
    for (const p of products) {
      if (p.image_url && p.image_url.includes('/storage/v1/object/bella-skin/') && !p.image_url.includes('/storage/v1/object/public/bella-skin/')) {
        const fixedUrl = p.image_url.replace('/storage/v1/object/bella-skin/', '/storage/v1/object/public/bella-skin/');
        console.log(`Fixing Product ID ${p.id}: ${p.image_url} -> ${fixedUrl}`);
        await supabase.from('products').update({ image_url: fixedUrl }).eq('id', p.id);
      }
    }
  }

  // 2. Fix What's New Table
  console.log('Checking "whats_new" table...');
  const { data: news, error: nError } = await supabase.from('whats_new').select('id, image_url');

  if (nError) {
    console.error('Error fetching whats_new:', nError.message);
  } else {
    for (const n of news) {
      if (n.image_url && n.image_url.includes('/storage/v1/object/bella-skin/') && !n.image_url.includes('/storage/v1/object/public/bella-skin/')) {
        const fixedUrl = n.image_url.replace('/storage/v1/object/bella-skin/', '/storage/v1/object/public/bella-skin/');
        console.log(`Fixing What's New ID ${n.id}: ${n.image_url} -> ${fixedUrl}`);
        await supabase.from('whats_new').update({ image_url: fixedUrl }).eq('id', n.id);
      }
    }
  }

  console.log('Cleanup finished! Please check your website.');
}

fixUrls();
