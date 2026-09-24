import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../store';
import { motion } from 'motion/react';

interface ProductCardProps { key?: string | number;
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const favorite = isFavorite(product.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-100 dark:border-zinc-800 flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-amber-50 dark:bg-zinc-800 block">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.featured && (
          <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Featured
          </div>
        )}
        {product.status === 'coming_soon' && (
          <div className="absolute top-4 right-4 bg-amber-950 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Coming Soon
          </div>
        )}
      </Link>
      
      <div className="p-3 sm:p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <div className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider truncate mr-1">
            {product.category}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-900/50 dark:text-zinc-400 font-medium">
              <Eye size={12} className="text-blue-500" />
              <span>{product.views ?? 0}</span>
            </span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(product.id);
              }}
              className={`flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full transition-all text-[10px] sm:text-xs font-bold ${
                favorite ? 'text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800' : 'text-amber-900/40 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 border border-transparent'
              }`}
              title={favorite ? "Unlike item" : "Like item"}
            >
              <Heart size={14} className={favorite ? 'fill-current text-red-500' : ''} />
              <span>{product.likes ?? 0}</span>
            </button>
          </div>
        </div>
        <Link to={`/product/${product.id}`} className="block flex-1">
          <h3 className="font-serif text-sm sm:text-lg font-bold text-amber-950 dark:text-zinc-100 mb-1 sm:mb-2 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-2 sm:mb-4">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-orange-400 text-orange-400" />
          <span className="text-xs sm:text-sm font-medium text-amber-900 dark:text-zinc-200">{product.rating}</span>
          <span className="text-xs text-amber-900/50 dark:text-zinc-500">({product.reviewsCount})</span>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="font-serif text-base sm:text-xl font-bold text-amber-950 dark:text-amber-400">
            ${product.price.toFixed(2)}
          </div>
          {product.status !== 'coming_soon' && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="bg-amber-100 dark:bg-zinc-800 hover:bg-orange-600 dark:hover:bg-orange-600 text-amber-900 dark:text-zinc-200 hover:text-white p-2 sm:p-3 rounded-full transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} className="sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
