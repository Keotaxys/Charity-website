'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function TeamPage() {
  const locale = useLocale();

  // ຂໍ້ມູນຈຳລອງຂອງທີມງານ (ສາມາດປ່ຽນຊື່ ແລະ ຮູບພາບຕົວຈິງໄດ້ພາຍຫຼັງ)
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
      
      {/* 1. ສ່ວນຫົວ (Header) - ປັບໃຫ້ເປັນ bg-gray-100 ແລະ py-20 ຕາມ Theme ໃໝ່ */}
      <section className="bg-gray-100 py-20 px-6 border-b border-gray-200 relative overflow-hidden">
        {/* ຕົກແຕ່ງພື້ນຫຼັງດ້ວຍແສງສີ Teal ແລະ ສີບົວ */}
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
              {/* ຮູບພາບ (ມີເອັບເຟັກປ່ຽນຈາກຂາວດຳເປັນສີ ເວລາ Hover) */}
              <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-[2.5rem] bg-gray-100">
                <img 
                  src={member.image} 
                  alt={member.name_en} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
                />
                {/* ເງົາສີ Teal ບາງໆດ້ານລຸ່ມ */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* ຊື່ ແລະ ຕຳແໜ່ງ */}
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

      {/* 3. ສ່ວນຊວນມາເປັນອາສາສະໝັກ (Volunteer Call to Action) */}
      <section className="max-w-4xl mx-auto px-6 mt-10">
        <div className="bg-teal-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          {/* ຕົກແຕ່ງພື້ນຫຼັງ */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">
              {locale === 'lo' ? 'ມາຮ່ວມເປັນສ່ວນໜຶ່ງກັບພວກເຮົາ' : 'BECOME A VOLUNTEER'}
            </h2>
            <p className="text-lg md:text-xl text-teal-100 mb-10">
              {locale === 'lo' 
                ? 'ພວກເຮົາຍິນດີຕ້ອນຮັບທຸກຄົນທີ່ມີໃຈຮັກໃນການຊ່ວຍເຫຼືອສັງຄົມ ເພື່ອມາເປັນອາສາສະໝັກໃນໂຄງການຕໍ່ໄປ.' 
                : 'We welcome anyone with a passion for helping others to join our upcoming projects.'}
            </p>
            <Link 
              href={`/${locale}/about/contact`}
              className="inline-block bg-white text-teal-600 hover:bg-gray-100 font-black py-4 px-10 rounded-full transition-all uppercase tracking-wider text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {locale === 'lo' ? 'ສະໝັກເປັນອາສາສະໝັກ' : 'JOIN THE TEAM'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}