import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';

export default function Navbar() {
  const t = useTranslations('Menu');

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-blue-600">
            CHARITY.LAO
          </Link>
          <div className="hidden md:flex gap-6 text-gray-600 font-medium">
            <Link href="/">{t('home')}</Link>
            <Link href="/campaigns">{t('campaigns')}</Link>
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
