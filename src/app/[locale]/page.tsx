'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useLocale } from 'next-intl';

export default function CampaignsPage() {
  const locale = useLocale();
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "campaigns"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCampaigns(data);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-12">ໂຄງການທັງໝົດ (All Campaigns)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {campaigns.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100 mb-4">
              <img 
                src={item.cover_image} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                alt="campaign cover"
              />
            </div>
            {/* ດຶງຊື່ຕາມພາສາທີ່ຜູ້ໃຊ້ເບິ່ງຢູ່ */}
            <h2 className="text-xl font-bold mb-2">
              {locale === 'lo' ? item.title_lo : item.title_en}
            </h2>
            <p className="text-gray-500 line-clamp-2 mb-4">
              {locale === 'lo' ? item.description_lo : item.description_en}
            </p>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600" 
                style={{ width: `${(item.raised_amount / item.target_amount) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}