'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function TabVideos({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  // 1. State ສຳລັບ Page Settings & Featured Video (ຮູບທີ 5 & 6)
  const [pageSettings, setPageSettings] = useState({
    header_title_lo: 'ວິດີໂອກິດຈະກຳ', header_title_en: 'OUR VIDEOS',
    header_subtitle_lo: 'ຕິດຕາມທຸກຄວາມເຄື່ອນໄຫວ ແລະ ພາລະກິດຂອງພວກເຮົາຜ່ານວິດີໂອ.',
    header_subtitle_en: 'Follow our movements and missions through our video gallery.',
    youtube_channel_url: '', // ລິ້ງຊ່ອງ YouTube (ປຸ່ມສີບົວ)
    
    // ວິດີໂອເດັ່ນ (Featured)
    featured_url: '',
    featured_tag_lo: 'ວິດີໂອລ້າສຸດ', featured_tag_en: 'LATEST VIDEO',
    featured_title_lo: '', featured_title_en: '',
    featured_desc_lo: '', featured_desc_en: ''
  });

  // 2. State ສຳລັບລາຍການວິດີໂອທັງໝົດ
  const [videoList, setVideoList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title_lo: '', title_en: '', video_url: '', date: '', views: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const docRef = doc(db, 'settings', 'videos_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPageSettings(docSnap.data() as any);

      const q = query(collection(db, 'videos'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      setVideoList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'videos_page'), pageSettings, { merge: true });
      showMessage('ບັນທຶກການຕັ້ງຄ່າໜ້າວິດີໂອສຳເລັດ!', 'success');
    } catch (error) { showMessage('ເກີດຂໍ້ຜິດພາດ', 'error'); }
    setLoading(false);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && editId) {
        await updateDoc(doc(db, 'videos', editId), formData);
        showMessage('ແກ້ໄຂວິດີໂອສຳເລັດ!', 'success');
      } else {
        await addDoc(collection(db, 'videos'), { ...formData, created_at: new Date() });
        showMessage('ເພີ່ມວິດີໂອໃໝ່ສຳເລັດ!', 'success');
      }
      setFormData({ title_lo: '', title_en: '', video_url: '', date: '', views: '' });
      setIsEditing(false); setEditId(null);
      fetchData();
    } catch (error) { showMessage('ເກີດຂໍ້ຜິດພາດ', 'error'); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('ລຶບວິດີໂອນີ້?')) {
      await deleteDoc(doc(db, 'videos', id));
      showMessage('ລຶບສຳເລັດ!', 'success');
      fetchData();
    }
  };

  const inputClass = "w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all";

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* --- 1. ຕັ້ງຄ່າທົ່ວໄປ & Featured Video --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" /></svg>
          1. ຕັ້ງຄ່າໜ້າວິດີໂອ & ວິດີໂອເດັ່ນ
        </h2>

        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Header & Channel Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
             <div className="md:col-span-2">
                <label className="block text-pink-500 font-black mb-2 text-xs uppercase tracking-widest">YouTube Channel URL (ປຸ່ມສີບົວ)</label>
                <input type="url" className={inputClass} value={pageSettings.youtube_channel_url} onChange={(e)=>setPageSettings({...pageSettings, youtube_channel_url: e.target.value})} placeholder="https://youtube.com/@beastlao" />
             </div>
             <input type="text" placeholder="ຫົວຂໍ້ໜ້າ (ລາວ)" className={inputClass} value={pageSettings.header_title_lo} onChange={(e)=>setPageSettings({...pageSettings, header_title_lo: e.target.value})} />
             <input type="text" placeholder="Page Title (EN)" className={inputClass} value={pageSettings.header_title_en} onChange={(e)=>setPageSettings({...pageSettings, header_title_en: e.target.value})} />
          </div>

          {/* Featured Video Details */}
          <div className="p-6 bg-teal-50/30 rounded-2xl border border-teal-100 space-y-4">
             <h4 className="font-black text-teal-700 text-sm uppercase">» ວິດີໂອເດັ່ນ (Featured Video - ດ້ານເທິງສຸດ)</h4>
             <input type="url" placeholder="ລິ້ງວິດີໂອ YouTube" className={inputClass} value={pageSettings.featured_url} onChange={(e)=>setPageSettings({...pageSettings, featured_url: e.target.value})} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="ຫົວຂໍ້ວິດີໂອ (ລາວ)" className={inputClass} value={pageSettings.featured_title_lo} onChange={(e)=>setPageSettings({...pageSettings, featured_title_lo: e.target.value})} />
                <input type="text" placeholder="Video Title (EN)" className={inputClass} value={pageSettings.featured_title_en} onChange={(e)=>setPageSettings({...pageSettings, featured_title_en: e.target.value})} />
                <textarea placeholder="ຄຳອະທິບາຍ (ລາວ)" rows={2} className={`${inputClass} resize-none`} value={pageSettings.featured_desc_lo} onChange={(e)=>setPageSettings({...pageSettings, featured_desc_lo: e.target.value})}></textarea>
                <textarea placeholder="Description (EN)" rows={2} className={`${inputClass} resize-none`} value={pageSettings.featured_desc_en} onChange={(e)=>setPageSettings({...pageSettings, featured_desc_en: e.target.value})}></textarea>
             </div>
          </div>

          <button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-xl transition-all shadow-md uppercase tracking-widest">
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການຕັ້ງຄ່າທັງໝົດ'}
          </button>
        </form>
      </div>

      {/* --- 2. ຈັດການລາຍການວິດີໂອທັງໝົດ --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100">
        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 4.5A2.25 2.25 0 014.5 2.25h15a2.25 2.25 0 012.25 2.25v15a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25v-15zm3 10.5V6a.75.75 0 01.75-.75h7.5a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0v-8.25H6.75v7.5a.75.75 0 01-1.5 0z" clipRule="evenodd" /></svg>
          {isEditing ? 'ແກ້ໄຂວິດີໂອ' : 'ເພີ່ມວິດີໂອໃໝ່'}
        </h2>

        <form onSubmit={handleSaveVideo} className="space-y-6">
          <input type="url" placeholder="ລິ້ງວິດີໂອ YouTube" className={inputClass} value={formData.video_url} onChange={(e)=>setFormData({...formData, video_url: e.target.value})} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="ຊື່ວິດີໂອ (ລາວ)" className={inputClass} value={formData.title_lo} onChange={(e)=>setFormData({...formData, title_lo: e.target.value})} required />
            <input type="text" placeholder="Video Title (EN)" className={inputClass} value={formData.title_en} onChange={(e)=>setFormData({...formData, title_en: e.target.value})} required />
            <input type="text" placeholder="ວັນທີສະແດງ (ຕົວຢ່າງ: 15 Jan 2026)" className={inputClass} value={formData.date} onChange={(e)=>setFormData({...formData, date: e.target.value})} required />
            <input type="text" placeholder="ຍອດວິວ (ຕົວຢ່າງ: 12K)" className={inputClass} value={formData.views} onChange={(e)=>setFormData({...formData, views: e.target.value})} required />
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="flex-1 bg-teal-600 text-white font-black py-4 rounded-xl uppercase transition-all shadow-md">
              {loading ? 'ກຳລັງປະມວນຜົນ...' : (isEditing ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມວິດີໂອເຂົ້າ Grid')}
            </button>
            {isEditing && <button type="button" onClick={()=>{setIsEditing(false); setFormData({title_lo:'', title_en:'', video_url:'', date:'', views:''})}} className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-xl">ຍົກເລີກ</button>}
          </div>
        </form>
      </div>

      {/* --- 3. Video List --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6">ລາຍການວິດີໂອທັງໝົດໃນ Grid</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoList.map((vid) => (
            <div key={vid.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
               <div className="aspect-video bg-gray-900 relative">
                  <img src={`https://img.youtube.com/vi/${vid.video_url.split('v=')[1]?.split('&')[0]}/0.jpg`} alt="thumb" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"><span className="text-white text-xs">▶</span></div>
                  </div>
               </div>
               <div className="p-4">
                  <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">{vid.title_lo}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{vid.date} • {vid.views} VIEWS</p>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <button onClick={() => { setFormData(vid); setIsEditing(true); setEditId(vid.id); window.scrollTo({top:0, behavior:'smooth'}) }} className="flex-1 text-teal-600 font-black text-[10px] uppercase bg-teal-50 py-2 rounded-lg">ແກ້ໄຂ</button>
                    <button onClick={() => handleDelete(vid.id)} className="flex-1 text-pink-500 font-black text-[10px] uppercase bg-pink-50 py-2 rounded-lg">ລຶບ</button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}