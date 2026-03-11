'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function CampaignsPage() {
  const locale = useLocale();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "campaigns"), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">ກຳລັງໂຫຼດ...</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
            {locale === 'lo' ? 'ທຸກໆການຊ່ວຍເຫຼືອມີຄວາມໝາຍ' : 'EVERY DONATION MATTERS'}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {locale === 'lo' 
              ? 'ຮ່ວມເປັນສ່ວນໜຶ່ງໃນການປ່ຽນແປງສັງຄົມ ຜ່ານໂຄງການຕ່າງໆຂອງພວກເຮົາ.' 
              : 'Be a part of the change through our ongoing impact projects.'}
          </p>
        </div>
      </section>

      {/* Campaigns Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {campaigns.map((item) => {
            const percent = item.target_amount > 0 
              ? Math.min(Math.round((item.raised_amount / item.target_amount) * 100), 100) 
              : 0;
            
            return (
              <Link href={`/${locale}/campaigns/${item.id}`} key={item.id} className="group">
                <div className="relative overflow-hidden rounded-3xl bg-gray-100 aspect-[16/10] mb-6 shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <img 
                    src={item.cover_image} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    alt="cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                      {item.status || 'Active'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {locale === 'lo' ? item.title_lo : item.title_en}
                  </h2>
                  
                  {/* Progress Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-blue-600">{percent}% {locale === 'lo' ? 'ສຳເລັດ' : 'Raised'}</span>
                      <span className="text-gray-500">{Number(item.target_amount).toLocaleString()} LAK</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                    {locale === 'lo' ? item.description_lo : item.description_en}
                  </p>

                  <button className="w-full border-2 border-gray-900 py-3 rounded-xl font-bold group-hover:bg-gray-900 group-hover:text-white transition-all">
                    {locale === 'lo' ? 'ເບິ່ງລາຍລະອຽດ' : 'VIEW DETAILS'}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}