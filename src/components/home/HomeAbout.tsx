'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeAbout() {
  const locale = useLocale();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'settings', 'about_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setData(docSnap.data());
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };
    fetchData();
  }, []);

  // ໃຊ້ຂໍ້ມູນຈາກ Firebase, ຖ້າຍັງໂຫຼດບໍ່ແລ້ວໃຫ້ໃຊ້ຂໍ້ຄວາມສຳຮອງ
  const title = data ? (locale === 'lo' ? data.story_main_lo : data.story_main_en) : (locale === 'lo' ? 'ຄວາມຫວັງສ້າງໄດ້ ດ້ວຍການລົງມືເຮັດ' : 'HOPE IS BUILT THROUGH ACTION');
  const desc1 = data ? (locale === 'lo' ? data.story_desc1_lo : data.story_desc1_en) : (locale === 'lo' ? 'ພວກເຮົາຄືກຸ່ມຄົນທີ່ເຊື່ອໝັ້ນໃນພະລັງຂອງການໃຫ້...' : 'We are a group of individuals who believe in the power of giving...');
  const desc2 = data ? (locale === 'lo' ? data.story_desc2_lo : data.story_desc2_en) : '';
  const image = data?.story_image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* ຮູບພາບ (ເບື້ອງຊ້າຍ) */}
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute -inset-4 bg-pink-100 rounded-3xl transform -rotate-3 z-0"></div>
          <img 
            src={image} 
            alt="About Us" 
            className="relative z-10 w-full h-auto object-cover rounded-3xl shadow-xl aspect-[4/3] transition-opacity duration-500"
          />
          <div className="absolute -bottom-6 -right-6 bg-teal-600 text-white p-6 rounded-2xl shadow-xl z-20 hidden md:block transform hover:scale-105 transition-transform cursor-default">
            <p className="text-4xl font-black mb-1">100%</p>
            <p className="text-sm font-bold uppercase tracking-wider">
              {locale === 'lo' ? 'ບໍ່ຫັກຄ່າໃຊ້ຈ່າຍ' : 'NON-PROFIT'}
            </p>
          </div>
        </div>

        {/* ເນື້ອຫາ (ເບື້ອງຂວາ) */}
        <div className="w-full lg:w-1/2 space-y-8 mt-10 lg:mt-0 relative z-10">
          <div>
            <h3 className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-3">
              {locale === 'lo' ? 'ກ່ຽວກັບພວກເຮົາ' : 'WHO WE ARE'}
            </h3>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
              {title}
            </h2>
          </div>
          
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>{desc1}</p>
            {desc2 && <p>{desc2}</p>}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/about`} className="bg-gray-900 hover:bg-black text-white text-center font-black py-4 px-8 rounded-full transition-all shadow-md hover:shadow-xl uppercase tracking-wide text-sm transform hover:-translate-y-1">
              {locale === 'lo' ? 'ອ່ານປະຫວັດຂອງພວກເຮົາ' : 'READ OUR STORY'}
            </Link>
            <Link href={`/${locale}/about/team`} className="bg-transparent border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white text-center font-black py-4 px-8 rounded-full transition-all uppercase tracking-wide text-sm">
              {locale === 'lo' ? 'ຮູ້ຈັກກັບທີມງານ' : 'MEET THE TEAM'}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}