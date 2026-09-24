import { Link } from 'react-router-dom';

export default function AuthBar() {
  const signedIn = typeof window !== 'undefined' && Boolean(localStorage.getItem('shop34_customer_token'));

  return (
    <div className="bg-zinc-950 text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-end gap-3 text-sm">
        {signedIn ? (
          <Link to="/account" className="font-bold text-amber-300 hover:text-white">
            My Account
          </Link>
        ) : (
          <>
            <span className="text-zinc-400 hidden sm:inline">Already have an account?</span>
            <Link to="/auth?mode=signin" className="font-bold text-white hover:text-amber-300">
              Sign In
            </Link>
            <Link to="/auth?mode=signup" className="rounded-lg bg-orange-600 px-3 py-1 font-black hover:bg-orange-500">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
