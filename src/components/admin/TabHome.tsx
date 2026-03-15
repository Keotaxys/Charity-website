'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function TabHome({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [loadingVideo, setLoadingVideo] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setVideoUrl(docSnap.data().hero_video_url || '');
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingVideo(true);
    try {
      await setDoc(doc(db, 'settings', 'homepage'), { hero_video_url: videoUrl }, { merge: true });
      showMessage('ບັນທຶກວິດີໂອໜ້າຫຼັກສຳເລັດແລ້ວ!', 'success');
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກວິດີໂອ', 'error');
    }
    setLoadingVideo(false);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-teal-600">
          <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" /><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" /></svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900">ຕັ້ງຄ່າໜ້າຫຼັກ (Homepage Settings)</h2>
      </div>
      <p className="text-gray-500 mb-6 text-sm">ປ່ຽນລິ້ງວິດີໂອພື້ນຫຼັງຂອງໜ້າທຳອິດ</p>
      <form onSubmit={handleSaveVideo} className="flex flex-col sm:flex-row gap-4">
        <input type="url" required className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" placeholder="ວາງລິ້ງວິດີໂອທີ່ນີ້..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
        <button type="submit" disabled={loadingVideo} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-8 rounded-xl transition-all shadow-md disabled:bg-gray-400 whitespace-nowrap">
          {loadingVideo ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
        </button>
      </form>
    </div>
  );
}