'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, increment } from 'firebase/firestore';

export default function TabDonations({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ໂຫຼດຂໍ້ມູນການບໍລິຈາກທັງໝົດ
  const fetchDonations = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'donations'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // ຟັງຊັນອະນຸມັດຍອດເງິນ
  const handleApprove = async (donation: any) => {
    if (!confirm('ທ່ານກວດສອບສະລິບຖືກຕ້ອງແລ້ວ ແລະ ຕ້ອງການອະນຸມັດຍອດນີ້ແທ້ບໍ່?')) return;
    
    try {
      // 1. ປ່ຽນສະຖານະບິນເປັນ Approved
      await updateDoc(doc(db, 'donations', donation.id), {
        status: 'Approved'
      });

      // 2. ບວກຍອດເງິນເຂົ້າໃນໂຄງການນັ້ນໆ (ຖ້າມີການລະບຸ ID ໂຄງການ)
      if (donation.campaign_id && donation.campaign_id !== 'general') {
        await updateDoc(doc(db, 'campaigns', donation.campaign_id), {
          raised_amount: increment(Number(donation.amount))
        });
      }

      showMessage('ອະນຸມັດຍອດບໍລິຈາກສຳເລັດແລ້ວ!', 'success');
      fetchDonations(); // ໂຫຼດຂໍ້ມູນໃໝ່
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການອະນຸມັດ', 'error');
    }
  };

  // ຟັງຊັນລຶບລາຍການ (ກໍລະນີບິນປອມ ຫຼື ຂໍ້ມູນຜິດ)
  const handleDelete = async (id: string) => {
    if (!confirm('ທ່ານຕ້ອງການລຶບລາຍການນີ້ຖິ້ມແທ້ບໍ່? (ບໍ່ສາມາດກູ້ຄືນໄດ້)')) return;
    
    try {
      await deleteDoc(doc(db, 'donations', id));
      showMessage('ລຶບລາຍການສຳເລັດແລ້ວ!', 'success');
      fetchDonations();
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການລຶບ', 'error');
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-teal-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" /><path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v14.25c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 19.125V4.875zm8.75 4.875c0-1.518 1.232-2.75 2.75-2.75s2.75 1.232 2.75 2.75-1.232 2.75-2.75 2.75-2.75-1.232-2.75-2.75z" clipRule="evenodd" /></svg>
        <h2 className="text-2xl font-black text-gray-900">ອະນຸມັດຍອດບໍລິຈາກ (Donations Approval)</h2>
      </div>
      
      <p className="text-gray-500 mb-6 text-sm">ກວດສອບສະລິບການໂອນເງິນຈາກຜູ້ບໍລິຈາກ ແລະ ກົດອະນຸມັດເພື່ອໃຫ້ຍອດເງິນອັບເດດຂຶ້ນໜ້າເວັບ.</p>

      {loading ? (
        <div className="text-center py-10 text-teal-600 font-bold animate-pulse">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>
      ) : donations.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-10 text-center border border-gray-100">
          <span className="text-4xl block mb-3">📭</span>
          <p className="text-gray-500 font-bold">ຍັງບໍ່ມີລາຍການແຈ້ງໂອນເງິນໃນລະບົບ.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((item) => (
            <div key={item.id} className={`flex flex-col lg:flex-row items-center justify-between p-5 rounded-2xl border transition-all gap-6 ${item.status === 'Approved' ? 'bg-teal-50/30 border-teal-100' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
              
              {/* ຂໍ້ມູນຜູ້ບໍລິຈາກ */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-black text-lg text-gray-900">{item.donor_name || 'ບໍ່ລະບຸຊື່ (Anonymous)'}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${item.status === 'Approved' ? 'bg-teal-100 text-teal-600' : 'bg-orange-100 text-orange-600'}`}>
                    {item.status === 'Approved' ? 'ອະນຸມັດແລ້ວ' : 'ລໍຖ້າກວດສອບ'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>ຍອດເງິນໂອນ: <span className="font-black text-teal-600">{Number(item.amount).toLocaleString()} LAK</span></p>
                  <p>ເບີໂທຕິດຕໍ່: {item.phone || '-'}</p>
                  <p className="text-xs text-gray-400">ວັນທີແຈ້ງ: {item.created_at ? new Date(item.created_at.seconds * 1000).toLocaleString('lo-LA') : '-'}</p>
                </div>
              </div>

              {/* ຮູບສະລິບ ແລະ ປຸ່ມຈັດການ */}
              <div className="flex items-center gap-4 w-full lg:w-auto shrink-0">
                {item.slip_url ? (
                  <a href={item.slip_url} target="_blank" rel="noopener noreferrer" className="relative group block w-20 h-24 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                    <img src={item.slip_url} alt="Slip" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold">ເບິ່ງຮູບ</span>
                    </div>
                  </a>
                ) : (
                  <div className="w-20 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 text-center border border-gray-200">ບໍ່ມີຮູບ</div>
                )}

                <div className="flex flex-col gap-2 w-full lg:w-32">
                  {item.status !== 'Approved' && (
                    <button 
                      onClick={() => handleApprove(item)}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm w-full shadow-sm"
                    >
                      ອະນຸມັດ
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="bg-white border border-pink-200 hover:bg-pink-50 text-pink-500 font-bold py-2 px-4 rounded-lg transition-all text-sm w-full"
                  >
                    ລຶບຖິ້ມ
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}