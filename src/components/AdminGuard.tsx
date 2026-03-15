'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useLocale } from 'next-intl';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        // ຖ້າບໍ່ມີ User ໃຫ້ເຕະໄປໜ້າ Login
        setLoading(false);
        // ກວດສອບກ່ອນວ່າຖ້າຢູ່ໜ້າ login ແລ້ວ ບໍ່ຕ້ອງ redirect ຊ້ຳ
        if (!pathname.includes('/admin/login')) {
          router.push(`/${locale}/admin/login`);
        }
      }
    });

    return () => unsubscribe();
  }, [router, locale, pathname]);

  // ລະຫວ່າງລໍຖ້າການຢືນຢັນຈາກ Firebase ໃຫ້ສະແດງອະນິເມຊັນໂຫຼດ
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  // ຖ້າບໍ່ມີ User ແທ້ໆ ບໍ່ໃຫ້ Render ຫຍັງເລີຍ (ປ້ອງກັນການເຫັນໜ້າແອັດມິນກ່ອນເດັ້ງອອກ)
  if (!user) return null;

  return <>{children}</>;
}