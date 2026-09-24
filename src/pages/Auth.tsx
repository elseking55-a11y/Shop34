import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'signup'>(
    params.get('mode') === 'signup' ? 'signup' : 'signin'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('shop34_customer_token');
    if (token) navigate('/account', { replace: true });
  }, [navigate]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/signin';
      const response = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'signup'
            ? { name, email, password }
            : { email, password }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      localStorage.setItem('shop34_customer_token', data.token);
      localStorage.setItem('shop34_customer_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('shop34-auth-changed'));
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-amber-900/10 dark:border-zinc-800 p-7 sm:p-9">
          <div className="text-center mb-7">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg">
              <UserRound size={27} />
            </div>
            <h1 className="mt-4 text-3xl font-black text-amber-950 dark:text-white">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-2 text-sm text-amber-900/60 dark:text-zinc-400">
              {mode === 'signin'
                ? 'Sign in to manage your Shop34 account and orders.'
                : 'Create a real Shop34 customer account in seconds.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-amber-50 dark:bg-zinc-800 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              className={`py-2.5 rounded-lg font-bold text-sm ${mode === 'signin' ? 'bg-white dark:bg-zinc-700 shadow text-orange-600' : 'text-amber-900/60 dark:text-zinc-400'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`py-2.5 rounded-lg font-bold text-sm ${mode === 'signup' ? 'bg-white dark:bg-zinc-700 shadow text-orange-600' : 'text-amber-900/60 dark:text-zinc-400'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <label className="block">
                <span className="text-sm font-bold">Full name</span>
                <div className="relative mt-1.5">
                  <UserRound className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                  <input value={name} onChange={e => setName(e.target.value)} required minLength={2}
                    className="w-full rounded-xl border border-amber-900/15 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your full name" />
                </div>
              </label>
            )}

            <label className="block">
              <span className="text-sm font-bold">Email address</span>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full rounded-xl border border-amber-900/15 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="you@example.com" />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-bold">Password</span>
              <div className="relative mt-1.5">
                <LockKeyhole className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                  className="w-full rounded-xl border border-amber-900/15 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="At least 8 characters" />
              </div>
            </label>

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <button disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-black py-3.5">
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-center text-sm text-amber-900/60 dark:text-zinc-400 mt-6">
            <Link to="/shop" className="font-bold text-orange-600 hover:underline">Continue shopping</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
