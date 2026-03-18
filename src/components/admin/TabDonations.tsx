'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, increment, query, orderBy, where } from 'firebase/firestore';

export default function TabDonations({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const locale = useLocale();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [approvalData, setApprovalData] = useState<Record<string, { amount: string, currency: string }>>({});
  
  // State ສຳລັບຄວບຄຸມການເປີດ/ປິດ Custom Dropdown (ເກັບ ID ຂອງລາຍການທີ່ເປີດຢູ່)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  // ຟັງຊັນປິດ Dropdown ເມື່ອກົດບ່ອນອື່ນນອກກ່ອງ
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.custom-currency-dropdown')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'donations'), 
        where('status', '==', 'Pending'),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setApprovalData({});
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
    setLoading(false);
  };

  // ຟັງຊັນຈັດການຕົວເລກ ພ້ອມໃສ່ຈຸດ (,) ອັດຕະໂນມັດ
  const handleAmountChange = (id: string, value: string) => {
    // ລຶບຕົວອັກສອນອື່ນທີ່ບໍ່ແມ່ນຕົວເລກອອກ
    const numericValue = value.replace(/\D/g, '');
    // ໃສ່ຈຸດ (,) ຂັ້ນທຸກໆ 3 ຕົວ
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    setApprovalData(prev => ({ 
      ...prev, 
      [id]: { ...prev[id], amount: formattedValue, currency: prev[id]?.currency || 'LAK' } 
    }));
  };

  // ຈັດການປ່ຽນສະກຸນເງິນ
  const handleCurrencyChange = (id: string, currency: string) => {
    setApprovalData(prev => ({ 
      ...prev, 
      [id]: { ...prev[id], amount: prev[id]?.amount || '', currency } 
    }));
    setOpenDropdownId(null); // ປິດ dropdown ຫຼັງຈາກເລືອກແລ້ວ
  };

  // ຟັງຊັນອະນຸມັດ
  const handleApprove = async (donation: any) => {
    const inputData = approvalData[donation.id];
    
    // ລຶບຈຸດ (,) ອອກກ່ອນເພື່ອແປງເປັນຕົວເລກແທ້ໆ
    const rawAmount = inputData?.amount?.replace(/,/g, '') || '0';
    const amountNum = Number(rawAmount);
    const currency = inputData?.currency || 'LAK';

    if (amountNum <= 0) {
      alert(locale === 'lo' ? 'ກະລຸນາປ້ອນຈຳນວນເງິນໃຫ້ຖືກຕ້ອງກ່ອນ!' : 'Please enter a valid amount before approving!');
      return;
    }

    const confirmMsg = locale === 'lo' 
      ? `ຢືນຢັນການອະນຸມັດຍອດເງິນ ${inputData?.amount} ${currency} ບໍ່?` 
      : `Confirm approval for ${inputData?.amount} ${currency}?`;
      
    if (!confirm(confirmMsg)) return;
    
    setActionLoading(donation.id);
    try {
      await updateDoc(doc(db, 'donations', donation.id), {
        status: 'Approved',
        amount: amountNum,
        currency: currency,
        approved_at: new Date()
      });

      const campaignRef = doc(db, 'campaigns', donation.campaign_id);
      await updateDoc(campaignRef, {
        raised_amount: increment(amountNum)
      });

      showMessage(locale === 'lo' ? 'ອະນຸມັດສຳເລັດແລ້ວ!' : 'Approved successfully!', 'success');
      fetchDonations();
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດ' : 'An error occurred', 'error');
    }
    setActionLoading(null);
  };

  // ຟັງຊັນປະຕິເສດ
  const handleReject = async (id: string) => {
    const confirmMsg = locale === 'lo' ? 'ທ່ານຕ້ອງການປະຕິເສດລາຍການນີ້ແທ້ບໍ່?' : 'Reject this donation?';
    if (!confirm(confirmMsg)) return;
    
    setActionLoading(id);
    try {
      await updateDoc(doc(db, 'donations', id), {
        status: 'Rejected',
        rejected_at: new Date()
      });
      showMessage(locale === 'lo' ? 'ປະຕິເສດລາຍການແລ້ວ' : 'Rejected', 'success');
      fetchDonations();
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດ' : 'Error', 'error');
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
            <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" /><path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v14.25c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 19.125V4.875zm8.75 4.875c0-1.518 1.232-2.75 2.75-2.75s2.75 1.232 2.75 2.75-1.232 2.75-2.75 2.75-2.75-1.232-2.75-2.75z" clipRule="evenodd" /></svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            {locale === 'lo' ? 'ອະນຸມັດຍອດບໍລິຈາກ (Pending Donations)' : 'Pending Donations'}
          </h2>
        </div>
        <p className="text-gray-500 mb-8 text-sm">
          {locale === 'lo' ? 'ກວດສອບສະລິບ, ປ້ອນຈຳນວນເງິນທີ່ຖືກຕ້ອງ ແລ້ວກົດອະນຸມັດ.' : 'Verify slips, enter the correct amount, and approve.'}
        </p>

        {/* ລາຍການບໍລິຈາກ */}
        {loading ? (
          <div className="text-center py-10 text-gray-400 font-bold">{locale === 'lo' ? 'ກຳລັງໂຫຼດ...' : 'Loading...'}</div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold">
            {locale === 'lo' ? 'ບໍ່ມີລາຍການລໍຖ້າການອະນຸມັດ' : 'No pending donations'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {donations.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                
                {/* ຮູບສະລິບ */}
                <div className="w-full lg:w-44 shrink-0">
                  <a href={item.slip_url} target="_blank" rel="noreferrer" className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-inner">
                    <img src={item.slip_url} alt="slip" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <span className="text-white text-xs font-black uppercase tracking-widest">{locale === 'lo' ? 'ເບິ່ງຮູບໃຫຍ່' : 'VIEW SLIP'}</span>
                    </div>
                  </a>
                </div>

                {/* ຂໍ້ມູນ ແລະ ຟອມປ້ອນເງິນ */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{locale === 'lo' ? 'ລໍຖ້າກວດສອບ' : 'PENDING'}</span>
                    <span className="text-gray-400 text-xs">{item.created_at?.toDate ? new Date(item.created_at.toDate()).toLocaleString() : ''}</span>
                  </div>
                  
                  <h3 className="text-xl font-black text-gray-900">{item.donor_name}</h3>
                  <p className="text-gray-500 font-medium text-sm">
                    {locale === 'lo' ? 'ບໍລິຈາກໃຫ້:' : 'Donated to:'} <span className="text-teal-600 font-bold">{locale === 'lo' ? item.campaign_title_lo : item.campaign_title_en}</span>
                  </p>
                  
                  {/* 💡 ສ່ວນປ້ອນຈຳນວນເງິນ ແລະ Custom Dropdown */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <div className="relative">
                      {/* ປ່ຽນ type="number" ເປັນ "text" ເພື່ອໃຫ້ຮອງຮັບເຄື່ອງໝາຍຈຸດ */}
                      <input 
                        type="text" 
                        placeholder={locale === 'lo' ? 'ປ້ອນຈຳນວນເງິນ...' : 'Enter amount...'}
                        className="w-48 md:w-56 p-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-2xl text-teal-600 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-600/10 transition-all"
                        value={approvalData[item.id]?.amount || ''}
                        onChange={(e) => handleAmountChange(item.id, e.target.value)}
                      />
                    </div>
                    
                    {/* Custom Dropdown */}
                    <div className="relative custom-currency-dropdown shrink-0">
                      <div 
                        onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                        className={`h-[64px] px-6 bg-gray-50 border rounded-2xl font-black text-gray-700 flex items-center gap-3 cursor-pointer transition-all select-none
                          ${openDropdownId === item.id ? 'border-teal-400 ring-4 ring-teal-600/10' : 'border-gray-200 hover:border-teal-300'}
                        `}
                      >
                        <span className="text-lg">{approvalData[item.id]?.currency || 'LAK'}</span>
                        <svg className={`w-5 h-5 transition-transform duration-300 ${openDropdownId === item.id ? 'rotate-180 text-teal-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>

                      {/* Dropdown Menu */}
                      {openDropdownId === item.id && (
                        <div className="absolute top-[72px] right-0 w-32 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                          <div 
                            onClick={() => handleCurrencyChange(item.id, 'LAK')} 
                            className={`px-5 py-4 font-black cursor-pointer transition-colors border-b border-gray-50
                              ${(approvalData[item.id]?.currency || 'LAK') === 'LAK' ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-50'}
                            `}
                          >
                            LAK
                          </div>
                          <div 
                            onClick={() => handleCurrencyChange(item.id, 'USD')} 
                            className={`px-5 py-4 font-black cursor-pointer transition-colors
                              ${approvalData[item.id]?.currency === 'USD' ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-50'}
                            `}
                          >
                            USD
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ປຸ່ມຈັດການ */}
                <div className="w-full lg:w-auto flex flex-col gap-3 shrink-0">
                  <button 
                    onClick={() => handleApprove(item)}
                    disabled={actionLoading === item.id}
                    className="w-full lg:w-48 bg-teal-600 hover:bg-teal-700 text-white font-black py-5 px-6 rounded-2xl transition-all shadow-lg hover:shadow-teal-600/30 disabled:bg-gray-300 uppercase tracking-widest text-sm"
                  >
                    {actionLoading === item.id ? (locale === 'lo' ? 'ກຳລັງບັນທຶກ...' : 'WAIT...') : (locale === 'lo' ? 'ອະນຸມັດ (APPROVE)' : 'APPROVE')}
                  </button>
                  <button 
                    onClick={() => handleReject(item.id)}
                    disabled={actionLoading === item.id}
                    className="w-full lg:w-48 bg-pink-50 text-pink-500 hover:bg-pink-100 font-black py-4 px-6 rounded-2xl transition-all text-sm uppercase tracking-widest"
                  >
                    {locale === 'lo' ? 'ປະຕິເສດ' : 'REJECT'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}