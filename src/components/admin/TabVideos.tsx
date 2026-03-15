'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export default function TabVideos({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const [videosList, setVideosList] = useState<any[]>([]);
  const [videoForm, setVideoForm] = useState({ title_lo: '', title_en: '', youtube_url: '' });
  const [loadingAddVideo, setLoadingAddVideo] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const q = query(collection(db, 'videos'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideosList(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAddVideo(true);
    try {
      await addDoc(collection(db, 'videos'), {
        ...videoForm,
        created_at: new Date()
      });
      showMessage('ເພີ່ມວິດີໂອໃໝ່ສຳເລັດແລ້ວ!', 'success');
      setVideoForm({ title_lo: '', title_en: '', youtube_url: '' });
      fetchVideos();
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມວິດີໂອ', 'error');
    }
    setLoadingAddVideo(false);
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບວິດີໂອນີ້?')) {
      try {
        await deleteDoc(doc(db, 'videos', id));
        showMessage('ລຶບວິດີໂອສຳເລັດແລ້ວ!', 'success');
        fetchVideos();
      } catch (error) {
        showMessage('ເກີດຂໍ້ຜິດພາດໃນການລຶບ', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* ຟອມເພີ່ມວິດີໂອ */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-teal-600">
            <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" /></svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900">ເພີ່ມວິດີໂອໃໝ່ (Add New Video)</h2>
        </div>
        <p className="text-gray-500 mb-6 text-sm">ເພີ່ມລິ້ງ YouTube ເພື່ອສະແດງໃນໜ້າລວມວິດີໂອຜົນງານ.</p>

        <form onSubmit={handleAddVideo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່ວິດີໂອ (ລາວ)</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" value={videoForm.title_lo} onChange={(e) => setVideoForm({...videoForm, title_lo: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່ວິດີໂອ (ອັງກິດ)</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" value={videoForm.title_en} onChange={(e) => setVideoForm({...videoForm, title_en: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">YouTube Embed URL</label>
            <input type="url" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" placeholder="ຕົວຢ່າງ: https://www.youtube.com/embed/xxxxx" value={videoForm.youtube_url} onChange={(e) => setVideoForm({...videoForm, youtube_url: e.target.value})} />
          </div>
          <button type="submit" disabled={loadingAddVideo} className="bg-teal-600 text-white font-black py-4 px-8 rounded-xl hover:bg-teal-700 transition-all shadow-md uppercase tracking-wide disabled:bg-gray-400 w-full md:w-auto">
            {loadingAddVideo ? 'ກຳລັງເພີ່ມ...' : 'ເພີ່ມວິດີໂອ'}
          </button>
        </form>
      </div>

      {/* ລາຍການວິດີໂອທີ່ເພີ່ມແລ້ວ */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-6">ລາຍການວິດີໂອທັງໝົດ</h2>
        {videosList.length === 0 ? (
          <p className="text-gray-500 text-center py-4">ຍັງບໍ່ມີວິດີໂອໃນລະບົບ.</p>
        ) : (
          <div className="space-y-4">
            {videosList.map((video) => (
              <div key={video.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{video.title_lo}</h3>
                  <p className="text-sm text-gray-500 truncate max-w-xs md:max-w-md">{video.youtube_url}</p>
                </div>
                <button 
                  onClick={() => handleDeleteVideo(video.id)}
                  className="text-pink-500 hover:text-pink-700 font-bold text-sm bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-lg transition-colors"
                >
                  ລຶບ (Delete)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}