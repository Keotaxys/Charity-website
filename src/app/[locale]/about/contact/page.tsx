'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

export default function ContactPage() {
  const locale = useLocale();
  
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const docRef = doc(db, 'settings', 'contact_info');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setContactInfo(docSnap.data());
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };
    fetchContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        created_at: new Date(),
        status: 'unread'
      });
      setStatus({ type: 'success', text: locale === 'lo' ? 'ສົ່ງຂໍ້ຄວາມສຳເລັດແລ້ວ! ພວກເຮົາຈະຕິດຕໍ່ກັບໂດຍໄວທີ່ສຸດ.' : 'Message sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', text: locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການສົ່ງຂໍ້ຄວາມ.' : 'An error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const addressText = contactInfo ? (locale === 'lo' ? contactInfo.address_lo : contactInfo.address_en) : 'ກຳລັງໂຫຼດທີ່ຢູ່...';

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 1. Header */}
      <section className="bg-gray-100 py-20 px-6 border-b border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-400/15 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase drop-shadow-sm">
            {locale === 'lo' ? 'ຕິດຕໍ່ພວກເຮົາ' : 'CONTACT US'}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {locale === 'lo' 
              ? 'ພວກເຮົາຍິນດີຮັບຟັງທຸກຄຳແນະນຳ, ຄຳຖາມ ຫຼື ການສະເໜີໂຄງການໃໝ່ໆ.' 
              : 'We’d love to hear from you. Whether it’s a question, suggestion, or a new project idea.'}
          </p>
        </div>
      </section>

      {/* 2. ຟອມ & ຂໍ້ມູນຕິດຕໍ່ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* ຂໍ້ມູນຕິດຕໍ່ */}
          <div className="w-full lg:w-1/3 space-y-10">
            <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">
              {locale === 'lo' ? 'ຊ່ອງທາງຕິດຕໍ່' : 'GET IN TOUCH'}
            </h2>
            
            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-400 group-hover:bg-pink-400 group-hover:text-white transition-colors shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{locale === 'lo' ? 'ທີ່ຕັ້ງສຳນັກງານ' : 'OUR OFFICE'}</h3>
                <p className="text-gray-500 leading-relaxed whitespace-pre-line">
                  {addressText}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{locale === 'lo' ? 'ເບີໂທຕິດຕໍ່' : 'PHONE NUMBER'}</h3>
                <p className="text-gray-500 leading-relaxed">{contactInfo?.phone || '...'}</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-400 group-hover:bg-pink-400 group-hover:text-white transition-colors shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{locale === 'lo' ? 'ອີເມວ' : 'EMAIL ADDRESS'}</h3>
                <p className="text-gray-500 leading-relaxed">{contactInfo?.email || '...'}</p>
              </div>
            </div>
          </div>

          {/* ຟອມຕິດຕໍ່ */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-[100px] -z-10"></div>
              <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">
                {locale === 'lo' ? 'ຝາກຂໍ້ຄວາມເຖິງພວກເຮົາ' : 'SEND US A MESSAGE'}
              </h2>

              {status.text && (
                <div className={`p-5 rounded-2xl mb-8 font-bold text-sm border ${status.type === 'success' ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-pink-50 text-pink-500 border-pink-200'}`}>
                  {status.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ຊື່ ແລະ ນາມສະກຸນ' : 'FULL NAME'}</label>
                    <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ອີເມວ (Email)' : 'EMAIL ADDRESS'}</label>
                    <input type="email" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ຫົວຂໍ້' : 'SUBJECT'}</label>
                  <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ຂໍ້ຄວາມ' : 'MESSAGE'}</label>
                  <textarea required rows={6} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all resize-none" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                </div>
                <button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-5 px-10 rounded-xl transition-all shadow-md hover:shadow-teal-600/30 uppercase tracking-widest w-full md:w-auto disabled:bg-gray-400">
                  {loading ? (locale === 'lo' ? 'ກຳລັງສົ່ງ...' : 'SENDING...') : (locale === 'lo' ? 'ສົ່ງຂໍ້ຄວາມ' : 'SEND MESSAGE')}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}