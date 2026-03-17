'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function TabVideos({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  // 1. State ສຳລັບ Page Settings & Featured Video
  const [pageSettings, setPageSettings] = useState({
    header_title_lo: 'ວິດີໂອກິດຈະກຳ', header_title_en: 'OUR VIDEOS',
    header_subtitle_lo: 'ຕິດຕາມທຸກຄວາມເຄື່ອນໄຫວ ແລະ ພາລະກິດຂອງພວກເຮົາຜ່ານວິດີໂອ.',
    header_subtitle_en: 'Follow our movements and missions through our video gallery.',
    youtube_channel_url: '', 
    
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

      const q = query(collection(db, 'videos'), orderBy('created_at', 'desc'));
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
    if (confirm('ທ່ານຕ້ອງການລຶບວິດີໂອນີ້ແທ້ບໍ່?')) {
      await deleteDoc(doc(db, 'videos', id));
      showMessage('ລຶບສຳເລັດ!', 'success');
      fetchData();
    }
  };

  // ຟັງຊັນສະກັດເອົາ ID ຂອງ YouTube ຈາກລິ້ງ ເພື່ອດຶງຮູບໜ້າປົກ
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const inputClass = "w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium transition-all";

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* --- 1. ຕັ້ງຄ່າທົ່ວໄປ & Featured Video --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" /></svg>
          </div>
          1. ຕັ້ງຄ່າໜ້າວິດີໂອ & ວິດີໂອເດັ່ນ
        </h2>

        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Header & Channel Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
             <div className="md:col-span-2">
                <label className="block text-pink-500 font-black mb-2 text-xs uppercase tracking-widest">YouTube Channel URL (ປຸ່ມສີບົວ)</label>
                <input type="url" className={inputClass} value={pageSettings.youtube_channel_url} onChange={(e)=>setPageSettings({...pageSettings, youtube_channel_url: e.target.value})} placeholder="https://youtube.com/@beastlao" />
             </div>
             <div>
                <label className="block text-gray-700 font-bold mb-2 text-xs uppercase">ຫົວຂໍ້ໜ້າ (ລາວ)</label>
                <input type="text" placeholder="ຫົວຂໍ້ໜ້າ (ລາວ)" className={inputClass} value={pageSettings.header_title_lo} onChange={(e)=>setPageSettings({...pageSettings, header_title_lo: e.target.value})} />
             </div>
             <div>
                <label className="block text-gray-700 font-bold mb-2 text-xs uppercase">Page Title (EN)</label>
                <input type="text" placeholder="Page Title (EN)" className={inputClass} value={pageSettings.header_title_en} onChange={(e)=>setPageSettings({...pageSettings, header_title_en: e.target.value})} />
             </div>
          </div>

          {/* Featured Video Details */}
          <div className="p-6 bg-teal-50/30 rounded-2xl border border-teal-100 space-y-4">
             <h4 className="font-black text-teal-700 text-sm uppercase">» ວິດີໂອເດັ່ນ (Featured Video - ດ້ານເທິງສຸດ)</h4>
             <div>
                <label className="block text-teal-700 font-bold mb-2 text-xs uppercase">ລິ້ງວິດີໂອ YouTube</label>
                <input type="url" placeholder="https://www.youtube.com/watch?v=..." className={inputClass} value={pageSettings.featured_url} onChange={(e)=>setPageSettings({...pageSettings, featured_url: e.target.value})} />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-teal-700 font-bold mb-2 text-xs uppercase">ຊື່ປ້າຍກຳກັບ (ລາວ)</label>
                   <input type="text" placeholder="ຕົວຢ່າງ: ວິດີໂອລ່າສຸດ" className={inputClass} value={pageSettings.featured_tag_lo} onChange={(e)=>setPageSettings({...pageSettings, featured_tag_lo: e.target.value})} />
                </div>
                <div>
                   <label className="block text-teal-700 font-bold mb-2 text-xs uppercase">Label Tag (EN)</label>
                   <input type="text" placeholder="Example: LATEST VIDEO" className={inputClass} value={pageSettings.featured_tag_en} onChange={(e)=>setPageSettings({...pageSettings, featured_tag_en: e.target.value})} />
                </div>
                <div>
                   <label className="block text-teal-700 font-bold mb-2 text-xs uppercase">ຫົວຂໍ້ວິດີໂອ (ລາວ)</label>
                   <input type="text" placeholder="ຫົວຂໍ້ວິດີໂອ (ລາວ)" className={inputClass} value={pageSettings.featured_title_lo} onChange={(e)=>setPageSettings({...pageSettings, featured_title_lo: e.target.value})} />
                </div>
                <div>
                   <label className="block text-teal-700 font-bold mb-2 text-xs uppercase">Video Title (EN)</label>
                   <input type="text" placeholder="Video Title (EN)" className={inputClass} value={pageSettings.featured_title_en} onChange={(e)=>setPageSettings({...pageSettings, featured_title_en: e.target.value})} />
                </div>
                <div>
                   <label className="block text-teal-700 font-bold mb-2 text-xs uppercase">ຄຳອະທິບາຍ (ລາວ)</label>
                   <textarea placeholder="ຄຳອະທິບາຍ (ລາວ)" rows={2} className={`${inputClass} resize-none`} value={pageSettings.featured_desc_lo} onChange={(e)=>setPageSettings({...pageSettings, featured_desc_lo: e.target.value})}></textarea>
                </div>
                <div>
                   <label className="block text-teal-700 font-bold mb-2 text-xs uppercase">Description (EN)</label>
                   <textarea placeholder="Description (EN)" rows={2} className={`${inputClass} resize-none`} value={pageSettings.featured_desc_en} onChange={(e)=>setPageSettings({...pageSettings, featured_desc_en: e.target.value})}></textarea>
                </div>
             </div>
          </div>

          <button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-xl transition-all shadow-md uppercase tracking-widest w-full md:w-auto">
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການຕັ້ງຄ່າທັງໝົດ'}
          </button>
        </form>
      </div>

      {/* --- 2. ຈັດການລາຍການວິດີໂອທັງໝົດ --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100">
        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </div>
          {isEditing ? 'ແກ້ໄຂວິດີໂອ' : 'ເພີ່ມວິດີໂອໃໝ່ລົງໃນ Grid'}
        </h2>

        <form onSubmit={handleSaveVideo} className="space-y-6">
          <div>
             <label className="block text-gray-700 font-bold mb-2 text-xs uppercase">ລິ້ງວິດີໂອ (YouTube URL)</label>
             <input type="url" placeholder="https://www.youtube.com/watch?v=..." className={inputClass} value={formData.video_url} onChange={(e)=>setFormData({...formData, video_url: e.target.value})} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-gray-700 font-bold mb-2 text-xs uppercase">ຊື່ວິດີໂອ (ລາວ)</label>
               <input type="text" placeholder="ຊື່ວິດີໂອ (ລາວ)" className={inputClass} value={formData.title_lo} onChange={(e)=>setFormData({...formData, title_lo: e.target.value})} required />
            </div>
            <div>
               <label className="block text-gray-700 font-bold mb-2 text-xs uppercase">Video Title (EN)</label>
               <input type="text" placeholder="Video Title (EN)" className={inputClass} value={formData.title_en} onChange={(e)=>setFormData({...formData, title_en: e.target.value})} required />
            </div>
            <div>
               <label className="block text-gray-700 font-bold mb-2 text-xs uppercase">ວັນທີສະແດງ (ຖ້າຍັງບໍ່ມີ API Key)</label>
               <input type="text" placeholder="ຕົວຢ່າງ: 15 Jan 2026" className={inputClass} value={formData.date} onChange={(e)=>setFormData({...formData, date: e.target.value})} />
               <p className="text-xs text-gray-400 mt-1">ຈະຖືກແທນທີ່ອັດຕະໂນມັດເມື່ອເພີ່ມ YouTube API Key</p>
            </div>
            <div>
               <label className="block text-gray-700 font-bold mb-2 text-xs uppercase">ຍອດວິວ (ຖ້າຍັງບໍ່ມີ API Key)</label>
               <input type="text" placeholder="ຕົວຢ່າງ: 12K" className={inputClass} value={formData.views} onChange={(e)=>setFormData({...formData, views: e.target.value})} />
               <p className="text-xs text-gray-400 mt-1">ຈະຖືກແທນທີ່ອັດຕະໂນມັດເມື່ອເພີ່ມ YouTube API Key</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-xl uppercase transition-all shadow-md">
              {loading ? 'ກຳລັງປະມວນຜົນ...' : (isEditing ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມວິດີໂອ')}
            </button>
            {isEditing && (
              <button type="button" onClick={()=>{setIsEditing(false); setEditId(null); setFormData({title_lo:'', title_en:'', video_url:'', date:'', views:''})}} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black py-4 rounded-xl uppercase transition-all">
                ຍົກເລີກ
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- 3. Video List --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-900 mb-6">ລາຍການວິດີໂອທັງໝົດໃນ Grid ({videoList.length})</h3>
        
        {videoList.length === 0 ? (
          <p className="text-center text-gray-400 py-10 border border-dashed border-gray-200 rounded-xl font-bold">ຍັງບໍ່ມີວິດີໂອ</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoList.map((vid) => {
              const ytId = getYoutubeId(vid.video_url);
              const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : 'https://via.placeholder.com/800x450?text=Video';

              return (
                <div key={vid.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                   <div className="aspect-video bg-gray-900 relative">
                      <img src={thumbUrl} alt="thumb" className="w-full h-full object-cover opacity-80" onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`; }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm pl-1"><span className="text-white text-xs">▶</span></div>
                      </div>
                   </div>
                   <div className="p-4 flex-1 flex flex-col">
                      <h4 className="font-bold text-gray-900 line-clamp-2 mb-2 flex-1" title={vid.title_lo}>{vid.title_lo}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-4">{vid.date || '-'} • {vid.views || '0'} VIEWS</p>
                      <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                        <button onClick={() => { setFormData(vid); setIsEditing(true); setEditId(vid.id); window.scrollTo({top:0, behavior:'smooth'}) }} className="flex-1 text-teal-600 font-black text-[10px] uppercase bg-teal-50 hover:bg-teal-100 py-2 rounded-lg transition-colors">ແກ້ໄຂ</button>
                        <button onClick={() => handleDelete(vid.id)} className="flex-1 text-pink-500 font-black text-[10px] uppercase bg-pink-50 hover:bg-pink-100 py-2 rounded-lg transition-colors">ລຶບ</button>
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}