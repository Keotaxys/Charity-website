'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export default function VideosPage() {
  const locale = useLocale();
  
  const [pageSettings, setPageSettings] = useState<any>(null);
  const [videoList, setVideoList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. ດຶງການຕັ້ງຄ່າໜ້າ ແລະ ວິດີໂອໄຮໄລທ໌
        const docRef = doc(db, 'settings', 'videos_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setPageSettings(docSnap.data());

        // 2. ດຶງລາຍການວິດີໂອທັງໝົດ
        const q = query(collection(db, 'videos'), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        setVideoList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching video data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ຟັງຊັນສະກັດເອົາ ID ຂອງ YouTube ເພື່ອເຮັດ Thumbnail ຫຼື Embed URL
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return <div className="min-h-screen flex flex-col items-center justify-center"><div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div><p className="mt-4 text-teal-600 font-bold uppercase tracking-widest">ກຳລັງໂຫຼດວິດີໂອ...</p></div>;
  }

  const headerTitle = pageSettings ? (locale === 'lo' ? pageSettings.header_title_lo : pageSettings.header_title_en) : '';
  const headerSubtitle = pageSettings ? (locale === 'lo' ? pageSettings.header_subtitle_lo : pageSettings.header_subtitle_en) : '';
  const youtubeUrl = pageSettings?.youtube_channel_url || '#';

  const featuredId = getYoutubeId(pageSettings?.featured_url);
  const embedUrl = featuredId ? `https://www.youtube.com/embed/${featuredId}` : '';

  return (
    <div className="bg-white min-h-screen pb-24">
      
      {/* 1. ສ່ວນຫົວ (Header) */}
      <section className="bg-gray-100 py-20 px-6 border-b border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-400/15 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase drop-shadow-sm">
            {headerTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {headerSubtitle}
          </p>
        </div>
      </section>

      {/* 2. ວິດີໂອໄຮໄລທ໌ (Featured Video) */}
      {featuredId && (
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
          <div className="bg-white p-4 md:p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col lg:flex-row gap-8 items-center">
            
            <div className="w-full lg:w-2/3 aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-inner relative">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={embedUrl} 
                title="Featured Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            <div className="w-full lg:w-1/3 space-y-4 px-4 pb-4 lg:pb-0">
              <span className="inline-block bg-pink-50 text-pink-500 font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border border-pink-100">
                {locale === 'lo' ? pageSettings?.featured_tag_lo : pageSettings?.featured_tag_en}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                {locale === 'lo' ? pageSettings?.featured_title_lo : pageSettings?.featured_title_en}
              </h2>
              <div className="w-12 h-1 bg-teal-600 rounded-full"></div>
              <p className="text-gray-600 leading-relaxed pt-2">
                {locale === 'lo' ? pageSettings?.featured_desc_lo : pageSettings?.featured_desc_en}
              </p>
              <div className="pt-4">
                <a 
                  href={pageSettings?.featured_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-teal-600 font-black hover:text-teal-700 transition-colors uppercase tracking-widest text-xs"
                >
                  {locale === 'lo' ? 'ເບິ່ງເທິງ YouTube' : 'WATCH ON YOUTUBE'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 3. ລາຍການວິດີໂອອື່ນໆ (Video Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              {locale === 'lo' ? 'ວິດີໂອທັງໝົດ' : 'ALL VIDEOS'}
            </h2>
          </div>
          <a 
            href={youtubeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-black py-3.5 px-8 rounded-full transition-all shadow-lg hover:shadow-pink-500/30 uppercase tracking-widest text-xs w-full md:w-auto"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            {locale === 'lo' ? 'ຕິດຕາມຊ່ອງ YouTube' : 'SUBSCRIBE'}
          </a>
        </div>

        {videoList.length === 0 ? (
          <p className="text-center text-gray-400 font-bold">ຍັງບໍ່ມີວິດີໂອອື່ນໆໃນຂະນະນີ້</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {videoList.map((video) => {
              const vidId = getYoutubeId(video.video_url);
              const thumbUrl = vidId ? `https://img.youtube.com/vi/${vidId}/maxresdefault.jpg` : 'https://via.placeholder.com/800x450?text=Video';
              
              return (
                <a href={video.video_url} target="_blank" rel="noopener noreferrer" key={video.id} className="group cursor-pointer">
                  
                  <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-4 bg-gray-900 shadow-sm border border-gray-100">
                    <img 
                      src={thumbUrl} 
                      alt={video.title_en} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center pl-1.5 shadow-lg text-teal-600 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                      </div>
                    </div>
                  </div>

                  <div className="px-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 mb-2">
                      {locale === 'lo' ? video.title_lo : video.title_en}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400">
                      <span>{video.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{video.views} {locale === 'lo' ? 'ຄົນເບິ່ງ' : 'VIEWS'}</span>
                    </div>
                  </div>

                </a>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}