'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function HistoryPage() {
  const locale = useLocale();

  // ຂໍ້ມູນຈຳລອງສຳລັບ Timeline
  const milestones = [
    {
      id: 1,
      year: '2023',
      title_lo: 'ຈຸດເລີ່ມຕົ້ນແຫ່ງຄວາມຕັ້ງໃຈ',
      title_en: 'THE SPARK OF INTENTION',
      desc_lo: 'ທຸກຢ່າງເລີ່ມຕົ້ນຈາກກຸ່ມອາສາສະໝັກນ້ອຍໆ ທີ່ລົງພື້ນທີ່ແຈກຢາຍອາຫານ ແລະ ເຄື່ອງນຸ່ງຫົ່ມໃຫ້ກັບຜູ້ຍາກໄຮ້ໃນຊ່ວງລະດູໜາວ. ພາບຮອຍຍິ້ມຂອງຜູ້ຮັບ ໃນມື້ນັ້ນກາຍເປັນແຮງຜັກດັນທີ່ຍິ່ງໃຫຍ່.',
      desc_en: 'It all started with a small group of volunteers distributing food and warm clothes to the underprivileged during winter. The smiles we saw that day became our greatest driving force.',
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      year: '2024',
      title_lo: 'ໂຄງການໃຫຍ່ຄັ້ງທຳອິດ',
      title_en: 'OUR FIRST MAJOR PROJECT',
      desc_lo: 'ພວກເຮົາໄດ້ລະດົມທຶນສ້າງນ້ຳບາດານ ແລະ ຫ້ອງນ້ຳທີ່ສະອາດ ໃຫ້ກັບໂຮງຮຽນໃນເຂດຫ່າງໄກສອກຫຼີກ ເຊິ່ງຊ່ວຍພັດທະນາຄຸນນະພາບຊີວິດຂອງນັກຮຽນຫຼາຍກວ່າ 300 ຄົນ.',
      desc_en: 'We raised funds to build a clean water system and sanitary restrooms for a remote school, improving the quality of life for over 300 students.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      year: '2025',
      title_lo: 'ການກໍ່ຕັ້ງ BEAST.LAO ຢ່າງເປັນທາງການ',
      title_en: 'OFFICIAL FOUNDATION OF BEAST.LAO',
      desc_lo: 'ເພື່ອໃຫ້ການຊ່ວຍເຫຼືອເປັນລະບົບ ແລະ ໂປ່ງໃສ 100%, ພວກເຮົາໄດ້ຈົດທະບຽນ ແລະ ສ້າງແພລດຟອມນີ້ຂຶ້ນມາ ເພື່ອເປັນຂົວຕໍ່ລະຫວ່າງຜູ້ໃຫ້ ແລະ ຜູ້ຮັບຢ່າງແທ້ຈິງ.',
      desc_en: 'To make our help systematic and 100% transparent, we officially registered and built this platform to truly bridge the gap between donors and those in need.',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      
      {/* 1. ສ່ວນຫົວ (Header) */}
      <section className="bg-gray-100 py-20 px-6 border-b border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-400/15 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase drop-shadow-sm">
            {locale === 'lo' ? 'ປະຫວັດຂອງພວກເຮົາ' : 'OUR HISTORY'}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {locale === 'lo' 
              ? 'ທຸກໆບາດກ້າວຂອງພວກເຮົາ ຄືການສ້າງປະຫວັດສາດແຫ່ງການໃຫ້ທີ່ບໍ່ມີວັນສິ້ນສຸດ.' 
              : 'Every step we take creates a history of endless giving.'}
          </p>
        </div>
      </section>

      {/* 2. ສ່ວນ Timeline ເລົ່າປະຫວັດ */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-24">
          {milestones.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div key={item.id} className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                
                <div className="w-full md:w-1/2 relative group">
                  <div className={`absolute inset-0 rounded-[2.5rem] transform ${isEven ? 'translate-x-4 translate-y-4 bg-teal-100' : '-translate-x-4 translate-y-4 bg-pink-100'} z-0 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0`}></div>
                  
                  <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-xl aspect-[4/3]">
                    <img 
                      src={item.image} 
                      alt={item.title_en} 
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 bg-white text-gray-900 font-black text-2xl py-2 px-6 rounded-2xl shadow-lg">
                      {item.year}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                    {locale === 'lo' ? item.title_lo : item.title_en}
                  </h3>
                  <div className="w-16 h-1 bg-teal-600 rounded-full mx-auto md:mx-0"></div>
                  <p className="text-lg text-gray-600 leading-relaxed pt-4">
                    {locale === 'lo' ? item.desc_lo : item.desc_en}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ສ່ວນອະນາຄົດ (The Future) - ອັບເດດພື້ນຫຼັງຕາມຮູບທີ 1 */}
      <section className="max-w-5xl mx-auto px-6 mt-10">
        {/* ປ່ຽນພື້ນຫຼັງໃຫ້ເປັນສີເທົາເຂັ້ມ (#111827) ແລະ ເພີ່ມ Gradient */}
        <div className="bg-gray-750 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          
          {/* ແສງຕົກແຕ່ງພື້ນຫຼັງ (Teal ແລະ Pink) */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10">
            <h2 className="text-teal-400 font-bold tracking-widest uppercase text-sm mb-4">
              {locale === 'lo' ? 'ກ້າວຕໍ່ໄປຂອງພວກເຮົາ' : 'LOOKING FORWARD'}
            </h2>
            <h3 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter drop-shadow-md">
              {locale === 'lo' ? 'ອະນາຄົດເລີ່ມຕົ້ນທີ່ມື້ນີ້' : 'THE FUTURE STARTS TODAY'}
            </h3>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {locale === 'lo' 
                ? 'ປະຫວັດສາດໜ້າຕໍ່ໄປຂອງ BEAST.LAO ກຳລັງຈະຖືກຂຽນຂຶ້ນ ດ້ວຍການຮ່ວມມືຈາກທ່ານ. ມາຮ່ວມສ້າງສັງຄົມທີ່ໜ້າຢູ່ໄປພ້ອມໆກັນ.' 
                : 'The next chapter of our history is being written with your support. Let’s build a better society together.'}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href={`/${locale}/campaigns`}
                className="bg-teal-600 hover:bg-teal-500 text-white font-black py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-teal-500/50 uppercase tracking-wider text-lg"
              >
                {locale === 'lo' ? 'ຮ່ວມສ້າງປະຫວັດສາດນຳກັນ' : 'JOIN OUR CAUSE'}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}