'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function HomeSupporters() {
  const locale = useLocale();
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        // ດຶງໂລໂກ້ທັງໝົດມາ ລຽງຕາມລຳດັບ (Order Index)
        const q = query(collection(db, 'sponsors'), orderBy('order_index', 'asc'));
        const snap = await getDocs(q);
        setSponsors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { 
        console.error("Error fetching sponsors:", error); 
      }
    };
    fetchSponsors();
  }, []);

  if (sponsors.length === 0) return null;

  // ແຍກປະເພດຜູ້ສະໜັບສະໜູນ
  const platinumSponsors = sponsors.filter(s => s.type === 'platinum');
  const generalSponsors = sponsors.filter(s => s.type === 'general');

  return (
    <section className="bg-white py-24 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          {locale === 'lo' ? 'ຂໍຂອບໃຈຜູ້ສະໜັບສະໜູນຫຼັກ' : 'OUR INCREDIBLE SUPPORTERS'}
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-16">
          {locale === 'lo' 
            ? 'ທຸກໂຄງການຂອງພວກເຮົາຈະເກີດຂຶ້ນບໍ່ໄດ້ເລີຍ ຖ້າປາສະຈາກການຊ່ວຍເຫຼືອຈາກພາກສ່ວນເຫຼົ່ານີ້.' 
            : 'Our missions are made possible through the generous support of our partners.'}
        </p>

        {/* --- ແຖວທີ 1: Premium (Platinum) ໂລໂກ້ໃຫຍ່ --- */}
        {platinumSponsors.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 mb-12">
            {platinumSponsors.map((sponsor) => (
              <div key={sponsor.id} className="w-36 md:w-56 transition-transform duration-300 hover:scale-105">
                <img 
                  src={sponsor.logo_url} 
                  alt={sponsor.name} 
                  className="w-full h-auto object-contain drop-shadow-sm" 
                />
              </div>
            ))}
          </div>
        )}

        {/* --- ແຖວທີ 2: ທົ່ວໄປ (General) ໂລໂກ້ນ້ອຍ --- */}
        {generalSponsors.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 mt-8 opacity-90">
            {generalSponsors.map((sponsor) => (
              <div key={sponsor.id} className="w-20 md:w-32 transition-transform duration-300 hover:scale-105">
                <img 
                  src={sponsor.logo_url} 
                  alt={sponsor.name} 
                  className="w-full h-auto object-contain" 
                />
              </div>
            ))}
          </div>
        )}

        {/* ປຸ່ມກົດ (ຮູບແບບຂອບສີບົວ ຕາມຮູບທີ 10) */}
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