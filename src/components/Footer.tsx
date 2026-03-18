'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Footer() {
  const locale = useLocale();
  const [contact, setContact] = useState<any>({});

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const docRef = doc(db, 'settings', 'contact_info');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setContact(docSnap.data());
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };
    fetchContact();
  }, []);

  return (
    // 💡 ຫຼຸດ pt-16 ເປັນ pt-10, ຫຼຸດ pb-10 ເປັນ pb-6
    <footer className="bg-white pt-10 pb-6 px-6 mt-auto border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* 💡 ຫຼຸດ mb-10 ເປັນ mb-6 */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-6">
          
          {/* ລິ້ງເມນູຕ່າງໆ */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 md:gap-5 text-[11px] md:text-sm font-bold text-gray-500 uppercase tracking-wider">
            <Link href={`/${locale}/privacy`} className="hover:text-teal-600 transition-colors">{locale === 'lo' ? 'ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ' : 'PRIVACY POLICY'}</Link>
            <span className="text-pink-300">|</span>
            <Link href={`/${locale}/terms`} className="hover:text-teal-600 transition-colors">{locale === 'lo' ? 'ເງື່ອນໄຂການບໍລິຈາກ' : 'DISCLOSURE STATEMENT'}</Link>
            <span className="text-pink-300">|</span>
            <Link href={`/${locale}/about/contact`} className="hover:text-teal-600 transition-colors">{locale === 'lo' ? 'ຕິດຕໍ່ພວກເຮົາ' : 'CONTACT'}</Link>
            <span className="text-pink-300">|</span>
            <Link href={`/${locale}/financials`} className="hover:text-teal-600 transition-colors">{locale === 'lo' ? 'ລາຍງານການເງິນ' : 'FINANCIALS'}</Link>
          </div>

          {/* ໄອຄອນ Social Media - 💡 ປັບຂະໜາດປຸ່ມຈາກ w-12 h-12 ເປັນ w-10 h-10 ເພື່ອຄວາມກະທັດຮັດ */}
          <div className="flex items-center gap-3">
            {contact.instagram_url && (
              <a href={contact.instagram_url} target="_blank" className="w-10 h-10 bg-pink-100 hover:bg-teal-600 text-pink-600 hover:text-white rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            )}
            {contact.facebook_url && (
              <a href={contact.facebook_url} target="_blank" className="w-10 h-10 bg-pink-100 hover:bg-teal-600 text-pink-600 hover:text-white rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            )}
            {contact.youtube_url && (
              <a href={contact.youtube_url} target="_blank" className="w-10 h-10 bg-pink-100 hover:bg-teal-600 text-pink-600 hover:text-white rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            )}
            {contact.tiktok_url && (
              <a href={contact.tiktok_url} target="_blank" className="w-10 h-10 bg-pink-100 hover:bg-teal-600 text-pink-600 hover:text-white rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.39-2.22 1.89-5.32 2.51-8.15 1.74-2.73-.74-5.06-2.82-5.83-5.59-.72-2.6-.04-5.46 1.69-7.46 1.71-1.98 4.39-2.92 6.95-2.67v4.07c-1.39-.1-2.83.27-3.85 1.16-.92.81-1.4 2.06-1.25 3.28.14 1.16.92 2.22 1.98 2.64 1.09.43 2.37.3 3.32-.38.86-.62 1.4-1.6 1.48-2.64.08-2.83.02-5.67.04-8.51 0-3.34-.01-6.68.01-10.02h2.88z"/></svg>
              </a>
            )}
          </div>
        </div>

        {/* 💡 ຫຼຸດ pt-8 ເປັນ pt-5 */}
        <div className="border-t border-gray-100 pt-5 flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} BEAST.LAO. {locale === 'lo' ? 'ສະຫງວນລິຂະສິດ.' : 'ALL RIGHTS RESERVED.'}</p>
          <p>WEB DEVELOPMENT BY BEAST.LAO</p>
        </div>
      </div>
    </footer>
  );
}