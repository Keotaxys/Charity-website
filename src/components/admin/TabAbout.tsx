'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function TabAbout({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  // ກຽມ State ໃຫ້ກົງກັບທຸກພາກສ່ວນຂອງໜ້າບ້ານ
  const [settings, setSettings] = useState({
    // 1. ສ່ວນຫົວ (Header)
    header_title_lo: 'ກ່ຽວກັບພວກເຮົາ', header_title_en: 'WHO WE ARE',
    header_subtitle_lo: 'ພວກເຮົາສ້າງການປ່ຽນແປງທີ່ຍິ່ງໃຫຍ່ ດ້ວຍການລົງມືເຮັດຕົວຈິງ.', header_subtitle_en: 'We create massive impact through real action.',
    
    // 2. ສ່ວນເລົ່າປະຫວັດ (Our Story)
    story_small_lo: 'ຈຸດເລີ່ມຕົ້ນຂອງພວກເຮົາ', story_small_en: 'OUR HUMBLE BEGINNINGS',
    story_main_lo: 'ຈາກຄວາມຕັ້ງໃຈນ້ອຍໆ ສູ່ການຊ່ວຍເຫຼືອທີ່ຍິ່ງໃຫຍ່', story_main_en: 'FROM A SIMPLE IDEA TO MASSIVE IMPACT',
    story_desc1_lo: 'BEAST.LAO ຖືກສ້າງຕັ້ງຂຶ້ນມາຈາກກຸ່ມຄົນທຳມະດາ ທີ່ເຫັນເຖິງບັນຫາຄວາມຫຍຸ້ງຍາກໃນສັງຄົມ ແລະ ບໍ່ຢາກເປັນພຽງແຕ່ຜູ້ເຝົ້າເບິ່ງ. ພວກເຮົາຕັດສິນໃຈລວມຕົວກັນເພື່ອສ້າງແພລດຟອມ ທີ່ເປັນຂົວຕໍ່ລະຫວ່າງ "ຜູ້ໃຫ້" ແລະ "ຜູ້ຮັບ".',
    story_desc1_en: 'BEAST.LAO was founded by a group of ordinary people who saw the struggles in our society and refused to just watch. We decided to build a platform that bridges the gap between those who want to give and those in need.',
    story_desc2_lo: 'ທຸກໆໂຄງການທີ່ພວກເຮົາເຮັດ ແມ່ນອີງໃສ່ຄວາມໂປ່ງໃສ 100%. ພວກເຮົາເຊື່ອວ່າທຸກການບໍລິຈາກ ບໍ່ວ່າຈະໜ້ອຍ ຫຼື ຫຼາຍ ລ້ວນແລ້ວແຕ່ມີພະລັງໃນການປ່ຽນແປງຊີວິດຂອງໃຜບາງຄົນສະເໝີ.',
    story_desc2_en: 'Every project we undertake is built on 100% transparency. We believe that every donation, big or small, has the power to change someone’s life forever.',
    story_image: 'https://images.unsplash.com/photo-1593113589914-07553e6c7800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',

    // 3. ຄ່ານິຍົມຫຼັກ (Core Values)
    values_title_lo: 'ຫຼັກການເຮັດວຽກຂອງພວກເຮົາ', values_title_en: 'OUR CORE VALUES',
    v1_title_lo: 'ຄວາມໂປ່ງໃສ', v1_title_en: 'TRANSPARENCY', v1_desc_lo: 'ເງິນທຸກກີບຈະຖືກແຈກແຈງຢ່າງຊັດເຈນ ແລະ ສາມາດກວດສອບໄດ້.', v1_desc_en: 'Every cent is clearly accounted for and publicly verifiable.',
    v2_title_lo: 'ຄວາມເມດຕາ', v2_title_en: 'COMPASSION', v2_desc_lo: 'ພວກເຮົາເຮັດວຽກດ້ວຍຄວາມຮັກ ແລະ ຄວາມເຫັນອົກເຫັນໃຈເພື່ອນມະນຸດ.', v2_desc_en: 'We operate with love and deep empathy for our fellow human beings.',
    v3_title_lo: 'ການລົງມືເຮັດຈິງ', v3_title_en: 'REAL ACTION', v3_desc_lo: 'ບໍ່ພຽງແຕ່ເວົ້າ ແຕ່ພວກເຮົາລົງພື້ນທີ່ ແລະ ແກ້ໄຂບັນຫາຢ່າງຈິງຈັງ.', v3_desc_en: 'We don’t just talk; we go to the field and solve problems directly.',

    // 4. ສ່ວນ Call to Action (CTA)
    cta_title_lo: 'ຮ່ວມເປັນສ່ວນໜຶ່ງກັບພວກເຮົາ', cta_title_en: 'JOIN OUR MISSION',
    cta_subtitle_lo: 'ບໍ່ວ່າທ່ານຈະເປັນໃຜ ກໍສາມາດສ້າງການປ່ຽນແປງໄດ້.', cta_subtitle_en: 'No matter who you are, you can make a difference.'
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
      showMessage('ບັນທຶກຂໍ້ມູນໜ້າກ່ຽວກັບພວກເຮົາສຳເລັດແລ້ວ!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ', 'error');
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
          <h2 className="text-2xl font-black text-gray-900">ຕັ້ງຄ່າໜ້າ "ກ່ຽວກັບພວກເຮົາ" (About Page)</h2>
          <p className="text-gray-500 text-sm mt-1">ແກ້ໄຂຂໍ້ຄວາມທຸກພາກສ່ວນໃນໜ້າ /about</p>
        </div>
      </div>
      
      <form onSubmit={handleSave} className="space-y-10">
        
        {/* --- 1. ສ່ວນຫົວ (Header) --- */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-6">
          <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2 border-b border-gray-200 pb-3">
            <span className="text-xl">1️⃣</span> ສ່ວນຫົວ (Top Header)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ຫຼັກ (ລາວ)</label>
              <input type="text" name="header_title_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.header_title_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ຫຼັກ (ອັງກິດ)</label>
              <input type="text" name="header_title_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.header_title_en} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຄຳອະທິບາຍ (ລາວ)</label>
              <input type="text" name="header_subtitle_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.header_subtitle_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຄຳອະທິບາຍ (ອັງກິດ)</label>
              <input type="text" name="header_subtitle_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.header_subtitle_en} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* --- 2. ສ່ວນເລົ່າປະຫວັດ (Our Story) --- */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-6">
          <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2 border-b border-gray-200 pb-3">
            <span className="text-xl">2️⃣</span> ສ່ວນເລົ່າປະຫວັດ (Our Story Section)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ຍ່ອຍ (ລາວ)</label>
              <input type="text" name="story_small_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.story_small_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ຍ່ອຍ (ອັງກິດ)</label>
              <input type="text" name="story_small_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.story_small_en} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ໃຫຍ່ (ລາວ)</label>
              <input type="text" name="story_main_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.story_main_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ໃຫຍ່ (ອັງກິດ)</label>
              <input type="text" name="story_main_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.story_main_en} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ເນື້ອຫາວັກທີ 1 (ລາວ)</label>
              <textarea name="story_desc1_lo" required rows={4} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={settings.story_desc1_lo} onChange={handleChange}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ເນື້ອຫາວັກທີ 1 (ອັງກິດ)</label>
              <textarea name="story_desc1_en" required rows={4} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={settings.story_desc1_en} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ເນື້ອຫາວັກທີ 2 (ລາວ)</label>
              <textarea name="story_desc2_lo" required rows={4} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={settings.story_desc2_lo} onChange={handleChange}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ເນື້ອຫາວັກທີ 2 (ອັງກິດ)</label>
              <textarea name="story_desc2_en" required rows={4} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={settings.story_desc2_en} onChange={handleChange}></textarea>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ຮູບພາບປະກອບ (Image URL)</label>
            <input type="url" name="story_image" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.story_image} onChange={handleChange} />
          </div>
        </div>

        {/* --- 3. ຄ່ານິຍົມຫຼັກ (Core Values) --- */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-6">
          <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2 border-b border-gray-200 pb-3">
            <span className="text-xl">3️⃣</span> ຄ່ານິຍົມຫຼັກ (Core Values)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ພາກສ່ວນ (ລາວ)</label>
              <input type="text" name="values_title_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.values_title_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ພາກສ່ວນ (ອັງກິດ)</label>
              <input type="text" name="values_title_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.values_title_en} onChange={handleChange} />
            </div>
          </div>

          {/* Value 1 */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
            <h4 className="font-bold text-teal-600">ຂໍ້ທີ 1 (ຊ້າຍ)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="v1_title_lo" placeholder="ຊື່ຫົວຂໍ້ (ລາວ)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium" value={settings.v1_title_lo} onChange={handleChange} />
              <input type="text" name="v1_title_en" placeholder="ຊື່ຫົວຂໍ້ (ອັງກິດ)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium" value={settings.v1_title_en} onChange={handleChange} />
              <textarea name="v1_desc_lo" placeholder="ລາຍລະອຽດ (ລາວ)" rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium resize-none" value={settings.v1_desc_lo} onChange={handleChange}></textarea>
              <textarea name="v1_desc_en" placeholder="ລາຍລະອຽດ (ອັງກິດ)" rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium resize-none" value={settings.v1_desc_en} onChange={handleChange}></textarea>
            </div>
          </div>

          {/* Value 2 */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
            <h4 className="font-bold text-pink-500">ຂໍ້ທີ 2 (ກາງ)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="v2_title_lo" placeholder="ຊື່ຫົວຂໍ້ (ລາວ)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium" value={settings.v2_title_lo} onChange={handleChange} />
              <input type="text" name="v2_title_en" placeholder="ຊື່ຫົວຂໍ້ (ອັງກິດ)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium" value={settings.v2_title_en} onChange={handleChange} />
              <textarea name="v2_desc_lo" placeholder="ລາຍລະອຽດ (ລາວ)" rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium resize-none" value={settings.v2_desc_lo} onChange={handleChange}></textarea>
              <textarea name="v2_desc_en" placeholder="ລາຍລະອຽດ (ອັງກິດ)" rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium resize-none" value={settings.v2_desc_en} onChange={handleChange}></textarea>
            </div>
          </div>

          {/* Value 3 */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
            <h4 className="font-bold text-teal-600">ຂໍ້ທີ 3 (ຂວາ)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="v3_title_lo" placeholder="ຊື່ຫົວຂໍ້ (ລາວ)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium" value={settings.v3_title_lo} onChange={handleChange} />
              <input type="text" name="v3_title_en" placeholder="ຊື່ຫົວຂໍ້ (ອັງກິດ)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium" value={settings.v3_title_en} onChange={handleChange} />
              <textarea name="v3_desc_lo" placeholder="ລາຍລະອຽດ (ລາວ)" rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium resize-none" value={settings.v3_desc_lo} onChange={handleChange}></textarea>
              <textarea name="v3_desc_en" placeholder="ລາຍລະອຽດ (ອັງກິດ)" rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium resize-none" value={settings.v3_desc_en} onChange={handleChange}></textarea>
            </div>
          </div>
        </div>

        {/* --- 4. ສ່ວນ Call to Action --- */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-6">
          <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2 border-b border-gray-200 pb-3">
            <span className="text-xl">4️⃣</span> ສ່ວນຊັກຊວນ (Call to Action)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ (ລາວ)</label>
              <input type="text" name="cta_title_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.cta_title_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຫົວຂໍ້ (ອັງກິດ)</label>
              <input type="text" name="cta_title_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.cta_title_en} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຂໍ້ຄວາມ (ລາວ)</label>
              <input type="text" name="cta_subtitle_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.cta_subtitle_lo} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ຂໍ້ຄວາມ (ອັງກິດ)</label>
              <input type="text" name="cta_subtitle_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={settings.cta_subtitle_en} onChange={handleChange} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-5 rounded-xl transition-all shadow-md hover:shadow-teal-600/30 disabled:bg-gray-400 uppercase tracking-widest text-lg">
          {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກຂໍ້ມູນທັງໝົດ'}
        </button>
      </form>
    </div>
  );
}