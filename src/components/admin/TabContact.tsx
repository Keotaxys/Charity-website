'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function TabContact({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const [settings, setSettings] = useState({
    phone: '',
    email: '',
    address_lo: '',
    address_en: '',
    facebook_url: '',
    tiktok_url: '',
    instagram_url: '',
    youtube_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const docRef = doc(db, 'settings', 'contact_info');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setSettings(docSnap.data() as any);
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    };
    fetchContact();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'contact_info'), settings, { merge: true });
      showMessage('ບັນທຶກຂໍ້ມູນການຕິດຕໍ່ສຳເລັດແລ້ວ!', 'success');
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ', 'error');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  // ຄລາດສຳລັບ Input ທີ່ເນັ້ນຄວາມເຂັ້ມ ແລະ ອ່ານງ່າຍ
  const inputClass = "w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all placeholder:text-gray-400";

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
        <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
          <svg className="w-8 h-8 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">ຕັ້ງຄ່າການຕິດຕໍ່</h2>
          <p className="text-gray-500 text-sm mt-1 font-bold">CONTACT & SOCIAL MEDIA SETTINGS</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* ສ່ວນຂໍ້ມູນພື້ນຖານ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">ເບີໂທລະສັບ (Phone)</label>
            <input type="text" name="phone" placeholder="+856 20..." className={inputClass} value={settings.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">ອີເມວ (Email)</label>
            <input type="email" name="email" placeholder="contact@beast.lao" className={inputClass} value={settings.email} onChange={handleChange} />
          </div>
        </div>

        {/* ສ່ວນທີ່ຢູ່ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">ທີ່ຢູ່ (ພາສາລາວ)</label>
            <textarea name="address_lo" rows={3} placeholder="ບ້ານ, ເມືອງ, ແຂວງ..." className={`${inputClass} resize-none`} value={settings.address_lo} onChange={handleChange}></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">ທີ່ຢູ່ (English)</label>
            <textarea name="address_en" rows={3} placeholder="Village, District, Province..." className={`${inputClass} resize-none`} value={settings.address_en} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* ສ່ວນໂຊຊຽວມີເດຍ */}
        <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-6">
          <h3 className="font-black text-gray-900 flex items-center gap-2 text-sm uppercase tracking-widest">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" /></svg>
            Social Media Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Facebook URL</label>
               <input type="url" name="facebook_url" className={inputClass} value={settings.facebook_url} onChange={handleChange} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase ml-2">TikTok URL</label>
               <input type="url" name="tiktok_url" className={inputClass} value={settings.tiktok_url} onChange={handleChange} placeholder="https://tiktok.com/@..." />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Instagram URL</label>
               <input type="url" name="instagram_url" className={inputClass} value={settings.instagram_url} onChange={handleChange} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase ml-2">YouTube URL</label>
               <input type="url" name="youtube_url" className={inputClass} value={settings.youtube_url} onChange={handleChange} placeholder="https://youtube.com/c/..." />
            </div>
          </div>
        </div>

        {/* ປຸ່ມບັນທຶກສີ Teal */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-12 rounded-2xl transition-all shadow-md hover:shadow-teal-600/30 disabled:bg-gray-400 uppercase tracking-widest text-sm"
          >
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກຂໍ້ມູນການຕິດຕໍ່'}
          </button>
        </div>
      </form>
    </div>
  );
}