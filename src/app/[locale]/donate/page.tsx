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
  const [pageSettings, setPageSettings] = useState<any>(null);

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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'campaigns'), where('status', '==', 'Active'), orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setCampaigns(data);

        if (prefillCampaignId) {
          const found = data.find(c => c.id === prefillCampaignId);
          if (found) setFormData(prev => ({ ...prev, campaign_id: found.id }));
        }

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

  const handleDownloadQR = async (imgUrl: string) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BEAST_LAO_QR_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      window.open(imgUrl, '_blank');
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

  const headerTitle = pageSettings ? (locale === 'lo' ? pageSettings.header_title_lo : pageSettings.header_title_en) : (locale === 'lo' ? 'ຮ່ວມບໍລິຈາກ' : 'MAKE A DONATION');
  const headerSubtitle = pageSettings ? (locale === 'lo' ? pageSettings.header_subtitle_lo : pageSettings.header_subtitle_en) : '';
  const bankName = pageSettings?.bank_name || 'BCEL Bank';
  const accountName = pageSettings?.account_name || 'BEAST LAO FOUNDATION';
  const accountNumber = pageSettings?.account_number || '160-120-00-0000';
  const qrImage = pageSettings?.qr_image_url || 'https://via.placeholder.com/400x500/F59E0B/ffffff?text=QR+CODE';
  const paypalLink = pageSettings?.paypal_link || 'https://paypal.me/';
  const paypalDesc = pageSettings ? (locale === 'lo' ? pageSettings.paypal_desc_lo : pageSettings.paypal_desc_en) : '';

  return (
    <div className="bg-white min-h-screen pb-24">

      {/* section header ປ່ຽນໃຫ້ສະອາດຂຶ້ນ */}
      <section className="bg-teal-50 py-20 px-6 border-b border-teal-100 relative overflow-hidden">
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

      {/* ສ່ວນເນື້ອຫາຫຼັກ ປັບໃຫ້ໃຫຍ່ ແລະ ເຕັມຂອບ */}
      <section className="max-w-[1400px] mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">

          {/* ຝັ່ງຊ້າຍ: ຊ່ອງທາງການຊຳລະເງິນ (QR & PayPal) - ປັບໃຫ້ໃຫຍ່ ແລະ ເຕັມຂອບ */}
          <div className="w-full lg:w-[45%] bg-[#EAB308] p-10 md:p-16 relative">
            <div className="mb-12">
              <h2 className="text-3xl font-black mb-8 uppercase tracking-tight text-yellow-950 flex items-center gap-4">
                <span className="bg-yellow-100 text-[#EAB308] w-12 h-12 rounded-full flex items-center justify-center text-lg shadow">1</span>
                {locale === 'lo' ? 'ໂອນເງິນຜ່ານທະນາຄານ (QR)' : 'BANK TRANSFER (QR)'}
              </h2>

              {/* Massive integrated orange block for QR and bank details */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-yellow-200">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <img src="/APB.png" alt="APB" className="h-10 object-contain" />
                    <img src="/LAPNet.png" alt="LAPNet" className="h-10 object-contain" />
                  </div>

                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-yellow-100 overflow-hidden mb-3">
                      <img src="/donor-avatar.png" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-bold text-gray-800 text-lg uppercase tracking-wider">
                      CHITHTIXAI PHOMMASENG MR
                    </p>
                    <p className="font-medium text-gray-600 text-sm">
                      AGRICULTURAL PROMOTION BANK
                    </p>
                  </div>
                </div>

                <div className="flex justify-center mb-10">
                  <div className="w-full max-w-[320px] aspect-square flex items-center justify-center p-3 rounded-2xl bg-white border border-gray-100">
                    <img src={qrImage} alt="QR Code" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <p className="text-gray-900 font-black text-xl tracking-tight">{accountNumber}</p>
                    <p className="text-pink-500 font-bold">| LAK</p>
                  </div>

                  <div className="flex justify-center items-center gap-3">
                    <div className="flex items-center gap-1">
                      <img src="/LAPNet.png" alt="LAPNet" className="h-5 object-contain" />
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-yellow-600 font-bold text-sm">Lao QR</p>
                    </div>
                  </div>
                </div>

                {/* Save QR Code button below the massive orange block */}
                <div className="text-center">
                  <button
                    onClick={() => handleDownloadQR(qrImage)}
                    className="inline-flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 font-bold py-3 px-8 rounded-full transition-all border border-yellow-200 shadow"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    {locale === 'lo' ? 'ບັນທຶກ QR Code' : 'Save QR Code'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-12">
              <div className="flex-1 h-px bg-yellow-100 opacity-60"></div>
              <span className="text-yellow-100 font-bold uppercase text-lg tracking-wider opacity-90">{locale === 'lo' ? 'ຫຼື (OR)' : 'OR'}</span>
              <div className="flex-1 h-px bg-yellow-100 opacity-60"></div>
            </div>

            <div>
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-[#00457C] flex items-center gap-4">
                <span className="bg-blue-50 text-[#00457C] w-12 h-12 rounded-full flex items-center justify-center text-lg shadow">2</span>
                {locale === 'lo' ? 'ບໍລິຈາກຜ່ານ PayPal' : 'DONATE VIA PAYPAL'}
              </h2>
              <div className="bg-[#00457C]/5 p-8 rounded-3xl border border-[#00457C]/10 text-center">
                <p className="text-gray-600 mb-8 text-sm">{paypalDesc}</p>
                <a
                  href={paypalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0070BA] hover:bg-[#003087] text-white font-black py-4 px-10 rounded-xl transition-all shadow-md w-full justify-center text-xl"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106a.64.64 0 0 1-.632.532z" /></svg>
                  PayPal.Me
                </a>
              </div>
            </div>
          </div>

          {/* ຝັ່ງຂວາ: ຟອມແຈ້ງໂອນເງິນ & ອັບໂຫຼດສະລິບ - ປັບໃຫ້ສະອາດຂຶ້ນ */}
          <div className="w-full lg:w-[55%] p-10 md:p-16 bg-white">
            <h2 className="text-4xl font-black text-gray-900 mb-3 uppercase tracking-tight">
              {locale === 'lo' ? 'ແຈ້ງການໂອນເງິນ' : 'SUBMIT RECEIPT'}
            </h2>
            <p className="text-gray-500 mb-10 text-lg">
              {locale === 'lo' ? 'ຫຼັງຈາກໂອນເງິນສຳເລັດແລ້ວ ກະລຸນາແນບຮູບໃບບິນເພື່ອໃຫ້ທີມງານອັບເດດຍອດໃຫ້.' : 'After transferring, please upload your receipt so our team can verify.'}
            </p>

            {status.text && (
              <div className={`p-6 rounded-2xl mb-10 font-bold text-base border ${status.type === 'success' ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-pink-50 text-pink-500 border-pink-200'}`}>
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* ອັບໂຫຼດຮູບໂປຣໄຟລ໌ */}
                <div className="md:col-span-2 flex flex-col items-center justify-center py-5">
                  <div className="relative w-28 h-28 rounded-full border-4 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-teal-400 transition-colors cursor-pointer group shadow-inner">
                    {profilePreviewUrl ? (
                      <img src={profilePreviewUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    )}
                    <input type="file" accept="image/*" onChange={handleProfileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 mt-4 uppercase tracking-widest bg-gray-100 px-4 py-1.5 rounded-full shadow-inner">
                    {locale === 'lo' ? 'ເພີ່ມຮູບໂປຣໄຟລ໌ (ທາງເລືອກ)' : 'ADD PROFILE (OPTIONAL)'}
                  </span>
                </div>

                {/* Custom Dropdown ສຳລັບເລືອກໂຄງການ */}
                <div className="md:col-span-2 relative" ref={dropdownRef}>
                  <label className="block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wider">
                    {locale === 'lo' ? 'ເລືອກໂຄງການ' : 'SELECT CAMPAIGN'}
                  </label>
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full p-5 bg-gray-50 border rounded-xl text-gray-900 flex justify-between items-center cursor-pointer transition-all
                      ${isDropdownOpen ? 'border-teal-600 ring-2 ring-teal-600/20 shadow-inner' : 'border-gray-200 hover:border-teal-400'}
                    `}
                  >
                    <span className="font-bold truncate pr-4 text-lg">{selectedCampaignTitle}</span>
                    <svg className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-teal-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-3 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden">
                      <div
                        onClick={() => { setFormData({ ...formData, campaign_id: 'general' }); setIsDropdownOpen(false); }}
                        className={`p-5 cursor-pointer transition-colors border-b border-gray-50
                          ${formData.campaign_id === 'general' ? 'bg-teal-50 text-teal-700 font-black' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700 font-medium'}
                        `}
                      >
                        {locale === 'lo' ? 'ກອງທຶນລວມ (ນຳໃຊ້ເຂົ້າໃນທຸກໂຄງການ)' : 'General Fund (Use where most needed)'}
                      </div>
                      {campaigns.map(camp => (
                        <div
                          key={camp.id}
                          onClick={() => { setFormData({ ...formData, campaign_id: camp.id }); setIsDropdownOpen(false); }}
                          className={`p-5 cursor-pointer transition-colors border-b border-gray-50
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
                  <label className="block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ຊື່ຜູ້ບໍລິຈາກ' : 'FULL NAME'}</label>
                  <input type="text" required name="donor_name" className="w-full p-5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:shadow-inner outline-none transition-all" placeholder={locale === 'lo' ? 'ຊື່ຜູ້ບໍລິຈາກ' : 'John Doe'} value={formData.donor_name} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wider">{locale === 'lo' ? 'ເບີໂທລະສັບ' : 'PHONE NUMBER'}</label>
                  <input type="tel" required name="donor_phone" className="w-full p-5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:shadow-inner outline-none transition-all" placeholder="020 xxxx xxxx" value={formData.donor_phone} onChange={handleInputChange} />
                </div>

                {/* ອັບໂຫຼດຮູບສະລິບ */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wider">
                    {locale === 'lo' ? 'ແນບຮູບໃບບິນ/ສະລິບການໂອນເງິນ' : 'UPLOAD TRANSFER SLIP / RECEIPT'}
                  </label>
                  <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer shadow-inner
                    ${receiptFile ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-teal-400'}`}>
                    <input
                      type="file" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    {previewUrl ? (
                      <div className="flex flex-col items-center">
                        <img src={previewUrl} alt="Preview" className="h-40 object-contain rounded-lg mb-3 shadow-md" />
                        <span className="font-bold text-teal-700 text-sm">{receiptFile?.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center pointer-events-none">
                        <svg className={`w-12 h-12 mb-3 text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <span className="font-bold text-gray-600 text-lg">
                          {locale === 'lo' ? 'ກົດເພື່ອເລືອກຮູບສະລິບ' : 'Click to select receipt image'}
                        </span>
                        <span className="text-gray-400 text-base mt-2">{locale === 'lo' ? 'ຮອງຮັບໄຟລ໌ .jpg, .png' : 'Supports .jpg, .png'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ການຕັ້ງຄ່າຄວາມເປັນສ່ວນຕົວ - ປັບໃຫ້ສະອາດຂຶ້ນ ແລະ ມີໄອຄອນ */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 mt-10 space-y-5 shadow-inner">
                <h3 className="font-black text-gray-900 text-xl flex items-center gap-3 mb-6 uppercase tracking-tight">
                  <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" /></svg>
                  {locale === 'lo' ? 'ການຕັ້ງຄ່າຄວາມເປັນສ່ວນຕົວ' : 'PRIVACY SETTINGS'}
                </h3>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-7 h-7 border-2 border-gray-300 rounded-md checked:bg-teal-600 checked:border-teal-600 transition-all cursor-pointer shadow-inner" checked={formData.hideName} onChange={(e) => setFormData({ ...formData, hideName: e.target.checked })} />
                    <svg className="absolute w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="flex-1 text-gray-700 font-medium group-hover:text-teal-700 transition-colors">
                    <p className="font-bold text-lg">{locale === 'lo' ? 'ບໍ່ປະສົງອອກນາມ (ເຊື່ອງຊື່)' : 'Donate Anonymously'}</p>
                    <p className="text-sm">{locale === 'lo' ? 'ເຊື່ອງຊື່ຂອງທ່ານຈາກສາທາລະນະ' : 'Hide your name from public view'}</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-7 h-7 border-2 border-gray-300 rounded-md checked:bg-blue-400 checked:border-blue-400 transition-all cursor-pointer shadow-inner" checked={formData.hideProfile} onChange={(e) => setFormData({ ...formData, hideProfile: e.target.checked })} />
                    <svg className="absolute w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="flex-1 text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                    <p className="font-bold text-lg">{locale === 'lo' ? 'ເຊື່ອງຮູບໂປຣໄຟລ໌' : 'Hide profile picture'}</p>
                    <p className="text-sm">{locale === 'lo' ? 'ບໍ່ສະແດງຮູບໂປຣໄຟລ໌ຂອງທ່ານໃນລາຍການຜູ້ບໍລິຈາກ' : 'Hide your profile picture in donor list'}</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-7 h-7 border-2 border-gray-300 rounded-md checked:bg-pink-400 checked:border-pink-400 transition-all cursor-pointer shadow-inner" checked={formData.hideAmount} onChange={(e) => setFormData({ ...formData, hideAmount: e.target.checked })} />
                    <svg className="absolute w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="flex-1 text-gray-700 font-medium group-hover:text-pink-600 transition-colors">
                    <p className="font-bold text-lg">{locale === 'lo' ? 'ເຊື່ອງຈຳນວນເງິນ' : 'Hide donation amount'}</p>
                    <p className="text-sm">{locale === 'lo' ? 'ບໍ່ເປີດເຜີຍຍອດບໍລິຈາກຂອງທ່ານຕໍ່ສາທາລະນະ' : 'Do not publicly disclose your donation amount'}</p>
                  </div>
                </label>
              </div>

              <button type="submit" disabled={submitting || !receiptFile} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-6 rounded-xl transition-all shadow-md hover:shadow-teal-600/40 uppercase tracking-widest text-xl disabled:bg-gray-400 mt-10 shadow">
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