import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('Menu');

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tighter text-blue-600">
          BEAST.LAO
        </Link>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">{t('home')}</Link>
            <Link href="/campaigns" className="hover:text-blue-600 transition-colors">{t('campaigns')}</Link>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}