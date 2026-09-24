import React from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';

export default function Contact() {
  const { sendMessage, siteSettings } = useStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    });
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50/30">
      
      {/* Header */}
      <div className="bg-amber-950 text-amber-50 py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-amber-50/80">
            Have a question about an order, our sourcing practices, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-amber-900/5 border border-amber-900/10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Contact Info */}
            <div className="bg-amber-50 p-10 lg:p-16">
              <h2 className="font-serif text-3xl font-bold text-amber-950 mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-orange-600 shadow-sm shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-950 mb-1">Our Headquarters</h3>
                    <p className="text-amber-900/80 leading-relaxed whitespace-pre-line">
                      {siteSettings.supportAddress || 'Nairobi Financial Centre, Kenya'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-orange-600 shadow-sm shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-950 mb-1">Phone / WhatsApp Support</h3>
                    <p className="text-amber-900/80 leading-relaxed">
                      {siteSettings.supportPhone || '+254 700 123 456'}<br />
                      <span className="text-xs text-amber-900/60 font-medium">{siteSettings.workingHours || 'Mon - Fri: 8:00 AM - 6:00 PM (EAT)'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-orange-600 shadow-sm shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-950 mb-1">Email Us</h3>
                    <p className="text-amber-900/80 leading-relaxed">
                      {siteSettings.supportEmail || 'support@eastafricastore.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-10 lg:p-16 relative">
              {isSubmitted ? (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center rounded-r-3xl">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-amber-950 mb-2">Message Sent!</h3>
                  <p className="text-amber-900/70">Thank you for reaching out. We will get back to you shortly.</p>
                </div>
              ) : null}
              <h2 className="font-serif text-3xl font-bold text-amber-950 mb-8">Send a Message</h2>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-bold text-amber-950">First Name</label>
                    <input 
                      required
                      type="text" 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-bold text-amber-950">Last Name</label>
                    <input 
                      required
                      type="text" 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-amber-950">Email Address</label>
                  <input 
                    required
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    placeholder="jane@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-bold text-amber-950">Subject</label>
                  <select 
                    id="subject" 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-amber-900"
                  >
                    <option>General Inquiry</option>
                    <option>Order Status</option>
                    <option>Returns & Exchanges</option>
                    <option>Wholesale</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-bold text-amber-950">Message</label>
                  <textarea 
                    required
                    id="message" 
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-colors shadow-md shadow-orange-600/20"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
