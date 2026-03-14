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
      
      {/* 1. ສ່ວນຫົວ (Header) - ປ່ຽນເປັນສີເທົາອ່ອນ (bg-gray-50) */}
      <section className="bg-gray-50 py-24 px-6 border-b border-gray-100 relative overflow-hidden">
        {/* ຕົກແຕ່ງພື້ນຫຼັງເລັກນ້ອຍໃຫ້ເບິ່ງມີມິຕິ */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase">
            {locale === 'lo' ? 'ທຸກໆການຊ່ວຍເຫຼືອມີຄວາມໝາຍ' : 'EVERY CONTRIBUTION MATTERS'}
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            {locale === 'lo' 
              ? 'ຮ່ວມເປັນສ່ວນໜຶ່ງໃນການປ່ຽນແປງສັງຄົມ ຜ່ານໂຄງການຕ່າງໆຂອງພວກເຮົາ.' 
              : 'Be a part of social change through our various campaigns.'}
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
              // ຄຳນວນເປີເຊັນ (ຖ້າ target_amount ເປັນ 0 ໃຫ້ເປັນ 0 ເພື່ອບໍ່ໃຫ້ Error)
              const percent = item.target_amount > 0 
                ? Math.min(Math.round((item.raised_amount / item.target_amount) * 100), 100) 
                : 0;
              
              return (
                <Link href={`/${locale}/campaigns/${item.id}`} key={item.id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                  
                  {/* ຮູບໜ້າປົກ */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img 
                      src={item.cover_image || 'https://via.placeholder.com/800x600?text=No+Image'} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      alt="cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-pink-400 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-sm tracking-widest">
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
                    
                    {/* ແຖບຄວາມຄືບໜ້າ (Progress Bar) */}
                    <div className="mt-auto space-y-3">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-teal-600">{percent}% {locale === 'lo' ? 'ສຳເລັດ' : 'Raised'}</span>
                        <span className="text-gray-400">{Number(item.target_amount).toLocaleString()} LAK</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                      </div>
                      <div className="pt-2">
                        <span className="text-gray-900 font-black text-lg">
                          {Number(item.raised_amount).toLocaleString()} <span className="text-sm text-gray-500">LAK</span>
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