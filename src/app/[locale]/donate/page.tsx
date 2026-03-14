'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default function DonatePage() {
  const locale = useLocale();

  // State ສຳລັບເກັບຂໍ້ມູນໂຄງການເພື່ອມາເຮັດ Dropdown
  const [campaigns, setCampaigns] = useState<any[]>([]);
  
  // State ຂອງຟອມບໍລິຈາກ
  const [formData, setFormData] = useState({
    campaign_id: 'general', // ຄ່າເລີ່ມຕົ້ນແມ່ນບໍລິຈາກເຂົ້າກອງທຶນລວມ
    amount: '',
    name: '',
    email: '',
    phone: '',
    hideName: false,
    hideAmount: false,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  // ດຶງລາຍຊື່ໂຄງການມາສະແດງໃນ Dropdown
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

  // ຟັງຊັນບັນທຶກການບໍລິຈາກ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      // ບັນທຶກລົງ Collection 'donations' ໃນ Firebase
      await addDoc(collection(db, 'donations'), {
        ...formData,
        amount: Number(formData.amount),
        status: 'pending', // ລໍຖ້າແອັດມິນກວດສອບສະລິບ
        created_at: new Date()
      });
      
      setStatus({ 
        type: 'success', 
        text: locale === 'lo' ? 'ຂໍຂອບໃຈສຳລັບການບໍລິຈາກ! ພວກເຮົາໄດ້ຮັບຂໍ້ມູນຂອງທ່ານແລ້ວ.' : 'Thank you for your donation! We have received your details.' 
      });
      
      // ລ້າງຟອມຫຼັງຈາກສົ່ງສຳເລັດ
      setFormData({
        campaign_id: 'general', amount: '', name: '', email: '', phone: '', hideName: false, hideAmount: false
      });
    } catch (error) {
      console.error("Error submitting donation:", error);
      setStatus({ 
        type: 'error', 
        text: locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດ. ກະລຸນາລອງໃໝ່.' : 'An error occurred. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      
      {/* 1. ສ່ວນຫົວ (Header) */}
      <section className="bg-teal-600 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">
            {locale === 'lo' ? 'ຮ່ວມບໍລິຈາກ' : 'MAKE A DONATION'}
          </h1>
          <p className="text-lg md:text-xl text-teal-100 font-medium max-w-2xl mx-auto">
            {locale === 'lo' 
              ? 'ທຸກໆການໃຫ້ຂອງທ່ານ ຄືພະລັງອັນຍິ່ງໃຫຍ່ໃນການປ່ຽນແປງສັງຄົມໃຫ້ດີຂຶ້ນ. ເງິນທຸກກີບຈະຖືກນຳໄປໃຊ້ຢ່າງໂປ່ງໃສທີ່ສຸດ.' 
              : 'Your contribution is a powerful force for changing society for the better. Every cent is used transparently.'}
          </p>
        </div>
      </section>

      {/* 2. ສ່ວນເນື້ອຫາຫຼັກ */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* ຝັ່ງຊ້າຍ: ຂໍ້ມູນບັນຊີ (Bank Info & QR) */}
          <div className="w-full lg:w-2/5 bg-gray-900 text-white p-10 md:p-14 flex flex-col justify-center relative">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-500 rounded-full blur-3xl opacity-20 translate-y-1/2 translate-x-1/4"></div>
            
            <h2 className="text-2xl font-black mb-8 uppercase tracking-widest text-teal-400">
              {locale === 'lo' ? 'ຊ່ອງທາງການໂອນເງິນ' : 'BANK TRANSFER INFO'}
            </h2>

            <div className="space-y-6 relative z-10">
              {/* QR Code ຕົວຢ່າງ */}
              <div className="bg-white p-4 rounded-3xl inline-block mb-4 shadow-lg">
                <img src="https://via.placeholder.com/200x200/ffffff/0d9488?text=QR+CODE" alt="QR Code" className="w-40 h-40 object-contain rounded-2xl" />
              </div>

              <div>
                <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-1">{locale === 'lo' ? 'ທະນາຄານ' : 'BANK NAME'}</p>
                <p className="text-xl font-bold">BCEL Bank</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-1">{locale === 'lo' ? 'ຊື່ບັນຊີ' : 'ACCOUNT NAME'}</p>
                <p className="text-xl font-bold text-pink-300">BEAST LAO FOUNDATION</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-1">{locale === 'lo' ? 'ເລກບັນຊີ' : 'ACCOUNT NUMBER'}</p>
                <p className="text-2xl font-black tracking-widest font-mono">160-120-000000-01</p>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                {locale === 'lo' 
                  ? '* ຫຼັງຈາກໂອນເງິນສຳເລັດແລ້ວ, ກະລຸນາຕື່ມຂໍ້ມູນລົງໃນຟອມດ້ານຂ້າງນີ້ ເພື່ອໃຫ້ພວກເຮົາກວດສອບ ແລະ ອອກໃບຮັບເງິນ.' 
                  : '* After successful transfer, please fill out the form to help us verify and issue a receipt.'}
              </p>
            </div>
          </div>

          {/* ຝັ່ງຂວາ: ຟອມແຈ້ງໂອນເງິນ (Donation Form) */}
          <div className="w-full lg:w-3/5 p-10 md:p-14 bg-white">
            <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">
              {locale === 'lo' ? 'ແຈ້ງການບໍລິຈາກ' : 'DONATION DETAILS'}
            </h2>

            {status.text && (
              <div className={`p-5 rounded-2xl mb-8 font-bold text-sm border ${status.type === 'success' ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-pink-50 text-pink-500 border-pink-200'}`}>
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* ເລືອກໂຄງການ */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">
                  {locale === 'lo' ? 'ເລືອກໂຄງການທີ່ຕ້ອງການຊ່ວຍເຫຼືອ' : 'SELECT A CAMPAIGN'}
                </label>
                <select 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold"
                  value={formData.campaign_id} 
                  onChange={(e) => setFormData({...formData, campaign_id: e.target.value})}
                >
                  <option value="general">{locale === 'lo' ? 'ກອງທຶນລວມ (ນຳໃຊ້ເຂົ້າໃນທຸກໂຄງການ)' : 'General Fund (Use where most needed)'}</option>
                  {campaigns.map(camp => (
                    <option key={camp.id} value={camp.id}>
                      {locale === 'lo' ? camp.title_lo : camp.title_en}
                    </option>
                  ))}
                </select>
              </div>

              {/* ຈຳນວນເງິນ */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">
                  {locale === 'lo' ? 'ຈຳນວນເງິນທີ່ໂອນ (ກີບ)' : 'DONATION AMOUNT (LAK)'}
                </label>
                <input 
                  type="number" required min="1000"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-teal-600 font-black text-xl focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                  placeholder="ເຊັ່ນ: 100000"
                  value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ຊື່ ແລະ ນາມສະກຸນ' : 'FULL NAME'}</label>
                  <input 
                    type="text" required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                    placeholder={locale === 'lo' ? 'ຊື່ຜູ້ບໍລິຈາກ' : 'John Doe'}
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ເບີໂທລະສັບ' : 'PHONE NUMBER'}</label>
                  <input 
                    type="tel" required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                    placeholder="020 xxxx xxxx"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              {/* ການຕັ້ງຄ່າຄວາມເປັນສ່ວນຕົວ (Privacy Settings) */}
              <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100 mt-8 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" /></svg>
                  {locale === 'lo' ? 'ການຕັ້ງຄ່າຄວາມເປັນສ່ວນຕົວ (Privacy)' : 'PRIVACY SETTINGS'}
                </h3>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-md checked:bg-teal-600 checked:border-teal-600 transition-all cursor-pointer"
                      checked={formData.hideName}
                      onChange={(e) => setFormData({...formData, hideName: e.target.checked})}
                    />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-teal-600 transition-colors">
                    {locale === 'lo' ? 'ບໍ່ປະສົງອອກນາມ (ເຊື່ອງຊື່ໃນໜ້າເວັບ)' : 'Donate Anonymously (Hide my name)'}
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-md checked:bg-pink-400 checked:border-pink-400 transition-all cursor-pointer"
                      checked={formData.hideAmount}
                      onChange={(e) => setFormData({...formData, hideAmount: e.target.checked})}
                    />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-pink-500 transition-colors">
                    {locale === 'lo' ? 'ບໍ່ເປີດເຜີຍຈຳນວນເງິນບໍລິຈາກ' : 'Hide donation amount publicly'}
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-5 rounded-xl transition-all shadow-lg hover:shadow-teal-600/40 uppercase tracking-widest text-lg disabled:bg-gray-400 mt-8"
              >
                {loading ? (locale === 'lo' ? 'ກຳລັງສົ່ງຂໍ້ມູນ...' : 'SUBMITTING...') : (locale === 'lo' ? 'ແຈ້ງການໂອນເງິນ' : 'SUBMIT DONATION')}
              </button>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
}