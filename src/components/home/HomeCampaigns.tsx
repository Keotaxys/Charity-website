'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function HomeCampaigns() {
  const locale = useLocale();
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatestCampaigns = async () => {
      try {
        const q = query(collection(db, "campaigns"), orderBy("created_at", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        setCampaigns(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error("Error:", error); }
    };
    fetchLatestCampaigns();
  }, []);

  if (campaigns.length === 0) return null;

  return (
    <section className="bg-gray-50 py-24 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">{locale === 'lo' ? 'ໂຄງການທີ່ກຳລັງດຳເນີນການ' : 'ACTIVE CAMPAIGNS'}</h2>
            <p className="text-gray-500 text-lg max-w-2xl">{locale === 'lo' ? 'ຮ່ວມເປັນສ່ວນໜຶ່ງໃນການຊ່ວຍເຫຼືອສັງຄົມກັບພວກເຮົາ.' : 'Join us in making a difference.'}</p>
          </div>
          <Link href={`/${locale}/campaigns`} className="hidden md:inline-block bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-black py-3 px-8 rounded-full transition-all uppercase tracking-wide text-sm whitespace-nowrap">
            {locale === 'lo' ? 'ເບິ່ງໂຄງການທັງໝົດ' : 'VIEW ALL CAMPAIGNS'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.map((item) => {
            const target = Number(item.target_amount) || 0;
            const raised = Number(item.raised_amount) || 0;
            const percent = target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 0;
            return (
              <Link href={`/${locale}/campaigns/${item.id}`} key={item.id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col transform hover:-translate-y-2">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img src={item.cover_image} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" alt="cover" />
                  <div className="absolute top-4 left-4"><span className="bg-pink-400 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-md">{item.status || 'ACTIVE'}</span></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-teal-600 transition-colors mb-4 line-clamp-2">{locale === 'lo' ? item.title_lo : item.title_en}</h3>
                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between text-sm font-bold"><span className="text-teal-600">{percent}% {locale === 'lo' ? 'ສຳເລັດ' : 'Raised'}</span><span className="text-gray-400">{target.toLocaleString()} LAK</span></div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}