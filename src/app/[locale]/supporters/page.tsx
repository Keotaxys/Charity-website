'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function SupportersPage() {
  const locale = useLocale();

  // ຂໍ້ມູນຈຳລອງ: ເພີ່ມ hideName ແລະ hideAmount ເພື່ອຈຳລອງການຕັ້ງຄ່າຄວາມເປັນສ່ວນຕົວ
  const topDonors = [
    { id: 1, name_lo: 'ທະນາຄານ ການຄ້າຕ່າງປະເທດລາວ ມະຫາຊົນ (BCEL)', name_en: 'BCEL Bank', amount: 500000000, hideName: false, hideAmount: false },
    { id: 2, name_lo: 'ບໍລິສັດ ເອລາວ ຈຳກັດ', name_en: 'A-Lao Co., Ltd', amount: 350000000, hideName: true, hideAmount: false }, // ເຊື່ອງຊື່
    { id: 3, name_lo: 'ທ່ານ ສົມພອນ ແກ້ວປະເສີດ', name_en: 'Mr. Somphone Keopaseuth', amount: 200000000, hideName: false, hideAmount: true }, // ເຊື່ອງຈຳນວນເງິນ
    { id: 4, name_lo: 'ຮ້ານຄຳ ສີລິວັນ', name_en: 'Sirivanh Gold Shop', amount: 150000000, hideName: false, hideAmount: false },
    { id: 5, name_lo: 'ກຸ່ມບໍລິສັດ ພີທີຊີ', name_en: 'PTC Group', amount: 100000000, hideName: true, hideAmount: true }, // ເຊື່ອງທັງຊື່ ແລະ ເງິນ
  ];

  const platinumSponsors = [
    { id: 1, name: 'Sponsor Alpha', logo: 'https://via.placeholder.com/400x200/f3f4f6/0d9488?text=PLATINUM+1' },
    { id: 2, name: 'Sponsor Beta', logo: 'https://via.placeholder.com/400x200/f3f4f6/0d9488?text=PLATINUM+2' },
  ];

  const generalSponsors = [
    { id: 3, name: 'Sponsor Gamma', logo: 'https://via.placeholder.com/300x150/f9fafb/4b5563?text=LOGO+3' },
    { id: 4, name: 'Sponsor Delta', logo: 'https://via.placeholder.com/300x150/f9fafb/4b5563?text=LOGO+4' },
    { id: 5, name: 'Sponsor Epsilon', logo: 'https://via.placeholder.com/300x150/f9fafb/4b5563?text=LOGO+5' },
    { id: 6, name: 'Sponsor Zeta', logo: 'https://via.placeholder.com/300x150/f9fafb/4b5563?text=LOGO+6' },
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      
      {/* 1. ສ່ວນຫົວ (Header) */}
      <section className="bg-gray-50 py-24 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase">
            {locale === 'lo' ? 'ຜູ້ສະໜັບສະໜູນຫຼັກ' : 'OUR SUPPORTERS'}
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            {locale === 'lo' 
              ? 'ຂໍຂອບໃຈທຸກພາກສ່ວນ ທີ່ຮ່ວມເປັນກຳລັງສຳຄັນໃນການຂັບເຄື່ອນທຸກໆໂຄງການຂອງພວກເຮົາ ໃຫ້ເກີດຂຶ້ນຈິງ.' 
              : 'Thank you to all our amazing partners who make our missions possible every single day.'}
          </p>
        </div>
      </section>

      {/* 2. ພາກສ່ວນ Top 5 (ມີລະບົບເຊື່ອງຊື່/ເງິນ) */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">
            {locale === 'lo' ? 'ທຳນຽບ 5 ອັນດັບຜູ້ສະໜັບສະໜູນ' : 'TOP 5 WALL OF FAME'}
          </h2>
          <div className="w-20 h-1 bg-teal-600 rounded-full mx-auto"></div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {topDonors.map((donor, index) => {
            const isFirst = index === 0;
            
            // ຈັດການຫຼຽນລາງວັນ
            let rankBadge = <span className="text-gray-400 font-black text-xl">#{index + 1}</span>;
            if (index === 0) rankBadge = <span className="text-3xl" title="Gold">🥇</span>;
            if (index === 1) rankBadge = <span className="text-3xl" title="Silver">🥈</span>;
            if (index === 2) rankBadge = <span className="text-3xl" title="Bronze">🥉</span>;

            // ກວດສອບເງື່ອນໄຂການເຊື່ອງຊື່
            const displayName = donor.hideName 
              ? (locale === 'lo' ? 'ຜູ້ບໍລິຈາກບໍ່ປະສົງອອກນາມ' : 'Anonymous Donor')
              : (locale === 'lo' ? donor.name_lo : donor.name_en);

            return (
              <div 
                key={donor.id} 
                className={`flex items-center p-6 sm:p-8 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  isFirst ? 'bg-gradient-to-r from-yellow-50/50 to-white' : ''
                }`}
              >
                {/* ຕົວເລກອັນດັບ / ຫຼຽນ */}
                <div className="w-12 sm:w-16 flex justify-center items-center shrink-0">
                  {rankBadge}
                </div>
                
                {/* ຊື່ຜູ້ບໍລິຈາກ */}
                <div className="flex-1 px-4">
                  <h3 className={`font-bold sm:text-lg ${donor.hideName ? 'text-gray-400 italic' : (isFirst ? 'text-gray-900' : 'text-gray-700')}`}>
                    {displayName}
                  </h3>
                  {/* ສະແດງຂໍ້ຄວາມນ້ອຍໆຖ້າເຊື່ອງຊື່ */}
                  {donor.hideName && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md mt-1 inline-block">
                      {locale === 'lo' ? 'ຂໍ້ມູນສ່ວນຕົວ' : 'Private'}
                    </span>
                  )}
                </div>
                
                {/* ຈຳນວນເງິນ */}
                <div className="text-right shrink-0">
                  {donor.hideAmount ? (
                    <p className="text-gray-400 italic font-medium text-sm sm:text-base bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      {locale === 'lo' ? 'ບໍ່ເປີດເຜີຍຈຳນວນ' : 'Undisclosed Amount'}
                    </p>
                  ) : (
                    <p className={`font-black tracking-wide ${isFirst ? 'text-teal-600 text-xl sm:text-2xl' : 'text-teal-600 text-lg sm:text-xl'}`}>
                      {donor.amount.toLocaleString()} <span className="text-sm font-bold text-gray-400 uppercase">LAK</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ຜູ້ສະໜັບສະໜູນຫຼັກ (Platinum Sponsors) */}
      <section className="bg-gray-50 py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="inline-block px-6 py-2 bg-pink-50 text-pink-500 font-black rounded-full uppercase tracking-widest text-sm mb-4 border border-pink-100">
              {locale === 'lo' ? 'ຜູ້ສະໜັບສະໜູນລະດັບແພລັດຕິນຳ' : 'PLATINUM PARTNERS'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {platinumSponsors.map((sponsor) => (
              <div key={sponsor.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex items-center justify-center group">
                <img src={sponsor.logo} alt={sponsor.name} className="w-full max-w-sm h-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ຜູ້ສະໜັບສະໜູນທົ່ວໄປ (General Partners) */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="inline-block px-6 py-2 bg-teal-50 text-teal-600 font-black rounded-full uppercase tracking-widest text-sm mb-4 border border-teal-100">
            {locale === 'lo' ? 'ພາກສ່ວນທີ່ໃຫ້ການສະໜັບສະໜູນ' : 'GENERAL PARTNERS'}
          </h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {generalSponsors.map((sponsor) => (
            <div key={sponsor.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center group hover:border-teal-200 transition-colors">
              <img src={sponsor.logo} alt={sponsor.name} className="w-full max-w-[150px] h-auto object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
            </div>
          ))}
        </div>
      </section>

      {/* 5. ສ່ວນ Call to Action */}
      <section className="max-w-4xl mx-auto px-6 mt-10">
        <div className="bg-teal-600 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">
              {locale === 'lo' ? 'ຮ່ວມເປັນຜູ້ສະໜັບສະໜູນ' : 'PARTNER WITH US'}
            </h2>
            <Link href={`/${locale}/about/contact`} className="inline-block bg-white text-teal-600 hover:bg-gray-100 font-black py-4 px-10 rounded-full transition-all uppercase tracking-wider text-lg shadow-lg">
              {locale === 'lo' ? 'ຕິດຕໍ່ເພື່ອສະໜັບສະໜູນ' : 'BECOME A PARTNER'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}