'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function TabHome({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const [settings, setSettings] = useState({
    hero_video_url: '',
    title_lo: '', title_en: '', subtitle_lo: '', subtitle_en: '',
    campaign_title_lo: '', campaign_title_en: '', campaign_subtitle_lo: '', campaign_subtitle_en: '',
    sponsor_title_lo: '', sponsor_title_en: '', sponsor_subtitle_lo: '', sponsor_subtitle_en: '',
    // ເພີ່ມຕົວແປສຳລັບວິດີໂອ
    video_title_lo: '', video_title_en: '', video_subtitle_lo: '', video_subtitle_en: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setSettings({ ...settings, ...docSnap.data() });
      } catch (error) {
        console.error("Error fetching homepage settings:", error);
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

  const inputClass = "w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all";

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
        <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
          <svg className="w-8 h-8 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">ຕັ້ງຄ່າໜ້າຫຼັກ (Homepage Settings)</h2>
          <p className="text-gray-500 text-sm mt-1 font-bold">HERO, CAMPAIGNS, SUPPORTERS & VIDEOS</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. Video & Hero Text */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-6">
          <h3 className="font-black text-teal-700 text-sm uppercase flex items-center gap-2">
            1. ສ່ວນເທິງສຸດ (Hero Section)
          </h3>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-xs uppercase">ລິ້ງວິດີໂອພື້ນຫຼັງ (Video URL)</label>
            <input type="url" name="hero_video_url" className={inputClass} value={settings.hero_video_url} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="title_lo" placeholder="ຫົວຂໍ້ໃຫຍ່ (ລາວ)" className={inputClass} value={settings.title_lo} onChange={handleChange} />
            <input type="text" name="title_en" placeholder="ຫົວຂໍ້ໃຫຍ່ (EN)" className={inputClass} value={settings.title_en} onChange={handleChange} />
            <textarea name="subtitle_lo" placeholder="ຄຳອະທິບາຍ (ລາວ)" rows={2} className={`${inputClass} resize-none`} value={settings.subtitle_lo} onChange={handleChange}></textarea>
            <textarea name="subtitle_en" placeholder="ຄຳອະທິບາຍ (EN)" rows={2} className={`${inputClass} resize-none`} value={settings.subtitle_en} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* 2. Campaigns Text */}
        <div className="p-6 bg-teal-50/30 rounded-2xl border border-teal-100 space-y-6">
          <h3 className="font-black text-teal-700 text-sm uppercase flex items-center gap-2">
            2. ສ່ວນຫົວຂໍ້ໂຄງການ (Campaigns Section)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="campaign_title_lo" placeholder="ຫົວຂໍ້ໂຄງການ (ລາວ)" className={inputClass} value={settings.campaign_title_lo} onChange={handleChange} />
            <input type="text" name="campaign_title_en" placeholder="Campaign Title (EN)" className={inputClass} value={settings.campaign_title_en} onChange={handleChange} />
            <textarea name="campaign_subtitle_lo" placeholder="ຄຳອະທິບາຍໂຄງການ (ລາວ)" rows={2} className={`${inputClass} resize-none`} value={settings.campaign_subtitle_lo} onChange={handleChange}></textarea>
            <textarea name="campaign_subtitle_en" placeholder="Campaign Subtitle (EN)" rows={2} className={`${inputClass} resize-none`} value={settings.campaign_subtitle_en} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* 3. Supporters Text */}
        <div className="p-6 bg-pink-50/30 rounded-2xl border border-pink-100 space-y-6">
          <h3 className="font-black text-pink-600 text-sm uppercase flex items-center gap-2">
            3. ສ່ວນຫົວຂໍ້ຜູ້ສະໜັບສະໜູນ (Supporters Section)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="sponsor_title_lo" placeholder="ຫົວຂໍ້ຜູ້ສະໜັບສະໜູນ (ລາວ)" className={inputClass} value={settings.sponsor_title_lo} onChange={handleChange} />
            <input type="text" name="sponsor_title_en" placeholder="Supporter Title (EN)" className={inputClass} value={settings.sponsor_title_en} onChange={handleChange} />
            <textarea name="sponsor_subtitle_lo" placeholder="ຄຳອະທິບາຍ (ລາວ)" rows={2} className={`${inputClass} resize-none`} value={settings.sponsor_subtitle_lo} onChange={handleChange}></textarea>
            <textarea name="sponsor_subtitle_en" placeholder="Supporter Subtitle (EN)" rows={2} className={`${inputClass} resize-none`} value={settings.sponsor_subtitle_en} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* 4. Videos Text */}
        <div className="p-6 bg-gray-100 rounded-2xl border border-gray-200 space-y-6">
          <h3 className="font-black text-gray-900 text-sm uppercase flex items-center gap-2">
            4. ສ່ວນຫົວຂໍ້ວິດີໂອ (Videos Section)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="video_title_lo" placeholder="ຫົວຂໍ້ວິດີໂອ (ລາວ)" className={inputClass} value={settings.video_title_lo} onChange={handleChange} />
            <input type="text" name="video_title_en" placeholder="Video Title (EN)" className={inputClass} value={settings.video_title_en} onChange={handleChange} />
            <textarea name="video_subtitle_lo" placeholder="ຄຳອະທິບາຍ (ລາວ)" rows={2} className={`${inputClass} resize-none`} value={settings.video_subtitle_lo} onChange={handleChange}></textarea>
            <textarea name="video_subtitle_en" placeholder="Video Subtitle (EN)" rows={2} className={`${inputClass} resize-none`} value={settings.video_subtitle_en} onChange={handleChange}></textarea>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-12 rounded-xl transition-all shadow-md hover:shadow-teal-600/30 uppercase tracking-widest">
          {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການຕັ້ງຄ່າ'}
        </button>
      </form>
    </div>
  );
}