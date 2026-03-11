'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    title_lo: '', title_en: '',
    description_lo: '', description_en: '',
    target_amount: 0, cover_image: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "campaigns"), {
        ...formData,
        target_amount: Number(formData.target_amount),
        raised_amount: 0,
        status: 'active',
        created_at: new Date()
      });
      alert("ເພີ່ມໂຄງການສຳເລັດແລ້ວ!");
      setFormData({ title_lo: '', title_en: '', description_lo: '', description_en: '', target_amount: 0, cover_image: '' });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-10">ສ້າງໂຄງການໃໝ່ (Create Campaign)</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <input type="text" placeholder="ຊື່ໂຄງການ (ພາສາລາວ)" className="w-full p-3 border rounded-lg"
            onChange={(e) => setFormData({...formData, title_lo: e.target.value})} value={formData.title_lo} />
          <textarea placeholder="ລາຍລະອຽດ (ພາສາລາວ)" className="w-full p-3 border rounded-lg h-32"
            onChange={(e) => setFormData({...formData, description_lo: e.target.value})} value={formData.description_lo} />
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Campaign Title (English)" className="w-full p-3 border rounded-lg"
            onChange={(e) => setFormData({...formData, title_en: e.target.value})} value={formData.title_en} />
          <textarea placeholder="Description (English)" className="w-full p-3 border rounded-lg h-32"
            onChange={(e) => setFormData({...formData, description_en: e.target.value})} value={formData.description_en} />
        </div>
        <div className="md:col-span-2 space-y-4">
          <input type="number" placeholder="ເປົ້າໝາຍເງິນບໍລິຈາກ (Target Amount)" className="w-full p-3 border rounded-lg"
            onChange={(e) => setFormData({...formData, target_amount: Number(e.target.value)})} value={formData.target_amount} />
          <input type="text" placeholder="ລິ້ງຮູບພາບໜ້າປົກ (Cover Image URL)" className="w-full p-3 border rounded-lg"
            onChange={(e) => setFormData({...formData, cover_image: e.target.value})} value={formData.cover_image} />
          <button className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700">
            ບັນທຶກ ແລະ ເຜີຍແຜ່ໂຄງການ
          </button>
        </div>
      </form>
    </div>
  );
}