'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function TabTeam({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const locale = useLocale(); // 💡 ເອີ້ນໃຊ້ useLocale ເພື່ອກວດສອບພາສາແອັດມິນ

  // 1. State ສຳລັບການຕັ້ງຄ່າໜ້າ Header ແລະ ສ່ວນຊັກຊວນ (ຮູບທີ 10)
  const [pageSettings, setPageSettings] = useState({
    header_title_lo: 'ທີມງານຂອງພວກເຮົາ', 
    header_title_en: 'OUR TEAM',
    header_subtitle_lo: 'ກຸ່ມຄົນຜູ້ຢູ່ເບື້ອງຫຼັງຂັບເຄື່ອນພາລະກິດ ເພື່ອສ້າງຮອຍຍິ້ມໃຫ້ກັບສັງຄົມ.', 
    header_subtitle_en: 'The people behind our mission, driving forward to bring smiles to society.',
    
    cta_title_lo: 'ມາຮ່ວມເປັນສ່ວນໜຶ່ງກັບພວກເຮົາ', 
    cta_title_en: 'COME JOIN US',
    cta_desc_lo: 'ພວກເຮົາຍິນດີຕ້ອນຮັບທຸກຄົນທີ່ມີໃຈຮັກໃນການຊ່ວຍເຫຼືອສັງຄົມ ເພື່ອມາເປັນອາສາສະໝັກໃນໂຄງການຕໍ່ໄປ.',
    cta_desc_en: 'We welcome everyone with a passion for helping society to become a volunteer in our next projects.',
    cta_btn_lo: 'ສະໝັກເປັນອາສາສະໝັກ', 
    cta_btn_en: 'APPLY AS VOLUNTEER'
  });
  const [loadingSettings, setLoadingSettings] = useState(false);

  // 2. State ສຳລັບການຈັດການສະມາຊິກທີມ (ຮູບທີ 9)
  const [members, setMembers] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name_lo: '', name_en: '', position_lo: '', position_en: '', image_url: '', order_index: '0'
  });
  const [loadingMember, setLoadingMember] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // ໂຫຼດ Page Settings
    try {
      const docRef = doc(db, 'settings', 'team_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPageSettings(docSnap.data() as any);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }

    // ໂຫຼດລາຍຊື່ທີມງານ
    try {
      const q = query(collection(db, 'team_members'), orderBy('order_index', 'asc'));
      const snapshot = await getDocs(q);
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'team_page'), pageSettings, { merge: true });
      showMessage(locale === 'lo' ? 'ບັນທຶກການຕັ້ງຄ່າໜ້າທີມງານສຳເລັດແລ້ວ!' : 'Team page settings saved successfully!', 'success');
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ' : 'Error saving settings', 'error');
    }
    setLoadingSettings(false);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMember(true);
    try {
      const data = { ...formData, order_index: Number(formData.order_index) };
      if (isEditing && editId) {
        await updateDoc(doc(db, 'team_members', editId), data);
        showMessage(locale === 'lo' ? 'ແກ້ໄຂຂໍ້ມູນທີມງານສຳເລັດ!' : 'Team member updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'team_members'), { ...data, created_at: new Date() });
        showMessage(locale === 'lo' ? 'ເພີ່ມທີມງານໃໝ່ສຳເລັດ!' : 'New team member added successfully!', 'success');
      }
      setFormData({ name_lo: '', name_en: '', position_lo: '', position_en: '', image_url: '', order_index: '0' });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດ' : 'An error occurred', 'error');
    }
    setLoadingMember(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      name_lo: item.name_lo, name_en: item.name_en, 
      position_lo: item.position_lo, position_en: item.position_en, 
      image_url: item.image_url, order_index: item.order_index.toString()
    });
    setIsEditing(true);
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const confirmMsg = locale === 'lo' ? 'ລຶບລາຍຊື່ທີມງານນີ້?' : 'Are you sure you want to delete this team member?';
    if (confirm(confirmMsg)) {
      await deleteDoc(doc(db, 'team_members', id));
      showMessage(locale === 'lo' ? 'ລຶບສຳເລັດ!' : 'Deleted successfully!', 'success');
      fetchData();
    }
  };

  const inputClass = "w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all";

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Main Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-6 bg-white p-8 rounded-3xl shadow-sm">
        <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
          <svg className="w-8 h-8 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" /><path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 016.576-3.036c.32.491.565 1.042.721 1.629a8.258 8.258 0 00-3.727-2.64z" /><path d="M18.918 14.254a8.287 8.287 0 011.308 5.135 9.687 9.687 0 001.764-.44l.115-.04a.563.563 0 00.373-.487l.01-.121a3.75 3.75 0 00-6.576-3.036c-.32.491-.565 1.042-.721 1.629a8.258 8.258 0 013.727-2.64z" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            {locale === 'lo' ? 'ຈັດການ "ທີມງານ"' : 'Manage "Our Team"'}
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-bold">TEAM MEMBERS MANAGEMENT</p>
        </div>
      </div>

      {/* --- 1. Header & Volunteer CTA Settings --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" /><path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" /></svg>
          {locale === 'lo' ? '1. ຕັ້ງຄ່າຂໍ້ຄວາມ (Page Settings)' : '1. Page Settings'}
        </h3>
        
        <form onSubmit={handleSaveSettings} className="space-y-8">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="font-black text-teal-700 mb-4 text-sm uppercase">
              {locale === 'lo' ? '» ສ່ວນຫົວ (Header Section)' : '» Header Section'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ (ລາວ)' : 'Title (Lao)'} className={inputClass} value={pageSettings.header_title_lo} onChange={(e)=>setPageSettings({...pageSettings, header_title_lo: e.target.value})} required />
              <input type="text" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ (EN)' : 'Title (English)'} className={inputClass} value={pageSettings.header_title_en} onChange={(e)=>setPageSettings({...pageSettings, header_title_en: e.target.value})} required />
              <textarea placeholder={locale === 'lo' ? 'ຄຳອະທິບາຍ (ລາວ)' : 'Description (Lao)'} rows={2} className={`${inputClass} resize-none`} value={pageSettings.header_subtitle_lo} onChange={(e)=>setPageSettings({...pageSettings, header_subtitle_lo: e.target.value})} required></textarea>
              <textarea placeholder={locale === 'lo' ? 'ຄຳອະທິບາຍ (EN)' : 'Description (English)'} rows={2} className={`${inputClass} resize-none`} value={pageSettings.header_subtitle_en} onChange={(e)=>setPageSettings({...pageSettings, header_subtitle_en: e.target.value})} required></textarea>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="font-black text-pink-600 mb-4 text-sm uppercase">
              {locale === 'lo' ? '» ສ່ວນຊັກຊວນອາສາສະໝັກ (Volunteer CTA)' : '» Volunteer Call to Action'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ຊັກຊວນ (ລາວ)' : 'CTA Title (Lao)'} className={inputClass} value={pageSettings.cta_title_lo} onChange={(e)=>setPageSettings({...pageSettings, cta_title_lo: e.target.value})} required />
              <input type="text" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ຊັກຊວນ (EN)' : 'CTA Title (English)'} className={inputClass} value={pageSettings.cta_title_en} onChange={(e)=>setPageSettings({...pageSettings, cta_title_en: e.target.value})} required />
              <textarea placeholder={locale === 'lo' ? 'ຂໍ້ຄວາມ (ລາວ)' : 'Description (Lao)'} rows={2} className={`${inputClass} resize-none`} value={pageSettings.cta_desc_lo} onChange={(e)=>setPageSettings({...pageSettings, cta_desc_lo: e.target.value})} required></textarea>
              <textarea placeholder={locale === 'lo' ? 'ຂໍ້ຄວາມ (EN)' : 'Description (English)'} rows={2} className={`${inputClass} resize-none`} value={pageSettings.cta_desc_en} onChange={(e)=>setPageSettings({...pageSettings, cta_desc_en: e.target.value})} required></textarea>
              <input type="text" placeholder={locale === 'lo' ? 'ປຸ່ມກົດ (ລາວ)' : 'Button Text (Lao)'} className={inputClass} value={pageSettings.cta_btn_lo} onChange={(e)=>setPageSettings({...pageSettings, cta_btn_lo: e.target.value})} required />
              <input type="text" placeholder={locale === 'lo' ? 'ປຸ່ມກົດ (EN)' : 'Button Text (English)'} className={inputClass} value={pageSettings.cta_btn_en} onChange={(e)=>setPageSettings({...pageSettings, cta_btn_en: e.target.value})} required />
            </div>
          </div>

          <button type="submit" disabled={loadingSettings} className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-xl transition-all shadow-md uppercase tracking-widest">
            {loadingSettings 
              ? (locale === 'lo' ? 'ກຳລັງບັນທຶກ...' : 'Saving...') 
              : (locale === 'lo' ? 'ບັນທຶກການຕັ້ງຄ່າ' : 'Save Settings')
            }
          </button>
        </form>
      </div>

      {/* --- 2. Team Member Management Form --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100">
        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>
          {isEditing 
            ? (locale === 'lo' ? 'ແກ້ໄຂຂໍ້ມູນທີມງານ' : 'Edit Team Member') 
            : (locale === 'lo' ? 'ເພີ່ມສະມາຊິກທີມໃໝ່' : 'Add New Team Member')
          }
        </h3>
        
        <form onSubmit={handleSaveMember} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ຊື່-ນາມສະກຸນ (ລາວ)' : 'Full Name (Lao)'}</label>
              <input type="text" className={inputClass} value={formData.name_lo} onChange={(e)=>setFormData({...formData, name_lo: e.target.value})} required />
            </div>
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ຊື່-ນາມສະກຸນ (EN)' : 'Full Name (English)'}</label>
              <input type="text" className={inputClass} value={formData.name_en} onChange={(e)=>setFormData({...formData, name_en: e.target.value})} required />
            </div>
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ຕຳແໜ່ງ (ລາວ)' : 'Position (Lao)'}</label>
              <input type="text" className={inputClass} value={formData.position_lo} onChange={(e)=>setFormData({...formData, position_lo: e.target.value})} required />
            </div>
            <div>
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ຕຳແໜ່ງ (EN)' : 'Position (English)'}</label>
              <input type="text" className={inputClass} value={formData.position_en} onChange={(e)=>setFormData({...formData, position_en: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ລິ້ງຮູບພາບ (Image URL)' : 'Image URL'}</label>
              <input type="url" placeholder="https://..." className={inputClass} value={formData.image_url} onChange={(e)=>setFormData({...formData, image_url: e.target.value})} required />
            </div>
            <div className="md:col-span-1">
              <label className="block text-gray-700 font-black mb-2 text-xs uppercase tracking-wider">{locale === 'lo' ? 'ລຳດັບ (Order)' : 'Order'}</label>
              <input type="number" className={`${inputClass} text-center`} value={formData.order_index} onChange={(e)=>setFormData({...formData, order_index: e.target.value})} required />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button type="submit" disabled={loadingMember} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-xl shadow-md transition-all uppercase">
              {loadingMember 
                ? (locale === 'lo' ? 'ກຳລັງປະມວນຜົນ...' : 'Processing...') 
                : (isEditing 
                    ? (locale === 'lo' ? 'ບັນທຶກການແກ້ໄຂ' : 'Save Changes') 
                    : (locale === 'lo' ? 'ບັນທຶກສະມາຊິກ' : 'Add Member')
                  )
              }
            </button>
            {isEditing && (
              <button type="button" onClick={()=>{setIsEditing(false); setFormData({name_lo:'', name_en:'', position_lo:'', position_en:'', image_url:'', order_index:'0'});}} className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-xl uppercase">
                {locale === 'lo' ? 'ຍົກເລີກ' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- 3. Members List --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" /></svg>
          {locale === 'lo' ? 'ລາຍຊື່ທີມງານທັງໝົດ' : 'All Team Members'}
        </h3>
        
        {members.length === 0 ? (
          <p className="text-gray-400 text-center py-6 font-bold bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            {locale === 'lo' ? 'ຍັງບໍ່ມີສະມາຊິກໃນລະບົບ.' : 'No members found.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-white border border-gray-200 rounded-[2rem] p-5 flex flex-col items-center text-center shadow-sm">
                <img src={member.image_url} alt={locale === 'lo' ? member.name_lo : member.name_en} className="w-full aspect-square object-cover rounded-2xl mb-4 bg-gray-50 border border-gray-100 shadow-inner" />
                <h4 className="font-black text-gray-900 text-lg leading-tight mb-1">{locale === 'lo' ? member.name_lo : member.name_en}</h4>
                <p className="text-pink-500 text-xs font-black uppercase tracking-wider mb-4">{locale === 'lo' ? member.position_lo : member.position_en}</p>
                <div className="flex gap-2 w-full pt-4 border-t border-gray-50">
                  <button onClick={() => handleEdit(member)} className="flex-1 text-teal-600 font-black bg-teal-50 hover:bg-teal-600 hover:text-white py-2 rounded-xl transition-all text-xs uppercase">
                    {locale === 'lo' ? 'ແກ້ໄຂ' : 'Edit'}
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="flex-1 text-pink-500 font-black bg-pink-50 hover:bg-pink-500 hover:text-white py-2 rounded-xl transition-all text-xs uppercase">
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