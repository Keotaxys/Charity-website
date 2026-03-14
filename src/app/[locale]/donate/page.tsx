'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function DonatePage() {
  const locale = useLocale();

  const [campaigns, setCampaigns] = useState<any[]>([]);
  
  // State ຂອງຟອມ (ເອົາ amount ອອກ, ເພີ່ມການອັບໂຫຼດໄຟລ໌ແທນ)
  const [formData, setFormData] = useState({
    campaign_id: 'general',
    name: '',
    email: '',
    phone: '',
    hideName: false,
    hideAmount: false,
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  // ດຶງລາຍຊື່ໂຄງການ
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const q = query(collection(db, 'campaigns'), orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  // ຟັງຊັນບັນທຶກການບໍລິຈາກພ້ອມອັບໂຫຼດສະລິບ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receiptFile) {
      setStatus({ type: 'error', text: locale === 'lo' ? 'ກະລຸນາແນບຮູບໃບບິນ/ສະລິບການໂອນເງິນ.' : 'Please upload your transfer receipt.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      // 1. ອັບໂຫຼດຮູບສະລິບຂຶ້ນ Firebase Storage ກ່ອນ
      const storageRef = ref(storage, `receipts/${Date.now()}_${receiptFile.name}`);
      await uploadBytes(storageRef, receiptFile);
      const receiptUrl = await getDownloadURL(storageRef);

      // 2. ບັນທຶກຂໍ້ມູນລົງ Database ພ້ອມກັບລິ້ງຮູບສະລິບ
      await addDoc(collection(db, 'donations'), {
        ...formData,
        receipt_url: receiptUrl,
        amount: 0, // ໃຫ້ແອັດມິນມາປ້ອນໃສ່ຕາມຫຼັງ
        status: 'pending', // ລໍຖ້າແອັດມິນກວດສອບ
        created_at: new Date()
      });
      
      setStatus({ 
        type: 'success', 
        text: locale === 'lo' ? 'ຂໍຂອບໃຈ! ພວກເຮົາໄດ້ຮັບແຈ້ງການໂອນເງິນຂອງທ່ານແລ້ວ. ທີມງານຈະກວດສອບສະລິບ ແລະ ອັບເດດຍອດເງິນໃຫ້ໂດຍໄວ.' : 'Thank you! We have received your receipt. Our team will verify and update the amount soon.' 
      });
      
      // ລ້າງຟອມ
      setFormData({ campaign_id: 'general', name: '', email: '', phone: '', hideName: false, hideAmount: false });
      setReceiptFile(null);
    } catch (error) {
      console.error("Error submitting donation:", error);
      setStatus({ type: 'error', text: locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດ. ກະລຸນາລອງໃໝ່.' : 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      
      {/* 1. ສ່ວນຫົວ (Header) - ປ່ຽນເປັນສີ Teal ອ່ອນໆ ບໍ່ໃຫ້ມືດ */}
      <section className="bg-teal-50 py-20 px-6 relative overflow-hidden border-b border-teal-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase text-teal-800">
            {locale === 'lo' ? 'ຮ່ວມບໍລິຈາກ' : 'MAKE A DONATION'}
          </h1>
          <p className="text-lg md:text-xl text-teal-600 font-medium max-w-2xl mx-auto">
            {locale === 'lo' 
              ? 'ທຸກໆການໃຫ້ຂອງທ່ານ ຄືພະລັງອັນຍິ່ງໃຫຍ່. ເລືອກຊ່ອງທາງການບໍລິຈາກທີ່ທ່ານສະດວກທີ່ສຸດ.' 
              : 'Your contribution is a powerful force. Choose the donation method that works best for you.'}
          </p>
        </div>
      </section>

      {/* 2. ສ່ວນເນື້ອຫາຫຼັກ (ສະຫວ່າງ ແລະ ຄລີນ) */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* ຝັ່ງຊ້າຍ: ຊ່ອງທາງການຊຳລະເງິນ (QR & PayPal) */}
          <div className="w-full lg:w-2/5 bg-white p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 relative">
            
            {/* ຊ່ອງທາງທີ 1: BCEL */}
            <div className="mb-10">
              <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-teal-600 flex items-center gap-3">
                <span className="bg-teal-100 text-teal-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                {locale === 'lo' ? 'ໂອນເງິນຜ່ານທະນາຄານ (QR)' : 'BANK TRANSFER (QR)'}
              </h2>
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center">
                <div className="bg-white p-3 rounded-2xl inline-block mb-4 shadow-sm border border-gray-100">
                  {/* ປ່ຽນຮູບນີ້ເປັນ QR Code ຂອງມູນນິທິແທ້ໆ */}
                  <img src="https://via.placeholder.com/200x200/ffffff/0d9488?text=QR+CODE" alt="BCEL QR Code" className="w-40 h-40 object-contain rounded-xl" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-900 font-bold text-lg">BCEL Bank</p>
                  <p className="text-pink-500 font-black tracking-wide">BEAST LAO FOUNDATION</p>
                  <p className="text-2xl font-black tracking-widest font-mono text-gray-900">160-120-00-0000</p>
                </div>
              </div>
            </div>

            {/* ເສັ້ນຂັ້ນ */}
            <div className="flex items-center gap-4 mb-10 opacity-60">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 font-bold uppercase text-sm">{locale === 'lo' ? 'ຫຼື (OR)' : 'OR'}</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* ຊ່ອງທາງທີ 2: PayPal */}
            <div>
              <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-[#00457C] flex items-center gap-3">
                <span className="bg-blue-50 text-[#00457C] w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                {locale === 'lo' ? 'ບໍລິຈາກຜ່ານ PayPal' : 'DONATE VIA PAYPAL'}
              </h2>
              <div className="bg-[#00457C]/5 p-6 rounded-3xl border border-[#00457C]/10 text-center">
                <p className="text-gray-600 mb-6 text-sm">
                  {locale === 'lo' ? 'ສຳລັບຜູ້ທີ່ຢູ່ຕ່າງປະເທດ ສາມາດບໍລິຈາກໄດ້ຢ່າງປອດໄພຜ່ານລະບົບ PayPal.' : 'For international donors, safely donate using PayPal.'}
                </p>
                <a 
                  href="https://paypal.me/yourpaypal" // ປ່ຽນເປັນລິ້ງ PayPal ຂອງເຈົ້າເອງ
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0070BA] hover:bg-[#003087] text-white font-black py-4 px-8 rounded-xl transition-all shadow-md w-full justify-center text-lg"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106a.64.64 0 0 1-.632.532z"/></svg>
                  PayPal.Me
                </a>
              </div>
            </div>

          </div>

          {/* ຝັ່ງຂວາ: ຟອມແຈ້ງໂອນເງິນ & ອັບໂຫຼດສະລິບ */}
          <div className="w-full lg:w-3/5 p-8 md:p-12 bg-white">
            <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
              {locale === 'lo' ? 'ແຈ້ງການໂອນເງິນ' : 'SUBMIT RECEIPT'}
            </h2>
            <p className="text-gray-500 mb-8">
              {locale === 'lo' ? 'ຫຼັງຈາກໂອນເງິນສຳເລັດແລ້ວ ກະລຸນາແນບຮູບໃບບິນເພື່ອໃຫ້ທີມງານອັບເດດຍອດໃຫ້.' : 'After transferring, please upload your receipt so our team can verify.'}
            </p>

            {status.text && (
              <div className={`p-5 rounded-2xl mb-8 font-bold text-sm border ${status.type === 'success' ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-pink-50 text-pink-500 border-pink-200'}`}>
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ເລືອກໂຄງການ' : 'SELECT CAMPAIGN'}</label>
                  <select 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none font-bold cursor-pointer"
                    value={formData.campaign_id} onChange={(e) => setFormData({...formData, campaign_id: e.target.value})}
                  >
                    <option value="general">{locale === 'lo' ? 'ກອງທຶນລວມ (ນຳໃຊ້ເຂົ້າໃນທຸກໂຄງການ)' : 'General Fund'}</option>
                    {campaigns.map(camp => (
                      <option key={camp.id} value={camp.id}>{locale === 'lo' ? camp.title_lo : camp.title_en}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ຊື່ ແລະ ນາມສະກຸນ' : 'FULL NAME'}</label>
                  <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none" placeholder={locale === 'lo' ? 'ຊື່ຜູ້ບໍລິຈາກ' : 'John Doe'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ເບີໂທລະສັບ' : 'PHONE NUMBER'}</label>
                  <input type="tel" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none" placeholder="020 xxxx xxxx" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>

                {/* ອັບໂຫຼດຮູບສະລິບ (ປ່ຽນແທນບ່ອນປ້ອນຈຳນວນເງິນ) */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">
                    {locale === 'lo' ? 'ແນບຮູບໃບບິນ/ສະລິບການໂອນເງິນ' : 'UPLOAD TRANSFER SLIP / RECEIPT'}
                  </label>
                  <div className="relative border-2 border-dashed border-teal-200 bg-teal-50/30 rounded-2xl p-6 text-center hover:bg-teal-50 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*"
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setReceiptFile(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <svg className="w-10 h-10 text-teal-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      <span className="font-bold text-teal-700">
                        {receiptFile ? receiptFile.name : (locale === 'lo' ? 'ກົດເພື່ອເລືອກຮູບສະລິບ' : 'Click to select receipt image')}
                      </span>
                      {!receiptFile && <span className="text-gray-400 text-sm mt-1">{locale === 'lo' ? 'ຮອງຮັບໄຟລ໌ .jpg, .png' : 'Supports .jpg, .png'}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* ການຕັ້ງຄ່າຄວາມເປັນສ່ວນຕົວ (Privacy Settings) */}
              <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100 mt-6 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" /></svg>
                  {locale === 'lo' ? 'ການຕັ້ງຄ່າຄວາມເປັນສ່ວນຕົວ (Privacy)' : 'PRIVACY SETTINGS'}
                </h3>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-md checked:bg-teal-600 checked:border-teal-600 transition-all cursor-pointer" checked={formData.hideName} onChange={(e) => setFormData({...formData, hideName: e.target.checked})} />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-teal-600 transition-colors">
                    {locale === 'lo' ? 'ບໍ່ປະສົງອອກນາມ (ເຊື່ອງຊື່ໃນໜ້າເວັບ)' : 'Donate Anonymously (Hide my name)'}
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-md checked:bg-pink-400 checked:border-pink-400 transition-all cursor-pointer" checked={formData.hideAmount} onChange={(e) => setFormData({...formData, hideAmount: e.target.checked})} />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-pink-500 transition-colors">
                    {locale === 'lo' ? 'ບໍ່ເປີດເຜີຍຈຳນວນເງິນບໍລິຈາກ' : 'Hide donation amount publicly'}
                  </span>
                </label>
              </div>

              <button type="submit" disabled={loading || !receiptFile} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-5 rounded-xl transition-all shadow-md hover:shadow-teal-600/40 uppercase tracking-widest text-lg disabled:bg-gray-400 mt-8">
                {loading ? (locale === 'lo' ? 'ກຳລັງອັບໂຫຼດສະລິບ...' : 'UPLOADING...') : (locale === 'lo' ? 'ແຈ້ງການໂອນເງິນ' : 'SUBMIT RECEIPT')}
              </button>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
}