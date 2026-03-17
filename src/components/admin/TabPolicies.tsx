'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function TabPolicies({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const [settings, setSettings] = useState({
    privacy_lo: '', privacy_en: '',
    terms_lo: '', terms_en: '',
    financial_lo: '', financial_en: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'settings', 'policies_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setSettings({ ...settings, ...docSnap.data() });
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'policies_page'), settings, { merge: true });
      showMessage('ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ!', 'success');
    } catch (error) { showMessage('ເກີດຂໍ້ຜິດພາດ', 'error'); }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const inputClass = "w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all min-h-[200px] resize-y";

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
      <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        ຕັ້ງຄ່ານະໂຍບາຍ, ເງື່ອນໄຂ & ລາຍງານການເງິນ
      </h2>

      <form onSubmit={handleSave} className="space-y-10">
        
        {/* ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ */}
        <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <h3 className="font-black text-teal-700 uppercase">1. ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ (Privacy Policy)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <textarea name="privacy_lo" placeholder="ເນື້ອຫານະໂຍບາຍ (ລາວ)" className={inputClass} value={settings.privacy_lo} onChange={handleChange}></textarea>
            <textarea name="privacy_en" placeholder="Privacy Policy (EN)" className={inputClass} value={settings.privacy_en} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* ເງື່ອນໄຂການບໍລິຈາກ */}
        <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <h3 className="font-black text-teal-700 uppercase">2. ເງື່ອນໄຂການບໍລິຈາກ (Terms of Donation)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <textarea name="terms_lo" placeholder="ເນື້ອຫາເງື່ອນໄຂ (ລາວ)" className={inputClass} value={settings.terms_lo} onChange={handleChange}></textarea>
            <textarea name="terms_en" placeholder="Terms of Donation (EN)" className={inputClass} value={settings.terms_en} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* ລາຍງານການເງິນ */}
        <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <h3 className="font-black text-teal-700 uppercase">3. ລາຍງານການເງິນ (Financial Report)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <textarea name="financial_lo" placeholder="ເນື້ອຫາລາຍງານ (ລາວ)" className={inputClass} value={settings.financial_lo} onChange={handleChange}></textarea>
            <textarea name="financial_en" placeholder="Financial Report (EN)" className={inputClass} value={settings.financial_en} onChange={handleChange}></textarea>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-12 rounded-xl transition-all shadow-md uppercase tracking-widest">
          {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການຕັ້ງຄ່າ'}
        </button>
      </form>
    </div>
  );
}