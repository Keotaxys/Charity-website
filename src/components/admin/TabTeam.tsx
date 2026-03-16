'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function TabTeam({ showMessage }: { showMessage: (text: string, type: string) => void }) {
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
      showMessage('ບັນທຶກການຕັ້ງຄ່າໜ້າທີມງານສຳເລັດແລ້ວ!', 'success');
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ', 'error');
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
        showMessage('ແກ້ໄຂຂໍ້ມູນທີມງານສຳເລັດ!', 'success');
      } else {
        await addDoc(collection(db, 'team_members'), { ...data, created_at: new Date() });
        showMessage('ເພີ່ມທີມງານໃໝ່ສຳເລັດ!', 'success');
      }
      setFormData({ name_lo: '', name_en: '', position_lo: '', position_en: '', image_url: '', order_index: '0' });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດ', 'error');
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
    if (confirm('ລຶບລາຍຊື່ທີມງານນີ້?')) {
      await deleteDoc(doc(db, 'team_members', id));
      showMessage('ລຶບສຳເລັດ!', 'success');
      fetchData();
    }
  };

  const inputClass = "w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all";

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* --- 1. Header & Volunteer CTA Settings --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" /><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" /></svg>
          1. ຕັ້ງຄ່າຂໍ້ຄວາມ (Page Settings)
        </h2>
        
        <form onSubmit={handleSaveSettings} className="space-y-8">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="font-black text-teal-700 mb-4 text-sm uppercase">» ສ່ວນຫົວ (Header Section)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="ຫົວຂໍ້ (ລາວ)" className={inputClass} value={pageSettings.header_title_lo} onChange={(e)=>setPageSettings({...pageSettings, header_title_lo: e.target.value})} required />
              <input type="text" placeholder="Header Title (EN)" className={inputClass} value={pageSettings.header_title_en} onChange={(e)=>setPageSettings({...pageSettings, header_title_en: e.target.value})} required />
              <textarea placeholder="ຄຳອະທິບາຍ (ລາວ)" rows={2} className={`${inputClass} resize-none`} value={pageSettings.header_subtitle_lo} onChange={(e)=>setPageSettings({...pageSettings, header_subtitle_lo: e.target.value})} required></textarea>
              <textarea placeholder="Description (EN)" rows={2} className={`${inputClass} resize-none`} value={pageSettings.header_subtitle_en} onChange={(e)=>setPageSettings({...pageSettings, header_subtitle_en: e.target.value})} required></textarea>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="font-black text-pink-600 mb-4 text-sm uppercase">» ສ່ວນຊັກຊວນອາສາສະໝັກ (Volunteer CTA)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="ຫົວຂໍ້ຊັກຊວນ (ລາວ)" className={inputClass} value={pageSettings.cta_title_lo} onChange={(e)=>setPageSettings({...pageSettings, cta_title_lo: e.target.value})} required />
              <input type="text" placeholder="CTA Title (EN)" className={inputClass} value={pageSettings.cta_title_en} onChange={(e)=>setPageSettings({...pageSettings, cta_title_en: e.target.value})} required />
              <textarea placeholder="ຂໍ້ຄວາມ (ລາວ)" rows={2} className={`${inputClass} resize-none`} value={pageSettings.cta_desc_lo} onChange={(e)=>setPageSettings({...pageSettings, cta_desc_lo: e.target.value})} required></textarea>
              <textarea placeholder="CTA Text (EN)" rows={2} className={`${inputClass} resize-none`} value={pageSettings.cta_desc_en} onChange={(e)=>setPageSettings({...pageSettings, cta_desc_en: e.target.value})} required></textarea>
              <input type="text" placeholder="ປຸ່ມກົດ (ລາວ)" className={inputClass} value={pageSettings.cta_btn_lo} onChange={(e)=>setPageSettings({...pageSettings, cta_btn_lo: e.target.value})} required />
              <input type="text" placeholder="Button Text (EN)" className={inputClass} value={pageSettings.cta_btn_en} onChange={(e)=>setPageSettings({...pageSettings, cta_btn_en: e.target.value})} required />
            </div>
          </div>

          <button type="submit" disabled={loadingSettings} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-xl transition-all shadow-md uppercase tracking-widest">
            {loadingSettings ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການຕັ້ງຄ່າ'}
          </button>
        </form>
      </div>

      {/* --- 2. Team Member Management Form --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100">
        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" /></svg>
          {isEditing ? 'ແກ້ໄຂຂໍ້ມູນທີມງານ' : 'ເພີ່ມສະມາຊິກທີມໃໝ່'}
        </h2>
        
        <form onSubmit={handleSaveMember} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="ຊື່-ນາມສະກຸນ (ລາວ)" className={inputClass} value={formData.name_lo} onChange={(e)=>setFormData({...formData, name_lo: e.target.value})} required />
            <input type="text" placeholder="Full Name (EN)" className={inputClass} value={formData.name_en} onChange={(e)=>setFormData({...formData, name_en: e.target.value})} required />
            <input type="text" placeholder="ຕຳແໜ່ງ (ລາວ)" className={inputClass} value={formData.position_lo} onChange={(e)=>setFormData({...formData, position_lo: e.target.value})} required />
            <input type="text" placeholder="Position (EN)" className={inputClass} value={formData.position_en} onChange={(e)=>setFormData({...formData, position_en: e.target.value})} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <input type="url" placeholder="Link ຮູບພາບ (URL)" className={inputClass} value={formData.image_url} onChange={(e)=>setFormData({...formData, image_url: e.target.value})} required />
            </div>
            <div className="md:col-span-1">
              <input type="number" placeholder="ລຳດັບ" className={`${inputClass} text-center`} value={formData.order_index} onChange={(e)=>setFormData({...formData, order_index: e.target.value})} required />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button type="submit" disabled={loadingMember} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-xl shadow-md transition-all uppercase">
              {loadingMember ? 'ກຳລັງປະມວນຜົນ...' : 'ບັນທຶກສະມາຊິກ'}
            </button>
            {isEditing && (
              <button type="button" onClick={()=>{setIsEditing(false); setFormData({name_lo:'', name_en:'', position_lo:'', position_en:'', image_url:'', order_index:'0'});}} className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-xl uppercase">ຍົກເລີກ</button>
            )}
          </div>
        </form>
      </div>

      {/* --- 3. Members List --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6">ລາຍຊື່ທີມງານທັງໝົດ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-[2rem] p-5 flex flex-col items-center text-center shadow-sm">
              <img src={member.image_url} alt={member.name_lo} className="w-full aspect-square object-cover rounded-2xl mb-4 bg-gray-50 border border-gray-100 shadow-inner" />
              <h4 className="font-black text-gray-900 text-lg leading-tight mb-1">{member.name_lo}</h4>
              <p className="text-pink-500 text-xs font-black uppercase tracking-wider mb-4">{member.position_lo}</p>
              <div className="flex gap-2 w-full pt-4 border-t border-gray-50">
                <button onClick={() => handleEdit(member)} className="flex-1 text-teal-600 font-black bg-teal-50 hover:bg-teal-600 hover:text-white py-2 rounded-xl transition-all text-xs">ແກ້ໄຂ</button>
                <button onClick={() => handleDelete(member.id)} className="flex-1 text-pink-500 font-black bg-pink-50 hover:bg-pink-500 hover:text-white py-2 rounded-xl transition-all text-xs">ລຶບ</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}