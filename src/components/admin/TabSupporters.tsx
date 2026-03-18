'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function TabSupporters({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const locale = useLocale(); // 💡 ເອີ້ນໃຊ້ useLocale ເພື່ອກວດສອບພາສາແອັດມິນ

  // 1. State ສຳລັບການຕັ້ງຄ່າໜ້າ Header ແລະ CTA
  const [pageSettings, setPageSettings] = useState({
    header_title_lo: 'ຜູ້ສະໜັບສະໜູນຫຼັກ', header_title_en: 'OUR SUPPORTERS',
    header_subtitle_lo: 'ຂໍຂອບໃຈທຸກພາກສ່ວນ ທີ່ຮ່ວມເປັນກຳລັງສຳຄັນໃນການຂັບເຄື່ອນທຸກໆໂຄງການຂອງພວກເຮົາ ໃຫ້ເກີດຂຶ້ນຈິງ.', 
    header_subtitle_en: 'Thank you to all our amazing partners who make our missions possible every single day.',
    
    cta_title_lo: 'ຮ່ວມເປັນຜູ້ສະໜັບສະໜູນ', cta_title_en: 'PARTNER WITH US',
    cta_btn_lo: 'ຕິດຕໍ່ເພື່ອສະໜັບສະໜູນ', cta_btn_en: 'BECOME A PARTNER'
  });
  const [loadingSettings, setLoadingSettings] = useState(false);

  // 2. State ສຳລັບການຈັດການ Sponsor Logos
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', logo_url: '', type: 'general', order_index: '0'
  });
  const [loadingSponsor, setLoadingSponsor] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // ໂຫຼດ Page Settings
    try {
      const docRef = doc(db, 'settings', 'supporters_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPageSettings(docSnap.data() as any);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }

    // ໂຫຼດລາຍຊື່ Sponsors
    try {
      const q = query(collection(db, 'sponsors'), orderBy('order_index', 'asc'));
      const snapshot = await getDocs(q);
      setSponsors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'supporters_page'), pageSettings, { merge: true });
      showMessage(locale === 'lo' ? 'ບັນທຶກການຕັ້ງຄ່າໜ້າຜູ້ສະໜັບສະໜູນສຳເລັດແລ້ວ!' : 'Supporters page settings saved successfully!', 'success');
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ' : 'Error saving settings', 'error');
    }
    setLoadingSettings(false);
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSettings({ ...pageSettings, [e.target.name]: e.target.value });
  };

  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSponsor(true);
    try {
      const data = { ...formData, order_index: Number(formData.order_index) };
      if (isEditing && editId) {
        await updateDoc(doc(db, 'sponsors', editId), data);
        showMessage(locale === 'lo' ? 'ແກ້ໄຂຂໍ້ມູນສະໜັບສະໜູນສຳເລັດ!' : 'Sponsor updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'sponsors'), { ...data, created_at: new Date() });
        showMessage(locale === 'lo' ? 'ເພີ່ມຜູ້ສະໜັບສະໜູນໃໝ່ສຳເລັດ!' : 'New sponsor added successfully!', 'success');
      }
      setFormData({ name: '', logo_url: '', type: 'general', order_index: '0' });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດ' : 'An error occurred', 'error');
    }
    setLoadingSponsor(false);
  };

  const handleEditClick = (item: any) => {
    setFormData({
      name: item.name, logo_url: item.logo_url, 
      type: item.type || 'general', order_index: item.order_index?.toString() || '0'
    });
    setIsEditing(true);
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id: string) => {
    const confirmMsg = locale === 'lo' ? 'ລຶບ Logo ຜູ້ສະໜັບສະໜູນນີ້ແທ້ບໍ່?' : 'Are you sure you want to delete this sponsor logo?';
    if (confirm(confirmMsg)) {
      try {
        await deleteDoc(doc(db, 'sponsors', id));
        showMessage(locale === 'lo' ? 'ລຶບສຳເລັດ!' : 'Deleted successfully!', 'success');
        fetchData();
      } catch (error) {
        showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການລຶບ' : 'Error deleting sponsor', 'error');
      }
    }
  };

  const inputClass = "w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all";

  // ແຍກ Sponsors ຕາມປະເພດ
  const platinumSponsors = sponsors.filter(s => s.type === 'platinum');
  const generalSponsors = sponsors.filter(s => s.type === 'general');

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Main Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-6 bg-white p-8 rounded-3xl shadow-sm">
        <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
          <svg className="w-8 h-8 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            {locale === 'lo' ? 'ຈັດການ "ຜູ້ສະໜັບສະໜູນ"' : 'Manage "Supporters"'}
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-bold">SUPPORTERS & PARTNERS MANAGEMENT</p>
        </div>
      </div>

      {/* --- 1. Page Settings (Header & CTA) --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" /><path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" /></svg>
          {locale === 'lo' ? '1. ຕັ້ງຄ່າຂໍ້ຄວາມ (Page Settings)' : '1. Page Settings (Header & CTA)'}
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
              {locale === 'lo' ? '» ສ່ວນຊັກຊວນທ້າຍໜ້າ (Call to Action)' : '» Call to Action (Bottom Section)'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="cta_title_lo" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ຊັກຊວນ (ລາວ)' : 'CTA Title (Lao)'} className={inputClass} value={pageSettings.cta_title_lo} onChange={handleSettingsChange} required />
              <input type="text" name="cta_title_en" placeholder={locale === 'lo' ? 'CTA Title (EN)' : 'CTA Title (English)'} className={inputClass} value={pageSettings.cta_title_en} onChange={handleSettingsChange} required />
              <input type="text" name="cta_btn_lo" placeholder={locale === 'lo' ? 'ປຸ່ມກົດ (ລາວ)' : 'Button Text (Lao)'} className={inputClass} value={pageSettings.cta_btn_lo} onChange={handleSettingsChange} required />
              <input type="text" name="cta_btn_en" placeholder={locale === 'lo' ? 'Button Text (EN)' : 'Button Text (English)'} className={inputClass} value={pageSettings.cta_btn_en} onChange={handleSettingsChange} required />
            </div>
          </div>
          
          <button type="submit" disabled={loadingSettings} className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-12 rounded-xl transition-all shadow-md hover:shadow-teal-600/30 uppercase tracking-widest">
            {loadingSettings 
              ? (locale === 'lo' ? 'ກຳລັງບັນທຶກ...' : 'Saving...') 
              : (locale === 'lo' ? 'ບັນທຶກການຕັ້ງຄ່າ' : 'Save Settings')
            }
          </button>
        </form>
      </div>

      {/* --- 2. Sponsor Logo Form --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100">
        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>
          {isEditing 
            ? (locale === 'lo' ? 'ແກ້ໄຂ Logo ຜູ້ສະໜັບສະໜູນ' : 'Edit Sponsor Logo') 
            : (locale === 'lo' ? 'ເພີ່ມ Logo ຜູ້ສະໜັບສະໜູນໃໝ່' : 'Add New Sponsor Logo')
          }
        </h3>
        <form onSubmit={handleSaveSponsor} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">
                {locale === 'lo' ? 'ຊື່ອົງກອນ/ບໍລິສັດ' : 'Company/Organization Name'}
              </label>
              <input type="text" required className={inputClass} placeholder="Company Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">
                {locale === 'lo' ? 'ລິ້ງຮູບ Logo (Image URL)' : 'Logo Image URL'}
              </label>
              <input type="url" required className={inputClass} placeholder="https://..." value={formData.logo_url} onChange={(e) => setFormData({...formData, logo_url: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">
                {locale === 'lo' ? 'ປະເພດຜູ້ສະໜັບສະໜູນ (Level)' : 'Sponsorship Level'}
              </label>
              <select className={inputClass} value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="general">{locale === 'lo' ? 'ທົ່ວໄປ (General - ຮູບນ້ອຍ)' : 'General (Small Image)'}</option>
                <option value="platinum">{locale === 'lo' ? 'ແພລັດຕິນຳ (Platinum - ຮູບໃຫຍ່)' : 'Platinum (Large Image)'}</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">
                {locale === 'lo' ? 'ລຳດັບການສະແດງຜົນ (Order)' : 'Display Order'}
              </label>
              <input type="number" required className={`${inputClass} text-center`} placeholder="1, 2, 3..." value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loadingSponsor} className="flex-1 bg-teal-600 text-white font-black py-4 rounded-xl hover:bg-teal-700 transition-all shadow-md uppercase tracking-widest">
              {loadingSponsor 
                ? (locale === 'lo' ? 'ກຳລັງປະມວນຜົນ...' : 'Processing...') 
                : (isEditing 
                    ? (locale === 'lo' ? 'ບັນທຶກການແກ້ໄຂ' : 'Save Changes') 
                    : (locale === 'lo' ? 'ເພີ່ມ Logo ເຂົ້າລະບົບ' : 'Add Logo')
                  )
              }
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setEditId(null); setFormData({name:'', logo_url:'', type:'general', order_index:'0'}); }} className="flex-1 bg-gray-100 text-gray-500 hover:bg-gray-200 font-black py-4 rounded-xl transition-all uppercase tracking-widest">
                {locale === 'lo' ? 'ຍົກເລີກ' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- 3. Sponsor Logo Lists --- */}
      <div className="space-y-8">
        
        {/* Platinum Category */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-100">
          <h3 className="text-xl font-black text-pink-500 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
            {locale === 'lo' ? 'ລາຍການລະດັບແພລັດຕິນຳ (Platinum)' : 'Platinum Sponsors'}
          </h3>
          {platinumSponsors.length === 0 ? (
            <p className="text-gray-400 text-center py-6 font-bold bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              {locale === 'lo' ? 'ຍັງບໍ່ມີ Logo ແພລັດຕິນຳ' : 'No Platinum logos yet'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platinumSponsors.map((item) => (
                <div key={item.id} className="group relative bg-white border-2 border-gray-100 hover:border-pink-200 rounded-[2rem] p-8 flex flex-col items-center justify-center transition-all">
                  <img src={item.logo_url} alt={item.name} className="h-20 object-contain mb-4" />
                  <p className="font-bold text-gray-500 text-sm">{item.name}</p>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(item)} className="bg-teal-500 text-white p-2 rounded-lg shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                    <button onClick={() => handleDeleteClick(item.id)} className="bg-pink-500 text-white p-2 rounded-lg shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* General Category */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM8.25 11.25a.75.75 0 000 1.5h12a.75.75 0 000-1.5h-12zm-5.625 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
            {locale === 'lo' ? 'ລາຍການທົ່ວໄປ (General Partners)' : 'General Sponsors'}
          </h3>
          {generalSponsors.length === 0 ? (
            <p className="text-gray-400 text-center py-6 font-bold bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              {locale === 'lo' ? 'ຍັງບໍ່ມີ Logo ທົ່ວໄປ' : 'No General logos yet'}
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {generalSponsors.map((item) => (
                <div key={item.id} className="group relative bg-white border border-gray-200 hover:border-teal-200 rounded-[1.5rem] p-6 flex flex-col items-center justify-center transition-all">
                  <img src={item.logo_url} alt={item.name} className="h-12 object-contain mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <p className="font-bold text-gray-400 text-xs text-center">{item.name}</p>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(item)} className="bg-teal-50 text-teal-600 p-1.5 rounded-md hover:bg-teal-500 hover:text-white"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                    <button onClick={() => handleDeleteClick(item.id)} className="bg-pink-50 text-pink-500 p-1.5 rounded-md hover:bg-pink-500 hover:text-white"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}