'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function HomeVideos() {
  const locale = useLocale();

  return (
    <section className="bg-gray-900 py-24 px-6 text-white relative overflow-hidden">
      {/* ຕົກແຕ່ງພື້ນຫຼັງ */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              {locale === 'lo' ? 'ວິດີໂອລ່າສຸດ' : 'LATEST VIDEOS'}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              {locale === 'lo' 
                ? 'ຕິດຕາມການລົງພື້ນທີ່ ແລະ ເບິ່ງຮອຍຍິ້ມທີ່ເກີດຂຶ້ນຈາກການຊ່ວຍເຫຼືອຂອງທ່ານ.' 
                : 'Watch our recent missions and see the impact of your donations.'}
            </p>
          </div>
          <Link 
            href={`/${locale}/videos`}
            className="bg-teal-600 hover:bg-teal-700 text-white font-black py-3 px-8 rounded-full transition-all uppercase tracking-wide text-sm whitespace-nowrap"
          >
            {locale === 'lo' ? 'ເບິ່ງວິດີໂອທັງໝົດ' : 'WATCH ALL VIDEOS'}
          </Link>
        </div>

        {/* ວິດີໂອ Highlight ຂະໜາດໃຫຍ່ */}
        <div className="relative w-full aspect-video bg-gray-800 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-gray-700">
          <img 
            src="https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Video Thumbnail" 
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
          {/* ປຸ່ມ Play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center pl-2 shadow-lg group-hover:bg-pink-400 transition-colors duration-300">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4l12 6-12 6z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {locale === 'lo' ? 'ພາລະກິດຊ່ວຍເຫຼືອໂຮງຮຽນເຂດຫ່າງໄກ' : 'Mission: Rebuilding Rural Schools'}
            </h3>
          </div>
        </div>

      </div>
    </section>
  );
}