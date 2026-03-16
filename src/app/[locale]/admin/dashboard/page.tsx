'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';

// ນຳເຂົ້າ (Import) Components ທີ່ເຮົາແຍກໄຟລ໌ໄວ້
import TabHome from '@/components/admin/TabHome';
import TabCampaigns from '@/components/admin/TabCampaigns';
import TabVideos from '@/components/admin/TabVideos';
import TabAbout from '@/components/admin/TabAbout'; // 👈 Import TabAbout ເຂົ້າມາແລ້ວ

export default function AdminDashboard() {
  const locale = useLocale();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('home');
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text: string, type: string) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push(`/${locale}/admin/login`);
  };

  const Icons = {
    home: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" /><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" /></svg>,
    campaigns: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00-.479 4.024m-18.068 4.253l2.8-.7a8.25 8.25 0 015.58.652l.108.054a9.75 9.75 0 006.725.738l1.838-.46V10.5a.75.75 0 01-.75.75h-.02a9.75 9.75 0 01-6.725-.738l-.108-.054a8.25 8.25 0 00-5.58-.652l-2.8.7V21a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" /></svg>,
    donations: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" /><path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v14.25c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 19.125V4.875zm8.75 4.875c0-1.518 1.232-2.75 2.75-2.75s2.75 1.232 2.75 2.75-1.232 2.75-2.75 2.75-2.75-1.232-2.75-2.75z" clipRule="evenodd" /></svg>,
    about: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v19.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V2.25zM5.25 3v18h13.5V3H5.25zm2.25 3a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75V6zm5.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75V6zm-5.25 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-2.25zm5.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75v-2.25zm-5.25 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-2.25z" clipRule="evenodd" /></svg>,
    team: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" /><path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 016.576-3.036c.32.491.565 1.042.721 1.629a8.258 8.258 0 00-3.727-2.64z" /><path d="M18.918 14.254a8.287 8.287 0 011.308 5.135 9.687 9.687 0 001.764-.44l.115-.04a.563.563 0 00.373-.487l.01-.121a3.75 3.75 0 00-6.576-3.036c-.32.491-.565 1.042-.721 1.629a8.258 8.258 0 013.727-2.64z" /></svg>,
    contact: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>,
    supporters: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" /></svg>,
    videos: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" /></svg>,
    logout: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z" clipRule="evenodd" /></svg>
  };

  const menuItems = [
    { id: 'home', icon: Icons.home, label: locale === 'lo' ? 'ຕັ້ງຄ່າໜ້າຫຼັກ' : 'Home Settings' },
    { id: 'campaigns', icon: Icons.campaigns, label: locale === 'lo' ? 'ໂຄງການ' : 'Campaigns' },
    { id: 'donations', icon: Icons.donations, label: locale === 'lo' ? 'ອະນຸມັດຍອດບໍລິຈາກ' : 'Approve Donations' },
    { id: 'about', icon: Icons.about, label: locale === 'lo' ? 'ກ່ຽວກັບພວກເຮົາ' : 'About Us' },
    { id: 'team', icon: Icons.team, label: locale === 'lo' ? 'ທີມງານ' : 'Our Team' },
    { id: 'contact', icon: Icons.contact, label: locale === 'lo' ? 'ຕິດຕໍ່ພວກເຮົາ' : 'Contact Us' },
    { id: 'supporters', icon: Icons.supporters, label: locale === 'lo' ? 'ຜູ້ສະໜັບສະໜູນ' : 'Supporters' },
    { id: 'videos', icon: Icons.videos, label: locale === 'lo' ? 'ວິດີໂອ' : 'Videos' },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-black text-teal-600 tracking-tighter uppercase">Admin Panel</h1>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">BEAST.LAO MANAGEMENT</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
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
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-pink-500 hover:bg-pink-50 transition-all text-sm">
              {Icons.logout} {locale === 'lo' ? 'ອອກຈາກລະບົບ' : 'Logout'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
          <div className="max-w-5xl mx-auto">
            
            {message.text && (
              <div className={`p-4 rounded-xl font-bold text-center border mb-8 shadow-sm animate-fade-in ${
                message.type === 'success' ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-pink-50 text-pink-500 border-pink-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* --- ແຖບທີ່ພັດທະນາສຳເລັດແລ້ວ --- */}
            {activeTab === 'home' && <TabHome showMessage={showMessage} />}
            {activeTab === 'campaigns' && <TabCampaigns showMessage={showMessage} />}
            {activeTab === 'videos' && <TabVideos showMessage={showMessage} />}
            {activeTab === 'about' && <TabAbout showMessage={showMessage} />}  {/* 👈 ເອີ້ນໃຊ້ TabAbout ຢູ່ບ່ອນນີ້ */}

            {/* --- ແຖບທີ່ຍັງລໍຖ້າການພັດທະນາ (Placeholder) --- */}
            {['donations', 'team', 'contact', 'supporters'].includes(activeTab) && (
              <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center animate-fade-in-up">
                <div className="text-teal-600 flex justify-center mb-6">
                  <div className="p-6 bg-teal-50 rounded-full">
                    {activeTab === 'donations' && <span className="w-12 h-12 block">{Icons.donations}</span>}
                    {activeTab === 'team' && <span className="w-12 h-12 block">{Icons.team}</span>}
                    {activeTab === 'contact' && <span className="w-12 h-12 block">{Icons.contact}</span>}
                    {activeTab === 'supporters' && <span className="w-12 h-12 block">{Icons.supporters}</span>}
                  </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">
                  {menuItems.find(i => i.id === activeTab)?.label}
                </h2>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                  {locale === 'lo' 
                    ? 'ພາກສ່ວນນີ້ກຳລັງຢູ່ໃນຂັ້ນຕອນການພັດທະນາລະບົບຈັດການຂໍ້ມູນ.' 
                    : 'This section is currently under development.'}
                </p>
                <div className="mt-8">
                  <span className="inline-block px-4 py-2 bg-pink-50 text-pink-500 rounded-full text-xs font-black uppercase tracking-widest border border-pink-100">
                    Coming Soon
                  </span>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </AdminGuard>
  );
}