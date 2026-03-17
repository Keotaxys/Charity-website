'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AboutPage() {
  const locale = useLocale();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'settings', 'about_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching about page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ຖ້າກຳລັງໂຫຼດ ໃຫ້ສະແດງ Loading ທີ່ສວຍງາມ
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-teal-600 uppercase tracking-widest text-lg">
          {locale === 'lo' ? 'ກຳລັງໂຫຼດຂໍ້ມູນ...' : 'Loading...'}
        </p>
      </div>
    );
  }

  // ຖ້າໂຫຼດສຳເລັດ ແຕ່ບໍ່ມີຂໍ້ມູນ ໃຫ້ໃຊ້ຂໍ້ມູນສຳຮອງ (Fallback)
  const headerTitle = data ? (locale === 'lo' ? data.header_title_lo : data.header_title_en) : 'ກ່ຽວກັບພວກເຮົາ';
  const headerSubtitle = data ? (locale === 'lo' ? data.header_subtitle_lo : data.header_subtitle_en) : '';

  const storySmall = data ? (locale === 'lo' ? data.story_small_lo : data.story_small_en) : '';
  const storyMain = data ? (locale === 'lo' ? data.story_main_lo : data.story_main_en) : '';
  const storyDesc1 = data ? (locale === 'lo' ? data.story_desc1_lo : data.story_desc1_en) : '';
  const storyDesc2 = data ? (locale === 'lo' ? data.story_desc2_lo : data.story_desc2_en) : '';
  const storyImage = data?.story_image || 'https://images.unsplash.com/photo-1593113589914-07553e6c7800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';

  const valuesTitle = data ? (locale === 'lo' ? data.values_title_lo : data.values_title_en) : '';
  const v1Title = data ? (locale === 'lo' ? data.v1_title_lo : data.v1_title_en) : '';
  const v1Desc = data ? (locale === 'lo' ? data.v1_desc_lo : data.v1_desc_en) : '';
  const v2Title = data ? (locale === 'lo' ? data.v2_title_lo : data.v2_title_en) : '';
  const v2Desc = data ? (locale === 'lo' ? data.v2_desc_lo : data.v2_desc_en) : '';
  const v3Title = data ? (locale === 'lo' ? data.v3_title_lo : data.v3_title_en) : '';
  const v3Desc = data ? (locale === 'lo' ? data.v3_desc_lo : data.v3_desc_en) : '';

  const ctaTitle = data ? (locale === 'lo' ? data.cta_title_lo : data.cta_title_en) : '';
  const ctaSubtitle = data ? (locale === 'lo' ? data.cta_subtitle_lo : data.cta_subtitle_en) : '';

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. ສ່ວນຫົວ (Header) */}
      <section className="bg-gray-100 py-20 px-6 border-b border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-400/15 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase drop-shadow-sm">
            {headerTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium">
            {headerSubtitle}
          </p>
        </div>
      </section>

      {/* 2. ສ່ວນເລົ່າປະຫວັດ (Our Story) */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* ເນື້ອຫາ (ເບື້ອງຊ້າຍ) */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h2 className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-3">
                {storySmall}
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {storyMain}
              </h3>
            </div>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p className="whitespace-pre-line">{storyDesc1}</p>
              {storyDesc2 && <p className="whitespace-pre-line">{storyDesc2}</p>}
            </div>

            {/* ປຸ່ມຂອບ Teal, ພື້ນຂາວ, ຕົວໜັງສື Teal */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link 
                href={`/${locale}/about`} 
                className="bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white text-center font-black py-4 px-8 rounded-full transition-all uppercase tracking-wide text-sm transform hover:-translate-y-1 shadow-sm"
              >
                {locale === 'lo' ? 'ອ່ານປະຫວັດຂອງພວກເຮົາ' : 'READ OUR STORY'}
              </Link>
            </div>
          </div>

          {/* ຮູບພາບ (ເບື້ອງຂວາ) */}
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-pink-100 rounded-3xl transform translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 z-0 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0"></div>
            <img 
              src={storyImage} 
              alt="Our Story" 
              className="relative z-10 w-full h-auto object-cover rounded-3xl shadow-xl aspect-square md:aspect-[4/3] transition-transform duration-700 group-hover:scale-105"
            />
          </div>

        </div>
      </section>

      {/* 3. ຄ່ານິຍົມຫຼັກ (Core Values) */}
      <section className="bg-gray-50 py-24 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">
              {valuesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Value 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{v1Title}</h3>
              <p className="text-gray-600">{v1Desc}</p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{v2Title}</h3>
              <p className="text-gray-600">{v2Desc}</p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{v3Title}</h3>
              <p className="text-gray-600">{v3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ສ່ວນ Call to Action - ອັບເດດພື້ນຫຼັງສີເທົາອ່ອນ + Gradient */}
      <section className="bg-gray-50 border-t border-gray-100 py-24 px-6 relative overflow-hidden mt-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter uppercase">
            {ctaTitle}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href={`/${locale}/campaigns`}
              className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-teal-600/50 uppercase tracking-wider text-lg"
            >
              {locale === 'lo' ? 'ເບິ່ງໂຄງການທັງໝົດ' : 'VIEW CAMPAIGNS'}
            </Link>
            <Link 
              href={`/${locale}/about/contact`}
              className="bg-transparent border-2 border-pink-300 text-pink-400 hover:bg-pink-300 hover:text-white font-black py-4 px-10 rounded-full transition-all uppercase tracking-wider text-lg"
            >
              {locale === 'lo' ? 'ຕິດຕໍ່ພວກເຮົາ' : 'CONTACT US'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}