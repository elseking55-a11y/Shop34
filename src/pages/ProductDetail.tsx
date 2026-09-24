import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, Minus, Plus, ShoppingCart, Truck, ShieldCheck, ArrowLeft, Play, Image as ImageIcon, Heart, Eye } from 'lucide-react';
import { useStore } from '../store';
import { motion } from 'motion/react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const products = useStore(state => state.products);
  const incrementProductViews = useStore(state => state.incrementProductViews);
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useStore(state => state.addToCart);
  const toggleFavorite = useStore(state => state.toggleFavorite);
  const isFavorite = useStore(state => state.isFavorite);
  const favorite = product ? isFavorite(product.id) : false;
  
  const allImages = product ? (product.images?.length ? product.images : (product.imageUrl ? [product.imageUrl] : [])) : [];
  const [activeMedia, setActiveMedia] = useState<{type: 'image'|'video', url: string}>({
    type: 'image',
    url: ''
  });

  useEffect(() => {
    if (id) {
      incrementProductViews(id);
    }
  }, [id, incrementProductViews]);

  useEffect(() => {
    if (product) {
      setActiveMedia({
        type: allImages.length > 0 ? 'image' : (product.videoUrl ? 'video' : 'image'),
        url: allImages.length > 0 ? allImages[0] : (product.videoUrl || '')
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-amber-950 mb-4">Product Not Found</h2>
        <p className="text-amber-900/70 mb-8">We couldn't find the product you're looking for.</p>
        <Link to="/shop" className="bg-orange-600 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-500 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="bg-amber-50/30 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/shop" className="inline-flex items-center gap-2 text-amber-900 hover:text-orange-600 mb-8 transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-amber-900/10 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Product Media Gallery */}
            <div className="flex flex-col bg-amber-50">
              <div className="relative aspect-square w-full">
                {activeMedia.url ? (
                  activeMedia.type === 'video' ? (
                    <video 
                      src={activeMedia.url} 
                      controls 
                      autoPlay 
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover object-center bg-black"
                    />
                  ) : (
                    <img 
                      src={activeMedia.url} 
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-amber-900/20">
                    <ImageIcon size={64} />
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {(allImages.length > 1 || (allImages.length > 0 && product.videoUrl)) && (
                <div className="p-4 grid grid-cols-5 sm:grid-cols-6 gap-2 md:gap-4 overflow-x-auto">
                  {allImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveMedia({type: 'image', url: img})}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeMedia.url === img ? 'border-orange-600' : 'border-transparent hover:border-amber-900/30'}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {product.videoUrl && (
                    <button 
                      onClick={() => setActiveMedia({type: 'video', url: product.videoUrl!})}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-black flex items-center justify-center ${activeMedia.type === 'video' ? 'border-orange-600' : 'border-transparent hover:border-amber-900/30'}`}
                    >
                      <video src={product.videoUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none" />
                      <Play className="text-white relative z-10" size={24} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-5 sm:p-8 md:p-12 lg:p-16 flex flex-col">
              <div className="text-xs sm:text-sm font-bold tracking-wider text-orange-600 uppercase mb-2 sm:mb-3">
                {product.category}
              </div>
              
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-950 mb-3 sm:mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-4 sm:mb-6 flex-wrap text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-400 text-orange-400" />
                  <span className="font-bold text-amber-950">{product.rating}</span>
                </div>
                <span className="text-amber-900/40">|</span>
                <span className="text-amber-900/70">{product.reviewsCount} reviews</span>
                <span className="text-amber-900/40">|</span>
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    favorite 
                      ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' 
                      : 'bg-amber-50 text-amber-900/70 hover:bg-red-50 hover:text-red-500 border border-amber-900/10'
                  }`}
                >
                  <Heart size={16} className={favorite ? 'fill-current text-red-500' : ''} />
                  <span>{product.likes ?? 0} Likes</span>
                </button>
                <span className="text-amber-900/40">|</span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <Eye size={16} className="text-blue-600" />
                  <span>{product.views ?? 0} Views</span>
                </div>
              </div>
              
              <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 mb-4 sm:mb-8">
                ${product.price.toFixed(2)}
              </div>
              
              <p className="text-sm sm:text-lg text-amber-900/80 mb-6 sm:mb-10 leading-relaxed">
                {product.description}
              </p>

              <div className="mt-auto">
                {product.status === 'coming_soon' ? (
                  <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 font-medium">
                    This product is currently coming soon. Check back later!
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between border border-amber-900/20 rounded-full p-1 bg-amber-50/50 sm:w-32">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-amber-900 hover:text-orange-600 hover:bg-white rounded-full transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-amber-950 w-8 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-amber-900 hover:text-orange-600 hover:bg-white rounded-full transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 sm:py-4 px-8 rounded-full transition-colors shadow-md shadow-orange-600/20"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </motion.button>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-6 sm:pt-8 border-t border-amber-900/10">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-amber-900/70">
                    <Truck size={18} className="text-amber-900 shrink-0" />
                    <span>Instant Digital Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-amber-900/70">
                    <ShieldCheck size={18} className="text-amber-900 shrink-0" />
                    <span>Verified Software</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Floating Quick Add Bar */}
      {product.status !== 'coming_soon' && (
        <div className="sm:hidden fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-900/10 p-3 shadow-lg flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-amber-900/60 font-medium">Price</div>
            <div className="font-serif font-bold text-amber-950 text-lg">${product.price.toFixed(2)}</div>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-orange-600 active:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
