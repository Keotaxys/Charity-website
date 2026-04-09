'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function CampaignsPage() {
  const locale = useLocale();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [pageSettings, setPageSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. ດຶງຂໍ້ມູນການຕັ້ງຄ່າໜ້າ (Header Text)
      try {
        const settingsRef = doc(db, 'settings', 'campaigns_page');
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          setPageSettings(settingsSnap.data());
        }
      } catch (error) {
        console.error("Error fetching campaign page settings:", error);
      }

      // 2. ດຶງຂໍ້ມູນລາຍການໂຄງການທັງໝົດ
      try {
        const q = query(collection(db, "campaigns"), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ກຳນົດຄ່າ Fallback ຖ້າຍັງບໍ່ໄດ້ຕັ້ງຄ່າໃນ Admin
  const headerTitle = pageSettings
    ? (locale === 'lo' ? pageSettings.header_title_lo : pageSettings.header_title_en)
    : (locale === 'lo' ? 'ທຸກໆການຊ່ວຍເຫຼືອມີຄວາມໝາຍ' : 'EVERY CONTRIBUTION MATTERS');

  const headerSubtitle = pageSettings
    ? (locale === 'lo' ? pageSettings.header_subtitle_lo : pageSettings.header_subtitle_en)
    : (locale === 'lo' ? 'ຮ່ວມເປັນສ່ວນໜຶ່ງໃນການປ່ຽນແປງສັງຄົມ ຜ່ານໂຄງການຕ່າງໆຂອງພວກເຮົາ. ເງິນທຸກກີບຈະຖືກນຳໄປໃຊ້ຢ່າງໂປ່ງໃສ ແລະ ເກີດປະໂຫຍດສູງສຸດ.' : 'Be a part of social change through our various campaigns. Every cent is used transparently for maximum impact.');

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
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {headerSubtitle}
          </p>
        </div>
      </section>

      {/* 2. ສ່ວນເນື້ອຫາ (Grid ລາຍການໂຄງການ) */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-teal-600 text-lg uppercase tracking-widest">
              {locale === 'lo' ? 'ກຳລັງໂຫຼດຂໍ້ມູນ...' : 'Loading campaigns...'}
            </p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-32 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <p className="text-gray-500 font-bold text-xl">
              {locale === 'lo' ? 'ຍັງບໍ່ມີໂຄງການໃນຂະນະນີ້' : 'No campaigns available at the moment'}
            </p>
            <p className="text-gray-400 mt-2">
              {locale === 'lo' ? 'ກະລຸນາກັບມາຕິດຕາມໃໝ່ໃນພາຍຫຼັງ.' : 'Please check back later.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {campaigns.map((item) => {
              const target = Number(item.target_amount) || 0;
              const raised = Number(item.raised_amount) || 0;
              const percent = target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 0;

              const title = locale === 'lo' ? item.title_lo : item.title_en;
              const desc = locale === 'lo' ? item.description_lo : item.description_en;

              return (
                <Link href={`/${locale}/campaigns/${item.id}`} key={item.id} className="group bg-white rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col transform hover:-translate-y-2">

                  {/* ຮູບໜ້າປົກ */}
                  <div className="relative aspect-4/3 overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={item.cover_image || 'https://via.placeholder.com/800x600?text=No+Image'}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      alt={title}
                    />
                    {/* ແສງເງົາໄລ່ລະດັບ */}
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-pink-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-md tracking-widest">
                        {item.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* ລາຍລະອຽດ */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col relative bg-white">
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-teal-600 transition-colors mb-3 line-clamp-2 leading-snug">
                      {title}
                    </h3>

                    <p className="text-gray-500 mb-8 text-sm md:text-base line-clamp-2 leading-relaxed">
                      {desc}
                    </p>

                    {/* 💡 ແຖບຄວາມຄືບໜ້າແບບໃໝ່ (Theme ໃໝ່) */}
                    <div className="mt-auto pt-2">

                      {/* ເປີເຊັນ ແລະ ເປົ້າໝາຍ */}
                      <div className="flex justify-between items-end mb-2">
                        {/* ເປີເຊັນສີດຳ */}
                        <span className="text-gray-900 font-black">
                          {percent}% <span className="text-gray-500 font-medium text-xs ml-1">{locale === 'lo' ? 'ສຳເລັດ' : 'Reached'}</span>
                        </span>
                        {/* ເປົ້າໝາຍສີບົວ */}
                        <span className="text-pink-500 font-bold text-sm">
                          {target.toLocaleString()} <span className="text-pink-400 text-xs">LAK</span>
                        </span>
                      </div>

                      {/* ຫຼອດ Progress ສີ Teal */}
                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden relative mb-5">
                        <div
                          className="absolute top-0 left-0 h-full bg-teal-500 rounded-full transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      {/* ຍອດບໍລິຈາກລວມ */}
                      <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-2">
                        <div className="flex flex-col">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            {locale === 'lo' ? 'ຍອດບໍລິຈາກລວມ' : 'Total Raised'}
                          </p>
                          <div className="flex items-baseline gap-1">
                            {/* ຍອດປັດຈຸບັນສີ Teal */}
                            <span className="text-2xl font-black text-teal-600">
                              {raised.toLocaleString()}
                            </span>
                            <span className="text-sm font-bold text-teal-600">LAK</span>
                          </div>
                        </div>

                        {/* ປຸ່ມລູກສອນ */}
                        <span className="w-10 h-10 bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white rounded-full flex items-center justify-center transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                      </div>

                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
}