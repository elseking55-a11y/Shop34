import React from "react";
import { useState, useRef } from 'react';
import { useStore } from '../../store';
import { Product } from '../../types';
import { Plus, Trash2, X, AlertTriangle, Heart, Eye } from 'lucide-react';
import MediaUploader from '../../components/MediaUploader';

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, offersTitle, setOffersTitle } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const defaultProductState: Partial<Product> = {
    name: '', description: '', price: 0, category: 'FOREX BOTS', stock: 10, offerLabel: '',
    imageUrl: '', images: [], videoUrl: '', rating: 5.0, reviewsCount: 0, likes: 50, views: 250,
    featured: false, status: 'available'
  };
  const [newProduct, setNewProduct] = useState<Partial<Product>>(defaultProductState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      // Fallback for imageUrl if they didn't upload any
      const productToSave = {
        ...newProduct,
        imageUrl: newProduct.images?.[0] || 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=500'
      } as Omit<Product, 'id'>;
      
      addProduct(productToSave);
      setIsAdding(false);
      setNewProduct(defaultProductState);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-amber-950">Manage Products</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-500 transition-colors"
        >
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          {isAdding ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-amber-950 mb-1">Global Offers Title</h2>
          <p className="text-sm text-amber-900/60">Customize the heading for the special offers section on the homepage.</p>
        </div>
        <input 
          type="text" 
          value={offersTitle}
          onChange={(e) => setOffersTitle(e.target.value)}
          placeholder="e.g. Christmas 🎄 Offers"
          className="w-full sm:w-auto min-w-[250px] p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500 font-medium"
        />
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 mb-8">
          <h2 className="text-xl font-bold text-amber-950 mb-6">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Name</label>
                <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Category</label>
                <input type="text" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Price ($)</label>
                <input type="number" required step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Stock Level</label>
                <input type="number" required min="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})} className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Initial Likes ❤️</label>
                <input type="number" min="0" value={newProduct.likes ?? 0} onChange={e => setNewProduct({...newProduct, likes: parseInt(e.target.value) || 0})} className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Initial Views 👁️</label>
                <input type="number" min="0" value={newProduct.views ?? 0} onChange={e => setNewProduct({...newProduct, views: parseInt(e.target.value) || 0})} className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Offer / Deal Label</label>
                <input type="text" placeholder="e.g. Deal of the Day, Christmas Offer" value={newProduct.offerLabel || ''} onChange={e => setNewProduct({...newProduct, offerLabel: e.target.value})} className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-amber-950 mb-2">Media (Up to 5 Images, 1 Video)</label>
                <MediaUploader
                  images={newProduct.images || []}
                  videoUrl={newProduct.videoUrl}
                  onImagesChange={(images) => setNewProduct({
                    ...newProduct, 
                    images, 
                    imageUrl: images[0] || newProduct.imageUrl
                  })}
                  onVideoChange={(videoUrl) => setNewProduct({...newProduct, videoUrl})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-amber-950 mb-1">Description</label>
                <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500" rows={3} />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-amber-950 cursor-pointer">
                  <input type="checkbox" checked={newProduct.featured} onChange={e => setNewProduct({...newProduct, featured: e.target.checked})} className="w-4 h-4 text-orange-600 rounded border-amber-900/20" />
                  Featured Product
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-amber-950 cursor-pointer">
                  <input type="checkbox" checked={newProduct.status === 'coming_soon'} onChange={e => setNewProduct({...newProduct, status: e.target.checked ? 'coming_soon' : 'available'})} className="w-4 h-4 text-orange-600 rounded border-amber-900/20" />
                  Mark as Coming Soon
                </label>
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="bg-amber-950 text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-900">Save Product</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-50/50 border-b border-amber-900/10 text-amber-900/60 text-sm">
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Name & Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Likes ❤️</th>
                <th className="p-4 font-medium">Views 👁️</th>
                <th className="p-4 font-medium">Offer</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.map((product) => (
                <tr key={product.id} className="border-b border-amber-900/5 last:border-0 hover:bg-amber-50/30 transition-colors">
                  <td className="p-4">
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-amber-100" />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-amber-950">{product.name}</div>
                    <div className="text-xs text-amber-900/60 uppercase">{product.category}</div>
                  </td>
                  <td className="p-4 font-bold text-amber-950">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={product.stock} 
                        onChange={e => updateProduct({...product, stock: parseInt(e.target.value) || 0})}
                        className={`w-16 p-1 border rounded-md text-sm font-bold outline-none focus:border-orange-500 ${product.stock < 5 ? 'border-red-500 text-red-600 bg-red-50' : 'border-amber-900/20 text-amber-950 bg-white'}`} 
                      />
                      {product.stock < 5 && (
                        <div title="Low stock warning" className="text-red-500 animate-pulse flex items-center bg-red-50 p-1.5 rounded-full border border-red-200">
                          <AlertTriangle size={16} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Heart size={14} className="text-red-500 fill-red-500" />
                      <input 
                        type="number" 
                        min="0"
                        value={product.likes ?? 0} 
                        onChange={e => updateProduct({...product, likes: parseInt(e.target.value) || 0})}
                        className="w-20 p-1 border rounded-md text-sm font-bold outline-none focus:border-orange-500 border-amber-900/20 text-amber-950 bg-white" 
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Eye size={14} className="text-blue-500" />
                      <input 
                        type="number" 
                        min="0"
                        value={product.views ?? 0} 
                        onChange={e => updateProduct({...product, views: parseInt(e.target.value) || 0})}
                        className="w-20 p-1 border rounded-md text-sm font-bold outline-none focus:border-orange-500 border-amber-900/20 text-amber-950 bg-white" 
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <input 
                      type="text" 
                      placeholder="No offer"
                      value={product.offerLabel || ''} 
                      onChange={e => updateProduct({...product, offerLabel: e.target.value})}
                      className="w-32 p-1 border rounded-md text-sm outline-none focus:border-orange-500 border-amber-900/20 bg-white text-amber-950" 
                    />
                  </td>
                  <td className="p-4">
                    <select 
                      value={product.status || 'available'} 
                      onChange={(e) => updateProduct({...product, status: e.target.value as 'available'|'coming_soon'})}
                      className={`text-xs font-bold px-3 py-1 rounded-full outline-none cursor-pointer border-0 ${product.status === 'coming_soon' ? 'bg-amber-950 text-white' : 'bg-green-100 text-green-700'}`}
                    >
                      <option value="available">Available</option>
                      <option value="coming_soon">Coming Soon</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-amber-900/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
