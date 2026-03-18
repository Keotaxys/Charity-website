'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function DonateForm() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const prefillCampaignId = searchParams.get('campaignId');

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [pageSettings, setPageSettings] = useState<any>(null); // 💡 ເພີ່ມ State ຮັບຂໍ້ມູນຕັ້ງຄ່າ
  
  const [formData, setFormData] = useState({
    campaign_id: 'general',
    donor_name: '',
    email: '',
    donor_phone: '',
    hideName: false,
    hideAmount: false,
    hideProfile: false,
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true); // 💡 ປ່ຽນເປັນ true ຕອນເລີ່ມ
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 💡 ດຶງຂໍ້ມູນໂຄງການ ແລະ ການຕັ້ງຄ່າໜ້າພ້ອມກັນ
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ດຶງໂຄງການ
        const q = query(collection(db, 'campaigns'), where('status', '==', 'Active'), orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setCampaigns(data);

        if (prefillCampaignId) {
          const found = data.find(c => c.id === prefillCampaignId);
          if (found) setFormData(prev => ({ ...prev, campaign_id: found.id }));
        }

        // ດຶງການຕັ້ງຄ່າໜ້າບໍລິຈາກ
        const docRef = doc(db, 'settings', 'donate_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPageSettings(docSnap.data());
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [prefillCampaignId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setReceiptFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setProfileFile(selectedFile);
      setProfilePreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) {
      setStatus({ type: 'error', text: locale === 'lo' ? 'ກະລຸນາແນບຮູບໃບບິນ/ສະລິບການໂອນເງິນ.' : 'Please upload your transfer receipt.' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: '', text: '' });

    try {
      const storageRef = ref(storage, `slips/${Date.now()}_${receiptFile.name}`);
      await uploadBytes(storageRef, receiptFile);
      const receiptUrl = await getDownloadURL(storageRef);

      let profileUrl = '';
      if (profileFile) {
        const profileRef = ref(storage, `profiles/${Date.now()}_${profileFile.name}`);
        await uploadBytes(profileRef, profileFile);
        profileUrl = await getDownloadURL(profileRef);
      }

      let campTitleLo = 'ກອງທຶນລວມ';
      let campTitleEn = 'General Fund';
      if (formData.campaign_id !== 'general') {
        const selectedCamp = campaigns.find(c => c.id === formData.campaign_id);
        if (selectedCamp) {
          campTitleLo = selectedCamp.title_lo;
          campTitleEn = selectedCamp.title_en;
        }
      }

      await addDoc(collection(db, 'donations'), {
        donor_name: formData.donor_name,
        donor_phone: formData.donor_phone,
        email: formData.email,
        campaign_id: formData.campaign_id,
        campaign_title_lo: campTitleLo,
        campaign_title_en: campTitleEn,
        slip_url: receiptUrl,
        profile_url: profileUrl,
        amount: 0,
        status: 'Pending', 
        hideName: formData.hideName,
        hideAmount: formData.hideAmount,
        hideProfile: formData.hideProfile,
        created_at: serverTimestamp()
      });
      
      setStatus({ type: 'success', text: locale === 'lo' ? 'ຂໍຂອບໃຈ! ພວກເຮົາໄດ້ຮັບແຈ້ງການໂອນເງິນຂອງທ່ານແລ້ວ.' : 'Thank you! We have received your receipt.' });
      setFormData({ campaign_id: 'general', donor_name: '', email: '', donor_phone: '', hideName: false, hideAmount: false, hideProfile: false });
      setReceiptFile(null);
      setPreviewUrl(null);
      setProfileFile(null);
      setProfilePreviewUrl(null);

    } catch (error) {
      console.error("Error submitting donation:", error);
      setStatus({ type: 'error', text: locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດ. ກະລຸນາລອງໃໝ່.' : 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCampaignTitle = formData.campaign_id === 'general' 
    ? (locale === 'lo' ? 'ກອງທຶນລວມ (ນຳໃຊ້ເຂົ້າໃນທຸກໂຄງການ)' : 'General Fund (Use where most needed)')
    : (() => {
        const camp = campaigns.find(c => c.id === formData.campaign_id);
        return camp ? (locale === 'lo' ? camp.title_lo : camp.title_en) : '';
      })();

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-xl text-teal-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>;

  // 💡 ກຳນົດຄ່າ Fallback (ຖ້າ Admin ຍັງບໍ່ໄດ້ຕັ້ງຄ່າ)
  const headerTitle = pageSettings ? (locale === 'lo' ? pageSettings.header_title_lo : pageSettings.header_title_en) : (locale === 'lo' ? 'ຮ່ວມບໍລິຈາກ' : 'MAKE A DONATION');
  const headerSubtitle = pageSettings ? (locale === 'lo' ? pageSettings.header_subtitle_lo : pageSettings.header_subtitle_en) : '';
  const bankName = pageSettings?.bank_name || 'BCEL Bank';
  const accountName = pageSettings?.account_name || 'BEAST LAO FOUNDATION';
  const accountNumber = pageSettings?.account_number || '160-120-00-0000';
  const qrImage = pageSettings?.qr_image_url || 'https://via.placeholder.com/200x200/ffffff/0d9488?text=QR+CODE';
  const paypalLink = pageSettings?.paypal_link || 'https://paypal.me/';
  const paypalDesc = pageSettings ? (locale === 'lo' ? pageSettings.paypal_desc_lo : pageSettings.paypal_desc_en) : '';

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      
      {/* 1. ສ່ວນຫົວ (Header) */}
      <section className="bg-teal-50 py-20 px-6 relative overflow-hidden border-b border-teal-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase text-teal-800">
            {headerTitle}
          </h1>
          <p className="text-lg md:text-xl text-teal-600 font-medium max-w-2xl mx-auto">
            {headerSubtitle}
          </p>
        </div>
      </section>

      {/* 2. ສ່ວນເນື້ອຫາຫຼັກ */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* ຝັ່ງຊ້າຍ: ຊ່ອງທາງການຊຳລະເງິນ (QR & PayPal) */}
          <div className="w-full lg:w-2/5 bg-white p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 relative">
            <div className="mb-10">
              <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-teal-600 flex items-center gap-3">
                <span className="bg-teal-100 text-teal-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                {locale === 'lo' ? 'ໂອນເງິນຜ່ານທະນາຄານ (QR)' : 'BANK TRANSFER (QR)'}
              </h2>
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center">
                <div className="bg-white p-3 rounded-2xl inline-block mb-4 shadow-sm border border-gray-100">
                  <img src={qrImage} alt="QR Code" className="w-40 h-40 object-contain rounded-xl" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-900 font-bold text-lg">{bankName}</p>
                  <p className="text-pink-500 font-black tracking-wide">{accountName}</p>
                  <p className="text-2xl font-black tracking-widest font-mono text-gray-900">{accountNumber}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-10 opacity-60">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 font-bold uppercase text-sm">{locale === 'lo' ? 'ຫຼື (OR)' : 'OR'}</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div>
              <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-[#00457C] flex items-center gap-3">
                <span className="bg-blue-50 text-[#00457C] w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                {locale === 'lo' ? 'ບໍລິຈາກຜ່ານ PayPal' : 'DONATE VIA PAYPAL'}
              </h2>
              <div className="bg-[#00457C]/5 p-6 rounded-3xl border border-[#00457C]/10 text-center">
                <p className="text-gray-600 mb-6 text-sm">{paypalDesc}</p>
                <a 
                  href={paypalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0070BA] hover:bg-[#003087] text-white font-black py-4 px-8 rounded-xl transition-all shadow-md w-full justify-center text-lg"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106a.64.64 0 0 1-.632.532z"/></svg>
                  PayPal.Me
                </a>
              </div>
            </div>
          </div>

          {/* ຝັ່ງຂວາ: ຟອມແຈ້ງໂອນເງິນ & ອັບໂຫຼດສະລິບ */}
          <div className="w-full lg:w-3/5 p-8 md:p-12 bg-white">
            <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
              {locale === 'lo' ? 'ແຈ້ງການໂອນເງິນ' : 'SUBMIT RECEIPT'}
            </h2>
            <p className="text-gray-500 mb-8">
              {locale === 'lo' ? 'ຫຼັງຈາກໂອນເງິນສຳເລັດແລ້ວ ກະລຸນາແນບຮູບໃບບິນເພື່ອໃຫ້ທີມງານອັບເດດຍອດໃຫ້.' : 'After transferring, please upload your receipt so our team can verify.'}
            </p>

            {status.text && (
              <div className={`p-5 rounded-2xl mb-8 font-bold text-sm border ${status.type === 'success' ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-pink-50 text-pink-500 border-pink-200'}`}>
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* ອັບໂຫຼດຮູບໂປຣໄຟລ໌ */}
                <div className="md:col-span-2 flex flex-col items-center justify-center py-4">
                  <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-teal-400 transition-colors cursor-pointer group shadow-sm">
                    {profilePreviewUrl ? (
                      <img src={profilePreviewUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    )}
                    <input type="file" accept="image/*" onChange={handleProfileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                    {locale === 'lo' ? 'ເພີ່ມຮູບໂປຣໄຟລ໌ (ທາງເລືອກ)' : 'ADD PROFILE (OPTIONAL)'}
                  </span>
                </div>

                {/* Custom Dropdown ສຳລັບເລືອກໂຄງການ */}
                <div className="md:col-span-2 relative" ref={dropdownRef}>
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">
                    {locale === 'lo' ? 'ເລືອກໂຄງການ' : 'SELECT CAMPAIGN'}
                  </label>
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full p-4 bg-gray-50 border rounded-xl text-gray-900 flex justify-between items-center cursor-pointer transition-all
                      ${isDropdownOpen ? 'border-teal-600 ring-2 ring-teal-600/20' : 'border-gray-200 hover:border-teal-400'}
                    `}
                  >
                    <span className="font-bold truncate pr-4">{selectedCampaignTitle}</span>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-teal-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden">
                      <div 
                        onClick={() => { setFormData({...formData, campaign_id: 'general'}); setIsDropdownOpen(false); }}
                        className={`p-4 cursor-pointer transition-colors text-sm md:text-base border-b border-gray-50
                          ${formData.campaign_id === 'general' ? 'bg-teal-50 text-teal-700 font-black' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700 font-medium'}
                        `}
                      >
                        {locale === 'lo' ? 'ກອງທຶນລວມ (ນຳໃຊ້ເຂົ້າໃນທຸກໂຄງການ)' : 'General Fund (Use where most needed)'}
                      </div>
                      {campaigns.map(camp => (
                        <div 
                          key={camp.id}
                          onClick={() => { setFormData({...formData, campaign_id: camp.id}); setIsDropdownOpen(false); }}
                          className={`p-4 cursor-pointer transition-colors text-sm md:text-base border-b border-gray-50
                            ${formData.campaign_id === camp.id ? 'bg-teal-50 text-teal-700 font-black' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700 font-medium'}
                          `}
                        >
                          {locale === 'lo' ? camp.title_lo : camp.title_en}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ຊື່ຜູ້ບໍລິຈາກ' : 'FULL NAME'}</label>
                  <input type="text" required name="donor_name" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none transition-all" placeholder={locale === 'lo' ? 'ຊື່ຜູ້ບໍລິຈາກ' : 'John Doe'} value={formData.donor_name} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ເບີໂທລະສັບ' : 'PHONE NUMBER'}</label>
                  <input type="tel" required name="donor_phone" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 outline-none transition-all" placeholder="020 xxxx xxxx" value={formData.donor_phone} onChange={handleInputChange} />
                </div>

                {/* ອັບໂຫຼດຮູບສະລິບ */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">
                    {locale === 'lo' ? 'ແນບຮູບໃບບິນ/ສະລິບການໂອນເງິນ' : 'UPLOAD TRANSFER SLIP / RECEIPT'}
                  </label>
                  <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer
                    ${receiptFile ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-teal-400'}`}>
                    <input 
                      type="file" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    {previewUrl ? (
                      <div className="flex flex-col items-center">
                        <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded-lg mb-2 shadow-sm" />
                        <span className="font-bold text-teal-700 text-sm">{receiptFile?.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center pointer-events-none">
                        <svg className={`w-10 h-10 mb-2 text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <span className="font-bold text-gray-600">
                          {locale === 'lo' ? 'ກົດເພື່ອເລືອກຮູບສະລິບ' : 'Click to select receipt image'}
                        </span>
                        <span className="text-gray-400 text-sm mt-1">{locale === 'lo' ? 'ຮອງຮັບໄຟລ໌ .jpg, .png' : 'Supports .jpg, .png'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ການຕັ້ງຄ່າຄວາມເປັນສ່ວນຕົວ */}
              <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100 mt-6 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" /></svg>
                  {locale === 'lo' ? 'ການຕັ້ງຄ່າຄວາມເປັນສ່ວນຕົວ (Privacy)' : 'PRIVACY SETTINGS'}
                </h3>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-md checked:bg-teal-600 checked:border-teal-600 transition-all cursor-pointer" checked={formData.hideName} onChange={(e) => setFormData({...formData, hideName: e.target.checked})} />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-teal-600 transition-colors">
                    {locale === 'lo' ? 'ບໍ່ປະສົງອອກນາມ (ເຊື່ອງຊື່)' : 'Donate Anonymously (Hide my name)'}
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-md checked:bg-blue-400 checked:border-blue-400 transition-all cursor-pointer" checked={formData.hideProfile} onChange={(e) => setFormData({...formData, hideProfile: e.target.checked})} />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-blue-500 transition-colors">
                    {locale === 'lo' ? 'ບໍ່ສະແດງຮູບໂປຣໄຟລ໌' : 'Hide my profile picture'}
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-md checked:bg-pink-400 checked:border-pink-400 transition-all cursor-pointer" checked={formData.hideAmount} onChange={(e) => setFormData({...formData, hideAmount: e.target.checked})} />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-pink-500 transition-colors">
                    {locale === 'lo' ? 'ບໍ່ເປີດເຜີຍຈຳນວນເງິນບໍລິຈາກ' : 'Hide donation amount publicly'}
                  </span>
                </label>
              </div>

              <button type="submit" disabled={submitting || !receiptFile} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-5 rounded-xl transition-all shadow-md hover:shadow-teal-600/40 uppercase tracking-widest text-lg disabled:bg-gray-400 mt-8">
                {submitting ? (locale === 'lo' ? 'ກຳລັງສົ່ງຂໍ້ມູນ...' : 'SUBMITTING...') : (locale === 'lo' ? 'ແຈ້ງການໂອນເງິນ' : 'SUBMIT RECEIPT')}
              </button>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
}

export default function DonateWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-xl text-teal-600">Loading...</div>}>
      <DonateForm />
    </Suspense>
  );
}