import React, { useState } from 'react';
import { useStore } from '../../store';
import { NewsItem } from '../../types';
import { Plus, Trash2, X, Edit2, ShieldAlert, Check, AlertCircle, Megaphone, Activity } from 'lucide-react';
import MediaUploader from '../../components/MediaUploader';

export default function AdminNews() {
  const { news, addNews, updateNews, deleteNews, marketActivities, approveMarketActivity, deleteMarketActivity, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'news' | 'live-moderation'>('news');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '', videoUrl: '', date: new Date().toISOString() });

  const pendingActivities = marketActivities.filter(a => !a.isApproved);
  const approvedActivities = marketActivities.filter(a => a.isApproved);

  const formatDateForInput = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setFormData({ ...formData, date: new Date(e.target.value).toISOString() });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.content) {
      if (editingId) {
        const itemToUpdate = news.find(n => n.id === editingId);
        if (itemToUpdate) {
          updateNews({ ...itemToUpdate, title: formData.title, content: formData.content, imageUrl: formData.imageUrl, videoUrl: formData.videoUrl, date: formData.date });
        }
      } else {
        addNews({ title: formData.title, content: formData.content, imageUrl: formData.imageUrl, videoUrl: formData.videoUrl, date: formData.date });
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', imageUrl: '', videoUrl: '', date: new Date().toISOString() });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (item: NewsItem) => {
    setFormData({ title: item.title, content: item.content, imageUrl: item.imageUrl || '', videoUrl: item.videoUrl || '', date: item.date || new Date().toISOString() });
    setEditingId(item.id);
    setIsAdding(true);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-amber-950">Announcements & Live Feed Moderation</h1>
          <p className="text-xs text-amber-900/60 mt-1">Manage official news items and approve/reject user posts in the live activity stream.</p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'news' && (
            <button 
              onClick={() => {
                if (isAdding) {
                  resetForm();
                } else {
                  setIsAdding(true);
                }
              }}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-500 transition-colors text-sm"
            >
              {isAdding ? <X size={18} /> : <Plus size={18} />}
              {isAdding ? 'Cancel' : 'Add Official News'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-amber-900/10 pb-4 mb-8">
        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'news'
              ? 'bg-amber-950 text-white shadow-md'
              : 'bg-white text-amber-900/70 hover:bg-amber-100/50'
          }`}
        >
          <Megaphone size={16} /> Official News Articles ({news.length})
        </button>

        <button
          onClick={() => setActiveTab('live-moderation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'live-moderation'
              ? 'bg-amber-950 text-white shadow-md'
              : 'bg-white text-amber-900/70 hover:bg-amber-100/50'
          }`}
        >
          <ShieldAlert size={16} className={pendingActivities.length > 0 ? 'text-orange-500 animate-pulse' : ''} />
          Live Feed Posts Moderation
          {pendingActivities.length > 0 && (
            <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-full animate-pulse">
              {pendingActivities.length} Pending
            </span>
          )}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 mb-8">
          <h2 className="text-xl font-bold text-amber-950 mb-6">{editingId ? 'Edit Announcement' : 'New Announcement'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-950 mb-1">Publish Date & Time (Schedule)</label>
                <input type="datetime-local" required value={formatDateForInput(formData.date)} onChange={handleDateChange} className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-amber-950 mb-1">Content</label>
              <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-2 rounded-lg border border-amber-900/20 outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-amber-950 mb-2">Media Attachment (Optional)</label>
              <MediaUploader
                images={formData.imageUrl ? [formData.imageUrl] : []}
                videoUrl={formData.videoUrl}
                onImagesChange={(images) => setFormData({...formData, imageUrl: images[0] || ''})}
                onVideoChange={(videoUrl) => setFormData({...formData, videoUrl: videoUrl || ''})}
              />
            </div>
            <div className="pt-4">
              <button type="submit" className="bg-amber-950 text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-900">
                {editingId ? 'Save Changes' : 'Post Announcement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'news' ? (
        <div className="space-y-4">
          {news.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="text-sm text-orange-600 font-bold">{new Date(item.date).toLocaleString()}</div>
                  {new Date(item.date) > new Date() && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">Scheduled</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-amber-950 mb-2">{item.title}</h3>
                <p className="text-amber-900/70 whitespace-pre-wrap mb-4">{item.content}</p>
                
                {(item.imageUrl || item.videoUrl) && (
                  <div className="flex gap-4">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.title} className="w-32 h-32 object-cover rounded-xl border border-amber-900/10 shadow-sm" />
                    )}
                    {item.videoUrl && !item.imageUrl && (
                      <video src={item.videoUrl} className="w-32 h-32 object-cover rounded-xl border border-amber-900/10 shadow-sm" />
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0 self-end md:self-start">
                <button 
                  onClick={() => handleEdit(item)}
                  className="p-2 text-amber-900/40 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => deleteNews(item.id)}
                  className="p-2 text-amber-900/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {news.length === 0 && (
            <div className="text-center py-12 text-amber-900/50 bg-white rounded-2xl border border-amber-900/10">
              No news or announcements yet. Click "Add Official News" to create one.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Approval Section */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-amber-950 flex items-center gap-2">
              <ShieldAlert className="text-orange-600" size={20} /> Pending User Submissions ({pendingActivities.length})
            </h3>
            
            {pendingActivities.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-amber-900/10 text-center text-amber-900/60 text-sm font-medium">
                <Check className="mx-auto text-emerald-600 mb-2" size={28} />
                No pending user posts. All live feed announcements are moderated and clear!
              </div>
            ) : (
              pendingActivities.map(item => (
                <div key={item.id} className="p-6 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-amber-950 text-base">{item.title}</h4>
                      <span className="text-xs text-amber-900/60">By {item.author || 'User'}</span>
                    </div>
                    <p className="text-xs text-amber-900/80 leading-relaxed max-w-2xl">{item.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => {
                        approveMarketActivity(item.id);
                        showToast(`Approved "${item.title}"! It is now live on the site.`);
                      }}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all"
                    >
                      <Check size={14} /> Approve & Push Live
                    </button>
                    <button
                      onClick={() => {
                        deleteMarketActivity(item.id);
                        showToast('Fake announcement rejected and deleted.');
                      }}
                      className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all"
                    >
                      <Trash2 size={14} /> Reject / Delete Fake
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Approved Public Activities */}
          <div className="pt-8 border-t border-amber-900/10 space-y-4">
            <h3 className="font-serif text-xl font-bold text-amber-950 flex items-center gap-2">
              <Activity className="text-emerald-600" size={20} /> Currently Live Feed Items ({approvedActivities.length})
            </h3>
            <div className="space-y-3">
              {approvedActivities.map(item => (
                <div key={item.id} className="p-4 bg-white rounded-2xl border border-amber-900/10 flex justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-amber-950 text-sm">{item.title}</h4>
                    </div>
                    <p className="text-xs text-amber-900/70 mt-1">{item.subtitle}</p>
                  </div>
                  <button
                    onClick={() => {
                      deleteMarketActivity(item.id);
                      showToast('Announcement removed from Live feed.');
                    }}
                    className="p-2 text-amber-900/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from Live Feed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
