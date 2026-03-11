import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export default function HomePage() {
  // ເອີ້ນໃຊ້ຄຳແປຈາກກຸ່ມ "HomePage" ໃນໄຟລ໌ JSON
  const t = useTranslations('HomePage');

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 leading-8">
          {t('description')}
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className="rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 transition-all">
            ຊ່ວຍເຫຼືອດຽວນີ້
          </button>
          <a href="#" className="text-lg font-semibold leading-6 text-gray-900">
            ຮຽນຮູ້ເພີ່ມເຕີມ <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* Transparency Section - ເພື່ອສ້າງຄວາມເຊື່ອໝັ້ນ */}
      <section className="mt-32 border-t pt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">ຜົນກະທົບຂອງພວກເຮົາ</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="bg-gray-50 p-8 rounded-2xl text-center">
            <p className="text-4xl font-bold text-blue-600">100%</p>
            <p className="text-gray-600 mt-2">ໄປເຖິງຜູ້ຮັບໂດຍກົງ</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl text-center">
            <p className="text-4xl font-bold text-blue-600">50+</p>
            <p className="text-gray-600 mt-2">ໂຄງການທີ່ສຳເລັດ</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl text-center">
            <p className="text-4xl font-bold text-blue-600">$0</p>
            <p className="text-gray-600 mt-2">ຄ່າທຳນຽມແພລັດຟອມ</p>
          </div>
        </div>
      </section>
    </div>
  );
}