'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function AboutPage() {
  const locale = useLocale();

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. ສ່ວນຫົວ (Hero Section) */}
      <section className="bg-gray-900 text-white py-32 px-6 relative overflow-hidden">
        {/* ຕົກແຕ່ງພື້ນຫຼັງ */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase">
            {locale === 'lo' ? 'ກ່ຽວກັບພວກເຮົາ' : 'WHO WE ARE'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium">
            {locale === 'lo' 
              ? 'ພວກເຮົາສ້າງການປ່ຽນແປງທີ່ຍິ່ງໃຫຍ່ ດ້ວຍການລົງມືເຮັດຕົວຈິງ.' 
              : 'We create massive impact through real action.'}
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
                {locale === 'lo' ? 'ຈຸດເລີ່ມຕົ້ນຂອງພວກເຮົາ' : 'OUR HUMBLE BEGINNINGS'}
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {locale === 'lo' ? 'ຈາກຄວາມຕັ້ງໃຈນ້ອຍໆ ສູ່ການຊ່ວຍເຫຼືອທີ່ຍິ່ງໃຫຍ່' : 'FROM A SIMPLE IDEA TO MASSIVE IMPACT'}
              </h3>
            </div>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                {locale === 'lo' 
                  ? 'BEAST.LAO ຖືກສ້າງຕັ້ງຂຶ້ນມາຈາກກຸ່ມຄົນທຳມະດາ ທີ່ເຫັນເຖິງບັນຫາຄວາມຫຍຸ້ງຍາກໃນສັງຄົມ ແລະ ບໍ່ຢາກເປັນພຽງແຕ່ຜູ້ເຝົ້າເບິ່ງ. ພວກເຮົາຕັດສິນໃຈລວມຕົວກັນເພື່ອສ້າງແພລດຟອມ ທີ່ເປັນຂົວຕໍ່ລະຫວ່າງ "ຜູ້ໃຫ້" ແລະ "ຜູ້ຮັບ".'
                  : 'BEAST.LAO was founded by a group of ordinary people who saw the struggles in our society and refused to just watch. We decided to build a platform that bridges the gap between those who want to give and those in need.'}
              </p>
              <p>
                {locale === 'lo'
                  ? 'ທຸກໆໂຄງການທີ່ພວກເຮົາເຮັດ ແມ່ນອີງໃສ່ຄວາມໂປ່ງໃສ 100%. ພວກເຮົາເຊື່ອວ່າທຸກການບໍລິຈາກ ບໍ່ວ່າຈະໜ້ອຍ ຫຼື ຫຼາຍ ລ້ວນແລ້ວແຕ່ມີພະລັງໃນການປ່ຽນແປງຊີວິດຂອງໃຜບາງຄົນສະເໝີ.'
                  : 'Every project we undertake is built on 100% transparency. We believe that every donation, big or small, has the power to change someone’s life forever.'}
              </p>
            </div>
          </div>

          {/* ຮູບພາບ (ເບື້ອງຂວາ) */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-pink-100 rounded-3xl transform translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1593113589914-07553e6c7800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Our Story" 
              className="relative z-10 w-full h-auto object-cover rounded-3xl shadow-xl aspect-square md:aspect-[4/3]"
            />
          </div>

        </div>
      </section>

      {/* 3. ຄ່ານິຍົມຫຼັກ (Core Values) */}
      <section className="bg-gray-50 py-24 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">
              {locale === 'lo' ? 'ຫຼັກການເຮັດວຽກຂອງພວກເຮົາ' : 'OUR CORE VALUES'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Value 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{locale === 'lo' ? 'ຄວາມໂປ່ງໃສ' : 'TRANSPARENCY'}</h3>
              <p className="text-gray-600">
                {locale === 'lo' ? 'ເງິນທຸກກີບຈະຖືກແຈກແຈງຢ່າງຊັດເຈນ ແລະ ສາມາດກວດສອບໄດ້.' : 'Every cent is clearly accounted for and publicly verifiable.'}
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{locale === 'lo' ? 'ຄວາມເມດຕາ' : 'COMPASSION'}</h3>
              <p className="text-gray-600">
                {locale === 'lo' ? 'ພວກເຮົາເຮັດວຽກດ້ວຍຄວາມຮັກ ແລະ ຄວາມເຫັນອົກເຫັນໃຈເພື່ອນມະນຸດ.' : 'We operate with love and deep empathy for our fellow human beings.'}
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{locale === 'lo' ? 'ການລົງມືເຮັດຈິງ' : 'REAL ACTION'}</h3>
              <p className="text-gray-600">
                {locale === 'lo' ? 'ບໍ່ພຽງແຕ່ເວົ້າ ແຕ່ພວກເຮົາລົງພື້ນທີ່ ແລະ ແກ້ໄຂບັນຫາຢ່າງຈິງຈັງ.' : 'We don’t just talk; we go to the field and solve problems directly.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ສ່ວນ Call to Action */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-8 uppercase">
            {locale === 'lo' ? 'ຮ່ວມເປັນສ່ວນໜຶ່ງກັບພວກເຮົາ' : 'JOIN OUR MISSION'}
          </h2>
          <p className="text-xl text-gray-500 mb-10">
            {locale === 'lo' ? 'ບໍ່ວ່າທ່ານຈະເປັນໃຜ ກໍສາມາດສ້າງການປ່ຽນແປງໄດ້.' : 'No matter who you are, you can make a difference.'}
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