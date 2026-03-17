'use client';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TermsPage() {
  const locale = useLocale();
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'policies_page'));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setContent(locale === 'lo' ? data.terms_lo : data.terms_en);
      }
    };
    fetchData();
  }, [locale]);

  return (
    <div className="bg-white min-h-screen pb-24">
      <section className="bg-gray-50 py-20 px-6 border-b border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-400/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase drop-shadow-sm">
            {locale === 'lo' ? 'ເງື່ອນໄຂການບໍລິຈາກ' : 'TERMS OF DONATION'}
          </h1>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
          {content || (locale === 'lo' ? 'ກຳລັງອັບເດດຂໍ້ມູນ...' : 'Updating content...')}
        </div>
      </section>
    </div>
  );
}