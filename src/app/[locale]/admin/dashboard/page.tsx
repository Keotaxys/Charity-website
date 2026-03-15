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

  // ດຶງຂໍ້ມູນການຕັ້ງຄ່າໜ້າຫຼັກມາສະແດງ
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

  // ຟັງຊັນບັນທຶກວິດີໂອ (ແຖບໜ້າຫຼັກ)
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

  // ຟັງຊັນສ້າງໂຄງການ (ແຖບໂຄງການ)
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

  // ຟັງຊັນອອກຈາກລະບົບ
  const handleLogout = async () => {
    await signOut(auth);
    router.push(`/${locale}/admin/login`);
  };

  // ລາຍການເມນູແຖບ (Tabs)
  const menuItems = [
    { id: 'home', icon: '🏠', label: 'ຕັ້ງຄ່າໜ້າຫຼັກ (Home)' },
    { id: 'campaigns', icon: '🎯', label: 'ໂຄງການ (Campaigns)' },
    { id: 'donations', icon: '💰', label: 'ອະນຸມັດຍອດບໍລິຈາກ' },
    { id: 'about', icon: '🏢', label: 'ກ່ຽວກັບພວກເຮົາ (About)' },
    { id: 'supporters', icon: '🤝', label: 'ຜູ້ສະໜັບສະໜູນ (Supporters)' },
    { id: 'videos', icon: '🎬', label: 'ວິດີໂອ (Videos)' },
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
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-pink-500 hover:bg-pink-50 transition-all text-sm"
            >
              <span>🚪</span> ອອກຈາກລະບົບ (Logout)
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
                <h2 className="text-2xl font-black text-gray-900 mb-2">ຕັ້ງຄ່າໜ້າຫຼັກ (Homepage Settings)</h2>
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
                <h2 className="text-2xl font-black text-gray-900 mb-2">ສ້າງໂຄງການໃໝ່ (Create Campaign)</h2>
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
                <span className="text-6xl mb-4 block">💰</span>
                <h2 className="text-2xl font-black text-gray-900 mb-2">ອະນຸມັດຍອດບໍລິຈາກ</h2>
                <p className="text-gray-500">ລະບົບກວດສອບສະລິບໂອນເງິນ ແລະ ອະນຸມັດຍອດ ເພື່ອສະແດງໃນໜ້າເວັບ.</p>
                <p className="text-pink-500 font-bold mt-4">ກຳລັງພັດທະນາ...</p>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
                <span className="text-6xl mb-4 block">🏢</span>
                <h2 className="text-2xl font-black text-gray-900 mb-2">ຈັດການຂໍ້ມູນອົງກອນ</h2>
                <p className="text-gray-500">ແກ້ໄຂປະຫວັດຄວາມເປັນມາ, ທີມງານ ແລະ ຂໍ້ມູນການຕິດຕໍ່.</p>
                <p className="text-pink-500 font-bold mt-4">ກຳລັງພັດທະນາ...</p>
              </div>
            )}

            {activeTab === 'supporters' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
                <span className="text-6xl mb-4 block">🤝</span>
                <h2 className="text-2xl font-black text-gray-900 mb-2">ຜູ້ສະໜັບສະໜູນ</h2>
                <p className="text-gray-500">ເພີ່ມ, ແກ້ໄຂ, ລຶບ ລາຍຊື່ ແລະ ໂລໂກ້ຂອງຜູ້ສະໜັບສະໜູນຫຼັກ.</p>
                <p className="text-pink-500 font-bold mt-4">ກຳລັງພັດທະນາ...</p>
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
                <span className="text-6xl mb-4 block">🎬</span>
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