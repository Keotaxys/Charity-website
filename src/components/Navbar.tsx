'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher'; 

export default function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();

  // ລາຍການເມນູ 2 ພາສາ
  const navLinks = [
    { name: locale === 'lo' ? 'ໜ້າຫຼັກ' : 'HOME', path: `/${locale}` },
    { name: locale === 'lo' ? 'ກ່ຽວກັບພວກເຮົາ' : 'WHO WE ARE', path: `/${locale}/about` },
    { name: locale === 'lo' ? 'ໂຄງການ' : 'CAMPAIGNS', path: `/${locale}/campaigns` },
    { name: locale === 'lo' ? 'ຮ້ານຄ້າ' : 'STORE', path: `/${locale}/store` },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm h-20 flex items-center transition-all">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        
        {/* 1. ໂລໂກ້ (ເບື້ອງຊ້າຍ) */}
        <div className="w-1/4">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            {/* ໃຊ້ສີ Teal ໃຫ້ກັບໂລໂກ້ */}
            <span className="text-3xl font-black text-teal-600 tracking-tighter uppercase">
              BEAST<span className="text-gray-900">.LAO</span>
            </span>
          </Link>
        </div>

        {/* 2. ເມນູ (ເຄິ່ງກາງ) - ເຊື່ອງໃນມືຖື, ສະແດງໃນຈໍໃຫຍ່ */}
        <nav className="hidden md:flex flex-1 justify-center items-center space-x-8">
          {navLinks.map((link) => {
            // ກວດສອບວ່າໜ້າປະຈຸບັນກົງກັບລິ້ງນີ້ບໍ່ (ເພື່ອເຮັດເອັບເຟັກຂີດກ້ອງ)
            const isActive = pathname === link.path || (link.path !== `/${locale}` && pathname.startsWith(link.path));

            return (
              <Link 
                key={link.name} 
                href={link.path}
                className={`font-black text-sm tracking-wide uppercase transition-all duration-300 relative py-2
                  ${isActive ? 'text-teal-600' : 'text-gray-900 hover:text-teal-600'}
                `}
              >
                {link.name}
                {/* ເອັບເຟັກຂີດກ້ອງສີບົວອ່ອນ (Light Pink) ເວລາ Active ຄືກັບຕົ້ນສະບັບ */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-pink-300 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. ປຸ່ມຈັດການ (ເບື້ອງຂວາ) */}
        <div className="w-1/4 flex justify-end items-center gap-4">
          
          {/* ປຸ່ມປ່ຽນພາສາ (ດຶງ Component ເກົ່າທີ່ເຈົ້າມີມາໃຊ້) */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* ປຸ່ມບໍລິຈາກ: ໃຊ້ສີ Teal ແລະ ໂຕໜັງສືສີຂາວ */}
          <Link 
            href={`/${locale}/donate`} 
            className="bg-teal-600 hover:bg-teal-700 text-white font-black py-3 px-8 rounded-full transition-all shadow-md hover:shadow-teal-600/30 uppercase tracking-wide text-sm transform hover:-translate-y-0.5"
          >
            {locale === 'lo' ? 'ບໍລິຈາກ' : 'DONATE'}
          </Link>
          
        </div>

      </div>
    </header>
  );
}