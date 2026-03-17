'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, increment, query, orderBy, where } from 'firebase/firestore';

export default function TabDonations({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const locale = useLocale(); // 💡 ເອີ້ນໃຊ້ useLocale ເພື່ອກວດສອບພາສາແອັດມິນ
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      // ດຶງສະເພາະລາຍການທີ່ "ລໍຖ້າການກວດສອບ (Pending)"
      const q = query(
        collection(db, 'donations'), 
        where('status', '==', 'Pending'),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
    setLoading(false);
  };

  // ຟັງຊັນອະນຸມັດ
  const handleApprove = async (donation: any) => {
    const confirmMsg = locale === 'lo' ? 'ຢືນຢັນການອະນຸມັດຍອດເງິນນີ້?' : 'Confirm approval for this donation?';
    if (!confirm(confirmMsg)) return;
    
    setActionLoading(donation.id);
    try {
      // 1. ອັບເດດສະຖານະການບໍລິຈາກ
      await updateDoc(doc(db, 'donations', donation.id), {
        status: 'Approved',
        approved_at: new Date()
      });

      // 2. ໄປບວກຍອດເງິນ (increment) ເຂົ້າໃນໂຄງການທີ່ກ່ຽວຂ້ອງ
      const campaignRef = doc(db, 'campaigns', donation.campaign_id);
      await updateDoc(campaignRef, {
        raised_amount: increment(donation.amount)
      });

      showMessage(locale === 'lo' ? 'ອະນຸມັດຍອດບໍລິຈາກ ແລະ ອັບເດດໂຄງການສຳເລັດ!' : 'Donation approved and campaign updated successfully!', 'success');
      fetchDonations(); // ໂຫຼດລາຍການໃໝ່
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການອະນຸມັດ' : 'Error approving donation', 'error');
    }
    setActionLoading(null);
  };

  // ຟັງຊັນປະຕິເສດ
  const handleReject = async (id: string) => {
    const confirmMsg = locale === 'lo' ? 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການປະຕິເສດລາຍການນີ້?' : 'Are you sure you want to reject this donation?';
    if (!confirm(confirmMsg)) return;
    
    setActionLoading(id);
    try {
      await updateDoc(doc(db, 'donations', id), {
        status: 'Rejected',
        rejected_at: new Date()
      });
      showMessage(locale === 'lo' ? 'ປະຕິເສດລາຍການແລ້ວ' : 'Donation rejected', 'success');
      fetchDonations();
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດ' : 'An error occurred', 'error');
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        
        {/* --- ຫົວຂໍ້ໜ້າ (Header) --- */}
        <div className="flex items-center gap-3 mb-2">
          <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
            <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" /><path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v14.25c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 19.125V4.875zm8.75 4.875c0-1.518 1.232-2.75 2.75-2.75s2.75 1.232 2.75 2.75-1.232 2.75-2.75 2.75-2.75-1.232-2.75-2.75z" clipRule="evenodd" /></svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            {locale === 'lo' ? 'ອະນຸມັດຍອດບໍລິຈາກ (Pending Donations)' : 'Pending Donations'}
          </h2>
        </div>
        <p className="text-gray-500 mb-8 text-sm">
          {locale === 'lo' ? 'ກວດສອບສະລິບ ແລະ ອະນຸມັດເພື່ອໃຫ້ຍອດເງິນສະແດງໃນໜ້າໂຄງການ.' : 'Verify slips and approve to update campaign amounts.'}
        </p>

        {/* --- ການສະແດງຜົນລາຍການ (List Rendering) --- */}
        {loading ? (
          <div className="text-center py-10 text-gray-400 font-bold">
            {locale === 'lo' ? 'ກຳລັງໂຫຼດຂໍ້ມູນ...' : 'Loading data...'}
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-lg">
              {locale === 'lo' ? 'ບໍ່ມີລາຍການທີ່ລໍຖ້າການອະນຸມັດ' : 'No pending donations at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {donations.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                
                {/* ຮູບສະລິບ (Slip Image) */}
                <div className="w-full lg:w-40 shrink-0">
                  <a href={item.slip_url} target="_blank" rel="noreferrer" className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 border border-gray-200">
                    <img src={item.slip_url} alt="slip" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <span className="text-white text-xs font-bold uppercase tracking-widest">
                        {locale === 'lo' ? 'ເບິ່ງຮູບໃຫຍ່' : 'VIEW SLIP'}
                      </span>
                    </div>
                  </a>
                </div>

                {/* ຂໍ້ມູນຜູ້ບໍລິຈາກ (Donor Info) */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {locale === 'lo' ? 'ລໍຖ້າການກວດສອບ' : 'PENDING'}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {item.created_at?.toDate ? new Date(item.created_at.toDate()).toLocaleString() : ''}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900">{item.donor_name}</h3>
                  <p className="text-gray-500 font-medium">
                    {locale === 'lo' ? 'ບໍລິຈາກໃຫ້:' : 'Donated to:'} <span className="text-teal-600 font-bold">{locale === 'lo' ? item.campaign_title_lo : item.campaign_title_en}</span>
                  </p>
                  <div className="pt-2">
                    <span className="text-3xl font-black text-gray-900">{Number(item.amount).toLocaleString()}</span>
                    <span className="ml-2 text-sm text-gray-400 font-bold uppercase tracking-widest">LAK</span>
                  </div>
                </div>

                {/* ປຸ່ມຈັດການ (Action Buttons) */}
                <div className="w-full lg:w-auto flex flex-col gap-3 shrink-0">
                  <button 
                    onClick={() => handleApprove(item)}
                    disabled={actionLoading === item.id}
                    className="w-full lg:w-44 bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-md hover:shadow-teal-600/30 disabled:bg-gray-300 uppercase tracking-widest text-sm"
                  >
                    {actionLoading === item.id 
                      ? (locale === 'lo' ? 'ກຳລັງປະມວນຜົນ...' : 'Processing...') 
                      : (locale === 'lo' ? 'ອະນຸມັດ (Approve)' : 'Approve')
                    }
                  </button>
                  <button 
                    onClick={() => handleReject(item.id)}
                    disabled={actionLoading === item.id}
                    className="w-full lg:w-44 bg-pink-50 text-pink-500 hover:bg-pink-100 font-black py-4 px-6 rounded-2xl transition-all text-sm uppercase tracking-widest"
                  >
                    {locale === 'lo' ? 'ປະຕິເສດ (Reject)' : 'Reject'}
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