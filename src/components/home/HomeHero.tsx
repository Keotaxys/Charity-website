'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeHero() {
  const locale = useLocale();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        // ດຶງຂໍ້ມູນຈາກ Collection 'settings' Document 'homepage'
        const docRef = doc(db, 'settings', 'homepage'); 
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching hero settings:", error);
      }
    };
    fetchHeroSettings();
  }, []);

  // ດຶງຂໍ້ມູນວິດີໂອ (ຮອງຮັບຫຼາຍຊື່ທີ່ອາດຈະຕັ້ງໄວ້ໃນ Admin)
  const videoUrl = data?.hero_video_url || data?.video_url || ''; 
  
  // ດຶງຂໍ້ມູນຫົວຂໍ້ (ດັກຈັບທຸກຊື່ທີ່ເປັນໄປໄດ້: title_lo, hero_title_lo, header_title_lo)
  const titleLo = data?.title_lo || data?.hero_title_lo || data?.header_title_lo || 'ຍິນດີຕ້ອນຮັບສູ່ ໂຄງການຊ່ວຍເຫຼືອສັງຄົມ';
  const titleEn = data?.title_en || data?.hero_title_en || data?.header_title_en || 'WELCOME TO OUR SOCIETY PROJECT';
  
  // ດຶງຂໍ້ມູນຄຳອະທິບາຍ (ດັກຈັບທຸກຊື່: subtitle_lo, desc_lo, hero_desc_lo)
  const descLo = data?.subtitle_lo || data?.desc_lo || data?.hero_desc_lo || data?.header_subtitle_lo || 'ພວກເຮົາມີພາລະກິດໃນການປ່ຽນແປງຊີວິດ ແລະ ສ້າງສັງຄົມທີ່ໜ້າຢູ່ໄປພ້ອມໆກັນ.';
  const descEn = data?.subtitle_en || data?.desc_en || data?.hero_desc_en || data?.header_subtitle_en || 'Our mission is to transform lives and build a better society together.';

  const title = locale === 'lo' ? titleLo : titleEn;
  const subtitle = locale === 'lo' ? descLo : descEn;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      
      {/* ວິດີໂອພື້ນຫຼັງ */}
      {videoUrl && (
        <video 
          key={videoUrl}
          autoPlay loop muted playsInline
          // ປັບ opacity ຈາກ 60 ເປັນ 90 ເພື່ອໃຫ້ວິດີໂອແຈ້ງຂຶ້ນ
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover opacity-90"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      
      {/* ເງົາດຳຊ້ອນທັບ: ປັບຈາກ bg-black/40 (ມືດ 40%) ມາເປັນ bg-black/20 (ມືດ 20%) */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      <div className="relative z-20 text-center text-white px-6 animate-fade-in-up">
        {/* ຫົວຂໍ້ໃຫຍ່ */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter drop-shadow-lg leading-tight">
          {title}
        </h1>
        
        {/* ຄຳອະທິບາຍ */}
        <p className="text-xl md:text-2xl font-medium mb-12 max-w-3xl mx-auto drop-shadow-md">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            href={`/${locale}/campaigns`} 
            className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-teal-600/50 uppercase tracking-widest text-lg transform hover:-translate-y-1"
          >
            {locale === 'lo' ? 'ຊ່ວຍເຫຼືອດຽວນີ້' : 'HELP NOW'}
          </Link>
          <Link 
            href={`/${locale}/about`} 
            className="bg-transparent border-2 border-white hover:bg-white hover:text-teal-900 text-white font-black py-4 px-10 rounded-full transition-all uppercase tracking-widest text-lg shadow-lg transform hover:-translate-y-1"
          >
            {locale === 'lo' ? 'ຮຽນຮູ້ເພີ່ມເຕີມ' : 'LEARN MORE'}
          </Link>
        </div>
      </div>
    </section>
  );
}