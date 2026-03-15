'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HomePage() {
  const locale = useLocale();

  // State ສຳລັບເກັບລິ້ງວິດີໂອຈາກ Admin
  const [videoUrl, setVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-working-together-to-clean-the-city-40019-large.mp4');

  // ດຶງລິ້ງວິດີໂອຈາກ Firebase ມາສະແດງ
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().hero_video_url) {
          setVideoUrl(docSnap.data().hero_video_url);
        }
      } catch (error) {
        console.error("Error fetching video settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // 1. ຂໍ້ມູນຈຳລອງ: ໂຄງການ
  const campaigns = [
    {
      id: 1,
      title_lo: 'ໂຄງການຊ່ວຍເຫຼືອໄພນ້ຳຖ້ວມ', title_en: 'Flood Relief Campaign',
      desc_lo: 'ຊ່ວຍເຫຼືອຜູ້ປະສົບໄພນ້ຳຖ້ວມທີ່ຕ້ອງການຄວາມຊ່ວຍເຫຼືອຢ່າງຮີບດ່ວນ.', desc_en: 'Helping flood victims who need urgent assistance.',
      image: 'https://images.unsplash.com/photo-1593113589914-07553e6c7800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      progress: 30, raised: 15000, goal: 50000
    },
    {
      id: 2,
      title_lo: 'ໂຄງການສ້າງໂຮງຮຽນ', title_en: 'School Building Campaign',
      desc_lo: 'ສ້າງໂຮງຮຽນໃໝ່ໃຫ້ນັກຮຽນໃນເຂດຊົນນະບົດ.', desc_en: 'Building a new school for students in rural areas.',
      image: 'https://images.unsplash.com/photo-1427504494785-319ce8372ac0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      progress: 70, raised: 35000, goal: 50000
    },
    {
      id: 3,
      title_lo: 'ໂຄງການຊ່ວຍເຫຼືອສັດປ່າ', title_en: 'Wildlife Rescue Campaign',
      desc_lo: 'ຊ່ວຍເຫຼືອ ແລະ ອະນຸລັກສັດປ່າທີ່ໃກ້ຈະສູນພັນ.', desc_en: 'Rescuing and conserving endangered wildlife.',
      image: 'https://images.unsplash.com/photo-1534567059665-cb525997d91e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      progress: 50, raised: 25000, goal: 50000
    }
  ];

  // 2. ຂໍ້ມູນຈຳລອງ: ຜູ້ສະໜັບສະໜູນ
  const sponsors = [
    { id: 1, name: 'Sponsor 1', logo: 'https://via.placeholder.com/300x150/f9fafb/4b5563?text=Sponsor+1' },
    { id: 2, name: 'Sponsor 2', logo: 'https://via.placeholder.com/300x150/f9fafb/4b5563?text=Sponsor+2' },
    { id: 3, name: 'Sponsor 3', logo: 'https://via.placeholder.com/300x150/f9fafb/4b5563?text=Sponsor+3' },
    { id: 4, name: 'Sponsor 4', logo: 'https://via.placeholder.com/300x150/f9fafb/4b5563?text=Sponsor+4' },
    { id: 5, name: 'Sponsor 5', logo: 'https://via.placeholder.com/300x150/f9fafb/4b5563?text=Sponsor+5' },
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* --- 1. HERO (ວິດີໂອພື້ນຫຼັງ) --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <video 
          key={videoUrl}
          autoPlay loop muted playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover opacity-80"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter drop-shadow-lg">
            {locale === 'lo' ? 'ຍິນດີຕ້ອນຮັບສູ່ ໂຄງການຊ່ວຍເຫຼືອສັງຄົມ' : 'WELCOME TO OUR SOCIETY PROJECT'}
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-12 max-w-3xl mx-auto drop-shadow-md">
            {locale === 'lo' 
              ? 'ພວກເຮົາມີພາລະກິດໃນການປ່ຽນແປງຊີວິດ ແລະ ສ້າງສັງຄົມທີ່ໜ້າຢູ່ໄປພ້ອມໆກັນ.' 
              : 'Our mission is to transform lives and build a better society together.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href={`/${locale}/campaigns`} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-teal-600/50 uppercase tracking-widest text-lg">
              {locale === 'lo' ? 'ຊ່ວຍເຫຼືອດຽວນີ້' : 'HELP NOW'}
            </Link>
            <Link href={`/${locale}/about`} className="bg-transparent border-2 border-white hover:bg-white hover:text-teal-900 text-white font-black py-4 px-10 rounded-full transition-all uppercase tracking-widest text-lg shadow-lg">
              {locale === 'lo' ? 'ຮຽນຮູ້ເພີ່ມເຕີມ' : 'LEARN MORE'}
            </Link>
          </div>
        </div>
      </section>

      {/* --- 2. ສະຖິຕິ (Stats) --- */}
      <section className="bg-white py-16 px-6 border-b border-gray-100 relative z-30 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-3xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-teal-600 mb-2">100%</h3>
            <p className="text-gray-500 font-bold uppercase tracking-wider">{locale === 'lo' ? 'ໂປ່ງໃສສາມາດກວດສອບໄດ້' : 'Transparent & Verifiable'}</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-teal-600 mb-2">50+</h3>
            <p className="text-gray-500 font-bold uppercase tracking-wider">{locale === 'lo' ? 'ໂຄງການທີ່ສຳເລັດ' : 'Completed Projects'}</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-teal-600 mb-2">$0</h3>
            <p className="text-gray-500 font-bold uppercase tracking-wider">{locale === 'lo' ? 'ຫັກຄ່າທຳນຽມ' : 'Admin Fees Deducted'}</p>
          </div>
        </div>
      </section>

      {/* --- 3. ໂຄງການ (Campaigns) --- */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight">
                {locale === 'lo' ? 'ໂຄງການທີ່ກຳລັງດຳເນີນການ' : 'ACTIVE CAMPAIGNS'}
              </h2>
              <p className="text-lg text-gray-600">
                {locale === 'lo' ? 'ຮ່ວມເປັນສ່ວນໜຶ່ງໃນການສ້າງຄວາມປ່ຽນແປງທີ່ຍິ່ງໃຫຍ່ ຜ່ານການລົງມືເຮັດຕົວຈິງ.' : 'Be a part of creating massive change through real action.'}
              </p>
            </div>
            <Link href={`/${locale}/campaigns`} className="bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-black py-3 px-8 rounded-full transition-all uppercase tracking-wider text-sm whitespace-nowrap">
              {locale === 'lo' ? 'ເບິ່ງໂຄງການທັງໝົດ' : 'VIEW ALL CAMPAIGNS'}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {campaigns.map((camp) => (
              <div key={camp.id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col transform hover:-translate-y-2">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img src={camp.image} alt={camp.title_en} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-pink-400 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-sm tracking-widest">ACTIVE</span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-gray-900 group-hover:text-teal-600 transition-colors mb-3 line-clamp-2">
                    {locale === 'lo' ? camp.title_lo : camp.title_en}
                  </h3>
                  <p className="text-gray-500 mb-8 line-clamp-2">{locale === 'lo' ? camp.desc_lo : camp.desc_en}</p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-teal-600">{camp.progress}% {locale === 'lo' ? 'ສຳເລັດ' : 'Raised'}</span>
                      <span className="text-gray-400">{camp.goal.toLocaleString()} LAK</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full transition-all duration-1000" style={{ width: `${camp.progress}%` }}></div>
                    </div>
                    <div className="pt-2 flex justify-between items-end">
                      <span className="text-gray-900 font-black text-xl">{camp.raised.toLocaleString()} <span className="text-sm text-gray-500 uppercase">LAK</span></span>
                      <span className="text-teal-600 font-bold text-sm flex items-center gap-1 group-hover:underline">
                        {locale === 'lo' ? 'ເບິ່ງເພີ່ມເຕີມ' : 'Details'} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. ກ່ຽວກັບພວກເຮົາ (About/Transparency) --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-8">
            <h2 className="text-teal-600 font-bold tracking-widest uppercase text-sm">
              {locale === 'lo' ? 'ກ່ຽວກັບພວກເຮົາ' : 'ABOUT US'}
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight uppercase">
              {locale === 'lo' ? 'ຄວາມໂປ່ງໃສສ້າງໄດ້ ດ້ວຍການລົງມືເຮັດ' : 'TRANSPARENCY BUILT THROUGH ACTION'}
            </h3>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>{locale === 'lo' ? 'ພວກເຮົາເຊື່ອວ່າທຸກໆການບໍລິຈາກມີຄຸນຄ່າສະເໝີ. ທຸກໆໂຄງການທີ່ພວກເຮົາເຮັດ ແມ່ນອີງໃສ່ຄວາມໂປ່ງໃສ ແລະ ສາມາດກວດສອບໄດ້ໃນທຸກຂັ້ນຕອນ.' : 'We believe every donation holds immense value. Every project we undertake is built on transparency and is verifiable at every step.'}</p>
              <p>{locale === 'lo' ? 'ເງິນທຸກກີບທີ່ທ່ານບໍລິຈາກເຂົ້າມາ ຈະຖືກນຳໄປໃຊ້ໃນໂຄງການ 100% ໂດຍບໍ່ມີການຫັກຄ່າໃຊ້ຈ່າຍບໍລິຫານໃດໆທັງສິ້ນ.' : '100% of your donation goes directly to the projects. We do not deduct any administrative fees.'}</p>
            </div>
            <div className="flex gap-4 pt-4">
              <Link href={`/${locale}/financials`} className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-8 rounded-full transition-all shadow-md uppercase tracking-wider text-sm">
                {locale === 'lo' ? 'ອ່ານລາຍງານການເງິນ' : 'VIEW FINANCIALS'}
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-pink-100 rounded-[2.5rem] transform translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 z-0"></div>
            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Transparency" className="relative z-10 w-full rounded-[2.5rem] shadow-2xl object-cover aspect-video md:aspect-[4/3]" />
          </div>
        </div>
      </section>

      {/* --- 5. ຜູ້ສະໜັບສະໜູນ (Supporters) --- */}
      <section className="py-24 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight">
            {locale === 'lo' ? 'ຜູ້ສະໜັບສະໜູນຂອງພວກເຮົາ' : 'OUR SUPPORTERS'}
          </h2>
          <p className="text-lg text-gray-500 mb-16 max-w-2xl mx-auto">
            {locale === 'lo' ? 'ຂໍຂອບໃຈທຸກພາກສ່ວນທີ່ຮ່ວມເປັນກຳລັງສຳຄັນ ໃນການຂັບເຄື່ອນທຸກໆໂຄງການ.' : 'Thank you to all partners who drive our missions forward.'}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center group hover:border-teal-200 transition-colors h-32">
                <img src={sponsor.logo} alt={sponsor.name} className="max-h-full max-w-full object-contain opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
              </div>
            ))}
          </div>
          
          <div className="mt-12">
            <Link href={`/${locale}/supporters`} className="text-teal-600 font-bold hover:underline">
              {locale === 'lo' ? 'ເບິ່ງລາຍຊື່ຜູ້ສະໜັບສະໜູນທັງໝົດ →' : 'View all supporters →'}
            </Link>
          </div>
        </div>
      </section>

      {/* --- 6. ວິດີໂອ (Videos) --- */}
      <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          {/* ວິດີໂອ Iframe */}
          <div className="w-full lg:w-3/5 aspect-video bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-gray-200">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/LXb3EKWsInQ?si=XYZ123" 
              title="Featured Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>

          {/* ເນື້ອຫາວິດີໂອ */}
          <div className="w-full lg:w-2/5 space-y-6">
            <span className="inline-block bg-pink-50 text-pink-500 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest border border-pink-100">
              {locale === 'lo' ? 'ວິດີໂອຫຼ້າສຸດ' : 'LATEST VIDEO'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight uppercase tracking-tight">
              {locale === 'lo' ? 'ພາລະກິດສ້າງໂຮງຮຽນໃໝ່ ໃຫ້ນ້ອງໆຊົນນະບົດ' : 'MISSION: NEW SCHOOL FOR RURAL CHILDREN'}
            </h2>
            <div className="w-16 h-1 bg-teal-600 rounded-full"></div>
            <p className="text-gray-600 leading-relaxed text-lg pt-2">
              {locale === 'lo' 
                ? 'ຕິດຕາມການລົງພື້ນທີ່ຂອງທີມງານ BEAST.LAO ໃນການປຸກສ້າງໂຮງຮຽນຫຼັງໃໝ່ ທີ່ໃຊ້ເວລາພຽງ 30 ມື້ ເພື່ອໃຫ້ນ້ອງໆໄດ້ມີບ່ອນຮຽນທີ່ປອດໄພ.' 
                : 'Follow our team building a new school in just 30 days, providing a safe learning environment.'}
            </p>
            <div className="pt-6 flex flex-wrap gap-4">
              <Link href={`/${locale}/videos`} className="bg-gray-900 hover:bg-gray-800 text-white font-black py-4 px-8 rounded-full transition-all shadow-md uppercase tracking-wider text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                {locale === 'lo' ? 'ເບິ່ງວິດີໂອທັງໝົດ' : 'VIEW ALL VIDEOS'}
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}