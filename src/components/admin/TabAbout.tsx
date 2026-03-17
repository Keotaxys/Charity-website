'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function TabAbout({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const locale = useLocale(); // 💡 ເອີ້ນໃຊ້ useLocale ເພື່ອກວດສອບພາສາແອັດມິນ

  const [settings, setSettings] = useState({
    // 1. ກ່ຽວກັບພວກເຮົາ (ໜ້າປົກ & ສ່ວນທ້າຍ)
    header_title_lo: 'ກ່ຽວກັບພວກເຮົາ', header_title_en: 'WHO WE ARE',
    header_subtitle_lo: 'ພວກເຮົາສ້າງການປ່ຽນແປງທີ່ຍິ່ງໃຫຍ່ ດ້ວຍການລົງມືເຮັດຕົວຈິງ.', header_subtitle_en: 'We create massive impact through real action.',
    cta_title_lo: 'ຮ່ວມເປັນສ່ວນໜຶ່ງກັບພວກເຮົາ', cta_title_en: 'JOIN OUR MISSION',
    cta_subtitle_lo: 'ບໍ່ວ່າທ່ານຈະເປັນໃຜ ກໍສາມາດສ້າງການປ່ຽນແປງໄດ້.', cta_subtitle_en: 'No matter who you are, you can make a difference.',
    
    // 2. ຈຸດເລີ່ມຕົ້ນຂອງພວກເຮົາ (ປະຫວັດ)
    story_small_lo: 'ຈຸດເລີ່ມຕົ້ນຂອງພວກເຮົາ', story_small_en: 'OUR HUMBLE BEGINNINGS',
    story_main_lo: 'ຈາກຄວາມຕັ້ງໃຈນ້ອຍໆ ສູ່ການຊ່ວຍເຫຼືອທີ່ຍິ່ງໃຫຍ່', story_main_en: 'FROM A SIMPLE IDEA TO MASSIVE IMPACT',
    story_desc1_lo: 'BEAST.LAO ຖືກສ້າງຕັ້ງຂຶ້ນມາຈາກກຸ່ມຄົນທຳມະດາ ທີ່ເຫັນເຖິງບັນຫາຄວາມຫຍຸ້ງຍາກໃນສັງຄົມ ແລະ ບໍ່ຢາກເປັນພຽງແຕ່ຜູ້ເຝົ້າເບິ່ງ. ພວກເຮົາຕັດສິນໃຈລວມຕົວກັນເພື່ອສ້າງແພລດຟອມ ທີ່ເປັນຂົວຕໍ່ລະຫວ່າງ "ຜູ້ໃຫ້" ແລະ "ຜູ້ຮັບ".',
    story_desc1_en: 'BEAST.LAO was founded by a group of ordinary people who saw the struggles in our society and refused to just watch. We decided to build a platform that bridges the gap between those who want to give and those in need.',
    story_desc2_lo: 'ທຸກໆໂຄງການທີ່ພວກເຮົາເຮັດ ແມ່ນອີງໃສ່ຄວາມໂປ່ງໃສ 100%. ພວກເຮົາເຊື່ອວ່າທຸກການບໍລິຈາກ ບໍ່ວ່າຈະໜ້ອຍ ຫຼື ຫຼາຍ ລ້ວນແລ້ວແຕ່ມີພະລັງໃນການປ່ຽນແປງຊີວິດຂອງໃຜບາງຄົນສະເໝີ.',
    story_desc2_en: 'Every project we undertake is built on 100% transparency. We believe that every donation, big or small, has the power to change someone’s life forever.',
    story_image: 'https://images.unsplash.com/photo-1593113589914-07553e6c7800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',

    // 3. ຫຼັກການເຮັດວຽກຂອງພວກເຮົາ (Core Values)
    values_title_lo: 'ຫຼັກການເຮັດວຽກຂອງພວກເຮົາ', values_title_en: 'OUR CORE VALUES',
    v1_title_lo: 'ຄວາມໂປ່ງໃສ', v1_title_en: 'TRANSPARENCY', v1_desc_lo: 'ເງິນທຸກກີບຈະຖືກແຈກແຈງຢ່າງຊັດເຈນ ແລະ ສາມາດກວດສອບໄດ້.', v1_desc_en: 'Every cent is clearly accounted for and publicly verifiable.',
    v2_title_lo: 'ຄວາມເມດຕາ', v2_title_en: 'COMPASSION', v2_desc_lo: 'ພວກເຮົາເຮັດວຽກດ້ວຍຄວາມຮັກ ແລະ ຄວາມເຫັນອົກເຫັນໃຈເພື່ອນມະນຸດ.', v2_desc_en: 'We operate with love and deep empathy for our fellow human beings.',
    v3_title_lo: 'ການລົງມືເຮັດຈິງ', v3_title_en: 'REAL ACTION', v3_desc_lo: 'ບໍ່ພຽງແຕ່ເວົ້າ ແຕ່ພວກເຮົາລົງພື້ນທີ່ ແລະ ແກ້ໄຂບັນຫາຢ່າງຈິງຈັງ.', v3_desc_en: 'We don’t just talk; we go to the field and solve problems directly.',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'about_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setSettings(docSnap.data() as any);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'about_page'), settings, { merge: true });
      showMessage(locale === 'lo' ? 'ບັນທຶກຂໍ້ມູນໜ້າກ່ຽວກັບພວກເຮົາສຳເລັດແລ້ວ!' : 'About Us settings saved successfully!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ' : 'Error saving data', 'error');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
        <div className="text-teal-600 bg-teal-50 p-3 rounded-full">
          <svg className="w-8 h-8 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v19.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V2.25zM5.25 3v18h13.5V3H5.25zm2.25 3a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75V6zm5.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75V6zm-5.25 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-2.25zm5.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75v-2.25zm-5.25 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-2.25z" clipRule="evenodd" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            {locale === 'lo' ? 'ຕັ້ງຄ່າໜ້າ "ກ່ຽວກັບພວກເຮົາ"' : '"About Us" Settings'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {locale === 'lo' ? 'ແກ້ໄຂຂໍ້ມູນທຸກພາກສ່ວນທີ່ສະແດງໃນໜ້າ /about' : 'Edit all content displayed on the /about page'}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSave} className="space-y-10">
        
        {/* =========================================
            1. ໝວດ: ກ່ຽວກັບພວກເຮົາ
        ========================================= */}
        <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            {locale === 'lo' ? '1️⃣ ໝວດ: ກ່ຽວກັບພວກເຮົາ' : '1️⃣ Section: About Us'}
            <span className="text-sm font-medium text-gray-500 ml-2">
              {locale === 'lo' ? '(ໜ້າປົກ ແລະ ສ່ວນຊັກຊວນ)' : '(Hero and CTA)'}
            </span>
          </h3>
          
          {/* ສ່ວນໜ້າປົກ (Hero) */}
          <div className="space-y-4 mb-8">
            <h4 className="font-bold text-teal-700 bg-teal-50 px-3 py-1 inline-block rounded-lg text-sm">
              {locale === 'lo' ? '» ຂໍ້ຄວາມໜ້າປົກ (ດ້ານເທິງສຸດ)' : '» Hero Text (Top Section)'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ໃຫຍ່ (ລາວ)' : 'Main Title (Lao)'}</label>
                <input type="text" name="header_title_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.header_title_lo} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ໃຫຍ່ (ອັງກິດ)' : 'Main Title (English)'}</label>
                <input type="text" name="header_title_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.header_title_en} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຄຳອະທິບາຍ (ລາວ)' : 'Description (Lao)'}</label>
                <input type="text" name="header_subtitle_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.header_subtitle_lo} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຄຳອະທິບາຍ (ອັງກິດ)' : 'Description (English)'}</label>
                <input type="text" name="header_subtitle_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.header_subtitle_en} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* ສ່ວນຊັກຊວນ (CTA) */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h4 className="font-bold text-pink-600 bg-pink-50 px-3 py-1 inline-block rounded-lg text-sm">
              {locale === 'lo' ? '» ຂໍ້ຄວາມຊັກຊວນ (ດ້ານລຸ່ມສຸດ)' : '» Call To Action (Bottom Section)'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ຊັກຊວນ (ລາວ)' : 'CTA Title (Lao)'}</label>
                <input type="text" name="cta_title_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.cta_title_lo} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ຊັກຊວນ (ອັງກິດ)' : 'CTA Title (English)'}</label>
                <input type="text" name="cta_title_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.cta_title_en} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຂໍ້ຄວາມຊັກຊວນ (ລາວ)' : 'CTA Subtitle (Lao)'}</label>
                <input type="text" name="cta_subtitle_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.cta_subtitle_lo} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຂໍ້ຄວາມຊັກຊວນ (ອັງກິດ)' : 'CTA Subtitle (English)'}</label>
                <input type="text" name="cta_subtitle_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.cta_subtitle_en} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            2. ໝວດ: ຈຸດເລີ່ມຕົ້ນຂອງພວກເຮົາ
        ========================================= */}
        <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-pink-400"></div>
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            {locale === 'lo' ? '2️⃣ ໝວດ: ຈຸດເລີ່ມຕົ້ນຂອງພວກເຮົາ' : '2️⃣ Section: Our Beginnings'}
            <span className="text-sm font-medium text-gray-500 ml-2">
              {locale === 'lo' ? '(ເນື້ອຫາປະຫວັດ ແລະ ຮູບພາບ)' : '(Story Content and Image)'}
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ຍ່ອຍ (ລາວ)' : 'Subtitle (Lao)'}</label>
              <input type="text" name="story_small_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 font-medium" value={settings.story_small_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ຍ່ອຍ (ອັງກິດ)' : 'Subtitle (English)'}</label>
              <input type="text" name="story_small_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 font-medium" value={settings.story_small_en} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ໃຫຍ່ (ລາວ)' : 'Main Title (Lao)'}</label>
              <input type="text" name="story_main_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 font-medium" value={settings.story_main_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ໃຫຍ່ (ອັງກິດ)' : 'Main Title (English)'}</label>
              <input type="text" name="story_main_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 font-medium" value={settings.story_main_en} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ເນື້ອຫາວັກທີ 1 (ລາວ)' : 'Paragraph 1 (Lao)'}</label>
              <textarea name="story_desc1_lo" required rows={4} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 font-medium resize-none" value={settings.story_desc1_lo} onChange={handleChange}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ເນື້ອຫາວັກທີ 1 (ອັງກິດ)' : 'Paragraph 1 (English)'}</label>
              <textarea name="story_desc1_en" required rows={4} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 font-medium resize-none" value={settings.story_desc1_en} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ເນື້ອຫາວັກທີ 2 (ລາວ)' : 'Paragraph 2 (Lao)'}</label>
              <textarea name="story_desc2_lo" required rows={4} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 font-medium resize-none" value={settings.story_desc2_lo} onChange={handleChange}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ເນື້ອຫາວັກທີ 2 (ອັງກິດ)' : 'Paragraph 2 (English)'}</label>
              <textarea name="story_desc2_en" required rows={4} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 font-medium resize-none" value={settings.story_desc2_en} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຮູບພາບປະກອບ (Image URL)' : 'Story Image (URL)'}</label>
            <input type="url" name="story_image" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 font-medium" placeholder={locale === 'lo' ? 'ວາງລິ້ງຮູບພາບທີ່ນີ້...' : 'Paste image URL here...'} value={settings.story_image} onChange={handleChange} />
          </div>
        </div>

        {/* =========================================
            3. ໝວດ: ຫຼັກການເຮັດວຽກຂອງພວກເຮົາ
        ========================================= */}
        <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-teal-600"></div>
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            {locale === 'lo' ? '3️⃣ ໝວດ: ຫຼັກການເຮັດວຽກຂອງພວກເຮົາ' : '3️⃣ Section: Our Core Values'}
            <span className="text-sm font-medium text-gray-500 ml-2">
              {locale === 'lo' ? '(3 ກາດ)' : '(3 Cards)'}
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-gray-200 pb-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ພາກສ່ວນນີ້ (ລາວ)' : 'Section Title (Lao)'}</label>
              <input type="text" name="values_title_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.values_title_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ພາກສ່ວນນີ້ (ອັງກິດ)' : 'Section Title (English)'}</label>
              <input type="text" name="values_title_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.values_title_en} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: ຄວາມໂປ່ງໃສ */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="font-black text-gray-900 mb-4 text-lg">{locale === 'lo' ? 'ກາດທີ 1: ຄວາມໂປ່ງໃສ' : 'Card 1: Transparency'}</h4>
              <div className="space-y-4">
                <input type="text" name="v1_title_lo" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ (ລາວ)' : 'Title (Lao)'} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm" value={settings.v1_title_lo} onChange={handleChange} />
                <input type="text" name="v1_title_en" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ (ອັງກິດ)' : 'Title (English)'} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm" value={settings.v1_title_en} onChange={handleChange} />
                <textarea name="v1_desc_lo" placeholder={locale === 'lo' ? 'ລາຍລະອຽດ (ລາວ)' : 'Description (Lao)'} rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm resize-none" value={settings.v1_desc_lo} onChange={handleChange}></textarea>
                <textarea name="v1_desc_en" placeholder={locale === 'lo' ? 'ລາຍລະອຽດ (ອັງກິດ)' : 'Description (English)'} rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm resize-none" value={settings.v1_desc_en} onChange={handleChange}></textarea>
              </div>
            </div>

            {/* Card 2: ຄວາມເມດຕາ */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h4 className="font-black text-gray-900 mb-4 text-lg">{locale === 'lo' ? 'ກາດທີ 2: ຄວາມເມດຕາ' : 'Card 2: Compassion'}</h4>
              <div className="space-y-4">
                <input type="text" name="v2_title_lo" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ (ລາວ)' : 'Title (Lao)'} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm" value={settings.v2_title_lo} onChange={handleChange} />
                <input type="text" name="v2_title_en" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ (ອັງກິດ)' : 'Title (English)'} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm" value={settings.v2_title_en} onChange={handleChange} />
                <textarea name="v2_desc_lo" placeholder={locale === 'lo' ? 'ລາຍລະອຽດ (ລາວ)' : 'Description (Lao)'} rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm resize-none" value={settings.v2_desc_lo} onChange={handleChange}></textarea>
                <textarea name="v2_desc_en" placeholder={locale === 'lo' ? 'ລາຍລະອຽດ (ອັງກິດ)' : 'Description (English)'} rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm resize-none" value={settings.v2_desc_en} onChange={handleChange}></textarea>
              </div>
            </div>

            {/* Card 3: ການລົງມືເຮັດຈິງ */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h4 className="font-black text-gray-900 mb-4 text-lg">{locale === 'lo' ? 'ກາດທີ 3: ການລົງມືເຮັດຈິງ' : 'Card 3: Real Action'}</h4>
              <div className="space-y-4">
                <input type="text" name="v3_title_lo" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ (ລາວ)' : 'Title (Lao)'} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm" value={settings.v3_title_lo} onChange={handleChange} />
                <input type="text" name="v3_title_en" placeholder={locale === 'lo' ? 'ຫົວຂໍ້ (ອັງກິດ)' : 'Title (English)'} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm" value={settings.v3_title_en} onChange={handleChange} />
                <textarea name="v3_desc_lo" placeholder={locale === 'lo' ? 'ລາຍລະອຽດ (ລາວ)' : 'Description (Lao)'} rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm resize-none" value={settings.v3_desc_lo} onChange={handleChange}></textarea>
                <textarea name="v3_desc_en" placeholder={locale === 'lo' ? 'ລາຍລະອຽດ (ອັງກິດ)' : 'Description (English)'} rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium text-sm resize-none" value={settings.v3_desc_en} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-5 rounded-2xl transition-all shadow-lg hover:shadow-teal-600/30 disabled:bg-gray-400 uppercase tracking-widest text-lg">
          {loading 
            ? (locale === 'lo' ? 'ກຳລັງບັນທຶກ...' : 'Saving...') 
            : (locale === 'lo' ? 'ບັນທຶກຂໍ້ມູນທັງໝົດ' : 'Save All Changes')
          }
        </button>
      </form>
    </div>
  );
}