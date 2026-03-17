'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeVideos() {
  const locale = useLocale();
  const [data, setData] = useState<any>(null);
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ດຶງ Settings ຂອງວິດີໂອ (ສຳລັບ Embed URL)
        const docRef = doc(db, 'settings', 'videos_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setData(docSnap.data());

        // ດຶງ Settings ຂອງໜ້າຫຼັກ (ສຳລັບຫົວຂໍ້)
        const homeRef = doc(db, 'settings', 'homepage');
        const homeSnap = await getDoc(homeRef);
        if (homeSnap.exists()) setHomeData(homeSnap.data());
      } catch (error) { console.error("Error:", error); }
    };
    fetchData();
  }, []);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(data?.featured_url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  
  const videoContentTitle = data ? (locale === 'lo' ? data.featured_title_lo : data.featured_title_en) : '';

  // ດຶງຫົວຂໍ້ຈາກ Admin Home Settings
  const sectionTitle = homeData ? (locale === 'lo' ? homeData.video_title_lo : homeData.video_title_en) : '';
  const sectionSubtitle = homeData ? (locale === 'lo' ? homeData.video_subtitle_lo : homeData.video_subtitle_en) : '';

  return (
    <section className="bg-gray-100 py-24 px-6 border-t border-gray-200 relative overflow-hidden">
      
      {/* ຕົກແຕ່ງພື້ນຫຼັງ Gradient ຄືກັບ Header */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-400/15 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              {sectionTitle || (locale === 'lo' ? 'ວິດີໂອລ່າສຸດ' : 'LATEST VIDEOS')}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl font-medium">
              {sectionSubtitle || (locale === 'lo' ? 'ຕິດຕາມການລົງພື້ນທີ່ ແລະ ເບິ່ງຮອຍຍິ້ມທີ່ເກີດຂຶ້ນຈາກການຊ່ວຍເຫຼືອຂອງທ່ານ.' : 'Watch our recent missions and see the impact of your donations.')}
            </p>
          </div>
          <Link href={`/${locale}/videos`} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-3 px-8 rounded-full transition-all uppercase tracking-wide text-sm whitespace-nowrap shadow-lg">
            {locale === 'lo' ? 'ເບິ່ງວິດີໂອທັງໝົດ' : 'WATCH ALL VIDEOS'}
          </Link>
        </div>

        <a href={data?.featured_url || `/${locale}/videos`} target="_blank" rel="noopener noreferrer" className="relative block w-full aspect-video bg-gray-800 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-gray-200">
          <img src={thumbnailUrl} alt={videoContentTitle} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center pl-2 shadow-lg group-hover:bg-pink-500 transition-colors duration-300">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-md">{videoContentTitle}</h3>
          </div>
        </a>
      </div>
    </section>
  );
}