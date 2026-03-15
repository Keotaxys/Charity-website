'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function CampaignsPage() {
  const locale = useLocale();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
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
    fetchCampaigns();
  }, []);

  return (
    <div className="bg-white min-h-screen pb-24">
      
      {/* 1. ສ່ວນຫົວ (Header) - ປ່ຽນເປັນ bg-gray-100 ເພື່ອໃຫ້ເທົາເຂັ້ມຂຶ້ນ */}
      <section className="bg-gray-100 py-32 px-6 border-b border-gray-200 relative overflow-hidden">
        
        {/* ເພີ່ມຄວາມເຂັ້ມຂອງແສງສີ Teal ແລະ ສີບົວ (opacity ເພີ່ມຂຶ້ນ) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-400/15 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase drop-shadow-sm">
            {locale === 'lo' ? 'ທຸກໆການຊ່ວຍເຫຼືອມີຄວາມໝາຍ' : 'EVERY CONTRIBUTION MATTERS'}
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {locale === 'lo' 
              ? 'ຮ່ວມເປັນສ່ວນໜຶ່ງໃນການປ່ຽນແປງສັງຄົມ ຜ່ານໂຄງການຕ່າງໆຂອງພວກເຮົາ. ເງິນທຸກກີບຈະຖືກນຳໄປໃຊ້ຢ່າງໂປ່ງໃສ ແລະ ເກີດປະໂຫຍດສູງສຸດ.' 
              : 'Be a part of social change through our various campaigns. Every cent is used transparently for maximum impact.'}
          </p>
        </div>
      </section>

      {/* 2. ສ່ວນເນື້ອຫາ (Grid ລາຍການໂຄງການ) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        
        {loading ? (
          <div className="py-20 text-center font-bold text-teal-600 text-xl">
            {locale === 'lo' ? 'ກຳລັງໂຫຼດຂໍ້ມູນ...' : 'Loading campaigns...'}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            {locale === 'lo' ? 'ຍັງບໍ່ມີໂຄງການໃນຂະນະນີ້.' : 'No campaigns available at the moment.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {campaigns.map((item) => {
              const percent = item.target_amount > 0 
                ? Math.min(Math.round((item.raised_amount / item.target_amount) * 100), 100) 
                : 0;
              
              return (
                <Link href={`/${locale}/campaigns/${item.id}`} key={item.id} className="group bg-white rounded-[2rem] shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col transform hover:-translate-y-2">
                  
                  {/* ຮູບໜ້າປົກ */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img 
                      src={item.cover_image || 'https://via.placeholder.com/800x600?text=No+Image'} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      alt="cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-pink-400 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-md tracking-widest">
                        {item.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* ລາຍລະອຽດ */}
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-teal-600 transition-colors mb-4 line-clamp-2 leading-tight">
                      {locale === 'lo' ? item.title_lo : item.title_en}
                    </h3>
                    
                    <p className="text-gray-500 mb-8 line-clamp-2 leading-relaxed">
                      {locale === 'lo' ? item.desc_lo : item.desc_en}
                    </p>
                    
                    {/* ແຖບຄວາມຄືບໜ້າ */}
                    <div className="mt-auto space-y-3">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-teal-600">{percent}% {locale === 'lo' ? 'ສຳເລັດ' : 'Raised'}</span>
                        <span className="text-gray-400">{Number(item.target_amount).toLocaleString()} LAK</span>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                      </div>
                      <div className="pt-2 flex justify-between items-end">
                        <span className="text-gray-900 font-black text-xl">
                          {Number(item.raised_amount).toLocaleString()} <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">LAK</span>
                        </span>
                        <span className="text-teal-600 font-bold text-sm flex items-center gap-1 group-hover:underline">
                          {locale === 'lo' ? 'ເບິ່ງເພີ່ມເຕີມ' : 'View Details'}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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