import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { MessageCircle, X, Send } from 'lucide-react';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const { chatMessages, addChatMessage } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    addChatMessage({ sender: 'user', text });
    setText('');

    // Simulate agent response
    setTimeout(() => {
      addChatMessage({ sender: 'agent', text: 'Thank you for your message! Our team will get back to you shortly.' });
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-500 transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[calc(100vw-3rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-amber-900/10 flex flex-col transition-all origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="bg-amber-950 text-white p-4 rounded-t-2xl flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-bold">Live Support</h3>
            <p className="text-xs text-amber-100/70">We typically reply in a few minutes</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-amber-50/30">
          {chatMessages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-orange-600 text-white rounded-br-sm' : 'bg-white border border-amber-900/10 text-amber-950 rounded-bl-sm shadow-sm'}`}
              >
                {msg.text}
              </div>
              <div className="text-[10px] text-amber-900/40 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-amber-900/10 rounded-b-2xl shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-amber-50 border border-amber-900/10 rounded-full text-sm outline-none focus:border-orange-500"
            />
            <button 
              type="submit"
              disabled={!text.trim()}
              className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-500 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
