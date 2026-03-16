'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeVideos() {
  const locale = useLocale();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchVideoSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'videos_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setData(docSnap.data());
      } catch (error) {
        console.error("Error fetching video settings:", error);
      }
    };
    fetchVideoSettings();
  }, []);

  // ຟັງຊັນສະກັດເອົາ ID ຂອງ YouTube ເພື່ອດຶງຮູບໜ້າປົກມาสະແດງ
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(data?.featured_url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  
  const title = data ? (locale === 'lo' ? data.featured_title_lo : data.featured_title_en) : (locale === 'lo' ? 'ພາລະກິດຊ່ວຍເຫຼືອໂຮງຮຽນເຂດຫ່າງໄກ' : 'Mission: Rebuilding Rural Schools');

  return (
    <section className="bg-gray-900 py-24 px-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              {locale === 'lo' ? 'ວິດີໂອລ່າສຸດ' : 'LATEST VIDEOS'}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              {locale === 'lo' ? 'ຕິດຕາມການລົງພື້ນທີ່ ແລະ ເບິ່ງຮອຍຍິ້ມທີ່ເກີດຂຶ້ນຈາກການຊ່ວຍເຫຼືອຂອງທ່ານ.' : 'Watch our recent missions and see the impact of your donations.'}
            </p>
          </div>
          <Link href={`/${locale}/videos`} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-3 px-8 rounded-full transition-all uppercase tracking-wide text-sm whitespace-nowrap">
            {locale === 'lo' ? 'ເບິ່ງວິດີໂອທັງໝົດ' : 'WATCH ALL VIDEOS'}
          </Link>
        </div>

        {/* ວິດີໂອ Highlight ຂະໜາດໃຫຍ່ */}
        <a href={data?.featured_url || `/${locale}/videos`} target="_blank" rel="noopener noreferrer" className="relative block w-full aspect-video bg-gray-800 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-gray-700">
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center pl-2 shadow-lg group-hover:bg-pink-500 transition-colors duration-300">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h3>
          </div>
        </a>
      </div>
    </section>
  );
}