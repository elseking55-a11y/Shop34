import React, { useState } from 'react';
import { useStore } from '../../store';
import { Mail, Users, Send, CheckCircle, Clock } from 'lucide-react';

export default function EmailUsers() {
  const { users, emailCampaigns, sendEmailCampaign } = useStore();
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    body: ''
  });

  const totalSubscribers = users.length; // In this mock, all users are recipients

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.body.trim()) return;

    setIsSending(true);
    
    // Simulate network delay for sending mass email
    setTimeout(() => {
      sendEmailCampaign({
        subject: formData.subject,
        body: formData.body,
        recipientCount: totalSubscribers
      });
      setIsSending(false);
      setShowSuccess(true);
      setFormData({ subject: '', body: '' });

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-2">
        <Mail className="text-orange-600" /> Mass Email Updates
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-amber-950">Compose Broadcast</h2>
              <div className="flex items-center gap-2 text-sm font-bold bg-amber-50 text-amber-900 px-3 py-1.5 rounded-full">
                <Users size={16} />
                {totalSubscribers} Recipients
              </div>
            </div>

            {showSuccess ? (
              <div className="bg-green-50 text-green-700 p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle size={48} className="text-green-500" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Email Sent Successfully!</h3>
                  <p className="font-medium text-green-600/80">Your update is being delivered to {totalSubscribers} users.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-amber-950 mb-1">Subject Line</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.subject} 
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-amber-900/20 outline-none focus:border-orange-500 bg-amber-50/30"
                    placeholder="e.g. Major Update: New Software Features Released!"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-amber-950 mb-1">Message Body</label>
                  <textarea 
                    required 
                    rows={8}
                    value={formData.body} 
                    onChange={e => setFormData({...formData, body: e.target.value})}
                    className="w-full p-3 rounded-xl border border-amber-900/20 outline-none focus:border-orange-500 bg-amber-50/30 font-sans"
                    placeholder="Write your email content here..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isSending || !formData.subject.trim() || !formData.body.trim()}
                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <span className="flex items-center gap-2">Sending... <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></span></span>
                    ) : (
                      <span className="flex items-center gap-2"><Send size={18} /> Send Broadcast Now</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10">
            <h2 className="text-xl font-bold text-amber-950 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-amber-900/40" /> Recent Broadcasts
            </h2>
            
            <div className="space-y-4">
              {emailCampaigns.length === 0 ? (
                <p className="text-amber-900/50 text-center py-8 text-sm">No emails sent yet.</p>
              ) : (
                emailCampaigns.map(campaign => (
                  <div key={campaign.id} className="p-4 rounded-xl border border-amber-900/10 hover:border-orange-200 transition-colors bg-amber-50/30">
                    <h3 className="font-bold text-amber-950 mb-1 line-clamp-1" title={campaign.subject}>{campaign.subject}</h3>
                    <div className="flex justify-between items-center text-xs text-amber-900/60 font-medium">
                      <span>{new Date(campaign.sentAt).toLocaleDateString()} at {new Date(campaign.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {campaign.recipientCount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
