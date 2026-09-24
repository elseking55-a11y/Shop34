import React, { useState } from 'react';
import { useStore } from '../../store';
import { Trash2, CheckCircle, Circle, MessageSquareReply, Send, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminMessages() {
  const { messages, markMessageRead, deleteMessage, replyMessage } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (e: React.FormEvent, msgId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    replyMessage(msgId, replyText);
    setReplyText('');
    setExpandedId(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif font-bold text-amber-950 mb-8">Messages</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-50/50 border-b border-amber-900/10 text-amber-900/60 text-sm">
                <th className="p-4 font-medium w-10"></th>
                <th className="p-4 font-medium">Sender</th>
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {messages.map((msg) => (
                <React.Fragment key={msg.id}>
                  <tr 
                    className={`border-b border-amber-900/5 last:border-0 transition-colors hover:bg-amber-50/30 cursor-pointer ${!msg.read ? 'bg-orange-50/30' : ''}`}
                    onClick={() => {
                      setExpandedId(expandedId === msg.id ? null : msg.id);
                      if (!msg.read) markMessageRead(msg.id);
                      setReplyText('');
                    }}
                  >
                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => markMessageRead(msg.id)} className={`${msg.read ? 'text-green-500' : 'text-amber-900/20 hover:text-green-500'}`} title="Mark as read">
                        {msg.read ? <CheckCircle size={20} /> : <Circle size={20} />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-amber-950">{msg.name}</div>
                      <div className="text-xs text-amber-900/60">{msg.email}</div>
                    </td>
                    <td className="p-4 max-w-md">
                      <div className={`font-bold ${!msg.read ? 'text-amber-950' : 'text-amber-900/70'} flex items-center gap-2`}>
                        {msg.subject}
                        {msg.adminReply && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Replied</span>}
                      </div>
                      <div className="text-sm text-amber-900/60 truncate">{msg.message}</div>
                    </td>
                    <td className="p-4 text-amber-900/60 text-xs">
                      {new Date(msg.date).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <button className="text-amber-900/40 hover:text-orange-600 transition-colors">
                          {expandedId === msg.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                          className="p-2 text-amber-900/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedId === msg.id && (
                    <tr className="bg-amber-50/20 border-b border-amber-900/10">
                      <td colSpan={5} className="p-6">
                        <div className="max-w-3xl mx-auto space-y-6">
                          <div className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-sm">
                            <h4 className="font-bold text-amber-950 mb-2">Message:</h4>
                            <p className="text-amber-900/80 whitespace-pre-wrap">{msg.message}</p>
                          </div>
                          
                          {msg.adminReply ? (
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                              <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2"><MessageSquareReply size={16}/> Your Reply:</h4>
                              <p className="text-green-700 whitespace-pre-wrap">{msg.adminReply}</p>
                            </div>
                          ) : (
                            <form onSubmit={(e) => handleReply(e, msg.id)} className="space-y-4">
                              <label className="block text-sm font-bold text-amber-950">Reply to {msg.name}</label>
                              <textarea 
                                required
                                rows={4}
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                className="w-full p-3 rounded-xl border border-amber-900/20 outline-none focus:border-orange-500 bg-white"
                                placeholder="Type your reply here..."
                              />
                              <button 
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
                              >
                                <Send size={16} /> Send Reply
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-amber-900/50">No messages.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
