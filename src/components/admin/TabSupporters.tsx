'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function TabSupporters({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const [supporters, setSupporters] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name_lo: '',
    name_en: '',
    logo_url: '',
    total_donation: '0'
  });

  useEffect(() => {
    fetchSupporters();
  }, []);

  const fetchSupporters = async () => {
    try {
      const q = query(collection(db, 'supporters'), orderBy('total_donation', 'desc'));
      const snapshot = await getDocs(q);
      setSupporters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching supporters:", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, total_donation: Number(formData.total_donation) };
      if (isEditing && editId) {
        await updateDoc(doc(db, 'supporters', editId), data);
        showMessage('ແກ້ໄຂຜູ້ສະໜັບສະໜູນສຳເລັດ!', 'success');
      } else {
        await addDoc(collection(db, 'supporters'), { ...data, created_at: new Date() });
        showMessage('ເພີ່ມຜູ້ສະໜັບສະໜູນໃໝ່ສຳເລັດ!', 'success');
      }
      setFormData({ name_lo: '', name_en: '', logo_url: '', total_donation: '0' });
      setIsEditing(false);
      setEditId(null);
      fetchSupporters();
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດ', 'error');
    }
    setLoading(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      name_lo: item.name_lo, name_en: item.name_en,
      logo_url: item.logo_url, total_donation: item.total_donation.toString()
    });
    setIsEditing(true);
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('ລຶບຜູ້ສະໜັບສະໜູນນີ້?')) {
      await deleteDoc(doc(db, 'supporters', id));
      showMessage('ລຶບສຳເລັດ!', 'success');
      fetchSupporters();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* ຟອມເພີ່ມ/ແກ້ໄຂ */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" /></svg>
          {isEditing ? 'ແກ້ໄຂຜູ້ສະໜັບສະໜູນ' : 'ເພີ່ມຜູ້ສະໜັບສະໜູນໃໝ່'}
        </h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="ຊື່ (ລາວ)" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={formData.name_lo} onChange={(e) => setFormData({...formData, name_lo: e.target.value})} />
            <input type="text" placeholder="Name (EN)" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={formData.name_en} onChange={(e) => setFormData({...formData, name_en: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="url" placeholder="Logo URL (Link ຮູບພາບ)" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={formData.logo_url} onChange={(e) => setFormData({...formData, logo_url: e.target.value})} />
            <input type="number" placeholder="ຍອດເງິນສະໜັບສະໜູນລວມ" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={formData.total_donation} onChange={(e) => setFormData({...formData, total_donation: e.target.value})} />
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="flex-1 bg-teal-600 text-white font-black py-4 rounded-xl hover:bg-teal-700 transition-all uppercase">{loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}</button>
            {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormData({name_lo: '', name_en: '', logo_url: '', total_donation: '0'}); }} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl uppercase font-bold">ຍົກເລີກ</button>}
          </div>
        </form>
      </div>

      {/* ລາຍຊື່ */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6">ລາຍຊື່ຜູ້ສະໜັບສະໜູນທັງໝົດ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supporters.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center text-center">
              <img src={item.logo_url} alt={item.name_lo} className="h-16 object-contain mb-4" />
              <h4 className="font-bold text-gray-900">{item.name_lo}</h4>
              <p className="text-teal-600 font-bold text-sm mb-4">{item.total_donation.toLocaleString()} LAK</p>
              <div className="flex gap-2 w-full pt-4 border-t border-gray-100">
                <button onClick={() => handleEdit(item)} className="flex-1 text-teal-600 text-sm font-bold">ແກ້ໄຂ</button>
                <button onClick={() => handleDelete(item.id)} className="flex-1 text-pink-500 text-sm font-bold">ລຶບ</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}