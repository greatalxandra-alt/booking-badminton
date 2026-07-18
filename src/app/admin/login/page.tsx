'use client'

import { useState } from 'react';
import { adminLogin } from '@/lib/actions/auth';
import { Activity, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await adminLogin(formData);
    
    setLoading(false);
    
    if (result.success) {
      toast.success('Login berhasil!');
      router.push('/admin');
    } else {
      toast.error(result.error || 'Login gagal, periksa kredensial Anda');
    }
  };

  return (
    <main className="min-h-screen bg-surface-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo/Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-primary text-white p-3 rounded-xl mb-4 shadow-[0px_10px_20px_-10px_rgba(249,115,22,0.5)]">
            <Activity className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">Admin Panel</h1>
          <p className="text-text-secondary font-body">Masuk untuk mengelola BadmintonSpace</p>
        </div>

        {/* Form Container */}
        <div className="bg-surface-dark rounded-2xl p-6 md:p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold font-body text-white">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-tertiary" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="admin@badmintonspace.com"
                  className="w-full bg-surface-darker text-white font-body text-base pl-12 pr-4 py-4 rounded-xl border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-disabled"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold font-body text-white">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-tertiary" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-surface-darker text-white font-body text-base pl-12 pr-4 py-4 rounded-xl border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-disabled"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-4 px-4 mt-4 rounded-xl text-base font-bold font-body transition-all h-[56px]
                ${loading 
                  ? 'bg-disabled text-white/50 cursor-not-allowed opacity-50' 
                  : 'bg-primary text-white hover:bg-primary-hover hover:shadow-[0px_4px_12px_rgba(249,115,22,0.3)] active:bg-primary-active'
                }
              `}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk Dashboard'}
            </button>
            
          </form>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm font-body text-text-secondary hover:text-white transition-colors">
            &larr; Kembali ke Beranda
          </a>
        </div>

      </div>
    </main>
  );
}
