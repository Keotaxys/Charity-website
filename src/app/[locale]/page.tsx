'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HomePage() {
  const locale = useLocale();

  // State ສຳລັບເກັບລິ້ງວິດີໂອຈາກ Firebase (ຕັ້ງຄ່າ Default ໄວ້ກໍລະນີຍັງບໍ່ມີຂໍ້ມູນ)
  const [videoUrl, setVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-working-together-to-clean-the-city-40019-large.mp4');

  // ດຶງຂໍ້ມູນ Settings ຈາກ Firebase ເມື່ອໂຫຼດໜ້າເວັບ
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().hero_video_url) {
          // ຖ້າມີລິ້ງວິດີໂອທີ່ຕັ້ງຄ່າໄວ້ໃນແອັດມິນ ໃຫ້ເອົາມາໃຊ້ແທນ Default
          setVideoUrl(docSnap.data().hero_video_url);
        }
      } catch (error) {
        console.error("Error fetching video settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // ຂໍ້ມູນຈຳລອງ: ໂຄງການໄຮໄລທ໌ (Featured Campaigns)
  const featuredCampaigns = [
    {
      id: 1,
      title_lo: 'ພາລະກິດສ້າງຮອຍຍິ້ມໃຫ້ນ້ອງໆຊົນນະບົດ',
      title_en: 'Mission: Smiles for Rural Children',
      desc_lo: 'ຕິດຕາມການລົງພື້ນທີ່ແຈກຢາຍອາຫານ ແລະ ເຄື່ອງນຸ່ງຫົ່ມ ທີ່ປ່ຽນແປງຊີວິດ.',
      desc_en: 'Follow our team distributing food and clothes, transforming lives.',
      thumbnail: 'https://images.unsplash.com/photo-1593113589914-07553e6c7800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title_lo: 'ສ້າງລະບົບນ້ຳສະອາດໃຫ້ 5 ໝູ່ບ້ານ',
      title_en: 'Clean Water System for 5 Villages',
      desc_lo: 'ໂຄງການພັດທະນາແຫຼ່ງນ້ຳ ແລະ ສຸຂະອະນາໄມ ທີ່ຍືນຍົງ.',
      desc_en: 'Sustainable water and sanitation development project.',
      thumbnail: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title_lo: 'ມອບທຶນການສຶກສາ ປະຈຳປີ 2025',
      title_en: 'Annual Scholarship Handover 2025',
      desc_lo: 'ສະໜັບສະໜູນການສຶກສາ ແລະ ອະນາຄົດຂອງເດັກນ້ອຍລາວ.',
      desc_en: 'Supporting the education and future of Lao children.',
      thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. ສ່ວນ Hero: ວິດີໂອຫຼັງບ້ານ ແລະ ຂໍ້ຄວາມ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        {/* ວິດີໂອຫຼັງບ້ານ (ດຶງຈາກ State ທີ່ເຊື່ອມຕໍ່ກັບ Firebase ແລ້ວ) */}
        <video 
          key={videoUrl} // ເພີ່ມ key ເພື່ອໃຫ້ video element ໂຫຼດໃໝ່ເວລາ url ປ່ຽນ
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* ຊັ້ນສີເທົາບັງວິດີໂອ */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* ເນື້ອຫາ */}
        <div className="relative z-20 text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
            {locale === 'lo' ? 'ຍິນດີຕ້ອນຮັບສູ່ ໂຄງການຊ່ວຍເຫຼືອສັງຄົມ' : 'WELCOME TO OUR SOCIETY PROJECT'}
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-12 max-w-3xl mx-auto drop-shadow-md">
            {locale === 'lo' 
              ? 'ພວກເຮົາມີພາລະກິດໃນການປ່ຽນແປງຊີວິດ ແລະ ສ້າງສັງຄົມທີ່ໜ້າຢູ່ໄປພ້ອມໆກັນ.' 
              : 'Our mission is to transform lives and build a better society together.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href={`/${locale}/campaigns`} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-teal-600/50 uppercase tracking-widest text-lg">
              {locale === 'lo' ? 'ຊ່ວຍເຫຼືອດຽວນີ້' : 'HELP NOW'}
            </Link>
            <Link href={`/${locale}/about`} className="bg-white hover:bg-gray-100 text-gray-900 font-black py-4 px-10 rounded-full transition-all uppercase tracking-widest text-lg shadow-lg">
              {locale === 'lo' ? 'ຮຽນຮູ້ເພີ່ມເຕີມ' : 'LEARN MORE'}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ສ່ວນພາລະກິດ (Mission Summary) */}
      <section className="bg-gray-50 py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 uppercase tracking-tight">
            {locale === 'lo' ? 'ພາລະກິດຂອງພວກເຮົາ' : 'OUR MISSION'}
          </h2>
          <div className="w-16 h-1 bg-pink-300 rounded-full mx-auto mb-12"></div>
          <p className="text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
            {locale === 'lo' 
              ? 'ເພື່ອສ້າງອະນາຄົດທີ່ດີກວ່າສຳລັບເດັກນ້ອຍ ແລະ ປະຊາຊົນລາວ ຜ່ານການສຶກສາ, ສຸຂະພາບ ແລະ ການພັດທະນາແບບຍືນຍົງ. ເງິນທຸກກີບຈະຖືກນຳໄປໃຊ້ຢ່າງໂປ່ງໃສ ແລະ ມີປະສິດທິພາບສູງສຸດ.' 
              : 'To create a better future for Lao children and people through education, health, and sustainable development. Every cent is used transparently and with maximum efficiency.'}
          </p>
        </div>
      </section>

      {/* 3. ໂຄງການໄຮໄລທ໌ (Featured Campaigns Grid) */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
              {locale === 'lo' ? 'ໂຄງການໄຮໄລທ໌' : 'FEATURED MISSIONS'}
            </h2>
            <Link href={`/${locale}/campaigns`} className="bg-pink-50 text-pink-500 hover:bg-pink-100 font-black py-3 px-6 rounded-full transition-all uppercase tracking-wider text-sm flex items-center gap-2">
              {locale === 'lo' ? 'ເບິ່ງທັງໝົດ' : 'VIEW ALL'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredCampaigns.map((camp) => (
              <div key={camp.id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={camp.thumbnail} 
                    alt={camp.title_en} 
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-pink-400 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-sm tracking-widest">
                      {locale === 'lo' ? 'ໂຄງການໃໝ່' : 'NEW PROJECT'}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-gray-900 group-hover:text-teal-600 transition-colors mb-3 leading-tight">
                    {locale === 'lo' ? camp.title_lo : camp.title_en}
                  </h3>
                  <p className="text-gray-500 mb-8 line-clamp-2">
                    {locale === 'lo' ? camp.desc_lo : camp.desc_en}
                  </p>
                  <Link href={`/${locale}/campaigns/${camp.id}`} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-black py-3 px-6 rounded-full transition-all shadow-md hover:shadow-teal-600/30 uppercase tracking-wider text-sm">
                    {locale === 'lo' ? 'ເບິ່ງລາຍລະອຽດ' : 'VIEW DETAILS'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ສ່ວນ Call to Action (ຊວນມາບໍລິຈາກ) */}
      <section className="bg-teal-600 py-24 px-6 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter">
            {locale === 'lo' ? 'ຮ່ວມເປັນສ່ວນໜຶ່ງໃນການປ່ຽນແປງ' : 'JOIN THE MOVEMENT FOR CHANGE'}
          </h2>
          <p className="text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            {locale === 'lo' 
              ? 'ທຸກໆການໃຫ້ຂອງທ່ານ ຄືພະລັງອັນຍິ່ງໃຫຍ່. ມາຮ່ວມສ້າງສັງຄົມທີ່ດີຂຶ້ນຮ່ວມກັບພວກເຮົາ.' 
              : 'Every contribution you make is a powerful force. Let’s build a better society together.'}
          </p>
          <Link href={`/${locale}/donate`} className="bg-white hover:bg-gray-100 text-gray-900 font-black py-5 px-12 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 uppercase tracking-widest text-lg">
            {locale === 'lo' ? 'ບໍລິຈາກດຽວນີ້' : 'DONATE NOW'}
          </Link>
        </div>
      </section>

    </div>
  );
}