'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function TabHome({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const [settings, setSettings] = useState({
    hero_video_url: '',
    hero_title_lo: 'ຍິນດີຕ້ອນຮັບສູ່ ໂຄງການຊ່ວຍເຫຼືອສັງຄົມ',
    hero_title_en: 'WELCOME TO OUR SOCIETY PROJECT',
    hero_subtitle_lo: 'ພວກເຮົາມີພາລະກິດໃນການປ່ຽນແປງຊີວິດ ແລະ ສ້າງສັງຄົມທີ່ໜ້າຢູ່ໄປພ້ອມໆກັນ.',
    hero_subtitle_en: 'Our mission is to transform lives and build a better society together.'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings({
            hero_video_url: data.hero_video_url || '',
            hero_title_lo: data.hero_title_lo || 'ຍິນດີຕ້ອນຮັບສູ່ ໂຄງການຊ່ວຍເຫຼືອສັງຄົມ',
            hero_title_en: data.hero_title_en || 'WELCOME TO OUR SOCIETY PROJECT',
            hero_subtitle_lo: data.hero_subtitle_lo || 'ພວກເຮົາມີພາລະກິດໃນການປ່ຽນແປງຊີວິດ ແລະ ສ້າງສັງຄົມທີ່ໜ້າຢູ່ໄປພ້ອມໆກັນ.',
            hero_subtitle_en: data.hero_subtitle_en || 'Our mission is to transform lives and build a better society together.'
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'homepage'), settings, { merge: true });
      showMessage('ບັນທຶກການຕັ້ງຄ່າໜ້າຫຼັກສຳເລັດແລ້ວ!', 'success');
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
      <div className="flex items-center gap-3 mb-6">
        <div className="text-teal-600">
          <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" /><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" /></svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900">ຕັ້ງຄ່າໜ້າຫຼັກ (Homepage Settings)</h2>
      </div>
      
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* ສ່ວນທີ 1: ວິດີໂອພື້ນຫຼັງ (ປ່ຽນ Emoji ເປັນ Solid Video Icon) */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" /></svg>
            1. ວິດີໂອພື້ນຫຼັງ (Background Video)
          </h3>
          <label className="block text-gray-700 font-bold mb-2 text-sm">ລິ້ງວິດີໂອ (URL)</label>
          <input 
            type="url" 
            name="hero_video_url"
            required 
            className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all" 
            placeholder="ວາງລິ້ງວິດີໂອທີ່ນີ້..." 
            value={settings.hero_video_url} 
            onChange={handleChange} 
          />
        </div>

        {/* ສ່ວນທີ 2: ຂໍ້ຄວາມໜ້າຫຼັກ (ປ່ຽນ Emoji ເປັນ Solid Edit/Text Icon) */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-6">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" /><path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" /></svg>
            2. ຂໍ້ຄວາມໜ້າຫຼັກ (Hero Text)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ຫຼັກ (ພາສາລາວ)</label>
              <input 
                type="text" 
                name="hero_title_lo"
                required 
                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all" 
                value={settings.hero_title_lo} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ຫຼັກ (ພາສາອັງກິດ)</label>
              <input 
                type="text" 
                name="hero_title_en"
                required 
                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all" 
                value={settings.hero_title_en} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຄຳອະທິບາຍ (ພາສາລາວ)</label>
              <textarea 
                name="hero_subtitle_lo"
                required 
                rows={3}
                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all resize-none" 
                value={settings.hero_subtitle_lo} 
                onChange={handleChange} 
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຄຳອະທິບາຍ (ພາສາອັງກິດ)</label>
              <textarea 
                name="hero_subtitle_en"
                required 
                rows={3}
                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all resize-none" 
                value={settings.hero_subtitle_en} 
                onChange={handleChange} 
              ></textarea>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-xl transition-all shadow-md hover:shadow-teal-600/30 disabled:bg-gray-400 uppercase tracking-wide">
          {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການຕັ້ງຄ່າ'}
        </button>
      </form>
    </div>
  );
}