'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export default function HomeSupporters() {
  const locale = useLocale();
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ດຶງຂໍ້ຄວາມຫົວຂໍ້
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setHomeData(docSnap.data());

        // ດຶງໂລໂກ້ທັງໝົດ
        const q = query(collection(db, 'sponsors'), orderBy('order_index', 'asc'));
        const snap = await getDocs(q);
        setSponsors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) { 
        console.error("Error fetching sponsors:", error); 
      }
    };
    fetchData();
  }, []);

  if (sponsors.length === 0) return null;

  const platinumSponsors = sponsors.filter(s => s.type === 'platinum');
  const generalSponsors = sponsors.filter(s => s.type === 'general');

  const title = homeData ? (locale === 'lo' ? homeData.sponsor_title_lo : homeData.sponsor_title_en) : '';
  const subtitle = homeData ? (locale === 'lo' ? homeData.sponsor_subtitle_lo : homeData.sponsor_subtitle_en) : '';

  return (
    <section className="bg-white py-24 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* ຫົວຂໍ້ ດຶງຈາກ Admin */}
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          {title || (locale === 'lo' ? 'ຂໍຂອບໃຈຜູ້ສະໜັບສະໜູນຫຼັກ' : 'OUR INCREDIBLE SUPPORTERS')}
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
          {subtitle || (locale === 'lo' ? 'ທຸກໂຄງການຂອງພວກເຮົາຈະເກີດຂຶ້ນບໍ່ໄດ້ເລີຍ ຖ້າປາສະຈາກການຊ່ວຍເຫຼືອຈາກພາກສ່ວນເຫຼົ່ານີ້.' : 'Our missions are made possible through the generous support of our partners.')}
        </p>

        {/* ແຖວທີ 1: Premium (Platinum) */}
        {platinumSponsors.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 mb-8">
            {platinumSponsors.map((sponsor) => (
              <div key={sponsor.id} className="w-36 md:w-56 transition-transform duration-300 hover:scale-105">
                <img src={sponsor.logo_url} alt={sponsor.name} className="w-full h-auto object-contain drop-shadow-sm" />
              </div>
            ))}
          </div>
        )}

        {/* ເສັ້ນຂີດຂັ້ນ (ສະແດງສະເພາະເມື່ອມີທັງສອງປະເພດ) */}
        {platinumSponsors.length > 0 && generalSponsors.length > 0 && (
          <div className="w-full max-w-2xl mx-auto h-[2px] bg-gradient-to-r from-transparent via-teal-200 to-transparent my-12"></div>
        )}

        {/* ແຖວທີ 2: ທົ່ວໄປ (General) */}
        {generalSponsors.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 mt-8 opacity-90">
            {generalSponsors.map((sponsor) => (
              <div key={sponsor.id} className="w-20 md:w-32 transition-transform duration-300 hover:scale-105">
                <img src={sponsor.logo_url} alt={sponsor.name} className="w-full h-auto object-contain" />
              </div>
            ))}
          </div>
        )}

        {/* ປຸ່ມເບິ່ງທັງໝົດ */}
        <div className="mt-16">
          <Link 
            href={`/${locale}/supporters`} 
            className="inline-block border-2 border-pink-400 text-pink-500 hover:bg-pink-50 font-bold py-3.5 px-10 rounded-full transition-all text-sm tracking-wide"
          >
            {locale === 'lo' ? 'ເບິ່ງລາຍຊື່ຜູ້ສະໜັບສະໜູນທັງໝົດ' : 'VIEW ALL SUPPORTERS'}
          </Link>
        </div>

      </div>
    </section>
  );
}