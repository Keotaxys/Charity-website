'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher'; 

export default function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();

  // 1. ອັບເດດລາຍການເມນູ ໃຫ້ຮອງຮັບລະບົບ Dropdown
  const navLinks = [
    { name: locale === 'lo' ? 'ໜ້າຫຼັກ' : 'HOME', path: `/${locale}` },
    { 
      name: locale === 'lo' ? 'ກ່ຽວກັບພວກເຮົາ' : 'WHO WE ARE', 
      path: `/${locale}/about`,
      // ເພີ່ມ dropdown ເຂົ້າໄປໃນເມນູນີ້
      dropdown: [
        { name: locale === 'lo' ? 'ປະຫວັດຂອງເຮົາ' : 'OUR HISTORY', path: `/${locale}/about/history` },
        { name: locale === 'lo' ? 'ທີມງານ' : 'OUR TEAM', path: `/${locale}/about/team` },
        { name: locale === 'lo' ? 'ຕິດຕໍ່ເຮົາ' : 'CONTACT US', path: `/${locale}/about/contact` },
      ]
    },
    { name: locale === 'lo' ? 'ໂຄງການ' : 'CAMPAIGNS', path: `/${locale}/campaigns` },
    { name: locale === 'lo' ? 'ຜູ້ສະໜັບສະໜູນ' : 'SUPPORTERS', path: `/${locale}/supporters` }, // ເມນູໃໝ່
    { name: locale === 'lo' ? 'ວິດີໂອ' : 'VIDEOS', path: `/${locale}/videos` }, // ເມນູໃໝ່
    { name: locale === 'lo' ? 'ຮ້ານຄ້າ' : 'STORE', path: `/${locale}/store` },
    { name: locale === 'lo' ? 'ແອັດມິນ' : 'ADMIN', path: `/${locale}/admin/login` },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm h-20 flex items-center transition-all">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        
        {/* ໂລໂກ້ */}
        <div className="w-1/4">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-3xl font-black text-teal-600 tracking-tighter uppercase">
              BEAST<span className="text-gray-900">.LAO</span>
            </span>
          </Link>
        </div>

        {/* ເມນູຫຼັກ */}
        <nav className="hidden lg:flex flex-1 justify-center items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== `/${locale}` && pathname.startsWith(link.path));

            return (
              <div key={link.name} className="relative group">
                {/* ຕົວລິ້ງຫຼັກ */}
                <Link 
                  href={link.path}
                  className={`font-black text-xs xl:text-sm tracking-wide uppercase transition-all duration-300 py-6 block
                    ${isActive ? 'text-teal-600' : 'text-gray-900 hover:text-teal-600'}
                  `}
                >
                  {link.name}
                  {/* ເອັບເຟັກຂີດກ້ອງເວລາກົດແລ້ວ (Active) */}
                  {isActive && (
                    <span className="absolute bottom-4 left-0 w-full h-1 bg-pink-300 rounded-full"></span>
                  )}
                </Link>

                {/* 2. ລະບົບ Dropdown ຈະສະແດງກໍຕໍ່ເມື່ອມີ array 'dropdown' ແລະ ເອົາເມົ້າໄປຊີ້ (group-hover) */}
                {link.dropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-xl rounded-2xl w-48 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {link.dropdown.map((subLink) => (
                      <Link
                        key={subLink.name}
                        href={subLink.path}
                        className="block px-5 py-3 text-sm font-bold text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors uppercase tracking-wider"
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ປຸ່ມບໍລິຈາກ ແລະ ປ່ຽນພາສາ */}
        <div className="w-1/4 flex justify-end items-center gap-4">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Link 
            href={`/${locale}/donate`} 
            className="bg-teal-600 hover:bg-teal-700 text-white font-black py-3 px-6 xl:px-8 rounded-full transition-all shadow-md hover:shadow-teal-600/30 uppercase tracking-wide text-sm transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            {locale === 'lo' ? 'ບໍລິຈາກ' : 'DONATE'}
          </Link>
        </div>

      </div>
    </header>
  );
}