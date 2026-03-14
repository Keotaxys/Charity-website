'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function HomeCampaigns() {
  const locale = useLocale();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestCampaigns = async () => {
      try {
        // ດຶງຂໍ້ມູນໂຄງການລ່າສຸດ ມາພຽງແຕ່ 3 ອັນເທົ່ານັ້ນ
        const q = query(collection(db, "campaigns"), orderBy("created_at", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching latest campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestCampaigns();
  }, []);

  if (loading) return <div className="py-20 text-center font-bold text-teal-600">ກຳລັງໂຫຼດໂຄງການ...</div>;
  if (campaigns.length === 0) return null; // ຖ້າຍັງບໍ່ມີໂຄງການ ຈະບໍ່ສະແດງຫຍັງເລີຍ

  return (
    <section className="bg-gray-50 py-24 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* ຫົວຂໍ້ພາກສ່ວນ */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              {locale === 'lo' ? 'ໂຄງການທີ່ກຳລັງດຳເນີນການ' : 'ACTIVE CAMPAIGNS'}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl">
              {locale === 'lo' 
                ? 'ຮ່ວມເປັນສ່ວນໜຶ່ງໃນການຊ່ວຍເຫຼືອສັງຄົມກັບພວກເຮົາ ຜ່ານໂຄງການເຫຼົ່ານີ້.' 
                : 'Join us in making a difference through our ongoing projects.'}
            </p>
          </div>
          {/* ປຸ່ມເບິ່ງທັງໝົດ */}
          <Link 
            href={`/${locale}/campaigns`}
            className="hidden md:inline-block bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-black py-3 px-8 rounded-full transition-all uppercase tracking-wide text-sm whitespace-nowrap"
          >
            {locale === 'lo' ? 'ເບິ່ງໂຄງການທັງໝົດ' : 'VIEW ALL CAMPAIGNS'}
          </Link>
        </div>

        {/* ກ່ອງສະແດງໂຄງການ (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.map((item) => {
            const percent = item.target_amount > 0 
              ? Math.min(Math.round((item.raised_amount / item.target_amount) * 100), 100) 
              : 0;
            
            return (
              <Link href={`/${locale}/campaigns/${item.id}`} key={item.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src={item.cover_image} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    alt="cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-pink-400 text-white px-4 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                      {item.status || 'Active'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors mb-4 line-clamp-2">
                    {locale === 'lo' ? item.title_lo : item.title_en}
                  </h3>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-teal-600">{percent}% {locale === 'lo' ? 'ສຳເລັດ' : 'Raised'}</span>
                      <span className="text-gray-500">{Number(item.target_amount).toLocaleString()} LAK</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ປຸ່ມເບິ່ງທັງໝົດ ສຳລັບມືຖື */}
        <div className="mt-10 text-center md:hidden">
          <Link 
            href={`/${locale}/campaigns`}
            className="inline-block w-full bg-white border-2 border-teal-600 text-teal-600 font-black py-4 rounded-full uppercase tracking-wide"
          >
            {locale === 'lo' ? 'ເບິ່ງໂຄງການທັງໝົດ' : 'VIEW ALL CAMPAIGNS'}
          </Link>
        </div>

      </div>
    </section>
  );
}