'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function TeamPage() {
  const locale = useLocale();

  // ຂໍ້ມູນຈຳລອງຂອງທີມງານ
  const teamMembers = [
    {
      id: 1,
      name_lo: 'ສົມຊາຍ ພົມມະຈັນ',
      name_en: 'Somchay Phommachan',
      role_lo: 'ຜູ້ກໍ່ຕັ້ງ & ຜູ້ອຳນວຍການ',
      role_en: 'Founder & Director',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      name_lo: 'ມະນີວັນ ສີສະຫວັດ',
      name_en: 'Maneevan Sisavath',
      role_lo: 'ຫົວໜ້າຝ່າຍປະຕິບັດການ',
      role_en: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      name_lo: 'ອານຸສອນ ວົງພະຈັນ',
      name_en: 'Anouson Vongphachan',
      role_lo: 'ຜູ້ປະສານງານໂຄງການ',
      role_en: 'Project Coordinator',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      name_lo: 'ຈັນທະລາ ແສງທອງ',
      name_en: 'Chanthala Saengthong',
      role_lo: 'ຝ່າຍສື່ສານອົງກອນ',
      role_en: 'Communications Lead',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
            {locale === 'lo' ? 'ທີມງານຂອງພວກເຮົາ' : 'MEET OUR TEAM'}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {locale === 'lo' 
              ? 'ກຸ່ມຄົນຜູ້ຢູ່ເບື້ອງຫຼັງການຂັບເຄື່ອນພາລະກິດ ເພື່ອສ້າງຮອຍຍິ້ມໃຫ້ກັບສັງຄົມ.' 
              : 'The passionate individuals driving our mission forward.'}
          </p>
        </div>
      </section>

      {/* 2. ລາຍຊື່ທີມງານ (Team Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {teamMembers.map((member) => (
            <div key={member.id} className="group text-center">
              <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-[2.5rem] bg-gray-100">
                <img 
                  src={member.image} 
                  alt={member.name_en} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 group-hover:text-teal-600 transition-colors">
                {locale === 'lo' ? member.name_lo : member.name_en}
              </h3>
              <p className="text-pink-400 font-bold text-sm tracking-widest uppercase mt-2">
                {locale === 'lo' ? member.role_lo : member.role_en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ສ່ວນຊວນມາເປັນອາສາສະໝັກ (Volunteer Call to Action) - ອັບເດດພື້ນຫຼັງ */}
      <section className="max-w-4xl mx-auto px-6 mt-10">
        {/* ປ່ຽນພື້ນຫຼັງໃຫ້ເປັນສີເທົາເຂັ້ມ (#111827) ແລະ ເພີ່ມ Gradient */}
        <div className="bg-gray-700 rounded-[2.5rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          
          {/* ແສງຕົກແຕ່ງພື້ນຫຼັງ (Teal ແລະ Pink) */}
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-teal-500/20 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/4"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px] translate-y-1/4 translate-x-1/4"></div>
          
          <div className="relative z-10">
            <h2 className="text-teal-400 font-bold tracking-widest uppercase text-sm mb-4">
              {locale === 'lo' ? 'ຮ່ວມເປັນສ່ວນໜຶ່ງຂອງທີມ' : 'JOIN OUR MOVEMENT'}
            </h2>
            <h3 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter drop-shadow-md">
              {locale === 'lo' ? 'ມາຮ່ວມເປັນອາສາສະໝັກນຳກັນ' : 'BECOME A VOLUNTEER'}
            </h3>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {locale === 'lo' 
                ? 'ພວກເຮົາຍິນດີຕ້ອນຮັບທຸກຄົນທີ່ມີໃຈຮັກໃນການຊ່ວຍເຫຼືອສັງຄົມ ເພື່ອມາເປັນອາສາສະໝັກໃນໂຄງການຕໍ່ໄປ.' 
                : 'We welcome anyone with a passion for helping others to join our upcoming projects.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href={`/${locale}/about/contact`}
                className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-black py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-teal-500/50 uppercase tracking-wider text-lg"
              >
                {locale === 'lo' ? 'ສະໝັກເປັນອາສາສະໝັກ' : 'JOIN THE TEAM'}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}