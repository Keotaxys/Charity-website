'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';

export default function AdminDashboard() {
  const locale = useLocale();
  const router = useRouter();
  
  // State ສຳລັບຈັດການແຖບ (Tabs) ເລີ່ມຕົ້ນທີ່ແຖບ 'home'
  const [activeTab, setActiveTab] = useState('home');
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // --- States ສຳລັບຂໍ້ມູນຕ່າງໆ ---
  const [videoUrl, setVideoUrl] = useState('');
  const [loadingVideo, setLoadingVideo] = useState(false);

  const [formData, setFormData] = useState({
    title_lo: '', title_en: '', description_lo: '', description_en: '', target_amount: '', cover_image: ''
  });
  const [loadingCampaign, setLoadingCampaign] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setVideoUrl(docSnap.data().hero_video_url || '');
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingVideo(true);
    try {
      await setDoc(doc(db, 'settings', 'homepage'), { hero_video_url: videoUrl }, { merge: true });
      setMessage({ text: 'ບັນທຶກວິດີໂອໜ້າຫຼັກສຳເລັດແລ້ວ!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກວິດີໂອ', type: 'error' });
    }
    setLoadingVideo(false);
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCampaign(true);
    try {
      await addDoc(collection(db, 'campaigns'), {
        ...formData,
        target_amount: Number(formData.target_amount),
        raised_amount: 0,
        status: 'Active',
        created_at: new Date()
      });
      setMessage({ text: 'ສ້າງໂຄງການໃໝ່ສຳເລັດແລ້ວ!', type: 'success' });
      setFormData({ title_lo: '', title_en: '', description_lo: '', description_en: '', target_amount: '', cover_image: '' });
    } catch (error) {
      setMessage({ text: 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງໂຄງການ', type: 'error' });
    }
    setLoadingCampaign(false);
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push(`/${locale}/admin/login`);
  };

  // ໄອຄ້ອນແບບ Solid SVG ເພື່ອຄວາມທັນສະໄໝ
  const Icons = {
    home: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" /><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" /></svg>,
    campaigns: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00-.479 4.024m-18.068 4.253l2.8-.7a8.25 8.25 0 015.58.652l.108.054a9.75 9.75 0 006.725.738l1.838-.46V10.5a.75.75 0 01-.75.75h-.02a9.75 9.75 0 01-6.725-.738l-.108-.054a8.25 8.25 0 00-5.58-.652l-2.8.7V21a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" /></svg>,
    donations: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" /><path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v14.25c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 19.125V4.875zm8.75 4.875c0-1.518 1.232-2.75 2.75-2.75s2.75 1.232 2.75 2.75-1.232 2.75-2.75 2.75-2.75-1.232-2.75-2.75z" clipRule="evenodd" /></svg>,
    about: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v19.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V2.25zM5.25 3v18h13.5V3H5.25zm2.25 3a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75V6zm5.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75V6zm-5.25 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-2.25zm5.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75v-2.25zm-5.25 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-2.25z" clipRule="evenodd" /></svg>,
    supporters: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" /></svg>,
    videos: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" /></svg>,
    logout: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z" clipRule="evenodd" /></svg>
  };

  const menuItems = [
    { id: 'home', icon: Icons.home, label: 'ຕັ້ງຄ່າໜ້າຫຼັກ (Home)' },
    { id: 'campaigns', icon: Icons.campaigns, label: 'ໂຄງການ (Campaigns)' },
    { id: 'donations', icon: Icons.donations, label: 'ອະນຸມັດຍອດບໍລິຈາກ' },
    { id: 'about', icon: Icons.about, label: 'ກ່ຽວກັບພວກເຮົາ (About)' },
    { id: 'supporters', icon: Icons.supporters, label: 'ຜູ້ສະໜັບສະໜູນ (Supporters)' },
    { id: 'videos', icon: Icons.videos, label: 'ວິດີໂອ (Videos)' },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        
        {/* Sidebar ເມນູດ້ານຊ້າຍ */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-black text-teal-600 tracking-tighter uppercase">Admin Panel</h1>
            <p className="text-xs text-gray-400 font-bold mt-1">BEAST.LAO MANAGEMENT</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm text-left ${
                  activeTab === item.id 
                    ? 'bg-teal-50 text-teal-600 border border-teal-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {/* ເອີ້ນໃຊ້ Solid Icon ຢູ່ບ່ອນນີ້ */}
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-pink-500 hover:bg-pink-50 transition-all text-sm"
            >
              {Icons.logout} ອອກຈາກລະບົບ (Logout)
            </button>
          </div>
        </aside>

        {/* ເນື້ອຫາຫຼັກດ້ານຂວາ */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
          
          <div className="max-w-4xl">
            {/* ແຈ້ງເຕືອນລວມ */}
            {message.text && (
              <div className={`p-4 rounded-xl font-bold text-center border mb-6 shadow-sm ${
                message.type === 'success' ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-pink-50 text-pink-500 border-pink-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* --- ແຖບໜ້າຫຼັກ --- */}
            {activeTab === 'home' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-teal-600">{Icons.home}</div>
                  <h2 className="text-2xl font-black text-gray-900">ຕັ້ງຄ່າໜ້າຫຼັກ (Homepage Settings)</h2>
                </div>
                <p className="text-gray-500 mb-6 text-sm">ປ່ຽນລິ້ງວິດີໂອພື້ນຫຼັງຂອງໜ້າທຳອິດ</p>
                <form onSubmit={handleSaveVideo} className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="url" required
                    className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none"
                    placeholder="ວາງລິ້ງວິດີໂອທີ່ນີ້..."
                    value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  <button type="submit" disabled={loadingVideo} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-8 rounded-xl transition-all shadow-md disabled:bg-gray-400 whitespace-nowrap">
                    {loadingVideo ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
                  </button>
                </form>
              </div>
            )}

            {/* --- ແຖບໂຄງການ --- */}
            {activeTab === 'campaigns' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-teal-600">{Icons.campaigns}</div>
                  <h2 className="text-2xl font-black text-gray-900">ສ້າງໂຄງການໃໝ່ (Create Campaign)</h2>
                </div>
                <p className="text-gray-500 mb-6 text-sm">ຂໍ້ມູນນີ້ຈະໄປສະແດງຢູ່ໜ້າ /campaigns ອັດຕະໂນມັດ</p>

                <form onSubmit={handleCreateCampaign} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່ໂຄງການ (ລາວ)</label>
                      <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" value={formData.title_lo} onChange={(e) => setFormData({...formData, title_lo: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm">ຊື່ໂຄງການ (ອັງກິດ)</label>
                      <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm">ລາຍລະອຽດ (ລາວ)</label>
                      <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 resize-none" value={formData.description_lo} onChange={(e) => setFormData({...formData, description_lo: e.target.value})}></textarea>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm">ລາຍລະອຽດ (ອັງກິດ)</label>
                      <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 resize-none" value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})}></textarea>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm">ຍອດເງິນເປົ້າໝາຍ (ກີບ)</label>
                      <input type="number" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" placeholder="ຕົວຢ່າງ: 10000000" value={formData.target_amount} onChange={(e) => setFormData({...formData, target_amount: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm">ລິ້ງຮູບໜ້າປົກ (URL)</label>
                      <input type="url" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600" value={formData.cover_image} onChange={(e) => setFormData({...formData, cover_image: e.target.value})} />
                    </div>
                  </div>
                  <button type="submit" disabled={loadingCampaign} className="w-full bg-teal-600 text-white font-black py-4 rounded-xl hover:bg-teal-700 transition-all shadow-md uppercase tracking-wide disabled:bg-gray-400">
                    {loadingCampaign ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ ແລະ ເຜີຍແຜ່'}
                  </button>
                </form>
              </div>
            )}

            {/* --- ແຖບອື່ນໆ ທີ່ກຳລັງຈະພັດທະນາ --- */}
            {activeTab === 'donations' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
                <div className="text-teal-600 flex justify-center mb-4"><span className="w-16 h-16">{Icons.donations}</span></div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">ອະນຸມັດຍອດບໍລິຈາກ</h2>
                <p className="text-gray-500">ລະບົບກວດສອບສະລິບໂອນເງິນ ແລະ ອະນຸມັດຍອດ ເພື່ອສະແດງໃນໜ້າເວັບ.</p>
                <p className="text-pink-500 font-bold mt-4">ກຳລັງພັດທະນາ...</p>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
                <div className="text-teal-600 flex justify-center mb-4"><span className="w-16 h-16">{Icons.about}</span></div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">ຈັດການຂໍ້ມູນອົງກອນ</h2>
                <p className="text-gray-500">ແກ້ໄຂປະຫວັດຄວາມເປັນມາ, ທີມງານ ແລະ ຂໍ້ມູນການຕິດຕໍ່.</p>
                <p className="text-pink-500 font-bold mt-4">ກຳລັງພັດທະນາ...</p>
              </div>
            )}

            {activeTab === 'supporters' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
                <div className="text-teal-600 flex justify-center mb-4"><span className="w-16 h-16">{Icons.supporters}</span></div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">ຜູ້ສະໜັບສະໜູນ</h2>
                <p className="text-gray-500">ເພີ່ມ, ແກ້ໄຂ, ລຶບ ລາຍຊື່ ແລະ ໂລໂກ້ຂອງຜູ້ສະໜັບສະໜູນຫຼັກ.</p>
                <p className="text-pink-500 font-bold mt-4">ກຳລັງພັດທະນາ...</p>
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
                <div className="text-teal-600 flex justify-center mb-4"><span className="w-16 h-16">{Icons.videos}</span></div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">ຈັດການວິດີໂອ</h2>
                <p className="text-gray-500">ເພີ່ມລິ້ງ YouTube ເພື່ອສະແດງໃນໜ້າລວມວິດີໂອຜົນງານ.</p>
                <p className="text-pink-500 font-bold mt-4">ກຳລັງພັດທະນາ...</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </AdminGuard>
  );
}