'use client';

import { useState } from 'react'; // 💡 ເພີ່ມ useState ເຂົ້າມາ
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // 💡 ສ້າງ State ສຳລັບເປີດ/ປິດເມນູມືຖື

  const navLinks = [
    { name: locale === 'lo' ? 'ໜ້າຫຼັກ' : 'HOME', path: `/${locale}` },
    { name: locale === 'lo' ? 'ໂຄງການ' : 'CAMPAIGNS', path: `/${locale}/campaigns` },
    {
      name: locale === 'lo' ? 'ກ່ຽວກັບພວກເຮົາ' : 'WHO WE ARE',
      path: `/${locale}/about`,
      dropdown: [
        { name: locale === 'lo' ? 'ປະຫວັດຂອງເຮົາ' : 'OUR HISTORY', path: `/${locale}/about/history` },
        { name: locale === 'lo' ? 'ທີມງານ' : 'OUR TEAM', path: `/${locale}/about/team` },
        { name: locale === 'lo' ? 'ຕິດຕໍ່ເຮົາ' : 'CONTACT US', path: `/${locale}/about/contact` },
      ]
    },
    { name: locale === 'lo' ? 'ຜູ້ສະໜັບສະໜູນ' : 'SUPPORTERS', path: `/${locale}/supporters` },
    { name: locale === 'lo' ? 'ວິດີໂອ' : 'VIDEOS', path: `/${locale}/videos` },
    {
      name: locale === 'lo' ? 'ຮ້ານຄ້າ' : 'STORE',
      path: 'https://your-store-website.com',
      isExternal: true
    },
    { name: locale === 'lo' ? 'ແອັດມິນ' : 'ADMIN', path: `/${locale}/admin/dashboard` },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm h-20 flex items-center transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex justify-between items-center gap-4 xl:gap-8">

        {/* ໂລໂກ້ */}
        <div className="shrink-0 flex items-center h-20">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-2xl xl:text-3xl font-black text-teal-600 tracking-tighter uppercase">
              Little<span className="text-gray-900">Magician</span>
            </span>
          </Link>
        </div>

        {/* ເມນູຫຼັກ (ສຳລັບຈໍຄອມ) */}
        <nav className="hidden lg:flex flex-1 justify-center items-center space-x-5 xl:space-x-8 px-4 h-full">
          {navLinks.map((link) => {
            const isActive = !link.isExternal && (pathname === link.path || (link.path !== `/${locale}` && pathname.startsWith(link.path)));

            return (
              <div key={link.name} className="relative group flex items-center h-full">
                <Link
                  href={link.path}
                  target={link.isExternal ? "_blank" : "_self"}
                  rel={link.isExternal ? "noopener noreferrer" : ""}
                  className={`font-bold text-[14px] xl:text-[15px] tracking-wider uppercase transition-all duration-300 flex items-center h-full whitespace-nowrap
                    ${isActive ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}
                  `}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-[22px] left-0 w-full h-1 bg-pink-300 rounded-full"></span>
                  )}
                </Link>

                {link.dropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-xl rounded-2xl w-48 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 before:absolute before:content-[''] before:-top-4 before:left-0 before:w-full before:h-4">
                    {link.dropdown.map((subLink) => (
                      <Link
                        key={subLink.name}
                        href={subLink.path}
                        className="block px-5 py-3 text-sm xl:text-[15px] font-bold text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors uppercase tracking-wider whitespace-nowrap"
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

        {/* ປຸ່ມບໍລິຈາກ, ປ່ຽນພາສາ ແລະ ປຸ່ມ 3 ຂີດ (ມືຖື) */}
        <div className="shrink-0 flex items-center gap-3 sm:gap-5 xl:gap-6 ml-auto">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <Link
            href={`/${locale}/donate`}
            className="bg-teal-600 hover:bg-teal-700 text-white font-black py-2.5 px-6 xl:py-3 xl:px-8 rounded-full transition-all shadow-md hover:shadow-teal-600/30 uppercase tracking-wide text-xs xl:text-sm transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            {locale === 'lo' ? 'ບໍລິຈາກ' : 'DONATE'}
          </Link>

          {/* 💡 ປຸ່ມ 3 ຂີດ ສຳລັບເປີດເມນູໃນມືຖື */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-teal-600 focus:outline-none"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

      </div>

      {/* 💡 ໜ້າຕ່າງເມນູສຳລັບມືຖື (Mobile Menu Dropdown) */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl lg:hidden flex flex-col max-h-[calc(100vh-5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="px-6 py-6 flex flex-col space-y-5">
            {navLinks.map((link) => {
              const isActive = !link.isExternal && (pathname === link.path || (link.path !== `/${locale}` && pathname.startsWith(link.path)));
              return (
                <div key={link.name} className="flex flex-col">
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)} // ກົດແລ້ວປິດເມນູທັນທີ
                    target={link.isExternal ? "_blank" : "_self"}
                    className={`font-black text-lg tracking-wider uppercase ${isActive ? 'text-teal-600' : 'text-gray-800'}`}
                  >
                    {link.name}
                  </Link>

                  {/* ເມນູຍ່ອຍໃນມືຖື */}
                  {link.dropdown && (
                    <div className="mt-3 pl-4 flex flex-col space-y-4 border-l-2 border-teal-100">
                      {link.dropdown.map(sub => (
                        <Link
                          key={sub.name}
                          href={sub.path}
                          onClick={() => setIsOpen(false)}
                          className="font-bold text-sm text-gray-500 hover:text-teal-600 uppercase tracking-wider"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* ປຸ່ມປ່ຽນພາສາໃນມືຖື */}
            <div className="pt-6 mt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="font-bold text-sm text-gray-400 uppercase">{locale === 'lo' ? 'ປ່ຽນພາສາ' : 'LANGUAGE'}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}