'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const locale = useLocale();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ກວດສອບ Email ແລະ Password ກັບ Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // ຖ້າຖືກຕ້ອງ ໃຫ້ສົ່ງໄປໜ້າ Dashboard
      router.push(`/${locale}/admin/dashboard`);
    } catch (err: any) {
      console.error(err);
      setError('ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ. ກະລຸນາລອງໃໝ່.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6">
      
      {/* ໂລໂກ້ */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black text-teal-600 tracking-tighter uppercase">
          BEAST<span className="text-gray-900">.LAO</span>
        </h1>
        <p className="text-gray-500 font-bold tracking-widest mt-2 text-sm uppercase">Admin Portal</p>
      </div>

      {/* ກ່ອງ Login */}
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
          ເຂົ້າສູ່ລະບົບ (Login)
        </h2>

        {error && (
          <div className="bg-pink-50 text-pink-500 p-4 rounded-xl mb-6 text-sm font-bold text-center border border-pink-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ອີເມວ (Email)</label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
              placeholder="admin@beast.lao"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">ລະຫັດຜ່ານ (Password)</label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-teal-600 text-white font-black py-4 rounded-xl hover:bg-teal-700 transition-all shadow-md hover:shadow-teal-600/30 uppercase tracking-wide disabled:bg-gray-400 mt-4"
          >
            {loading ? 'ກຳລັງເຂົ້າສູ່ລະບົບ...' : 'ເຂົ້າສູ່ລະບົບ'}
          </button>
        </form>
      </div>
      
    </div>
  );
} 