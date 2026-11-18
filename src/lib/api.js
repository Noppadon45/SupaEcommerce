import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { categories, mockProducts } from './products';

const ORDERS_KEY = 'shopwave_orders';

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// Supabase stores snake_case columns; the UI uses camelCase.
function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    oldPrice: row.old_price == null ? null : Number(row.old_price),
    category: row.category,
    image: row.image_url,
    rating: Number(row.rating) || 0,
    reviews: Number(row.reviews) || 0,
    badge: row.badge || null,
    stock: Number(row.stock) || 0,
    features: Array.isArray(row.features) ? row.features : [],
    createdAt: row.created_at,
  };
}

function sortProducts(list, sort) {
  const items = [...list];
  switch (sort) {
    case 'price-asc':
      return items.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return items.sort((a, b) => b.price - a.price);
    case 'rating':
      return items.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return items.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    default:
      return items;
  }
}

export async function fetchProducts({ search = '', category = 'All', sort = 'featured' } = {}) {
  if (isSupabaseConfigured) {
    let query = supabase.from('products').select('*');
    if (category && category !== 'All') query = query.eq('category', category);
    if (search.trim()) {
      const term = search.trim().replace(/[%,]/g, ' ');
      query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return sortProducts((data || []).map(mapProduct), sort);
  }

  let items = [...mockProducts];
  if (category && category !== 'All') {
    items = items.filter((p) => p.category === category);
  }
  if (search.trim()) {
    const term = search.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }
  return sortProducts(items, sort);
}

export async function fetchProduct(id) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return mapProduct(data);
  }
  return mockProducts.find((p) => p.id === id) || null;
}

export async function fetchFeaturedProducts(limit = 4) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []).map(mapProduct);
  }
  return mockProducts.slice(0, limit);
}

export async function fetchCategories() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('categories').select('name').order('name');
    if (error) throw error;
    const names = (data || []).map((row) => row.name);
    return ['All', ...names.filter((name) => name !== 'All')];
  }
  return categories;
}

function mapOrder(row) {
  const items = (row.order_items || []).map((item) => ({
    id: item.product_id,
    name: item.product_name,
    image: item.product_image,
    price: Number(item.unit_price),
    quantity: Number(item.quantity),
  }));
  return {
    id: row.id,
    userId: row.user_id,
    total: Number(row.total),
    status: row.status || 'processing',
    createdAt: row.created_at,
    shipping: row.shipping_address || null,
    items,
  };
}

export async function createOrder({ user, items, total, shipping }) {
  if (isSupabaseConfigured) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total,
        status: 'processing',
        shipping_address: shipping,
      })
      .select()
      .single();
    if (orderError) throw orderError;

    const { error: itemsError } = await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
      }))
    );
    if (itemsError) throw itemsError;
    return mapOrder({ ...order, order_items: [] });
  }

  const order = {
    id: `SW-${Date.now().toString(36).toUpperCase()}`,
    userId: user?.id || 'guest',
    total,
    status: 'processing',
    createdAt: new Date().toISOString(),
    shipping,
    items,
  };
  writeOrders([order, ...readOrders()]);
  return order;
}

export async function fetchOrders(userId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapOrder);
  }
  return readOrders().filter((order) => order.userId === userId);
}
