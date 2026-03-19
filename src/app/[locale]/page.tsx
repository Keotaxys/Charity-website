'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Import Components ທີ່ແຍກໄວ້
import HomeHero from '@/components/home/HomeHero';
import HomeAbout from '@/components/home/HomeAbout';
import HomeCampaigns from '@/components/home/HomeCampaigns';
import HomeSupporters from '@/components/home/HomeSupporters';
import HomeVideos from '@/components/home/HomeVideos';

export default function HomePage() {
  const locale = useLocale();
  
  // State ສຳລັບເກັບຈຳນວນໂຄງການທີ່ສຳເລັດ (ຕັ້ງຄ່າເລີ່ມຕົ້ນໄວ້ທີ່ 4 ກ່ອນ)
  const [completedCount, setCompletedCount] = useState(4);

  useEffect(() => {
    const fetchCompletedProjectsCount = async () => {
      try {
        const snap = await getDocs(collection(db, 'campaigns'));
        let count = 0;
        
        snap.forEach(doc => {
          const data = doc.data();
          const target = Number(data.target_amount) || 0;
          const raised = Number(data.raised_amount) || 0;
          const status = data.status?.toLowerCase() || '';

          // ເງື່ອນໄຂໂຄງການສຳເລັດ: status ເປັນ completed/ສຳເລັດ ຫຼື ຍອດບໍລິຈາກຮອດເປົ້າໝາຍແລ້ວ
          if (status === 'completed' || status === 'ສຳເລັດ' || (target > 0 && raised >= target)) {
            count++;
          }
        });

        // 💡 ແກ້ໄຂຈຸດນີ້: ເອົາ 4 (ໂຄງການເກົ່າ) ມາບວກກັບຈຳນວນໂຄງການໃໝ່ທີ່ສຳເລັດໃນລະບົບ
        setCompletedCount(4 + count);
        
      } catch (error) {
        console.error("Error fetching completed campaigns count:", error);
      }
    };

    fetchCompletedProjectsCount();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Hero Section (ວິດີໂອພື້ນຫຼັງ & ຂໍ້ຄວາມ) */}
      <HomeHero />

      {/* 2. ສ່ວນສະຖິຕິ (Stats) ທີ່ດຶງຕົວເລກຈິງ */}
      <section className="bg-white py-16 px-6 border-b border-gray-100 relative z-30 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-3xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-teal-600 mb-2">100%</h3>
            <p className="text-gray-500 font-bold uppercase tracking-wider">
              {locale === 'lo' ? 'ໂປ່ງໃສສາມາດກວດສອບໄດ້' : 'Transparent & Verifiable'}
            </p>
          </div>
          
          <div>
            {/* ສະແດງຕົວເລກໂຄງການທີ່ສຳເລັດແລ້ວຕົວຈິງທີ່ດຶງມາຈາກ Firebase */}
            <h3 className="text-4xl md:text-5xl font-black text-teal-600 mb-2">
              {completedCount}
            </h3>
            <p className="text-gray-500 font-bold uppercase tracking-wider">
              {locale === 'lo' ? 'ໂຄງການທີ່ສຳເລັດ' : 'Completed Projects'}
            </p>
          </div>
          
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-teal-600 mb-2">$0</h3>
            <p className="text-gray-500 font-bold uppercase tracking-wider">
              {locale === 'lo' ? 'ຫັກຄ່າທຳນຽມບໍລິຫານ' : 'Admin Fees Deducted'}
            </p>
          </div>

        </div>
      </section>

      {/* 3. ສ່ວນອື່ນໆ ທີ່ແຍກ Component ໄວ້ແລ້ວ */}
      <HomeCampaigns />
      <HomeAbout />
      <HomeSupporters />
      <HomeVideos />
      
    </div>
  );
}