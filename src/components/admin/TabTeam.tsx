'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function TabTeam({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  // 1. State ສຳລັບການຕັ້ງຄ່າໜ້າ Header ແລະ ປຸ່ມ CTA (ອາສາສະໝັກ)
  const [pageSettings, setPageSettings] = useState({
    header_title_lo: 'ທີມງານຂອງພວກເຮົາ', header_title_en: 'OUR TEAM',
    header_subtitle_lo: 'ກຸ່ມຄົນຜູ້ຢູ່ເບື້ອງຫຼັງຂັບເຄື່ອນພາລະກິດ ເພື່ອສ້າງຮອຍຍິ້ມໃຫ້ກັບສັງຄົມ.', 
    header_subtitle_en: 'The people behind our mission, driving forward to bring smiles to society.',
    
    cta_title_lo: 'ມາຮ່ວມເປັນສ່ວນໜຶ່ງກັບພວກເຮົາ', cta_title_en: 'COME JOIN US',
    cta_desc_lo: 'ພວກເຮົາຍິນດີຕ້ອນຮັບທຸກຄົນທີ່ມີໃຈຮັກໃນການຊ່ວຍເຫຼືອສັງຄົມ ເພື່ອມາເປັນອາສາສະໝັກໃນໂຄງການຕໍ່ໄປ.',
    cta_desc_en: 'We welcome everyone with a passion for helping society to become a volunteer in our next projects.',
    cta_btn_lo: 'ສະໝັກເປັນອາສາສະໝັກ', cta_btn_en: 'APPLY AS VOLUNTEER'
  });
  const [loadingSettings, setLoadingSettings] = useState(false);

  // 2. State ສຳລັບການຈັດການສະມາຊິກທີມ
  const [members, setMembers] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name_lo: '', name_en: '', position_lo: '', position_en: '', image_url: '', order_index: '0'
  });
  const [loadingMember, setLoadingMember] = useState(false);

  // ໂຫຼດຂໍ້ມູນເມື່ອເປີດໜ້າ
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const docRef = doc(db, 'settings', 'team_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPageSettings(docSnap.data() as any);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }

    try {
      const q = query(collection(db, 'team_members'), orderBy('order_index', 'asc'));
      const snapshot = await getDocs(q);
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // ບັນທຶກ Page Settings
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

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSettings({ ...pageSettings, [e.target.name]: e.target.value });
  };

  // ບັນທຶກ / ແກ້ໄຂ ສະມາຊິກ
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMember(true);
    try {
      const memberData = {
        ...formData,
        order_index: Number(formData.order_index)
      };

      if (isEditing && editId) {
        await updateDoc(doc(db, 'team_members', editId), memberData);
        showMessage('ແກ້ໄຂຂໍ້ມູນທີມງານສຳເລັດແລ້ວ!', 'success');
      } else {
        await addDoc(collection(db, 'team_members'), {
          ...memberData,
          created_at: new Date()
        });
        showMessage('ເພີ່ມທີມງານໃໝ່ສຳເລັດແລ້ວ!', 'success');
      }
      
      setFormData({ name_lo: '', name_en: '', position_lo: '', position_en: '', image_url: '', order_index: '0' });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກທີມງານ', 'error');
    }
    setLoadingMember(false);
  };

  const handleEditClick = (item: any) => {
    setFormData({
      name_lo: item.name_lo, name_en: item.name_en, 
      position_lo: item.position_lo, position_en: item.position_en, 
      image_url: item.image_url, order_index: item.order_index?.toString() || '0'
    });
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລາຍຊື່ທີມງານນີ້?')) {
      try {
        await deleteDoc(doc(db, 'team_members', id));
        showMessage('ລຶບລາຍຊື່ສຳເລັດແລ້ວ!', 'success');
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
          <svg className="w-8 h-8 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" /><path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 016.576-3.036c.32.491.565 1.042.721 1.629a8.258 8.258 0 00-3.727-2.64z" /><path d="M18.918 14.254a8.287 8.287 0 011.308 5.135 9.687 9.687 0 001.764-.44l.115-.04a.563.563 0 00.373-.487l.01-.121a3.75 3.75 0 00-6.576-3.036c-.32.491-.565 1.042-.721 1.629a8.258 8.258 0 013.727-2.64z" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">ຈັດການ "ທີມງານ" (Our Team)</h2>
          <p className="text-gray-500 text-sm mt-1">ຕັ້ງຄ່າຂໍ້ຄວາມ ແລະ ເພີ່ມລາຍຊື່ຜູ້ບໍລິຫານ/ທີມງານ</p>
        </div>
      </div>

      {/* --- 1. ຕັ້ງຄ່າໜ້າ (Page Settings) --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
          <span className="text-xl">1️⃣</span> ຕັ້ງຄ່າຂໍ້ຄວາມ (Page Settings)
        </h3>
        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="font-bold text-teal-700 mb-4">» ສ່ວນຫົວ (Header)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ (ລາວ)</label>
                <input type="text" name="header_title_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.header_title_lo} onChange={handleSettingsChange} />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ (ອັງກິດ)</label>
                <input type="text" name="header_title_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.header_title_en} onChange={handleSettingsChange} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-2 text-sm">ຄຳອະທິບາຍ (ລາວ)</label>
                <textarea name="header_subtitle_lo" required rows={2} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium resize-none" value={pageSettings.header_subtitle_lo} onChange={handleSettingsChange}></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-2 text-sm">ຄຳອະທິບາຍ (ອັງກິດ)</label>
                <textarea name="header_subtitle_en" required rows={2} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium resize-none" value={pageSettings.header_subtitle_en} onChange={handleSettingsChange}></textarea>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="font-bold text-pink-600 mb-4">» ສ່ວນຊັກຊວນອາສາສະໝັກ (Call to Action)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="cta_title_lo" placeholder="ຫົວຂໍ້ (ລາວ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.cta_title_lo} onChange={handleSettingsChange} required />
              <input type="text" name="cta_title_en" placeholder="ຫົວຂໍ້ (ອັງກິດ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.cta_title_en} onChange={handleSettingsChange} required />
              <textarea name="cta_desc_lo" placeholder="ຂໍ້ຄວາມ (ລາວ)" rows={2} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium resize-none" value={pageSettings.cta_desc_lo} onChange={handleSettingsChange} required></textarea>
              <textarea name="cta_desc_en" placeholder="ຂໍ້ຄວາມ (ອັງກິດ)" rows={2} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium resize-none" value={pageSettings.cta_desc_en} onChange={handleSettingsChange} required></textarea>
              <input type="text" name="cta_btn_lo" placeholder="ຂໍ້ຄວາມປຸ່ມກົດ (ລາວ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.cta_btn_lo} onChange={handleSettingsChange} required />
              <input type="text" name="cta_btn_en" placeholder="ຂໍ້ຄວາມປຸ່ມກົດ (ອັງກິດ)" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none font-medium" value={pageSettings.cta_btn_en} onChange={handleSettingsChange} required />
            </div>
          </div>

          <button type="submit" disabled={loadingSettings} className="bg-gray-900 hover:bg-gray-800 text-white font-black py-4 px-8 rounded-xl transition-all disabled:bg-gray-400">
            {loadingSettings ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການຕັ້ງຄ່າ'}
          </button>
        </form>
      </div>

      {/* --- 2. ຟອມເພີ່ມທີມງານ --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100">
        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
          <span className="text-xl">2️⃣</span> {isEditing ? 'ແກ້ໄຂຂໍ້ມູນທີມງານ' : 'ເພີ່ມທີມງານໃໝ່'}
        </h3>
        <form onSubmit={handleSaveMember} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່-ນາມສະກຸນ (ລາວ)</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" placeholder="ຕົວຢ່າງ: ສົມຊາຍ ພົມມະຈັນ" value={formData.name_lo} onChange={(e) => setFormData({...formData, name_lo: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່-ນາມສະກຸນ (ອັງກິດ)</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" placeholder="Ex: Somchay Phommachan" value={formData.name_en} onChange={(e) => setFormData({...formData, name_en: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຕຳແໜ່ງ (ລາວ)</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" placeholder="ຕົວຢ່າງ: ຜູ້ກໍ່ຕັ້ງ & ຜູ້ອຳນວຍການ" value={formData.position_lo} onChange={(e) => setFormData({...formData, position_lo: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຕຳແໜ່ງ (ອັງກິດ)</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" placeholder="Ex: Founder & Director" value={formData.position_en} onChange={(e) => setFormData({...formData, position_en: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <label className="block text-gray-700 font-bold mb-2 text-sm">ລິ້ງຮູບພາບ (Image URL)</label>
              <input type="url" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" placeholder="https://..." value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
            </div>
            <div className="md:col-span-1">
              <label className="block text-gray-700 font-bold mb-2 text-sm">ລຳດັບການສະແດງຜົນ</label>
              <input type="number" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-bold text-center" placeholder="1, 2, 3..." value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loadingMember} className="flex-1 bg-teal-600 text-white font-black py-4 rounded-xl hover:bg-teal-700 transition-all uppercase tracking-wide">
              {loadingMember ? 'ກຳລັງບັນທຶກ...' : (isEditing ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມທີມງານໃໝ່')}
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setEditId(null); setFormData({name_lo: '', name_en: '', position_lo: '', position_en: '', image_url: '', order_index: '0'}); }} className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200 font-black py-4 rounded-xl transition-all uppercase tracking-wide">
                ຍົກເລີກ
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- 3. ລາຍຊື່ທີມງານ --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-3">ລາຍຊື່ທີມງານທັງໝົດ</h3>
        {members.length === 0 ? (
          <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-xl">ຍັງບໍ່ມີລາຍຊື່ທີມງານໃນລະບົບ.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-white border border-gray-200 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <img src={member.image_url} alt={member.name_lo} className="w-full aspect-square rounded-2xl object-cover mb-4 bg-gray-100" />
                <h4 className="font-black text-gray-900 text-lg mb-1">{member.name_lo}</h4>
                <p className="text-pink-500 text-xs font-bold mb-4 tracking-wide">{member.position_lo}</p>
                <div className="w-full flex gap-2 border-t border-gray-100 pt-4">
                  <button onClick={() => handleEditClick(member)} className="flex-1 text-teal-600 font-bold bg-teal-50 hover:bg-teal-100 py-2 rounded-lg transition-colors text-sm">ແກ້ໄຂ</button>
                  <button onClick={() => handleDeleteClick(member.id)} className="flex-1 text-pink-500 font-bold bg-pink-50 hover:bg-pink-100 py-2 rounded-lg transition-colors text-sm">ລຶບ</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}