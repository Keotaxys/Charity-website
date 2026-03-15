'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function TabCampaigns({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const [formData, setFormData] = useState({
    title_lo: '', title_en: '', description_lo: '', description_en: '', target_amount: '', cover_image: ''
  });
  const [loadingCampaign, setLoadingCampaign] = useState(false);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCampaign(true);
    try {
      await addDoc(collection(db, 'campaigns'), {
        ...formData,
        target_amount: Number(formData.target_amount),
        raised_amount: 0,
        status: 'Active',
        created_at: new Date()
      });
      showMessage('ສ້າງໂຄງການໃໝ່ສຳເລັດແລ້ວ!', 'success');
      setFormData({ title_lo: '', title_en: '', description_lo: '', description_en: '', target_amount: '', cover_image: '' });
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການສ້າງໂຄງການ', 'error');
    }
    setLoadingCampaign(false);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-teal-600">
          <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00-.479 4.024m-18.068 4.253l2.8-.7a8.25 8.25 0 015.58.652l.108.054a9.75 9.75 0 006.725.738l1.838-.46V10.5a.75.75 0 01-.75.75h-.02a9.75 9.75 0 01-6.725-.738l-.108-.054a8.25 8.25 0 00-5.58-.652l-2.8.7V21a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" /></svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900">ສ້າງໂຄງການໃໝ່ (Create Campaign)</h2>
      </div>
      <p className="text-gray-500 mb-6 text-sm">ຂໍ້ມູນນີ້ຈະໄປສະແດງຢູ່ໜ້າ /campaigns ອັດຕະໂນມັດ</p>

      <form onSubmit={handleCreateCampaign} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່ໂຄງການ (ລາວ)</label>
            <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" value={formData.title_lo} onChange={(e) => setFormData({...formData, title_lo: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່ໂຄງການ (ອັງກິດ)</label>
            <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ລາຍລະອຽດ (ລາວ)</label>
            <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 resize-none" value={formData.description_lo} onChange={(e) => setFormData({...formData, description_lo: e.target.value})}></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ລາຍລະອຽດ (ອັງກິດ)</label>
            <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 resize-none" value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})}></textarea>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ຍອດເງິນເປົ້າໝາຍ (ກີບ)</label>
            <input type="number" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" placeholder="ຕົວຢ່າງ: 10000000" value={formData.target_amount} onChange={(e) => setFormData({...formData, target_amount: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ລິ້ງຮູບໜ້າປົກ (URL)</label>
            <input type="url" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" value={formData.cover_image} onChange={(e) => setFormData({...formData, cover_image: e.target.value})} />
          </div>
        </div>
        <button type="submit" disabled={loadingCampaign} className="w-full bg-teal-600 text-white font-black py-4 rounded-xl hover:bg-teal-700 transition-all shadow-md uppercase tracking-wide disabled:bg-gray-400">
          {loadingCampaign ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ ແລະ ເຜີຍແຜ່'}
        </button>
      </form>
    </div>
  );
}