import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, Search } from 'lucide-react';
import { useStore } from '../store';
import { motion } from 'motion/react';

export default function Shop() {
  const products = useStore(state => state.products);
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (activeCategory) {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [activeCategory, searchQuery, products]);

  return (
    <div className="bg-amber-50/30 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-amber-950 mb-4">Shop Collection</h1>
          <p className="text-amber-900/70 max-w-2xl">Browse our complete collection of East African goods.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 shrink-0 space-y-4 lg:space-y-8">
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-amber-900/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/40" size={18} />
            </div>

            {/* Mobile Category Horizontal Scroll Bar & Desktop Vertical List */}
            <div>
              <div className="hidden lg:flex items-center gap-2 font-bold text-amber-950 mb-4 pb-2 border-b border-amber-900/10">
                <Filter size={18} />
                Categories
              </div>
              
              {/* Horizontal Scroll on Mobile */}
              <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 scrollbar-none -mx-4 px-4">
                <button 
                  onClick={() => handleCategoryClick(null)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    !activeCategory 
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm' 
                      : 'bg-white text-amber-900 border-amber-900/15 hover:bg-amber-100'
                  }`}
                >
                  All Products
                </button>
                {categories.map(category => (
                  <button 
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                      activeCategory === category 
                        ? 'bg-orange-600 text-white border-orange-600 shadow-sm' 
                        : 'bg-white text-amber-900 border-amber-900/15 hover:bg-amber-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Vertical List on Desktop */}
              <ul className="hidden lg:block space-y-3">
                <li>
                  <button 
                    onClick={() => handleCategoryClick(null)}
                    className={`text-left w-full transition-colors ${!activeCategory ? 'text-orange-600 font-bold' : 'text-amber-900 hover:text-orange-600'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category}>
                    <button 
                      onClick={() => handleCategoryClick(category)}
                      className={`text-left w-full transition-colors ${activeCategory === category ? 'text-orange-600 font-bold' : 'text-amber-900 hover:text-orange-600'}`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <span className="text-amber-900/70 text-xs sm:text-sm">{filteredProducts.length} products</span>
              <button className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-amber-950 hover:text-orange-600 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-amber-900/10 shadow-sm">
                Sort by: Featured <ChevronDown size={14} />
              </button>
            </div>
            
            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8"
              >
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-amber-900/10">
                <p className="text-amber-900/50">No products found matching your criteria.</p>
                <button 
                  onClick={() => {
                    handleCategoryClick(null);
                    setSearchQuery('');
                  }}
                  className="mt-4 text-orange-600 font-bold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
