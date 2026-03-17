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
      try {
        const docRef = doc(db, 'settings', 'policies_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'policies_page'), settings, { merge: true });
      showMessage('ບັນທຶກຂໍ້ມູນນະໂຍບາຍ ແລະ ລາຍງານສຳເລັດ!', 'success');
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ', 'error');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const sectionClass = "p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6";
  const labelClass = "block text-gray-700 font-black mb-2 text-xs uppercase tracking-widest";
  const textareaClass = "w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all min-h-[250px] resize-y";

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">ຈັດການເນື້ອຍັງ (Policies & Reports)</h2>
          <p className="text-gray-500 text-sm font-bold uppercase">PRIVACY, TERMS AND FINANCIAL REPORTS</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Privacy Policy */}
        <div className={sectionClass}>
          <h3 className="text-lg font-black text-teal-600 flex items-center gap-2">
            <span className="bg-teal-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ (Privacy Policy)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>ເນື້ອຫາພາສາລາວ</label>
              <textarea name="privacy_lo" className={textareaClass} value={settings.privacy_lo} onChange={handleChange} placeholder="ພິມເນື້ອຫາບ່ອນນີ້..." />
            </div>
            <div>
              <label className={labelClass}>English Content</label>
              <textarea name="privacy_en" className={textareaClass} value={settings.privacy_en} onChange={handleChange} placeholder="Type content here..." />
            </div>
          </div>
        </div>

        {/* Section 2: Terms of Donation */}
        <div className={sectionClass}>
          <h3 className="text-lg font-black text-teal-600 flex items-center gap-2">
            <span className="bg-teal-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
            ເງື່ອນໄຂການບໍລິຈາກ (Terms of Donation)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>ເນື້ອຫາພາສາລາວ</label>
              <textarea name="terms_lo" className={textareaClass} value={settings.terms_lo} onChange={handleChange} placeholder="ພິມເນື້ອຫາບ່ອນນີ້..." />
            </div>
            <div>
              <label className={labelClass}>English Content</label>
              <textarea name="terms_en" className={textareaClass} value={settings.terms_en} onChange={handleChange} placeholder="Type content here..." />
            </div>
          </div>
        </div>

        {/* Section 3: Financial Report */}
        <div className={sectionClass}>
          <h3 className="text-lg font-black text-teal-600 flex items-center gap-2">
            <span className="bg-teal-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
            ລາຍງານການເງິນ (Financial Report)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>ເນື້ອຫາພາສາລາວ</label>
              <textarea name="financial_lo" className={textareaClass} value={settings.financial_lo} onChange={handleChange} placeholder="ພິມເນື້ອຫາບ່ອນນີ້..." />
            </div>
            <div>
              <label className={labelClass}>English Content</label>
              <textarea name="financial_en" className={textareaClass} value={settings.financial_en} onChange={handleChange} placeholder="Type content here..." />
            </div>
          </div>
        </div>

        <div className="sticky bottom-6 flex justify-end">
          <button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-12 rounded-2xl transition-all shadow-xl hover:shadow-teal-600/30 uppercase tracking-widest flex items-center gap-2">
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກຂໍ້ມູນທັງໝົດ'}
          </button>
        </div>
      </form>
    </div>
  );
}