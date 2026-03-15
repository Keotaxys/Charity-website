'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useLocale } from 'next-intl';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ຕັ້ງຄ່າໃຫ້ Loading ກ່ອນສະເໝີ
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // onAuthStateChanged ຈະຄອຍຟັງວ່າ User ຍັງລັອກອິນຢູ່ຫຼືບໍ່ (ເຖິງຈະປ່ຽນໜ້າກໍຍັງຈື່ໄວ້)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false); // ຖ້າລັອກອິນແລ້ວ ໃຫ້ຢຸດ Loading ແລ້ວສະແດງໜ້າເວັບ
      } else {
        // ຖ້າຍັງບໍ່ລັອກອິນ ຫຼື ໝົດອາຍຸ ໃຫ້ສົ່ງກັບໄປໜ້າ Login
        router.push(`/${locale}/admin/login`);
      }
    });

    // Cleanup ຟັງຊັນເມື່ອ Component ຖືກທຳລາຍ
    return () => unsubscribe();
  }, [router, locale]);

  // ລະຫວ່າງທີ່ລໍຖ້າ Firebase ກວດສອບ (Loading) ໃຫ້ສະແດງອະນິເມຊັນໝຸນໆ ເພື່ອບໍ່ໃຫ້ມັນເດັ້ງໄປໜ້າ Login
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  // ຖ້າຜ່ານການກວດສອບແລ້ວ ໃຫ້ສະແດງເນື້ອຫາໜ້າແອັດມິນໄດ້ເລີຍ
  return <>{children}</>;
}