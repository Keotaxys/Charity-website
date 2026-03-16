'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, query, orderBy } from 'firebase/firestore';

export default function TabCampaigns({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  // 1. State ສຳລັບ Header ຂອງໜ້າໂຄງການ
  const [pageSettings, setPageSettings] = useState({
    header_title_lo: 'ທຸກໆການຊ່ວຍເຫຼືອມີຄວາມໝາຍ',
    header_title_en: 'EVERY CONTRIBUTION COUNTS',
    header_subtitle_lo: 'ຮ່ວມເປັນສ່ວນໜຶ່ງໃນການປ່ຽນແປງສັງຄົມ ຜ່ານໂຄງການຕ່າງໆຂອງພວກເຮົາ. ເງິນທຸກກີບຈະຖືກນຳໄປໃຊ້ຢ່າງໂປ່ງໃສ ແລະ ເກີດປະໂຫຍດສູງສຸດ.',
    header_subtitle_en: 'Be a part of social change through our various campaigns. Every contribution is used transparently for maximum impact.'
  });
  const [loadingSettings, setLoadingSettings] = useState(false);

  // 2. State ສຳລັບການຈັດການໂຄງການ (Campaigns)
  const [campaignsList, setCampaignsList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title_lo: '', title_en: '', description_lo: '', description_en: '', target_amount: '', cover_image: ''
  });
  const [loadingCampaign, setLoadingCampaign] = useState(false);

  // ໂຫຼດຂໍ້ມູນທັງໝົດເມື່ອເປີດໜ້ານີ້
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // ໂຫຼດຂໍ້ມູນ Header
    try {
      const docRef = doc(db, 'settings', 'campaigns_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPageSettings(docSnap.data() as any);
      }
    } catch (error) {
      console.error("Error fetching page settings:", error);
    }

    // ໂຫຼດລາຍການໂຄງການ
    try {
      const q = query(collection(db, 'campaigns'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      setCampaignsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  // ຟັງຊັນບັນທຶກ Header
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'campaigns_page'), pageSettings, { merge: true });
      showMessage('ບັນທຶກຂໍ້ຄວາມ Header ສຳເລັດແລ້ວ!', 'success');
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ Header', 'error');
    }
    setLoadingSettings(false);
  };

  // ຟັງຊັນບັນທຶກ ຫຼື ແກ້ໄຂໂຄງການ
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCampaign(true);
    try {
      if (isEditing && editId) {
        // ກໍລະນີແກ້ໄຂໂຄງການເກົ່າ
        await updateDoc(doc(db, 'campaigns', editId), {
          ...formData,
          target_amount: Number(formData.target_amount)
        });
        showMessage('ແກ້ໄຂຂໍ້ມູນໂຄງການສຳເລັດແລ້ວ!', 'success');
      } else {
        // ກໍລະນີສ້າງໂຄງການໃໝ່
        await addDoc(collection(db, 'campaigns'), {
          ...formData,
          target_amount: Number(formData.target_amount),
          raised_amount: 0, // ເລີ່ມຕົ້ນທີ່ 0
          status: 'Active',
          created_at: new Date()
        });
        showMessage('ສ້າງໂຄງການໃໝ່ສຳເລັດແລ້ວ!', 'success');
      }
      
      // ລ້າງຟອມ ແລະ ໂຫຼດຂໍ້ມູນໃໝ່
      setFormData({ title_lo: '', title_en: '', description_lo: '', description_en: '', target_amount: '', cover_image: '' });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກໂຄງການ', 'error');
    }
    setLoadingCampaign(false);
  };

  // ຟັງຊັນກົດປຸ່ມແກ້ໄຂ (ດຶງຂໍ້ມູນມາໃສ່ຟອມ)
  const handleEditClick = (campaign: any) => {
    setFormData({
      title_lo: campaign.title_lo,
      title_en: campaign.title_en,
      description_lo: campaign.description_lo,
      description_en: campaign.description_en,
      target_amount: campaign.target_amount.toString(),
      cover_image: campaign.cover_image
    });
    setIsEditing(true);
    setEditId(campaign.id);
    
    // ເລື່ອນໜ້າຈໍຂຶ້ນໄປຫາຟອມອັດຕະໂນມັດ
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ຟັງຊັນຍົກເລີກການແກ້ໄຂ
  const handleCancelEdit = () => {
    setFormData({ title_lo: '', title_en: '', description_lo: '', description_en: '', target_amount: '', cover_image: '' });
    setIsEditing(false);
    setEditId(null);
  };

  // ຟັງຊັນລຶບໂຄງການ
  const handleDeleteClick = async (id: string) => {
    if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບໂຄງການນີ້? ຂໍ້ມູນຈະຖືກລຶບຖາວອນ!')) {
      try {
        await deleteDoc(doc(db, 'campaigns', id));
        showMessage('ລຶບໂຄງການສຳເລັດແລ້ວ!', 'success');
        fetchData();
      } catch (error) {
        showMessage('ເກີດຂໍ້ຜິດພາດໃນການລຶບ', 'error');
      }
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSettings({ ...pageSettings, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* --- ສ່ວນທີ 1: ຕັ້ງຄ່າ Header ໜ້າໂຄງການ --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" /><path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" /></svg>
          <h2 className="text-2xl font-black text-gray-900">ຕັ້ງຄ່າຂໍ້ຄວາມໜ້າໂຄງການ (Page Header)</h2>
        </div>
        
        <form onSubmit={handleSaveSettings} className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ (ພາສາລາວ)</label>
              <input type="text" name="header_title_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={pageSettings.header_title_lo} onChange={handleSettingsChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ (ພາສາອັງກິດ)</label>
              <input type="text" name="header_title_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={pageSettings.header_title_en} onChange={handleSettingsChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຄຳອະທິບາຍ (ພາສາລາວ)</label>
              <textarea name="header_subtitle_lo" required rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={pageSettings.header_subtitle_lo} onChange={handleSettingsChange}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຄຳອະທິບາຍ (ພາສາອັງກິດ)</label>
              <textarea name="header_subtitle_en" required rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={pageSettings.header_subtitle_en} onChange={handleSettingsChange}></textarea>
            </div>
          </div>
          <button type="submit" disabled={loadingSettings} className="bg-gray-900 hover:bg-gray-800 text-white font-black py-3 px-8 rounded-xl transition-all shadow-md disabled:bg-gray-400">
            {loadingSettings ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ Header'}
          </button>
        </form>
      </div>

      {/* --- ສ່ວນທີ 2: ຟອມສ້າງ / ແກ້ໄຂໂຄງການ --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00-.479 4.024m-18.068 4.253l2.8-.7a8.25 8.25 0 015.58.652l.108.054a9.75 9.75 0 006.725.738l1.838-.46V10.5a.75.75 0 01-.75.75h-.02a9.75 9.75 0 01-6.725-.738l-.108-.054a8.25 8.25 0 00-5.58-.652l-2.8.7V21a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" /></svg>
          <h2 className="text-2xl font-black text-gray-900">
            {isEditing ? 'ແກ້ໄຂຂໍ້ມູນໂຄງການ (Edit Campaign)' : 'ສ້າງໂຄງການໃໝ່ (Create Campaign)'}
          </h2>
        </div>

        <form onSubmit={handleSaveCampaign} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່ໂຄງການ (ລາວ)</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={formData.title_lo} onChange={(e) => setFormData({...formData, title_lo: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່ໂຄງການ (ອັງກິດ)</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ລາຍລະອຽດ (ລາວ)</label>
              <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={formData.description_lo} onChange={(e) => setFormData({...formData, description_lo: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ລາຍລະອຽດ (ອັງກິດ)</label>
              <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})}></textarea>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຍອດເງິນເປົ້າໝາຍ (ກີບ)</label>
              <input type="number" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" placeholder="ຕົວຢ່າງ: 10000000" value={formData.target_amount} onChange={(e) => setFormData({...formData, target_amount: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ລິ້ງຮູບໜ້າປົກ (Cover Image URL)</label>
              <input type="url" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" placeholder="ວາງລິ້ງຮູບພາບ .jpg ຫຼື .png" value={formData.cover_image} onChange={(e) => setFormData({...formData, cover_image: e.target.value})} />
            </div>
          </div>
          
          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={loadingCampaign} className="flex-1 bg-teal-600 text-white font-black py-4 rounded-xl hover:bg-teal-700 transition-all shadow-md uppercase tracking-wide disabled:bg-gray-400">
              {loadingCampaign ? 'ກຳລັງບັນທຶກ...' : (isEditing ? 'ບັນທຶກການແກ້ໄຂ' : 'ສ້າງ ແລະ ເຜີຍແຜ່')}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-black py-4 rounded-xl transition-all shadow-sm uppercase tracking-wide">
                ຍົກເລີກ (Cancel)
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- ສ່ວນທີ 3: ລາຍການໂຄງການທີ່ມີໃນລະບົບ --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h15.75c1.036 0 1.875.84 1.875 1.875V17.25c0 1.035-.84 1.875-1.875 1.875h-11.25l-4.5 4.5V4.125z" clipRule="evenodd" /></svg>
          ລາຍການໂຄງການທັງໝົດ
        </h2>
        
        {campaignsList.length === 0 ? (
          <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-xl">ຍັງບໍ່ມີໂຄງການໃນລະບົບ.</p>
        ) : (
          <div className="space-y-4">
            {campaignsList.map((campaign) => (
              <div key={campaign.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 gap-4 transition-colors">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img src={campaign.cover_image} alt="cover" className="w-20 h-14 object-cover rounded-lg shadow-sm border border-gray-100" />
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{campaign.title_lo}</h3>
                    <p className="text-sm text-gray-500 font-medium">ເປົ້າໝາຍ: {Number(campaign.target_amount).toLocaleString()} LAK</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto shrink-0">
                  <button onClick={() => handleEditClick(campaign)} className="flex-1 md:flex-none text-teal-600 hover:text-white font-bold text-sm bg-teal-50 hover:bg-teal-600 px-5 py-2.5 rounded-lg transition-colors border border-teal-100 hover:border-teal-600">
                    ແກ້ໄຂ
                  </button>
                  <button onClick={() => handleDeleteClick(campaign.id)} className="flex-1 md:flex-none text-pink-500 hover:text-white font-bold text-sm bg-pink-50 hover:bg-pink-500 px-5 py-2.5 rounded-lg transition-colors border border-pink-100 hover:border-pink-500">
                    ລຶບ
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