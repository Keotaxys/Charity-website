'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HomePage() {
  const locale = useLocale();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ດຶງຂໍ້ມູນລິ້ງວິດີໂອຈາກ Firebase ຕອນໂຫຼດໜ້າເວັບ
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().hero_video_url) {
          setVideoUrl(docSnap.data().hero_video_url);
        } else {
          // ຖ້າແອັດມິນຍັງບໍ່ໄດ້ຕັ້ງຄ່າ ໃຫ້ໃຊ້ວິດີໂອສຳຮອງໄປກ່ອນ
          setVideoUrl('https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      
      {/* 1. ສ່ວນ Hero (ວິດີໂອພື້ນຫຼັງເຕັມຈໍ) */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-900">
        
        {/* ສະແດງຂໍ້ຄວາມຕອນກຳລັງໂຫຼດ */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-teal-500 font-bold">
            ກຳລັງໂຫຼດວິດີໂອ...
          </div>
        )}

        {/* Video Background (ຈະສະແດງກໍຕໍ່ເມື່ອມີລິ້ງແລ້ວ) */}
        {!loading && videoUrl && (
          <video
            key={videoUrl} // ເຕັກນິກ: ໃຊ້ key ເພື່ອບັງຄັບໃຫ້ React ໂຫຼດວິດີໂອໃໝ່ເວລາລິ້ງປ່ຽນແປງ
            autoPlay
            loop
            muted={true}
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}

        {/* Overlay ສີດຳທັບວິດີໂອ ເພື່ອໃຫ້ຕົວໜັງສືອ່ານງ່າຍຂຶ້ນ */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>

        {/* ເນື້ອຫາທີ່ຢູ່ເທິງວິດີໂອ */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center mt-16">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
            {locale === 'lo' ? 'ຍິນດີຕ້ອນຮັບສູ່ ໂຄງການຊ່ວຍເຫຼືອສັງຄົມ' : 'WELCOME TO BEAST PHILANTHROPY LAO'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 font-medium drop-shadow-md">
            {locale === 'lo' 
              ? 'ພວກເຮົາຮ່ວມມືກັນເພື່ອປ່ຽນແປງໂລກໃຫ້ດີຂຶ້ນ.' 
              : 'Together we are changing the world for the better.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* ປຸ່ມຫຼັກສີ Teal */}
            <Link 
              href={`/${locale}/campaigns`}
              className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-teal-600/50 uppercase tracking-wider text-lg transform hover:-translate-y-1"
            >
              {locale === 'lo' ? 'ຊ່ວຍເຫຼືອດຽວນີ້' : 'HELP NOW'}
            </Link>
            
            {/* ປຸ່ມຮອງ (ມີຂອບສີບົວອ່ອນ) */}
            <Link 
              href={`/${locale}/about`}
              className="bg-transparent border-2 border-pink-300 text-pink-300 hover:bg-pink-300 hover:text-white font-black py-4 px-10 rounded-full transition-all uppercase tracking-wider text-lg"
            >
              {locale === 'lo' ? 'ຮຽນຮູ້ເພີ່ມເຕີມ' : 'LEARN MORE'}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ສ່ວນຕົວເລກສະຖິຕິແຫ່ງຄວາມໂປ່ງໃສ (Impact Stats) */}
      <section className="bg-white py-20 px-6 relative z-30 -mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* ກ່ອງທີ 1 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <h2 className="text-6xl font-black text-teal-600 mb-4">100%</h2>
              <p className="text-gray-600 font-bold uppercase tracking-wide">
                {locale === 'lo' ? 'ໄປເຖິງຜູ້ຮັບໂດຍກົງ' : 'GOES DIRECTLY TO CAUSE'}
              </p>
            </div>

            {/* ກ່ອງທີ 2 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <h2 className="text-6xl font-black text-teal-600 mb-4">50+</h2>
              <p className="text-gray-600 font-bold uppercase tracking-wide">
                {locale === 'lo' ? 'ໂຄງການທີ່ສຳເລັດ' : 'COMPLETED CAMPAIGNS'}
              </p>
            </div>

            {/* ກ່ອງທີ 3 (ເນັ້ນສີບົວອ່ອນ) */}
            <div className="bg-white border border-pink-100 rounded-3xl p-10 text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <h2 className="text-6xl font-black text-pink-400 mb-4">$0</h2>
              <p className="text-gray-600 font-bold uppercase tracking-wide">
                {locale === 'lo' ? 'ຫັກຄ່າທຳນຽມແພລດຟອມ' : 'PLATFORM FEES'}
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}