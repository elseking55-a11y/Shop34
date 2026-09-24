import React, { useState } from 'react';
import { useStore } from '../../store';
import { Tag, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Voucher } from '../../types';

export default function Vouchers() {
  const { vouchers, addVoucher, deleteVoucher, toggleVoucherActive } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    expiresAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.code && formData.discountValue) {
      addVoucher({
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        expiresAt: new Date(formData.expiresAt).toISOString(),
        isActive: true
      });
      setIsAdding(false);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expiresAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
      });
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-2">
          <Tag className="text-orange-600" /> Vouchers & Promos
        </h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl font-bold transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus size={20} /> New Voucher</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10">
          <h2 className="text-xl font-bold text-amber-950 mb-4">Create New Voucher</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Voucher Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    required 
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="flex-1 p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500 uppercase"
                    placeholder="e.g. SUMMER20"
                  />
                  <button 
                    type="button"
                    onClick={generateRandomCode}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-2 rounded-lg font-medium transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Discount Type</label>
                <select 
                  value={formData.discountType}
                  onChange={e => setFormData({...formData, discountType: e.target.value as 'percentage' | 'fixed'})}
                  className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500 bg-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Discount Value</label>
                <input 
                  type="number" 
                  required 
                  min="0.01"
                  step="0.01"
                  value={formData.discountValue} 
                  onChange={e => setFormData({...formData, discountValue: e.target.value})}
                  className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500"
                  placeholder={formData.discountType === 'percentage' ? "e.g. 15" : "e.g. 20.00"}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Expiration Date & Time</label>
                <input 
                  type="datetime-local" 
                  required 
                  value={formData.expiresAt} 
                  onChange={e => setFormData({...formData, expiresAt: e.target.value})}
                  className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-xl font-bold transition-colors"
              >
                Create Voucher
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-amber-950">Code</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-amber-950">Discount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-amber-950">Expires At</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-amber-950">Status</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-amber-950">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {vouchers.map(voucher => {
                const isExpired = new Date(voucher.expiresAt) < new Date();
                return (
                  <tr key={voucher.id} className="hover:bg-amber-50/50">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                        {voucher.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-amber-900">
                      {voucher.discountType === 'percentage' ? `${voucher.discountValue}%` : `$${voucher.discountValue.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${isExpired ? 'text-red-500 font-bold' : 'text-amber-900'}`}>
                        {new Date(voucher.expiresAt).toLocaleString()}
                        {isExpired && ' (Expired)'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleVoucherActive(voucher.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                          voucher.isActive && !isExpired 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                        title={voucher.isActive ? "Click to disable" : "Click to enable"}
                      >
                        {voucher.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {voucher.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteVoucher(voucher.id)}
                        className="p-2 text-amber-900/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Voucher"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {vouchers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-amber-900/50">
                    No vouchers generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
