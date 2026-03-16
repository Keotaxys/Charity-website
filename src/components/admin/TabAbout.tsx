'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function TabAbout({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const [settings, setSettings] = useState({
    title_lo: 'ກ່ຽວກັບພວກເຮົາ',
    title_en: 'ABOUT US',
    heading_lo: 'ຄວາມໂປ່ງໃສສ້າງໄດ້ ດ້ວຍການລົງມືເຮັດ',
    heading_en: 'TRANSPARENCY BUILT THROUGH ACTION',
    desc1_lo: 'ພວກເຮົາເຊື່ອວ່າທຸກໆການບໍລິຈາກມີຄຸນຄ່າສະເໝີ. ທຸກໆໂຄງການທີ່ພວກເຮົາເຮັດ ແມ່ນອີງໃສ່ຄວາມໂປ່ງໃສ ແລະ ສາມາດກວດສອບໄດ້ໃນທຸກຂັ້ນຕອນ.',
    desc1_en: 'We believe every donation holds immense value. Every project we undertake is built on transparency and is verifiable at every step.',
    desc2_lo: 'ເງິນທຸກກີບທີ່ທ່ານບໍລິຈາກເຂົ້າມາ ຈະຖືກນຳໄປໃຊ້ໃນໂຄງການ 100% ໂດຍບໍ່ມີການຫັກຄ່າໃຊ້ຈ່າຍບໍລິຫານໃດໆທັງສິ້ນ.',
    desc2_en: '100% of your donation goes directly to the projects. We do not deduct any administrative fees.',
    image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'about_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
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
      await setDoc(doc(db, 'settings', 'about_page'), settings, { merge: true });
      showMessage('ບັນທຶກຂໍ້ມູນກ່ຽວກັບພວກເຮົາສຳເລັດແລ້ວ!', 'success');
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
          <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v19.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V2.25zM5.25 3v18h13.5V3H5.25zm2.25 3a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75V6zm5.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75V6zm-5.25 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-2.25zm5.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75v-2.25zm-5.25 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-2.25z" clipRule="evenodd" /></svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900">ຈັດການຂໍ້ມູນກ່ຽວກັບພວກເຮົາ (About Us)</h2>
      </div>
      
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* ສ່ວນທີ 1: ຫົວຂໍ້ */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-6">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" /></svg>
            1. ຫົວຂໍ້ (Headings)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ຍ່ອຍ (ລາວ)</label>
              <input type="text" name="title_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.title_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ຍ່ອຍ (ອັງກິດ)</label>
              <input type="text" name="title_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.title_en} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ຫຼັກ (ລາວ)</label>
              <input type="text" name="heading_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.heading_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ຫຼັກ (ອັງກິດ)</label>
              <input type="text" name="heading_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.heading_en} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ສ່ວນທີ 2: ເນື້ອຫາ */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-6">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M3 4.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 4.5zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
            2. ເນື້ອຫາ (Descriptions)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ເນື້ອຫາວັກທີ 1 (ລາວ)</label>
              <textarea name="desc1_lo" required rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={settings.desc1_lo} onChange={handleChange}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ເນື້ອຫາວັກທີ 1 (ອັງກິດ)</label>
              <textarea name="desc1_en" required rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={settings.desc1_en} onChange={handleChange}></textarea>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ເນື້ອຫາວັກທີ 2 (ລາວ)</label>
              <textarea name="desc2_lo" required rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={settings.desc2_lo} onChange={handleChange}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ເນື້ອຫາວັກທີ 2 (ອັງກິດ)</label>
              <textarea name="desc2_en" required rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={settings.desc2_en} onChange={handleChange}></textarea>
            </div>
          </div>
        </div>

        {/* ສ່ວນທີ 3: ຮູບພາບ */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>
            3. ຮູບພາບ (Image)
          </h3>
          <label className="block text-gray-700 font-bold mb-2 text-sm">ລິ້ງຮູບພາບ (URL)</label>
          <input type="url" name="image_url" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" placeholder="ວາງລິ້ງຮູບພາບທີ່ນີ້..." value={settings.image_url} onChange={handleChange} />
        </div>

        <button type="submit" disabled={loading} className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-xl transition-all shadow-md hover:shadow-teal-600/30 disabled:bg-gray-400 uppercase tracking-wide">
          {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການຕັ້ງຄ່າ'}
        </button>
      </form>
    </div>
  );
}