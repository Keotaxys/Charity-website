'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function TabHistory({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  // 1. State ສຳລັບການຕັ້ງຄ່າໜ້າ (Header & Footer)
  const [pageSettings, setPageSettings] = useState({
    header_title_lo: 'ປະຫວັດຂອງພວກເຮົາ', header_title_en: 'OUR HISTORY',
    header_subtitle_lo: 'ທຸກໆບາດກ້າວຂອງພວກເຮົາ ຄືການສ້າງປະຫວັດສາດແຫ່ງການໃຫ້ທີ່ບໍ່ມີວັນສິ້ນສຸດ.', header_subtitle_en: 'Every step we take creates a history of endless giving.',
    footer_small_lo: 'ກ້າວຕໍ່ໄປຂອງພວກເຮົາ', footer_small_en: 'LOOKING FORWARD',
    footer_title_lo: 'ອະນາຄົດເລີ່ມຕົ້ນທີ່ມື້ນີ້', footer_title_en: 'THE FUTURE STARTS TODAY',
    footer_desc_lo: 'ປະຫວັດສາດໜ້າຕໍ່ໄປຂອງ BEAST.LAO ກຳລັງຈະຖືກຂຽນຂຶ້ນ ດ້ວຍການຮ່ວມມືຈາກທ່ານ.', footer_desc_en: 'The next chapter of our history is being written with your support.',
    footer_btn_lo: 'ຮ່ວມສ້າງປະຫວັດສາດນຳກັນ', footer_btn_en: 'JOIN OUR CAUSE',
  });
  const [loadingSettings, setLoadingSettings] = useState(false);

  // 2. State ສຳລັບການຈັດການ Timeline
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    year: '', title_lo: '', title_en: '', desc_lo: '', desc_en: '', image: ''
  });
  const [loadingMilestone, setLoadingMilestone] = useState(false);

  // ໂຫຼດຂໍ້ມູນທັງໝົດເມື່ອເປີດໜ້າ
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // ໂຫຼດ Page Settings
    try {
      const docRef = doc(db, 'settings', 'history_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPageSettings(docSnap.data() as any);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }

    // ໂຫຼດ Milestones
    try {
      const q = query(collection(db, 'history_milestones'), orderBy('year', 'asc'));
      const snapshot = await getDocs(q);
      setMilestones(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  // ຟັງຊັນບັນທຶກ Page Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'history_page'), pageSettings, { merge: true });
      showMessage('ບັນທຶກການຕັ້ງຄ່າໜ້າປະຫວັດສຳເລັດແລ້ວ!', 'success');
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ', 'error');
    }
    setLoadingSettings(false);
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSettings({ ...pageSettings, [e.target.name]: e.target.value });
  };

  // ຟັງຊັນບັນທຶກ / ແກ້ໄຂ Milestone
  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMilestone(true);
    try {
      if (isEditing && editId) {
        await updateDoc(doc(db, 'history_milestones', editId), formData);
        showMessage('ແກ້ໄຂປະຫວັດສຳເລັດແລ້ວ!', 'success');
      } else {
        await addDoc(collection(db, 'history_milestones'), {
          ...formData,
          created_at: new Date()
        });
        showMessage('ເພີ່ມປະຫວັດໃໝ່ສຳເລັດແລ້ວ!', 'success');
      }
      
      setFormData({ year: '', title_lo: '', title_en: '', desc_lo: '', desc_en: '', image: '' });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກປະຫວັດ', 'error');
    }
    setLoadingMilestone(false);
  };

  // ຟັງຊັນກົດປຸ່ມແກ້ໄຂ
  const handleEditClick = (item: any) => {
    setFormData({
      year: item.year, title_lo: item.title_lo, title_en: item.title_en,
      desc_lo: item.desc_lo, desc_en: item.desc_en, image: item.image
    });
    setIsEditing(true);
    setEditId(item.id);
  };

  // ຟັງຊັນລຶບ
  const handleDeleteClick = async (id: string) => {
    if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບປະຫວັດປີນີ້?')) {
      try {
        await deleteDoc(doc(db, 'history_milestones', id));
        showMessage('ລຶບປະຫວັດສຳເລັດແລ້ວ!', 'success');
        fetchData();
      } catch (error) {
        showMessage('ເກີດຂໍ້ຜິດພາດໃນການລຶບ', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-6 bg-white p-8 rounded-3xl shadow-sm">
        <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
          <svg className="w-8 h-8 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">ຈັດການ "ປະຫວັດຂອງພວກເຮົາ" (Our History)</h2>
          <p className="text-gray-500 text-sm mt-1">ຕັ້ງຄ່າຂໍ້ຄວາມ ແລະ ເພີ່ມເຫດການສຳຄັນໃນແຕ່ລະປີ</p>
        </div>
      </div>

      {/* --- 1. ຕັ້ງຄ່າໜ້າ Header & Footer --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
          <span className="text-xl">1️⃣</span> ຕັ້ງຄ່າຂໍ້ຄວາມ (Page Settings)
        </h3>
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="font-bold text-teal-700 mb-4">» ສ່ວນຫົວ (Header)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="header_title_lo" placeholder="ຫົວຂໍ້ (ລາວ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.header_title_lo} onChange={handleSettingsChange} required />
              <input type="text" name="header_title_en" placeholder="ຫົວຂໍ້ (ອັງກິດ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.header_title_en} onChange={handleSettingsChange} required />
              <textarea name="header_subtitle_lo" placeholder="ຄຳອະທິບາຍ (ລາວ)" rows={2} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium resize-none" value={pageSettings.header_subtitle_lo} onChange={handleSettingsChange} required></textarea>
              <textarea name="header_subtitle_en" placeholder="ຄຳອະທິບາຍ (ອັງກິດ)" rows={2} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium resize-none" value={pageSettings.header_subtitle_en} onChange={handleSettingsChange} required></textarea>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="font-bold text-pink-600 mb-4">» ສ່ວນທ້າຍ (Footer - The Future)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="footer_small_lo" placeholder="ຫົວຂໍ້ຍ່ອຍ (ລາວ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.footer_small_lo} onChange={handleSettingsChange} required />
              <input type="text" name="footer_small_en" placeholder="ຫົວຂໍ້ຍ່ອຍ (ອັງກິດ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.footer_small_en} onChange={handleSettingsChange} required />
              <input type="text" name="footer_title_lo" placeholder="ຫົວຂໍ້ໃຫຍ່ (ລາວ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.footer_title_lo} onChange={handleSettingsChange} required />
              <input type="text" name="footer_title_en" placeholder="ຫົວຂໍ້ໃຫຍ່ (ອັງກິດ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.footer_title_en} onChange={handleSettingsChange} required />
              <textarea name="footer_desc_lo" placeholder="ຄຳອະທິບາຍ (ລາວ)" rows={2} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium resize-none" value={pageSettings.footer_desc_lo} onChange={handleSettingsChange} required></textarea>
              <textarea name="footer_desc_en" placeholder="ຄຳອະທິບາຍ (ອັງກິດ)" rows={2} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium resize-none" value={pageSettings.footer_desc_en} onChange={handleSettingsChange} required></textarea>
              <input type="text" name="footer_btn_lo" placeholder="ຂໍ້ຄວາມປຸ່ມກົດ (ລາວ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.footer_btn_lo} onChange={handleSettingsChange} required />
              <input type="text" name="footer_btn_en" placeholder="ຂໍ້ຄວາມປຸ່ມກົດ (ອັງກິດ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.footer_btn_en} onChange={handleSettingsChange} required />
            </div>
          </div>
          <button type="submit" disabled={loadingSettings} className="bg-gray-900 hover:bg-gray-800 text-white font-black py-4 px-8 rounded-xl transition-all disabled:bg-gray-400">
            {loadingSettings ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການຕັ້ງຄ່າ'}
          </button>
        </form>
      </div>

      {/* --- 2. ຟອມເພີ່ມ Timeline --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100">
        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
          <span className="text-xl">2️⃣</span> {isEditing ? 'ແກ້ໄຂເຫດການ (Edit Milestone)' : 'ເພີ່ມເຫດການໃໝ່ (Add New Milestone)'}
        </h3>
        <form onSubmit={handleSaveMilestone} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-gray-700 font-bold mb-2 text-sm">ປີ (Year)</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-bold text-xl text-center" placeholder="ຕົວຢ່າງ: 2024" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2 text-sm">ລິ້ງຮູບພາບ (Image URL)</label>
              <input type="url" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" placeholder="https://..." value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ (ລາວ)</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={formData.title_lo} onChange={(e) => setFormData({...formData, title_lo: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ (ອັງກິດ)</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ເນື້ອຫາ (ລາວ)</label>
              <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={formData.desc_lo} onChange={(e) => setFormData({...formData, desc_lo: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ເນື້ອຫາ (ອັງກິດ)</label>
              <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={formData.desc_en} onChange={(e) => setFormData({...formData, desc_en: e.target.value})}></textarea>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loadingMilestone} className="flex-1 bg-teal-600 text-white font-black py-4 rounded-xl hover:bg-teal-700 transition-all uppercase tracking-wide">
              {loadingMilestone ? 'ກຳລັງບັນທຶກ...' : (isEditing ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມເຫດການໃໝ່')}
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setEditId(null); setFormData({year: '', title_lo: '', title_en: '', desc_lo: '', desc_en: '', image: ''}); }} className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200 font-black py-4 rounded-xl transition-all uppercase tracking-wide">
                ຍົກເລີກ
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- 3. ລາຍການ Timeline ທີ່ເພີ່ມແລ້ວ --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-3">ລາຍການປະຫວັດທັງໝົດ</h3>
        {milestones.length === 0 ? (
          <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-xl">ຍັງບໍ່ມີຂໍ້ມູນປະຫວັດໃນລະບົບ.</p>
        ) : (
          <div className="space-y-4">
            {milestones.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 gap-4 transition-colors">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 bg-teal-50 text-teal-600 font-black text-xl flex items-center justify-center rounded-2xl shrink-0">
                    {item.year}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg line-clamp-1">{item.title_lo}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.desc_lo}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEditClick(item)} className="text-teal-600 font-bold bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-lg transition-colors text-sm">ແກ້ໄຂ</button>
                  <button onClick={() => handleDeleteClick(item.id)} className="text-pink-500 font-bold bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-lg transition-colors text-sm">ລຶບ</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}