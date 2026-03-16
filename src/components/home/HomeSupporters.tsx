'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function HomeSupporters() {
  const locale = useLocale();
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        // ດຶງ Logo ມາສະແດງ 6 ອັນດັບທຳອິດ
        const q = query(collection(db, 'sponsors'), orderBy('order_index', 'asc'), limit(6));
        const snap = await getDocs(q);
        setSponsors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };
    fetchSponsors();
  }, []);

  if (sponsors.length === 0) return null;

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

        {/* ໂລໂກ້ Grid */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="w-32 md:w-48 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105">
              <img src={sponsor.logo_url} alt={sponsor.name} className="w-full h-auto object-contain" />
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link href={`/${locale}/supporters`} className="inline-block border-2 border-pink-300 text-pink-400 hover:bg-pink-300 hover:text-white font-black py-3 px-8 rounded-full transition-all uppercase tracking-wide text-sm">
            {locale === 'lo' ? 'ເບິ່ງລາຍຊື່ຜູ້ສະໜັບສະໜູນທັງໝົດ' : 'VIEW ALL SUPPORTERS'}
          </Link>
        </div>
      </div>
    </section>
  );
}