'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';

// ນຳເຂົ້າທຸກ Tabs ທີ່ເຮົາແຍກໄຟລ໌ໄວ້
import TabHome from '@/components/admin/TabHome';
import TabCampaigns from '@/components/admin/TabCampaigns';
import TabDonations from '@/components/admin/TabDonations';
import TabAbout from '@/components/admin/TabAbout';
import TabHistory from '@/components/admin/TabHistory';
import TabTeam from '@/components/admin/TabTeam';
import TabContact from '@/components/admin/TabContact';
import TabSupporters from '@/components/admin/TabSupporters';
import TabVideos from '@/components/admin/TabVideos';
import TabPolicies from '@/components/admin/TabPolicies';

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

  // Solid Icons Definition
  const Icons = {
    home: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" /><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" /></svg>,
    campaigns: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00-.479 4.024m-18.068 4.253l2.8-.7a8.25 8.25 0 015.58.652l.108.054a9.75 9.75 0 006.725.738l1.838-.46V10.5a.75.75 0 01-.75.75h-.02a9.75 9.75 0 01-6.725-.738l-.108-.054a8.25 8.25 0 00-5.58-.652l-2.8.7V21a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" /></svg>,
    donations: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" /><path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v14.25c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 19.125V4.875zm8.75 4.875c0-1.518 1.232-2.75 2.75-2.75s2.75 1.232 2.75 2.75-1.232 2.75-2.75 2.75-2.75-1.232-2.75-2.75z" clipRule="evenodd" /></svg>,
    about: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v19.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V2.25zM5.25 3v18h13.5V3H5.25zm2.25 3a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75V6zm5.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75V6zm-5.25 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-2.25zm5.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75v-2.25zm-5.25 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-2.25z" clipRule="evenodd" /></svg>,
    history: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>,
    team: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" /><path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 016.576-3.036c.32.491.565 1.042.721 1.629a8.258 8.258 0 00-3.727-2.64z" /><path d="M18.918 14.254a8.287 8.287 0 011.308 5.135 9.687 9.687 0 001.764-.44l.115-.04a.563.563 0 00.373-.487l.01-.121a3.75 3.75 0 00-6.576-3.036c-.32.491-.565 1.042-.721 1.629a8.258 8.258 0 013.727-2.64z" /></svg>,
    contact: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>,
    supporters: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" /></svg>,
    videos: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" /></svg>,
    policies: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.89-.777.89-2.038 0-2.815zM12 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" /></svg>,
    logout: <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01-.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z" clipRule="evenodd" /></svg>
  };

  const menuItems = [
    { id: 'home', icon: Icons.home, label: locale === 'lo' ? 'ຕັ້ງຄ່າໜ້າຫຼັກ' : 'Home Settings' },
    { id: 'campaigns', icon: Icons.campaigns, label: locale === 'lo' ? 'ໂຄງການ' : 'Campaigns' },
    { id: 'donations', icon: Icons.donations, label: locale === 'lo' ? 'ອະນຸມັດຍອດບໍລິຈາກ' : 'Approve Donations' },
    { id: 'about', icon: Icons.about, label: locale === 'lo' ? 'ກ່ຽວກັບພວກເຮົາ' : 'About Us' },
    { id: 'history', icon: Icons.history, label: locale === 'lo' ? 'ປະຫວັດຂອງເຮົາ' : 'Our History' },
    { id: 'team', icon: Icons.team, label: locale === 'lo' ? 'ທີມງານ' : 'Our Team' },
    { id: 'contact', icon: Icons.contact, label: locale === 'lo' ? 'ຕິດຕໍ່ພວກເຮົາ' : 'Contact Us' },
    { id: 'supporters', icon: Icons.supporters, label: locale === 'lo' ? 'ຜູ້ສະໜັບສະໜູນ' : 'Supporters' },
    { id: 'videos', icon: Icons.videos, label: locale === 'lo' ? 'ວິດີໂອ' : 'Videos' },
    { id: 'policies', icon: Icons.policies, label: locale === 'lo' ? 'ນະໂຍບາຍ & ລາຍງານ' : 'Policies & Reports' },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col md:flex-row">
        
        {/* Sidebar: ປັບໃຫ້ກວ້າງຂຶ້ນເລັກນ້ອຍ ແລະ ໃຊ້ສີທີ່ Soft ຂຶ້ນ */}
        <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 z-20 shadow-sm relative">
          <div className="p-8 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-teal-600/30">B</div>
              <div>
                <h1 className="text-xl font-black text-gray-900 leading-none">ADMIN</h1>
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[0.2em]">MANAGEMENT</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm text-left
                  ${activeTab === item.id 
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <span className={activeTab === item.id ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-50">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-pink-500 hover:bg-pink-50 transition-all text-sm uppercase tracking-widest">
              {Icons.logout} {locale === 'lo' ? 'ອອກຈາກລະບົບ' : 'Logout'}
            </button>
          </div>
        </aside>

        {/* Content Area: ເພີ່ມ Padding ແລະ ຈັດລຽງໃຫ້ສົມດຸນ */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen scroll-smooth relative">
          
          {/* Message Toast ແບບ Floating ເດັ້ງລົງມາຈາກດ້ານເທິງ */}
          {message.text && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
               <div className={`px-8 py-4 rounded-2xl font-black shadow-2xl border flex items-center gap-3 ${
                message.type === 'success' ? 'bg-white text-teal-600 border-teal-100' : 'bg-white text-pink-500 border-pink-100'
              }`}>
                {message.type === 'success' 
                  ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                }
                {message.text}
              </div>
            </div>
          )}

          <div className="max-w-5xl mx-auto animate-fade-in-up">
            {/* Render ແຕ່ລະແຖບ */}
            {activeTab === 'home' && <TabHome showMessage={showMessage} />}
            {activeTab === 'campaigns' && <TabCampaigns showMessage={showMessage} />}
            {activeTab === 'donations' && <TabDonations showMessage={showMessage} />}
            {activeTab === 'about' && <TabAbout showMessage={showMessage} />}
            {activeTab === 'history' && <TabHistory showMessage={showMessage} />}
            {activeTab === 'team' && <TabTeam showMessage={showMessage} />}
            {activeTab === 'contact' && <TabContact showMessage={showMessage} />}
            {activeTab === 'supporters' && <TabSupporters showMessage={showMessage} />}
            {activeTab === 'videos' && <TabVideos showMessage={showMessage} />}
            {activeTab === 'policies' && <TabPolicies showMessage={showMessage} />}
          </div>
        </main>

      </div>
    </AdminGuard>
  );
}