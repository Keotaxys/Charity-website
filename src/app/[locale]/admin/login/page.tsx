'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard'); // ເມື່ອ Login ສຳເລັດໃຫ້ໄປໜ້າ Dashboard
    } catch (error) {
      alert("ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <form onSubmit={handleLogin} className="p-10 bg-white rounded-3xl shadow-xl w-full max-w-md space-y-6">
        <h1 className="text-3xl font-black text-center text-gray-900">ADMIN LOGIN</h1>
        <input 
          type="email" placeholder="Email" 
          className="w-full p-4 border rounded-xl"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-4 border rounded-xl"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="w-full bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 transition-all">
          ເຂົ້າສູ່ລະບົບ
        </button>
      </form>
    </div>
  );
}