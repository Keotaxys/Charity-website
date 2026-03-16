'use client';

// Import Components ທີ່ແຍກໄວ້
import HomeHero from '@/components/home/HomeHero';
import HomeAbout from '@/components/home/HomeAbout';
import HomeCampaigns from '@/components/home/HomeCampaigns';
import HomeSupporters from '@/components/home/HomeSupporters';
import HomeVideos from '@/components/home/HomeVideos';

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Hero Section (ແຍກອອກໄປແລ້ວ) */}
      <HomeHero />

      {/* 2. ສ່ວນສະຖິຕິ (Stats) - ສາມາດແຍກເປັນ Component ໄດ້ຄືກັນຖ້າຕ້ອງການ */}
      <section className="bg-white py-16 px-6 border-b border-gray-100 relative z-30 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-3xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-teal-600 mb-2">100%</h3>
            <p className="text-gray-500 font-bold uppercase tracking-wider">ໂປ່ງໃສສາມາດກວດສອບໄດ້</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-teal-600 mb-2">50+</h3>
            <p className="text-gray-500 font-bold uppercase tracking-wider">ໂຄງການທີ່ສຳເລັດ</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-teal-600 mb-2">$0</h3>
            <p className="text-gray-500 font-bold uppercase tracking-wider">ຫັກຄ່າທຳນຽມ</p>
          </div>
        </div>
      </section>

      {/* 3. ສ່ວນອື່ນໆ ທີ່ແຍກໄວ້ແລ້ວ */}
      <HomeCampaigns />
      <HomeAbout />
      <HomeSupporters />
      <HomeVideos />
      
    </div>
  );
}