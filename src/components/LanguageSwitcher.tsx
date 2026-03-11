'use client';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-2 border p-1 rounded-full bg-gray-50">
      {['lo', 'en'].map((lang) => (
        <button
          key={lang}
          onClick={() => toggleLanguage(lang)}
          className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
            locale === lang ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}