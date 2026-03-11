'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { useLocale } from 'next-intl';

export default function AdminDashboard() {
  const locale = useLocale();
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // State ສຳລັບວິດີໂອໜ້າຫຼັກ
  const [videoUrl, setVideoUrl] = useState('');
  const [loadingVideo, setLoadingVideo] = useState(false);

  // State ສຳລັບສ້າງໂຄງການ
  const [formData, setFormData] = useState({
    title_lo: '',
    title_en: '',
    description_lo: '',
    description_en: '',
    target_amount: '',
    cover_image: ''
  });
  const [loadingCampaign, setLoadingCampaign] = useState(false);

  // ດຶງລິ້ງວິດີໂອປະຈຸບັນມາສະແດງຕອນໂຫຼດໜ້າເວັບ
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVideoUrl(docSnap.data().hero_video_url || '');
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // ຟັງຊັນບັນທຶກວິດີໂອ
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingVideo(true);
    try {
      await setDoc(doc(db, 'settings', 'homepage'), {
        hero_video_url: videoUrl
      }, { merge: true });
      setMessage({ text: 'ບັນທຶກວິດີໂອໜ້າຫຼັກສຳເລັດແລ້ວ!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກວິດີໂອ', type: 'error' });
    }
    setLoadingVideo(false);
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // ຟັງຊັນສ້າງໂຄງການ
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCampaign(true);
    try {
      await addDoc(collection(db, 'campaigns'), {
        ...formData,
        target_amount: Number(formData.target_amount),
        raised_amount: 0, // ເລີ່ມຕົ້ນທີ່ 0 ກີບ
        status: 'Active',
        created_at: new Date()
      });
      setMessage({ text: 'ສ້າງໂຄງການໃໝ່ສຳເລັດແລ້ວ!', type: 'success' });
      setFormData({ title_lo: '', title_en: '', description_lo: '', description_en: '', target_amount: '', cover_image: '' }); // ລ້າງຟອມ
    } catch (error) {
      setMessage({ text: 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງໂຄງການ', type: 'error' });
    }
    setLoadingCampaign(false);
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header ຂອງ Admin */}
      <div className="bg-white border-b border-gray-200 py-8 px-6 mb-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">ຈັດການຂໍ້ມູນເວັບໄຊ້ BEAST.LAO</p>
          </div>
          <div className="bg-teal-50 text-teal-600 px-4 py-2 rounded-lg font-bold text-sm border border-teal-100">
            ສະຖານະ: ເຂົ້າສູ່ລະບົບແລ້ວ
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-10">
        
        {/* ແຈ້ງເຕືອນ (Alerts) */}
        {message.text && (
          <div className={`p-4 rounded-xl font-bold text-center border ${
            message.type === 'success' ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-pink-50 text-pink-500 border-pink-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* ສ່ວນທີ 1: ຕັ້ງຄ່າວິດີໂອໜ້າຫຼັກ */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-2">1. ຕັ້ງຄ່າໜ້າຫຼັກ (Homepage Settings)</h2>
          <p className="text-gray-500 mb-6 text-sm">ປ່ຽນລິ້ງວິດີໂອພື້ນຫຼັງ (ແນະນຳໃຫ້ໃຊ້ລິ້ງ .mp4 ທີ່ຝາກໄວ້ໃນ Firebase Storage ຫຼື ບ່ອນອື່ນໆ)</p>
          
          <form onSubmit={handleSaveVideo} className="flex gap-4">
            <input 
              type="url" 
              required
              className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
              placeholder="ຕົວຢ່າງ: https://.../video.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loadingVideo}
              className="bg-gray-900 hover:bg-teal text-white font-bold py-4 px-8 rounded-xl transition-all disabled:bg-gray-400 whitespace-nowrap"
            >
              {loadingVideo ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກວິດີໂອ'}
            </button>
          </form>
        </div>

        {/* ສ່ວນທີ 2: ສ້າງໂຄງການໃໝ່ */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-2">2. ສ້າງໂຄງການໃໝ່ (Create Campaign)</h2>
          <p className="text-gray-500 mb-6 text-sm">ຂໍ້ມູນນີ້ຈະໄປສະແດງຢູ່ໜ້າ /campaigns ອັດຕະໂນມັດ</p>

          <form onSubmit={handleCreateCampaign} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່ໂຄງການ (ພາສາລາວ)</label>
                <input 
                  type="text" required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none"
                  value={formData.title_lo} onChange={(e) => setFormData({...formData, title_lo: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່ໂຄງການ (ພາສາອັງກິດ)</label>
                <input 
                  type="text" required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none"
                  value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">ລາຍລະອຽດ (ພາສາລາວ)</label>
                <textarea 
                  required rows={4}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none resize-none"
                  value={formData.description_lo} onChange={(e) => setFormData({...formData, description_lo: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">ລາຍລະອຽດ (ພາສາອັງກິດ)</label>
                <textarea 
                  required rows={4}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none resize-none"
                  value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">ຍອດເງິນເປົ້າໝາຍ (ກີບ)</label>
                <input 
                  type="number" required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none"
                  placeholder="ເຊັ່ນ: 100000000"
                  value={formData.target_amount} onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">ລິ້ງຮູບໜ້າປົກ (Cover Image URL)</label>
                <input 
                  type="url" required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none"
                  placeholder="ເຊັ່ນ: https://.../image.jpg"
                  value={formData.cover_image} onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loadingCampaign}
              className="w-full bg-teal-600 text-white font-black py-4 rounded-xl hover:bg-teal-700 transition-all shadow-md hover:shadow-teal-600/30 uppercase tracking-wide disabled:bg-gray-400 text-lg mt-4"
            >
              {loadingCampaign ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ ແລະ ເຜີຍແຜ່ໂຄງການ'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}