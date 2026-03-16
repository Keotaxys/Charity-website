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

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
        <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
          <svg className="w-8 h-8 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">ຕັ້ງຄ່າການຕິດຕໍ່ (Contact Settings)</h2>
          <p className="text-gray-500 text-sm mt-1">ຈັດການເບີໂທ, ອີເມວ ແລະ ລິ້ງໂຊຊຽວມີເດຍຂອງອົງກອນ</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* ຂໍ້ມູນພື້ນຖານ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ເບີໂທລະສັບ</label>
            <input type="text" name="phone" placeholder="+856 20..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ອີເມວ (Email)</label>
            <input type="email" name="email" placeholder="contact@beast.lao" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.email} onChange={handleChange} />
          </div>
        </div>

        {/* ທີ່ຢູ່ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ທີ່ຢູ່ (ພາສາລາວ)</label>
            <textarea name="address_lo" rows={3} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={settings.address_lo} onChange={handleChange}></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ທີ່ຢູ່ (ພາສາອັງກິດ)</label>
            <textarea name="address_en" rows={3} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={settings.address_en} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* ໂຊຊຽວມີເດຍ */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-6">
          <h3 className="font-black text-gray-900 flex items-center gap-2">🌐 Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="url" name="facebook_url" placeholder="Facebook URL" className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm" value={settings.facebook_url} onChange={handleChange} />
            <input type="url" name="tiktok_url" placeholder="TikTok URL" className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm" value={settings.tiktok_url} onChange={handleChange} />
            <input type="url" name="instagram_url" placeholder="Instagram URL" className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm" value={settings.instagram_url} onChange={handleChange} />
            <input type="url" name="youtube_url" placeholder="YouTube Channel URL" className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm" value={settings.youtube_url} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-xl transition-all shadow-md disabled:bg-gray-400 uppercase tracking-widest">
          {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກຂໍ້ມູນການຕິດຕໍ່'}
        </button>
      </form>
    </div>
  );
}