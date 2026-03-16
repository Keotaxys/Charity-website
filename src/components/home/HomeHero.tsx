'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeHero() {
  const locale = useLocale();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        // ດຶງຂໍ້ມູນຈາກ settings/home_page ທີ່ເຈົ້າບັນທຶກໃນ Admin
        const docRef = doc(db, 'settings', 'home_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching hero settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroSettings();
  }, []);

  // ກຳນົດຄ່າ Fallback ຖ້າຍັງໂຫຼດບໍ່ແລ້ວ ຫຼື ບໍ່ມີຂໍ້ມູນ
  const videoUrl = data?.video_url || ''; 
  const title = data ? (locale === 'lo' ? data.title_lo : data.title_en) : '';
  const subtitle = data ? (locale === 'lo' ? data.subtitle_lo : data.subtitle_en) : '';

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
        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter drop-shadow-lg leading-tight">
          {title}
        </h1>
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