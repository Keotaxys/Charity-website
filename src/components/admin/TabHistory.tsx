'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function TabHistory({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const locale = useLocale(); // 💡 ເອີ້ນໃຊ້ useLocale ເພື່ອກວດສອບພາສາແອັດມິນ

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const docRef = doc(db, 'settings', 'history_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPageSettings(docSnap.data() as any);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }

    try {
      const q = query(collection(db, 'history_milestones'), orderBy('year', 'asc'));
      const snapshot = await getDocs(q);
      setMilestones(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'history_page'), pageSettings, { merge: true });
      showMessage(locale === 'lo' ? 'ບັນທຶກການຕັ້ງຄ່າໜ້າປະຫວັດສຳເລັດແລ້ວ!' : 'History page settings saved successfully!', 'success');
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ' : 'Error saving settings', 'error');
    }
    setLoadingSettings(false);
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSettings({ ...pageSettings, [e.target.name]: e.target.value });
  };

  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMilestone(true);
    try {
      if (isEditing && editId) {
        await updateDoc(doc(db, 'history_milestones', editId), formData);
        showMessage(locale === 'lo' ? 'ແກ້ໄຂປະຫວັດສຳເລັດແລ້ວ!' : 'Milestone updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'history_milestones'), {
          ...formData,
          created_at: new Date()
        });
        showMessage(locale === 'lo' ? 'ເພີ່ມປະຫວັດໃໝ່ສຳເລັດແລ້ວ!' : 'New milestone added successfully!', 'success');
      }
      
      setFormData({ year: '', title_lo: '', title_en: '', desc_lo: '', desc_en: '', image: '' });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກປະຫວັດ' : 'Error saving milestone', 'error');
    }
    setLoadingMilestone(false);
  };

  const handleEditClick = (item: any) => {
    setFormData({
      year: item.year, title_lo: item.title_lo, title_en: item.title_en,
      desc_lo: item.desc_lo, desc_en: item.desc_en, image: item.image
    });
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleDeleteClick = async (id: string) => {
    const confirmMsg = locale === 'lo' ? 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບປະຫວັດປີນີ້?' : 'Are you sure you want to delete this milestone?';
    if (confirm(confirmMsg)) {
      try {
        await deleteDoc(doc(db, 'history_milestones', id));
        showMessage(locale === 'lo' ? 'ລຶບປະຫວັດສຳເລັດແລ້ວ!' : 'Milestone deleted successfully!', 'success');
        fetchData();
      } catch (error) {
        showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການລຶບ' : 'Error deleting milestone', 'error');
      }
    }
  };

  const inputClass = "w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all";

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Main Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-6 bg-white p-8 rounded-3xl shadow-sm">
        <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
          <svg className="w-8 h-8 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            {locale === 'lo' ? 'ຈັດການ "ປະຫວັດຂອງພວກເຮົາ"' : 'Manage "Our History"'}
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-bold">HISTORY & TIMELINE MANAGEMENT</p>
        </div>
      </div>

      {/* --- 1. Page Settings (Header & Footer) --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" /><path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" /></svg>
          {locale === 'lo' ? '1. ຕັ້ງຄ່າຂໍ້ຄວາມ (Page Settings)' : '1. Page Settings (Header & Footer)'}
        </h3>
        <form onSubmit={handleSaveSettings} className="space-y-8">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="font-black text-teal-700 mb-4 text-sm uppercase">
              {locale === 'lo' ? '» ສ່ວນຫົວ (Header Section)' : '» Header Section'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="header_title_lo" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ (ລາວ)' : 'Title (Lao)'} className={inputClass} value={pageSettings.header_title_lo} onChange={handleSettingsChange} required />
              <input type="text" name="header_title_en" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ (EN)' : 'Title (English)'} className={inputClass} value={pageSettings.header_title_en} onChange={handleSettingsChange} required />
              <textarea name="header_subtitle_lo" placeholder={locale === 'lo' ? 'ຄຳອະທິບາຍ (ລາວ)' : 'Description (Lao)'} rows={2} className={`${inputClass} resize-none`} value={pageSettings.header_subtitle_lo} onChange={handleSettingsChange} required></textarea>
              <textarea name="header_subtitle_en" placeholder={locale === 'lo' ? 'ຄຳອະທິບາຍ (EN)' : 'Description (English)'} rows={2} className={`${inputClass} resize-none`} value={pageSettings.header_subtitle_en} onChange={handleSettingsChange} required></textarea>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="font-black text-pink-600 mb-4 text-sm uppercase">
              {locale === 'lo' ? '» ສ່ວນທ້າຍ (Footer Section)' : '» Footer Section'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="footer_small_lo" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ຍ່ອຍ (ລາວ)' : 'Subtitle (Lao)'} className={inputClass} value={pageSettings.footer_small_lo} onChange={handleSettingsChange} required />
              <input type="text" name="footer_small_en" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ຍ່ອຍ (EN)' : 'Subtitle (English)'} className={inputClass} value={pageSettings.footer_small_en} onChange={handleSettingsChange} required />
              <input type="text" name="footer_title_lo" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ໃຫຍ່ (ລາວ)' : 'Main Title (Lao)'} className={inputClass} value={pageSettings.footer_title_lo} onChange={handleSettingsChange} required />
              <input type="text" name="footer_title_en" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ໃຫຍ່ (EN)' : 'Main Title (English)'} className={inputClass} value={pageSettings.footer_title_en} onChange={handleSettingsChange} required />
              <textarea name="footer_desc_lo" placeholder={locale === 'lo' ? 'ເນື້ອຫາ (ລາວ)' : 'Content (Lao)'} rows={2} className={`${inputClass} resize-none`} value={pageSettings.footer_desc_lo} onChange={handleSettingsChange} required></textarea>
              <textarea name="footer_desc_en" placeholder={locale === 'lo' ? 'ເນື້ອຫາ (EN)' : 'Content (English)'} rows={2} className={`${inputClass} resize-none`} value={pageSettings.footer_desc_en} onChange={handleSettingsChange} required></textarea>
              <input type="text" name="footer_btn_lo" placeholder={locale === 'lo' ? 'ປຸ່ມກົດ (ລາວ)' : 'Button Text (Lao)'} className={inputClass} value={pageSettings.footer_btn_lo} onChange={handleSettingsChange} required />
              <input type="text" name="footer_btn_en" placeholder={locale === 'lo' ? 'ປຸ່ມກົດ (EN)' : 'Button Text (English)'} className={inputClass} value={pageSettings.footer_btn_en} onChange={handleSettingsChange} required />
            </div>
          </div>
          
          <button type="submit" disabled={loadingSettings} className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-12 rounded-xl transition-all shadow-md hover:shadow-teal-600/30 uppercase tracking-widest">
            {loadingSettings ? (locale === 'lo' ? 'ກຳລັງບັນທຶກ...' : 'Saving...') : (locale === 'lo' ? 'ບັນທຶກການຕັ້ງຄ່າ' : 'Save Settings')}
          </button>
        </form>
      </div>

      {/* --- 2. Timeline Milestone Form --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100">
        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>
          {isEditing 
            ? (locale === 'lo' ? 'ແກ້ໄຂເຫດການ (Edit Milestone)' : 'Edit Milestone') 
            : (locale === 'lo' ? 'ເພີ່ມເຫດການໃໝ່ (Add Milestone)' : 'Add New Milestone')}
        </h3>
        <form onSubmit={handleSaveMilestone} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ປີ (Year)' : 'Year'}</label>
              <input type="text" required className={`${inputClass} text-center text-xl font-black`} placeholder="2024" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ລິ້ງຮູບພາບ (Image URL)' : 'Image URL'}</label>
              <input type="url" required className={inputClass} placeholder="https://..." value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ຫົວຂໍ້ (ລາວ)' : 'Title (Lao)'}</label>
              <input type="text" required className={inputClass} value={formData.title_lo} onChange={(e) => setFormData({...formData, title_lo: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ຫົວຂໍ້ (EN)' : 'Title (English)'}</label>
              <input type="text" required className={inputClass} value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ເນື້ອຫາ (ລາວ)' : 'Content (Lao)'}</label>
              <textarea required rows={4} className={`${inputClass} resize-none`} value={formData.desc_lo} onChange={(e) => setFormData({...formData, desc_lo: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ເນື້ອຫາ (EN)' : 'Content (English)'}</label>
              <textarea required rows={4} className={`${inputClass} resize-none`} value={formData.desc_en} onChange={(e) => setFormData({...formData, desc_en: e.target.value})}></textarea>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loadingMilestone} className="flex-1 bg-teal-600 text-white font-black py-4 rounded-xl hover:bg-teal-700 transition-all shadow-md uppercase tracking-widest">
              {loadingMilestone 
                ? (locale === 'lo' ? 'ກຳລັງປະມວນຜົນ...' : 'Processing...') 
                : (isEditing 
                    ? (locale === 'lo' ? 'ບັນທຶກການແກ້ໄຂ' : 'Save Changes') 
                    : (locale === 'lo' ? 'ເພີ່ມເຫດການລົງ Timeline' : 'Add to Timeline')
                  )
              }
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setEditId(null); setFormData({year:'', title_lo:'', title_en:'', desc_lo:'', desc_en:'', image:''}); }} className="flex-1 bg-gray-100 text-gray-500 hover:bg-gray-200 font-black py-4 rounded-xl transition-all uppercase tracking-widest">
                {locale === 'lo' ? 'ຍົກເລີກ' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- 3. Milestone List --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM8.25 11.25a.75.75 0 000 1.5h12a.75.75 0 000-1.5h-12zm-5.625 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
          {locale === 'lo' ? 'ລາຍການປະຫວັດທັງໝົດ' : 'All Milestones'}
        </h3>
        {milestones.length === 0 ? (
          <p className="text-gray-400 text-center py-10 font-bold bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            {locale === 'lo' ? 'ຍັງບໍ່ມີຂໍ້ມູນໃນລະບົບ.' : 'No milestones found.'}
          </p>
        ) : (
          <div className="space-y-4">
            {milestones.map((item) => (
              <div key={item.id} className="group flex flex-col md:flex-row items-center justify-between p-5 bg-white hover:bg-teal-50/30 rounded-[1.5rem] border border-gray-100 transition-all">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 bg-teal-600 text-white font-black text-xl flex items-center justify-center rounded-2xl shadow-lg shrink-0">
                    {item.year}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg line-clamp-1">{locale === 'lo' ? item.title_lo : item.title_en}</h4>
                    <p className="text-sm text-gray-500 font-bold line-clamp-1">{locale === 'lo' ? item.desc_lo : item.desc_en}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto shrink-0">
                  <button onClick={() => handleEditClick(item)} className="flex-1 md:flex-none text-teal-600 font-black bg-teal-50 hover:bg-teal-600 hover:text-white px-5 py-2.5 rounded-xl transition-all text-xs uppercase">
                    {locale === 'lo' ? 'ແກ້ໄຂ' : 'Edit'}
                  </button>
                  <button onClick={() => handleDeleteClick(item.id)} className="flex-1 md:flex-none text-pink-500 font-black bg-pink-50 hover:bg-pink-500 hover:text-white px-5 py-2.5 rounded-xl transition-all text-xs uppercase">
                    {locale === 'lo' ? 'ລຶບ' : 'Delete'}
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