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
        // ປ່ຽນຈາກ 'home_page' ມາເປັນ 'homepage' ໃຫ້ກົງກັບທີ່ Admin ບັນທຶກ
        const docRef = doc(db, 'settings', 'homepage'); 
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const fetchedData = docSnap.data();
          console.log("ດຶງຂໍ້ມູນມາໄດ້ແລ້ວ:", fetchedData); // ເບິ່ງຂໍ້ມູນໃນ Console
          setData(fetchedData);
        } else {
          console.log("ບໍ່ພົບຂໍ້ມູນໃນ Firebase");
        }
      } catch (error) {
        console.error("Error fetching hero settings:", error);
      }
    };
    fetchHeroSettings();
  }, []);

  // ດຶງຂໍ້ມູນມາໃສ່ຕົວແປ (ຮອງຮັບທັງຊື່ hero_video_url ຫຼື video_url)
  const videoUrl = data?.hero_video_url || data?.video_url || ''; 
  const title = data ? (locale === 'lo' ? data.title_lo : data.title_en) : '';
  
  // ໝາຍເຫດ: ຖ້າຢູ່ Admin ເຈົ້າໃຊ້ຊື່ desc_lo ກໍໃຫ້ປ່ຽນຈາກ subtitle_lo ເປັນ desc_lo ເດີ
  const subtitle = data ? (locale === 'lo' ? (data.subtitle_lo || data.desc_lo) : (data.subtitle_en || data.desc_en)) : '';

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      
      {/* ວິດີໂອພື້ນຫຼັງ */}
      {videoUrl && (
        <video 
          key={videoUrl}
          autoPlay loop muted playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover opacity-60"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <div className="relative z-20 text-center text-white px-6 animate-fade-in-up">
        {/* ຫົວຂໍ້ໃຫຍ່ */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter drop-shadow-lg leading-tight">
          {title || (locale === 'lo' ? 'ຍິນດີຕ້ອນຮັບສູ່ໂຄງການ' : 'WELCOME TO OUR PROJECT')}
        </h1>
        
        {/* ຄຳອະທິບາຍ */}
        <p className="text-xl md:text-2xl font-medium mb-12 max-w-3xl mx-auto drop-shadow-md">
          {subtitle || (locale === 'lo' ? 'ກຳລັງໂຫຼດຂໍ້ມູນ...' : 'Loading data...')}
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