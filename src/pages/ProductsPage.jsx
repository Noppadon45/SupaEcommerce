import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../lib/api';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import { LoadingGrid, ErrorState, NoResults } from '../components/States';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'featured';
  const search = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [categories, setCategories] = useState(['All']);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0);
  const { showToast } = useToast();

  useEffect(() => setSearchInput(search), [search]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories(['All']));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchProducts({ search, category, sort })
      .then((data) => active && setProducts(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [search, category, sort, reload]);

  function updateParams(patch, remove = []) {
    const next = new URLSearchParams(searchParams);
    remove.forEach((key) => next.delete(key));
    Object.entries(patch).forEach(([key, value]) => {
      if (value && value !== 'All' && value !== 'featured') next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  }

  function handleSearch(event) {
    event.preventDefault();
    updateParams({ search: searchInput.trim() });
  }

  const hasFilters = Boolean(search || category !== 'All' || sort !== 'featured');

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Our collection</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Shop all products</h1>
        <p className="mt-2 text-slate-500">Something for every part of your day.</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handleSearch} className="flex-1 lg:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name or keyword..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 hidden items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:flex">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
          </span>
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => updateParams({ category: item })}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                category === item
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 lg:border-l lg:border-slate-200 lg:pl-4">
          <label htmlFor="sort" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => updateParams({ sort: event.target.value })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-brand-400"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-900">{products.length}</span> products
          {category !== 'All' && <> in <span className="font-semibold text-slate-900">{category}</span></>}
          {search && <> for <span className="font-semibold text-slate-900">“{search}”</span></>}
        </p>
        {hasFilters && (
          <button
            onClick={() => {
              setSearchInput('');
              setSearchParams(new URLSearchParams());
              showToast('Filters cleared', 'info');
            }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <X className="h-3.5 w-3.5" /> Clear all filters
          </button>
        )}
      </div>

      {loading ? (
        <LoadingGrid />
      ) : error ? (
        <ErrorState message={error} onRetry={() => setReload((n) => n + 1)} />
      ) : products.length === 0 ? (
        <NoResults onClear={() => { setSearchInput(''); setSearchParams(new URLSearchParams()); }} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
