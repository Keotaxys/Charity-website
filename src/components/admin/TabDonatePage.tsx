'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function TabDonatePage({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    header_title_lo: 'ຮ່ວມບໍລິຈາກ',
    header_title_en: 'MAKE A DONATION',
    header_subtitle_lo: 'ທຸກໆການໃຫ້ຂອງທ່ານ ຄືພະລັງອັນຍິ່ງໃຫຍ່. ເລືອກຊ່ອງທາງການບໍລິຈາກທີ່ທ່ານສະດວກທີ່ສຸດ.',
    header_subtitle_en: 'Your contribution is a powerful force. Choose the donation method that works best for you.',
    bank_name: 'BCEL Bank',
    account_name: 'BEAST LAO FOUNDATION',
    account_number: '160-120-00-0000',
    qr_image_url: '',
    paypal_link: 'https://paypal.me/yourpaypal',
    paypal_desc_lo: 'ສຳລັບຜູ້ທີ່ຢູ່ຕ່າງປະເທດ ສາມາດບໍລິຈາກໄດ້ຢ່າງປອດໄພຜ່ານລະບົບ PayPal.',
    paypal_desc_en: 'For international donors, safely donate using PayPal.',
    exchange_rate: 22000 // 💡 ເພີ່ມ State ສຳລັບອັດຕາແລກປ່ຽນ
  });

  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'settings', 'donate_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(prev => ({ ...prev, ...docSnap.data() }));
          if (docSnap.data().qr_image_url) {
            setQrPreview(docSnap.data().qr_image_url);
          }
        }
      } catch (error) {
        console.error("Error fetching donate page settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQrFile(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalQrUrl = formData.qr_image_url;
      
      if (qrFile) {
        const fileRef = ref(storage, `settings/qr_${Date.now()}_${qrFile.name}`);
        await uploadBytes(fileRef, qrFile);
        finalQrUrl = await getDownloadURL(fileRef);
      }

      const finalData = { ...formData, qr_image_url: finalQrUrl };
      
      await setDoc(doc(db, 'settings', 'donate_page'), finalData, { merge: true });
      showMessage(locale === 'lo' ? 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ!' : 'Saved successfully!', 'success');
    } catch (error) {
      console.error("Error saving donate page settings:", error);
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ' : 'Error saving data', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-teal-600 font-bold">{locale === 'lo' ? 'ກຳລັງໂຫຼດຂໍ້ມູນ...' : 'Loading...'}</div>;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">{locale === 'lo' ? 'ຕັ້ງຄ່າໜ້າບໍລິຈາກ' : 'Donate Page Settings'}</h2>
          <p className="text-gray-500 mt-1">{locale === 'lo' ? 'ແກ້ໄຂຂໍ້ມູນທະນາຄານ, ອັດຕາແລກປ່ຽນ ແລະ PayPal' : 'Edit Bank, Exchange Rate, and PayPal details'}</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-3 px-8 rounded-xl transition-all shadow-md disabled:bg-gray-400">
          {saving ? (locale === 'lo' ? 'ກຳລັງບັນທຶກ...' : 'Saving...') : (locale === 'lo' ? 'ບັນທຶກການຕັ້ງຄ່າ' : 'Save Settings')}
        </button>
      </div>

      <div className="space-y-8">
        
        {/* 💡 ສ່ວນຕັ້ງຄ່າອັດຕາແລກປ່ຽນ */}
        <div className="p-6 bg-green-50/50 rounded-3xl border border-green-200">
          <h3 className="font-black text-lg text-green-700 mb-4 uppercase flex items-center gap-2">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             {locale === 'lo' ? 'ອັດຕາແລກປ່ຽນ (Exchange Rate)' : 'Exchange Rate'}
          </h3>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{locale === 'lo' ? '1 USD ເທົ່າກັບຈັກກີບ? (ສຳລັບຄຳນວນຍອດ)' : '1 USD = ? LAK'}</label>
            <div className="relative">
               <input type="number" name="exchange_rate" value={formData.exchange_rate} onChange={handleNumberChange} className="w-full md:w-1/2 p-4 border border-green-300 rounded-xl font-black text-2xl text-green-800 bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all" />
               <span className="absolute left-[calc(50%+10px)] md:left-auto md:right-[50%] top-1/2 -translate-y-1/2 -translate-x-full pr-4 font-bold text-gray-400">LAK</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{locale === 'lo' ? '* ຕົວເລກນີ້ຈະຖືກນຳໄປໃຊ້ຄຳນວນການຈັດອັນດັບຜູ້ບໍລິຈາກ ແລະ ເພີ່ມຍອດເຂົ້າໂຄງການອັດຕະໂນມັດ.' : '* This rate is used for calculating donor rankings and campaign totals.'}</p>
          </div>
        </div>

        {/* ສ່ວນທະນາຄານ ແລະ QR Code */}
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200">
          <h3 className="font-black text-lg text-teal-600 mb-6 uppercase">ຂໍ້ມູນບັນຊີທະນາຄານ (Bank Transfer)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ຊື່ທະນາຄານ (Bank Name)</label>
              <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} className="w-full p-4 border rounded-xl font-bold text-gray-800 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-gray-400 placeholder:font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ຊື່ບັນຊີ (Account Name)</label>
              <input type="text" name="account_name" value={formData.account_name} onChange={handleChange} className="w-full p-4 border rounded-xl font-bold text-gray-800 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-gray-400 placeholder:font-medium" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">ເລກບັນຊີ (Account Number)</label>
              <input type="text" name="account_number" value={formData.account_number} onChange={handleChange} className="w-full p-4 border rounded-xl font-bold text-xl text-gray-800 font-mono tracking-widest bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-gray-400 placeholder:font-medium" />
            </div>
            
            <div className="md:col-span-2 border-t pt-6">
              <label className="block text-sm font-bold text-gray-700 mb-4">ຮູບ QR Code ສະແກນຈ່າຍ</label>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                  {qrPreview ? (
                    <img src={qrPreview} alt="QR Code" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center px-2">ຍັງບໍ່ມີຮູບ QR</span>
                  )}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ສ່ວນ PayPal ແລະ ຫົວຂໍ້ (ໂຄດເດີມ) */}
        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
          <h3 className="font-black text-lg text-[#00457C] mb-6 uppercase">ຊ່ອງທາງ PayPal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">ລິ້ງ PayPal (PayPal Link)</label>
              <input type="url" name="paypal_link" value={formData.paypal_link} onChange={handleChange} className="w-full p-4 border rounded-xl font-bold text-gray-800 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 placeholder:font-medium" placeholder="https://paypal.me/..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ຄຳອະທິບາຍ (ພາສາລາວ)</label>
              <textarea name="paypal_desc_lo" value={formData.paypal_desc_lo} onChange={handleChange} rows={3} className="w-full p-4 border rounded-xl font-bold text-gray-800 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed placeholder:text-gray-400 placeholder:font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ຄຳອະທິບາຍ (English)</label>
              <textarea name="paypal_desc_en" value={formData.paypal_desc_en} onChange={handleChange} rows={3} className="w-full p-4 border rounded-xl font-bold text-gray-800 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed placeholder:text-gray-400 placeholder:font-medium" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200">
          <h3 className="font-black text-lg text-gray-800 mb-6 uppercase">ຂໍ້ຄວາມສ່ວນຫົວ (Header)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ຫົວຂໍ້ (ລາວ)</label>
              <input type="text" name="header_title_lo" value={formData.header_title_lo} onChange={handleChange} className="w-full p-4 border rounded-xl font-bold text-gray-800 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-gray-400 placeholder:font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ຫົວຂໍ້ (English)</label>
              <input type="text" name="header_title_en" value={formData.header_title_en} onChange={handleChange} className="w-full p-4 border rounded-xl font-bold text-gray-800 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-gray-400 placeholder:font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ຄຳອະທິບາຍ (ລາວ)</label>
              <textarea name="header_subtitle_lo" value={formData.header_subtitle_lo} onChange={handleChange} className="w-full p-4 border rounded-xl font-bold text-gray-800 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all leading-relaxed placeholder:text-gray-400 placeholder:font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ຄຳອະທິບາຍ (English)</label>
              <textarea name="header_subtitle_en" value={formData.header_subtitle_en} onChange={handleChange} className="w-full p-4 border rounded-xl font-bold text-gray-800 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all leading-relaxed placeholder:text-gray-400 placeholder:font-medium" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}