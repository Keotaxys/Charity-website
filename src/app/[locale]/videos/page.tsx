'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function VideosPage() {
  const locale = useLocale();

  // ຂໍ້ມູນຈຳລອງ: ວິດີໂອໄຮໄລທ໌ (Featured Video)
  const featuredVideo = {
    id: '1',
    title_lo: 'ພາລະກິດສ້າງໂຮງຮຽນໃໝ່ ໃຫ້ນ້ອງໆຊົນນະບົດ',
    title_en: 'Mission: Building a New School for Rural Children',
    desc_lo: 'ຕິດຕາມການລົງພື້ນທີ່ຂອງທີມງານ BEAST.LAO ໃນການປຸກສ້າງໂຮງຮຽນຫຼັງໃໝ່ ທີ່ໃຊ້ເວລາພຽງ 30 ມື້ ເພື່ອໃຫ້ນ້ອງໆໄດ້ມີບ່ອນຮຽນທີ່ປອດໄພກ່ອນລະດູຝົນຈະມາຮອດ.',
    desc_en: 'Follow the BEAST.LAO team as we build a new school in just 30 days, providing a safe learning environment for children before the rainy season arrives.',
    // ໃຊ້ YouTube Embed URL ຕົວຢ່າງ
    embedUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ?si=XYZ123', 
  };

  // ຂໍ້ມູນຈຳລອງ: ວິດີໂອອື່ນໆ (Video List)
  const videoList = [
    {
      id: '2',
      title_lo: 'ແຈກຢາຍຜ້າຫົ່ມ 1,000 ຜືນ ຕ້ານໄພໜາວ',
      title_en: 'Distributing 1,000 Blankets for Winter',
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '15 Jan 2026',
      views: '12K',
    },
    {
      id: '3',
      title_lo: 'ສ້າງລະບົບນ້ຳສະອາດໃຫ້ 5 ໝູ່ບ້ານ',
      title_en: 'Clean Water System for 5 Villages',
      thumbnail: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '02 Feb 2026',
      views: '8.5K',
    },
    {
      id: '4',
      title_lo: 'ມອບທຶນການສຶກສາ ປະຈຳປີ 2025',
      title_en: 'Annual Scholarship Handover 2025',
      thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '10 Dec 2025',
      views: '20K',
    },
    {
      id: '5',
      title_lo: 'ຊ່ວຍເຫຼືອສັດຈອນຈັດ ກວ່າ 200 ໂຕ',
      title_en: 'Rescuing Over 200 Stray Animals',
      thumbnail: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '25 Nov 2025',
      views: '15K',
    },
    {
      id: '6',
      title_lo: 'ປູກຕົ້ນໄມ້ 10,000 ຕົ້ນ ຟື້ນຟູປ່າ',
      title_en: 'Planting 10,000 Trees for the Forest',
      thumbnail: 'https://images.unsplash.com/photo-1542601098367-bf5e5c7a40fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '05 Oct 2025',
      views: '9.2K',
    },
    {
      id: '7',
      title_lo: 'ພາລະກິດສ້ອມແປງຂົວຂ້າມນ້ຳ',
      title_en: 'Bridge Repair Mission',
      thumbnail: 'https://images.unsplash.com/photo-1517601614995-5dbf9e9a444a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: '18 Sep 2025',
      views: '11K',
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      
      {/* 1. ສ່ວນຫົວ (Header) */}
      <section className="bg-gray-900 text-white py-24 px-6 relative overflow-hidden">
        {/* ຕົກແຕ່ງພື້ນຫຼັງ */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter uppercase">
            {locale === 'lo' ? 'ວິດີໂອການລົງພື້ນທີ່' : 'OUR MISSIONS ON VIDEO'}
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            {locale === 'lo' 
              ? 'ທຸກໆຄລິບຄືຫຼັກຖານແຫ່ງຄວາມໂປ່ງໃສ ແລະ ຜົນງານທີ່ເກີດຈາກການສະໜັບສະໜູນຂອງທ່ານ.' 
              : 'Every video is a testament to our transparency and the impact of your support.'}
          </p>
        </div>
      </section>

      {/* 2. ວິດີໂອໄຮໄລທ໌ (Featured Video) */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-4 md:p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col lg:flex-row gap-8 items-center">
          
          {/* ກ່ອງສະແດງວິດີໂອ (Iframe) */}
          <div className="w-full lg:w-2/3 aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-inner relative">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src={featuredVideo.embedUrl} 
              title="Featured Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>

          {/* ເນື້ອຫາວິດີໂອໄຮໄລທ໌ */}
          <div className="w-full lg:w-1/3 space-y-4 px-4 pb-4 lg:pb-0">
            <span className="inline-block bg-pink-50 text-pink-500 font-black px-4 py-1 rounded-full text-xs uppercase tracking-widest border border-pink-100">
              {locale === 'lo' ? 'ວິດີໂອຫຼ້າສຸດ' : 'LATEST RELEASE'}
            </span>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">
              {locale === 'lo' ? featuredVideo.title_lo : featuredVideo.title_en}
            </h2>
            <div className="w-12 h-1 bg-teal-600 rounded-full"></div>
            <p className="text-gray-600 leading-relaxed text-lg pt-2">
              {locale === 'lo' ? featuredVideo.desc_lo : featuredVideo.desc_en}
            </p>
            <div className="pt-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-teal-600 font-black hover:text-teal-700 transition-colors uppercase tracking-wide text-sm"
              >
                {locale === 'lo' ? 'ເບິ່ງເທິງ YouTube' : 'WATCH ON YOUTUBE'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 3. ລາຍການວິດີໂອອື່ນໆ (Video Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              {locale === 'lo' ? 'ວິດີໂອທັງໝົດ' : 'ALL VIDEOS'}
            </h2>
          </div>
          {/* ປຸ່ມ Subscribe */}
          <a 
            href="#" 
            target="_blank" 
            className="hidden md:inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-black py-3 px-6 rounded-full transition-all shadow-md hover:shadow-pink-500/30 uppercase tracking-wide text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            {locale === 'lo' ? 'ຕິດຕາມຊ່ອງ YouTube' : 'SUBSCRIBE'}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {videoList.map((video) => (
            <div key={video.id} className="group cursor-pointer">
              
              {/* ຮູບໜ້າປົກ (Thumbnail) */}
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-4 bg-gray-100 shadow-sm border border-gray-100">
                <img 
                  src={video.thumbnail} 
                  alt={video.title_en} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                
                {/* ປຸ່ມ Play ກາງຮູບ */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center pl-1.5 shadow-lg text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                  </div>
                </div>
              </div>

              {/* ຂໍ້ມູນວິດີໂອ */}
              <div className="px-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 mb-2">
                  {locale === 'lo' ? video.title_lo : video.title_en}
                </h3>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <span>{video.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{video.views} {locale === 'lo' ? 'ຄົນເບິ່ງ' : 'Views'}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ປຸ່ມ Load More (ສຳລັບມືຖື ແລະ ເພື່ອຄວາມສວຍງາມ) */}
        <div className="mt-16 text-center">
          <button className="bg-transparent border-2 border-gray-200 text-gray-600 hover:border-teal-600 hover:text-teal-600 font-black py-4 px-10 rounded-full transition-all uppercase tracking-wider text-sm">
            {locale === 'lo' ? 'ໂຫຼດວິດີໂອເພີ່ມເຕີມ' : 'LOAD MORE VIDEOS'}
          </button>
        </div>
      </section>

    </div>
  );
}